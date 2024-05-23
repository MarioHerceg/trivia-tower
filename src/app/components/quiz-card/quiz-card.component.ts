import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DEFAULT_CATEGORY, ITriviaCategory, TriviaSelectors } from '../../state/trivia';
import { IQuestionsRequest, QuestionDifficulty, QuizType } from '../../models/trivia.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../state';

export interface IQuizForm {
  category: FormControl<ITriviaCategory>;
  difficulty: FormControl<QuestionDifficulty>;
}

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizCardComponent {
  @Input() quizType: QuizType = QuizType.CLASSIC;
  @Output() startQuiz = new EventEmitter<Partial<IQuestionsRequest>>();

  categories$ = this.store.select(TriviaSelectors.selectTriviaCategories);

  quizForm = new FormGroup<IQuizForm>({
    category: new FormControl(DEFAULT_CATEGORY, { nonNullable: true }),
    difficulty: new FormControl(QuestionDifficulty.ANY, { nonNullable: true }),
  });

  difficulties = Object.values(QuestionDifficulty);

  constructor(private readonly store: Store<AppState>) {}

  onStartQuiz() {
    const quizFormValue = this.quizForm.value;
    this.startQuiz.emit({
      category:
        quizFormValue.category && quizFormValue.category.id !== DEFAULT_CATEGORY.id
          ? quizFormValue.category.id
          : undefined,
      difficulty:
        quizFormValue.difficulty && quizFormValue.difficulty !== QuestionDifficulty.ANY
          ? quizFormValue.difficulty
          : undefined,
    });
  }
}
