import { InjectionToken } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { ITriviaState } from './trivia';
import { triviaReducer } from './trivia/trivia.reducers';
import { localStorageMetaReducer } from './local-storage.reducer';

export interface AppState {
  trivia: ITriviaState;
}

export const reducers: ActionReducerMap<AppState> = {
  trivia: triviaReducer,
};

export const reducerToken = new InjectionToken<ActionReducerMap<AppState>>('Reducers');

export const reducerProvider = [{ provide: reducerToken, useValue: reducers }];

export const metaReducers: MetaReducer<AppState>[] = [localStorageMetaReducer];
