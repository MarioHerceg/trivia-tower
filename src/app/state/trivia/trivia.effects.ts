import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { DEFAULT_CATEGORY, TriviaActions } from '.';

@Injectable()
export class TriviaEffects {
  constructor(
    private actions$: Actions,
    private api: ApiService,
  ) {}

  getCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriviaActions.getCategories),
      switchMap(() =>
        from(this.api.getCategories()).pipe(
          map((categories) => {
            return TriviaActions.getCategoriesSuccess({ categories: [DEFAULT_CATEGORY, ...categories] });
          }),
          catchError((error) => of(TriviaActions.getCategoriesFailure({ errorMessage: error.message }))),
        ),
      ),
    ),
  );

  getSessionToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriviaActions.getSessionToken),
      switchMap(() =>
        from(this.api.getSessionToken()).pipe(
          map((response) => {
            return TriviaActions.getSessionTokenSuccess({ token: response.token });
          }),
          catchError((error) => of(TriviaActions.getSessionTokenFailure({ errorMessage: error.message }))),
        ),
      ),
    ),
  );

  resetSessionToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TriviaActions.resetSessionToken),
      switchMap((payload) =>
        from(this.api.resetSessionToken(payload.token)).pipe(
          map((response) => {
            return TriviaActions.resetSessionTokenSuccess({ token: response.token });
          }),
          catchError((error) => of(TriviaActions.resetSessionTokenFailure({ errorMessage: error.message }))),
        ),
      ),
    ),
  );
}
