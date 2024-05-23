import { Action, ActionReducer, INIT } from '@ngrx/store';
import { AppState } from '.';

export const localStorageMetaReducer = (reducer: ActionReducer<AppState>): ActionReducer<AppState> => {
  return (state, action: Action) => {
    if (action.type === INIT && !action.type.includes('[Auth]')) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          const loadedState = JSON.parse(storageValue) as AppState;
          return loadedState;
        } catch {
          localStorage.removeItem('state');
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem('state', JSON.stringify(nextState));

    return nextState;
  };
};
