import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ITriviaCategory } from '../../state/trivia';
import { GetQuestionsType, IQuestionsRequest, QuizType, TriviaStep, TriviaStore } from './trivia.store';
import { FormControl } from '@angular/forms';
import { QuestionDifficulty, QuestionType } from '../../models/api.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, withLatestFrom } from 'rxjs';
import { filterNullish } from '../../utils/filter-nullish';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    private readonly router: Router,
  ) {
    this.getMoreQuestionsAction_
      .pipe(withLatestFrom(this.currentQuizRequest$), takeUntilDestroyed())
      .subscribe(([_, request]) => {
        this.triviaStore.getQuestions({ request, type: GetQuestionsType.APPEND });
      });
  }

  questions$ = this.triviaStore.questions$;
  step$ = this.triviaStore.step$;

  private readonly quizType_ = new BehaviorSubject<QuizType>(QuizType.CLASSIC);
  quizType$ = this.quizType_.asObservable();

  private readonly currentQuizRequest_ = new BehaviorSubject<Partial<IQuestionsRequest> | undefined>(undefined);
  currentQuizRequest$ = this.currentQuizRequest_.pipe(filterNullish());

  private readonly getMoreQuestionsAction_ = new Subject<void>();

  TriviaStep = TriviaStep;
  QuizType = QuizType;

  onStartQuiz(request: Partial<IQuestionsRequest>, quizType: QuizType) {
    this.currentQuizRequest_.next(request);
    this.triviaStore.getQuestions({ request, type: GetQuestionsType.OVERWRITE });
    this.quizType_.next(quizType);
  }

  goToStats() {
    this.router.navigate(['/stats']);
  }

  onGetMoreQuestions() {
    this.getMoreQuestionsAction_.next();
  }
}
