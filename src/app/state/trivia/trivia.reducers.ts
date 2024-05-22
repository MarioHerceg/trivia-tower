import { DEFAULT_SUMMARY_STATE, ITriviaState } from './trivia.models';
import { Action, createReducer, on } from '@ngrx/store';
import { TriviaActions } from '.';
import { toAsyncFailedStatus, toAsyncLoadedStatus } from '../../models/async-status.model';

const _triviaReducers = createReducer(
  DEFAULT_SUMMARY_STATE,

  on(TriviaActions.getCategoriesSuccess, (state, { categories }): ITriviaState => {
    return {
      ...state,
      categories,
    };
  }),

  on(TriviaActions.getCategoriesFailure, (state, { errorMessage }): ITriviaState => {
    return {
      ...state,
      getCategoriesState: toAsyncFailedStatus(errorMessage),
    };
  }),

  on(TriviaActions.getSessionTokenSuccess, (state, { token }): ITriviaState => {
    return {
      ...state,
      sessionToken: token,
      getSessionTokenState: toAsyncLoadedStatus(),
    };
  }),

  on(TriviaActions.getSessionTokenFailure, (state, { errorMessage }): ITriviaState => {
    return {
      ...state,
      getSessionTokenState: toAsyncFailedStatus(errorMessage),
    };
  }),

  on(TriviaActions.addAnsweredQuestion, (state, { answeredQuestion }): ITriviaState => {
    return {
      ...state,
      answeredQuestions: [...state.answeredQuestions, answeredQuestion],
    };
  }),

  on(TriviaActions.resetSessionTokenSuccess, (state, { token }): ITriviaState => {
    return {
      ...state,
      sessionToken: token,
      resetSessionTokenState: toAsyncLoadedStatus(),
    };
  }),

  on(TriviaActions.resetSessionTokenFailure, (state, { errorMessage }): ITriviaState => {
    return {
      ...state,
      resetSessionTokenState: toAsyncFailedStatus(errorMessage),
    };
  }),
);

export function triviaReducer(state = DEFAULT_SUMMARY_STATE, action: Action): ITriviaState {
  return _triviaReducers(state, action);
}
