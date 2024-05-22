import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ITriviaCategory, TriviaSelectors } from '../../state/trivia';
import { GetQuestionsType, IQuestionsRequest, QuizType, TriviaStep, TriviaStore } from './trivia.store';
import { FormControl } from '@angular/forms';
import { QuestionDifficulty, QuestionType } from '../../models/trivia.model';
import { BehaviorSubject, Subject, withLatestFrom } from 'rxjs';
import { filterNullish } from '../../utils/filter-nullish';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AppState } from '../../state';
import { isAsyncLoadedStatus } from '../../models/async-status.model';

export interface IQuizForm {
  category: FormControl<ITriviaCategory>;
  difficulty: FormControl<QuestionDifficulty>;
  type: FormControl<QuestionType>;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [TriviaStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(
    private readonly triviaStore: TriviaStore,
    private readonly store: Store<AppState>,
  ) {
    this.getMoreQuestionsAction_
      .pipe(withLatestFrom(this.currentQuizRequest$), takeUntilDestroyed())
      .subscribe(([_, request]) => {
        this.triviaStore.getQuestions({ request, type: GetQuestionsType.APPEND });
      });

    this.resetTokenState$
      .pipe(withLatestFrom(this.currentQuizRequest$), takeUntilDestroyed())
      .subscribe(([state, request]) => {
        if (!isAsyncLoadedStatus(state)) {
          return;
        }
        this.triviaStore.getQuestions({ request, type: GetQuestionsType.OVERWRITE });
      });
  }

  questions$ = this.triviaStore.questions$;
  step$ = this.triviaStore.step$;
  resetTokenState$ = this.store.select(TriviaSelectors.selectResetSessionTokenState);

  private readonly quizType_ = new BehaviorSubject<QuizType>(QuizType.CLASSIC);
  quizType$ = this.quizType_.asObservable();

  private readonly currentQuizRequest_ = new BehaviorSubject<Partial<IQuestionsRequest> | undefined>(undefined);
  currentQuizRequest$ = this.currentQuizRequest_.pipe(filterNullish());

  private readonly getMoreQuestionsAction_ = new Subject<void>();

  TriviaStep = TriviaStep;
  QuizType = QuizType;

  onStartQuiz(request: Partial<IQuestionsRequest>, quizType: QuizType) {
    this.currentQuizRequest_.next(request);
    this.triviaStore.getQuestionsProcess({ request, type: GetQuestionsType.OVERWRITE });
    this.quizType_.next(quizType);
  }

  onGetMoreQuestions() {
    this.getMoreQuestionsAction_.next();
  }

  onRestart() {
    this.triviaStore.restart();
  }
}
