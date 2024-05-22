import { IQuestion } from '../../components/home/trivia.store';
import { IAsyncStatus, toAsyncInitStatus } from '../../models/async-status.model';

export interface ITriviaState {
  categories: ITriviaCategory[];
  getCategoriesState: IAsyncStatus;
  sessionToken: string | null;
  getSessionTokenState: IAsyncStatus;
  answeredQuestions: IQuestionAnswered[];
  resetSessionTokenState: IAsyncStatus;
}

export const DEFAULT_SUMMARY_STATE: ITriviaState = {
  categories: [],
  getCategoriesState: toAsyncInitStatus(),
  sessionToken: null,
  getSessionTokenState: toAsyncInitStatus(),
  answeredQuestions: [],
  resetSessionTokenState: toAsyncInitStatus(),
};

export interface ITriviaCategory {
  id: number;
  name: string;
}

export type IQuestionAnswered = IQuestion & { isCorrect: boolean };

export const DEFAULT_CATEGORY: ITriviaCategory = { id: -1, name: 'Any category' };
