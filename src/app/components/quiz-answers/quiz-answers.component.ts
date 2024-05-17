import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { IQuestion } from '../home/trivia.store';
import _ from 'lodash';
import { filterNullish } from '../../utils/filter-nullish';

@Component({
  selector: 'app-quiz-answers',
  templateUrl: './quiz-answers.component.html',
  styleUrl: './quiz-answers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizAnswersComponent {
  private readonly incorrectAnswers_ = new BehaviorSubject<IQuestion['incorrectAnswers'] | undefined>(undefined);
  incorrectAnswers$ = this.incorrectAnswers_.pipe(filterNullish());
  @Input() set incorrectAnswers(value: IQuestion['incorrectAnswers'] | null | undefined) {
    if (value) {
      console.log(value);
      this.incorrectAnswers_.next(value);
    }
  }

  private readonly correctAnswer_ = new BehaviorSubject<IQuestion['correctAnswer'] | undefined>(undefined);
  correctAnswer$ = this.correctAnswer_.pipe(filterNullish());
  @Input() set correctAnswer(value: IQuestion['correctAnswer'] | null | undefined) {
    if (value) {
      console.log(value);
      this.correctAnswer_.next(value);
    }
  }
  @Output() answer = new EventEmitter<string>();

  randomizedAnswers$ = combineLatest([this.correctAnswer$, this.incorrectAnswers$]).pipe(
    map(([correctAnswer, incorrectAnswers]) => _.shuffle([...incorrectAnswers, correctAnswer])),
  );

  private readonly answeredQuestion_ = new BehaviorSubject<IQuestion['correctAnswer'] | undefined>(undefined);
  answeredQuestion$ = this.answeredQuestion_.pipe(filterNullish());

  onAnswerClick(answer: string) {
    this.answeredQuestion_.next(answer);
    this.answer.next(answer);
  }
}
