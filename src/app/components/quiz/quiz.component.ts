import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest, filter, map, shareReplay, withLatestFrom } from 'rxjs';
import { filterNullish } from '../../utils/filter-nullish';
import { Store } from '@ngrx/store';
import { AppState } from '../../state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TriviaActions } from '../../state/trivia';
import { IQuestion, QuizType } from '../../models/trivia.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  private readonly quizQuestions_ = new BehaviorSubject<IQuestion[] | undefined>(undefined);
  quizQuestions$ = this.quizQuestions_.pipe(filterNullish(), shareReplay());
  @Input() set quizQuestion(value: IQuestion[] | null | undefined) {
    if (value) {
      this.quizQuestions_.next(value);
    }
  }

  private readonly quizType_ = new BehaviorSubject<QuizType>(QuizType.CLASSIC);
  quizType$ = this.quizType_.asObservable();
  @Input() set quizType(value: QuizType) {
    this.quizType_.next(value);
  }
  @Output() getMoreQuestions = new EventEmitter<void>();
  @Output() restart = new EventEmitter<void>();

  private readonly currentQuestionIndex_ = new BehaviorSubject<number>(0);
  currentQuestionIndex$ = this.currentQuestionIndex_.asObservable();

  private readonly answeredQuestions_ = new BehaviorSubject<number[]>([]);
  answeredQuestions$ = this.answeredQuestions_.asObservable();

  private readonly correctAnsweres_ = new BehaviorSubject<IQuestion[]>([]);
  correctAnsweres$ = this.correctAnsweres_.asObservable();

  private readonly isQuizFinished_ = new BehaviorSubject<boolean>(false);
  isQuizFinished$ = this.isQuizFinished_.asObservable();

  QuizType = QuizType;

  isAllAnswered$ = combineLatest([
    this.quizQuestions$,
    this.answeredQuestions$,
    this.quizType$,
    this.correctAnsweres$,
  ]).pipe(
    map(
      ([quizQuestions, answeredQuestions, quizType, correctAnsweres]) =>
        answeredQuestions.length === quizQuestions.length ||
        (quizType === QuizType.ENDLESS && correctAnsweres.length !== answeredQuestions.length),
    ),
  );

  incrementQuestionIndex_ = new Subject<void>();
  addAnsweredQuestion_ = new Subject<number>();
  addCorrectQuestion_ = new Subject<IQuestion>();

  constructor(private readonly store: Store<AppState>) {
    this.incrementQuestionIndex_
      .pipe(withLatestFrom(this.currentQuestionIndex$), takeUntilDestroyed())
      .subscribe(([_, currentQuestionIndex]) => {
        this.currentQuestionIndex_.next(currentQuestionIndex + 1);
      });

    this.addAnsweredQuestion_
      .pipe(withLatestFrom(this.answeredQuestions$), takeUntilDestroyed())
      .subscribe(([questitonIndex, answeredQuestions]) => {
        this.answeredQuestions_.next([...answeredQuestions, questitonIndex]);
      });

    this.addCorrectQuestion_
      .pipe(withLatestFrom(this.correctAnsweres$), takeUntilDestroyed())
      .subscribe(([correctAnswer, correctAnsweres]) => {
        this.correctAnsweres_.next([...correctAnsweres, correctAnswer]);
      });

    combineLatest([this.answeredQuestions$, this.quizQuestions$, this.quizType$])
      .pipe(filter(([_, __, quizType]) => quizType === QuizType.ENDLESS))
      .subscribe(([answeredQuestions, quizQuestions, _]) => {
        if (answeredQuestions.length >= quizQuestions.length - 2) {
          this.getMoreQuestions.emit();
        }
      });
  }

  onAnswer(answer: string, question: IQuestion, index: number, quizType: QuizType | null) {
    this.addAnsweredQuestion_.next(index);
    const isCorrect = answer === question.correctAnswer;
    this.store.dispatch(TriviaActions.addAnsweredQuestion({ answeredQuestion: { ...question, isCorrect } }));
    if (isCorrect) {
      this.addCorrectQuestion_.next(question);
    }
  }

  onNextQuestion() {
    this.incrementQuestionIndex_.next();
  }

  onFinish() {
    this.isQuizFinished_.next(true);
  }

  onTryAgain() {
    this.restart.emit();
  }
}
