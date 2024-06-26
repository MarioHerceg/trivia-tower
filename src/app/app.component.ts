import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './state';
import { TriviaActions, TriviaSelectors } from './state/trivia';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  constructor(private readonly store: Store<AppState>) {}

  categories$ = this.store.select(TriviaSelectors.selectTriviaCategories);

  ngOnInit(): void {
    this.store.dispatch(TriviaActions.getCategories());
    this.store.dispatch(TriviaActions.getSessionToken());
  }
}
