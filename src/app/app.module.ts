import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers, reducers } from './state';
import { TriviaEffects } from './state/trivia/trivia.effects';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuizCardComponent } from './components/quiz-card/quiz-card.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { QuizAnswersComponent } from './components/quiz-answers/quiz-answers.component';
import { LetDirective } from '@ngrx/component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatsComponent } from './components/stats/stats.component';
import { TableModule } from 'primeng/table';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizCardComponent,
    QuizComponent,
    QuizAnswersComponent,
    StatsComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    LetDirective,
    DropdownModule,
    ButtonModule,
    TableModule,
    TabMenuModule,
    ToastModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers: metaReducers }),
    EffectsModule.forRoot([TriviaEffects]),
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
