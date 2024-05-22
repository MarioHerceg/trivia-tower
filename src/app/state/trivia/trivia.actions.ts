import { createAction, props } from '@ngrx/store';
import { IQuestionAnswered, ITriviaCategory } from './trivia.models';

export const getCategories = createAction('[Trivia] Get Trivia Categories');

export const getCategoriesSuccess = createAction(
  '[Trivia] Get Trivia Categories Success',
  props<{ categories: ITriviaCategory[] }>(),
);

export const getCategoriesFailure = createAction(
  '[Trivia] Get Trivia Categories Failure',
  props<{ errorMessage: string }>(),
);

export const getSessionToken = createAction('[Trivia] Get Session Token');

export const getSessionTokenSuccess = createAction('[Trivia] Get Session Token Success', props<{ token: string }>());

export const getSessionTokenFailure = createAction(
  '[Trivia] Get Session Token Failure',
  props<{ errorMessage: string }>(),
);

export const addAnsweredQuestion = createAction(
  '[Trivia] Add Answered Question',
  props<{ answeredQuestion: IQuestionAnswered }>(),
);

export const resetSessionToken = createAction('[Trivia] Reset Session Token', props<{ token: string }>());

export const resetSessionTokenSuccess = createAction(
  '[Trivia] Reset Session Token Success',
  props<{ token: string }>(),
);

export const resetSessionTokenFailure = createAction(
  '[Trivia] Reset Session Token Failure',
  props<{ errorMessage: string }>(),
);
