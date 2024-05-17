import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ApiService } from '../../services/api.service';
import { AppState } from '../../state';
import { from, switchMap, tap, withLatestFrom } from 'rxjs';
import { TriviaSelectors } from '../../state/trivia';
import { tapResponse } from '@ngrx/operators';
import { IResponseQuestion } from '../../models/api.model';
import {
  IAsyncStatus,
  toAsyncInitStatus,
  toAsyncLoadedStatus,
  toAsyncLoadingStatus,
} from '../../models/async-status.model';

export interface IQuestion {
  category: IResponseQuestion['category'];
  correctAnswer: IResponseQuestion['correct_answer'];
  incorrectAnswers: IResponseQuestion['incorrect_answers'];
  question: IResponseQuestion['question'];
  type: IResponseQuestion['type'];
  difficulty: IResponseQuestion['difficulty'];
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
              const questions = responseQuestionsToQuestions(response.results);
              console.log(questions);
              this.getQuestionSuccess({ questions, type: payload.type });
              if (payload.type === GetQuestionsType.OVERWRITE) {
                this.updateStep(TriviaStep.QUIZ);
              }
            },
            (error: Error) => {
              console.log(error);
            },
          ),
        ),
      ),
    );
  });

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
