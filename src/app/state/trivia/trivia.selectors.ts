import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITriviaState } from './trivia.models';
import { AppState } from '..';

const TRIVIA_FEATURE_KEY: keyof AppState = 'trivia';

export const selectTriviaState = createFeatureSelector<ITriviaState>(TRIVIA_FEATURE_KEY);

export const selectTriviaCategories = createSelector(selectTriviaState, (state: ITriviaState) => state.categories);

export const selectSessionToken = createSelector(selectTriviaState, (state: ITriviaState) => state.sessionToken);

export const selectAnsweredQuestions = createSelector(
  selectTriviaState,
  (state: ITriviaState) => state.answeredQuestions,
);
