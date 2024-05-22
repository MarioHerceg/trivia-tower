import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ApiService } from '../../services/api.service';
import { AppState } from '../../state';
import { from, switchMap, tap, withLatestFrom } from 'rxjs';
import { TriviaActions, TriviaSelectors } from '../../state/trivia';
import { tapResponse } from '@ngrx/operators';
import { IResponseQuestion, IResponseQuestionCountsByCategory, QuestionDifficulty } from '../../models/trivia.model';
import {
  IAsyncStatus,
  toAsyncInitStatus,
  toAsyncLoadedStatus,
  toAsyncLoadingStatus,
} from '../../models/async-status.model';
import { MessageService } from 'primeng/api';

export interface IQuestion {
  category: IResponseQuestion['category'];
  correctAnswer: IResponseQuestion['correct_answer'];
  incorrectAnswers: IResponseQuestion['incorrect_answers'];
  question: IResponseQuestion['question'];
  type: IResponseQuestion['type'];
  difficulty: IResponseQuestion['difficulty'];
}

export interface IQuestionCountsByCategory {
  categoryId: IResponseQuestionCountsByCategory['category_id'];
  categoryQuestionCount: {
    [QuestionDifficulty.ANY]: IResponseQuestionCountsByCategory['category_question_count']['total_easy_question_count'];
    // eslint-disable-next-line max-len
    [QuestionDifficulty.EASY]: IResponseQuestionCountsByCategory['category_question_count']['total_easy_question_count'];
    // eslint-disable-next-line max-len
    [QuestionDifficulty.MEDIUM]: IResponseQuestionCountsByCategory['category_question_count']['total_medium_question_count'];
    // eslint-disable-next-line max-len
    [QuestionDifficulty.HARD]: IResponseQuestionCountsByCategory['category_question_count']['total_hard_question_count'];
  };
}

export interface IQuestionsRequest {
  category: number;
  type: IResponseQuestion['type'];
  difficulty: IResponseQuestion['difficulty'];
}

export enum TriviaStep {
  HOME = 'home',
  QUIZ = 'quiz',
}

export enum QuizType {
  CLASSIC = 'classic',
  ENDLESS = 'endless',
}

export enum GetQuestionsType {
  OVERWRITE = 'overwrite',
  APPEND = 'append',
}

export interface IGetQuestionsPayload {
  request: Partial<IQuestionsRequest>;
  type: GetQuestionsType;
}

export type IGetQuestionCountsByCategoryPayload = Omit<IGetQuestionsPayload, 'request'> & {
  request: Omit<IGetQuestionsPayload['request'], 'category'> & { category: number };
};

interface IGraphSchemaLocalState {
  questions: IQuestion[];
  getQuestionsStatus: IAsyncStatus;
  step: TriviaStep;
}

@Injectable()
export class TriviaStore extends ComponentStore<IGraphSchemaLocalState> {
  readonly questions$ = this.select((state) => state.questions);
  readonly step$ = this.select((state) => state.step);

  readonly sessionToken$ = this.store.select(TriviaSelectors.selectSessionToken);

  constructor(
    private readonly apiService: ApiService,
    private readonly store: Store<AppState>,
    private messageService: MessageService,
  ) {
    super({
      questions: [],
      getQuestionsStatus: toAsyncInitStatus(),
      step: TriviaStep.HOME,
    });
  }

  readonly getQuestions = this.effect<IGetQuestionsPayload>((payload$) => {
    return payload$.pipe(
      tap(() => this.initiateGetQuestions()),
      withLatestFrom(this.sessionToken$),
      switchMap(([payload, sessionToken]) =>
        from(this.apiService.getQuestions({ ...payload.request, ammount: 10, token: sessionToken ?? undefined })).pipe(
          tapResponse(
            (response) => {
              if (response.response_code === 0) {
                const questions = responseQuestionsToQuestions(response.results);
                console.log(questions);
                this.getQuestionSuccess({ questions, type: payload.type });
                if (payload.type === GetQuestionsType.OVERWRITE) {
                  this.updateStep(TriviaStep.QUIZ);
                }
              }
              if (response.response_code === 4) {
                this.messageService.add({
                  severity: 'warn',
                  detail: 'All questions answered in this quiz configuration. Reseting session token.',
                });
                setTimeout(() => {
                  if (sessionToken) {
                    this.store.dispatch(TriviaActions.resetSessionToken({ token: sessionToken }));
                    return;
                  }
                  this.store.dispatch(TriviaActions.getSessionToken());
                }, 5000);
              }
            },
            (error: Error) => {
              console.error(error);
            },
          ),
        ),
      ),
    );
  });

  readonly getQuestionsByCaregory = this.effect<IGetQuestionCountsByCategoryPayload>((payload$) => {
    return payload$.pipe(
      tap(() => this.initiateGetQuestions()),
      switchMap((payload) =>
        from(this.apiService.getQuestionCountsByCategory(payload.request.category)).pipe(
          tapResponse(
            (response) => {
              const questionCountsByCategory = responseQuestionCountsByCategoryToQuestionCountsByCategory(response);
              if (
                questionCountsByCategory.categoryQuestionCount[payload.request.difficulty ?? QuestionDifficulty.ANY] >=
                10
              ) {
                this.getQuestions(payload);
                return;
              }
              this.messageService.add({
                severity: 'success',
                detail: 'Not enough questions in this quiz configuration',
              });
            },
            (error: Error) => {
              console.error(error);
            },
          ),
        ),
      ),
    );
  });

  readonly getQuestionsProcess = (payload: IGetQuestionsPayload) => {
    if (payload.request.category) {
      this.getQuestionsByCaregory({ ...payload, request: { ...payload.request, category: payload.request.category } });
      return;
    }
    this.getQuestions(payload);
  };

  readonly restart = this.updater(
    (state): IGraphSchemaLocalState => ({
      ...state,
      questions: [],
      step: TriviaStep.HOME,
    }),
  );

  private readonly initiateGetQuestions = this.updater(
    (state): IGraphSchemaLocalState => ({
      ...state,
      getQuestionsStatus: toAsyncLoadingStatus(),
    }),
  );

  private readonly getQuestionSuccess = this.updater(
    (state, payload: { questions: IQuestion[]; type: GetQuestionsType }): IGraphSchemaLocalState => ({
      ...state,
      getQuestionsStatus: toAsyncLoadedStatus(),
      questions:
        payload.type === GetQuestionsType.OVERWRITE ? payload.questions : [...state.questions, ...payload.questions],
    }),
  );

  private readonly updateStep = this.updater(
    (state, step: TriviaStep): IGraphSchemaLocalState => ({
      ...state,
      step,
    }),
  );
}

export const responseQuestionsToQuestions = (responseQuestions: IResponseQuestion[]): IQuestion[] => {
  return responseQuestions.map((responseQuestion) => ({
    question: responseQuestion.question,
    difficulty: responseQuestion.difficulty,
    type: responseQuestion.type,
    category: responseQuestion.category,
    correctAnswer: responseQuestion.correct_answer,
    incorrectAnswers: responseQuestion.incorrect_answers,
  }));
};

export const responseQuestionCountsByCategoryToQuestionCountsByCategory = (
  responseQuestionCountsByCategory: IResponseQuestionCountsByCategory,
): IQuestionCountsByCategory => {
  return {
    categoryId: responseQuestionCountsByCategory.category_id,
    categoryQuestionCount: {
      [QuestionDifficulty.ANY]: responseQuestionCountsByCategory.category_question_count.total_question_count,
      [QuestionDifficulty.EASY]: responseQuestionCountsByCategory.category_question_count.total_easy_question_count,
      [QuestionDifficulty.MEDIUM]: responseQuestionCountsByCategory.category_question_count.total_medium_question_count,
      [QuestionDifficulty.HARD]: responseQuestionCountsByCategory.category_question_count.total_hard_question_count,
    },
  };
};
