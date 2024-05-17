import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state';
import { IQuestionAnswered, TriviaSelectors } from '../../state/trivia';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { QuestionDifficulty, QuestionType } from '../../models/api.model';

type IQuestionsByCategory = Record<string, IQuestionAnswered[]>;

interface IStat {
  basicPerc: number;
  weightedPerc: number;
}

interface IStatByCategory {
  [key: string]: IStat;
}

const WEIGHT_BY_DIFFICULTY: Record<QuestionDifficulty, number> = {
  [QuestionDifficulty.ANY]: 0,
  [QuestionDifficulty.EASY]: 1,
  [QuestionDifficulty.MEDIUM]: 3,
  [QuestionDifficulty.HARD]: 5,
};

const WEIGHT_BY_TYPE: Record<QuestionType, number> = {
  [QuestionType.ANY]: 0,
  [QuestionType.BOOLEAN]: 1,
  [QuestionType.MULTIPLE]: 2,
};

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  answeredQuestions$ = this.store.select(TriviaSelectors.selectAnsweredQuestions);

  questionsByCategory$ = this.answeredQuestions$.pipe(
    map((answeredQuestions) => {
      const questionsByCategory: IQuestionsByCategory = {};
      for (let i = 0; i < answeredQuestions.length; i++) {
        const answeredQuestion = answeredQuestions[i];
        if (questionsByCategory[answeredQuestion.category]) {
          questionsByCategory[answeredQuestion.category] = [
            ...questionsByCategory[answeredQuestion.category],
            answeredQuestion,
          ];
          continue;
        }
        questionsByCategory[answeredQuestion.category] = [answeredQuestion];
      }
      return questionsByCategory;
    }),
  );

  statsByCategory$ = this.questionsByCategory$.pipe(
    map((questionsByCategory) => {
      const statsByCategory: IStatByCategory = {};
      const questionsByCategoryKeys = Object.keys(questionsByCategory);
      for (let i = 0; i < questionsByCategoryKeys.length; i++) {
        const category = questionsByCategoryKeys[i];
        const correctAnswers: IQuestionAnswered[] = [];
        let weightedAnsweresSize = 0;
        let correctAnsweresSize = 0;
        for (let j = 0; j < questionsByCategory[category].length; j++) {
          const question = questionsByCategory[category][j];
          weightedAnsweresSize += getQuestionWeight(question);
          if (question.isCorrect) {
            correctAnswers.push(question);
            correctAnsweresSize += getQuestionWeight(question);
          }
        }
        statsByCategory[category] = {
          basicPerc: Math.round((correctAnswers.length / questionsByCategory[category].length) * 100),
          weightedPerc: weightedAnsweresSize > 0 ? Math.round((correctAnsweresSize / weightedAnsweresSize) * 100) : 0,
        };
      }
      return statsByCategory;
    }),
  );

  stats$ = this.statsByCategory$.pipe(
    map((stats) => Object.entries(stats).map(([category, value]) => ({ category, ...value }))),
  );

  constructor(private readonly store: Store<AppState>) {
    combineLatest([this.answeredQuestions$, this.questionsByCategory$, this.statsByCategory$])
      .pipe(takeUntilDestroyed())
      .subscribe(([answeredQuestions, questionsByCategory, statsByCategory]) => {
        console.log(answeredQuestions, questionsByCategory, statsByCategory);
      });
  }
}

const getQuestionWeight = (question: IQuestionAnswered) => {
  return WEIGHT_BY_DIFFICULTY[question.difficulty] * WEIGHT_BY_TYPE[question.type];
};
