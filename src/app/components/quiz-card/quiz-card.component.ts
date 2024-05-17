import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DEFAULT_CATEGORY, ITriviaCategory, TriviaSelectors } from '../../state/trivia';
import { IQuestionsRequest, QuestionDifficulty, QuestionType } from '../../models/api.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../state';
import { QuizType } from '../home/trivia.store';

export interface IQuizForm {
  category: FormControl<ITriviaCategory>;
  difficulty: FormControl<QuestionDifficulty>;
  type: FormControl<QuestionType>;
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
    type: new FormControl(QuestionType.ANY, { nonNullable: true }),
  });

  difficulties = Object.values(QuestionDifficulty);
  types = Object.values(QuestionType);

  constructor(private readonly store: Store<AppState>) {}

  onStartQuiz() {
    const quizFormValue = this.quizForm.value;
    console.log(quizFormValue);
    this.startQuiz.emit({
      category:
        quizFormValue.category && quizFormValue.category.id !== DEFAULT_CATEGORY.id
          ? quizFormValue.category.id
          : undefined,
      difficulty:
        quizFormValue.difficulty && quizFormValue.difficulty !== QuestionDifficulty.ANY
          ? quizFormValue.difficulty
          : undefined,
      type: quizFormValue.type && quizFormValue.type !== QuestionType.ANY ? quizFormValue.type : undefined,
    });
  }
}
