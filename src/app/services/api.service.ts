import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {
  IQuestionsRequest,
  IResponseCategories,
  IResponseQuestionCountsByCategory,
  IResponseQuestions,
  IResponseToken,
} from '../models/trivia.model';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getSessionToken() {
    return this.http.get<IResponseToken>('https://opentdb.com/api_token.php?command=request');
  }

  resetSessionToken(token: string) {
    return this.http.get<any>(`https://opentdb.com/api_token.php?command=reset&token=${token}`);
  }

  getCategories() {
    return this.http
      .get<IResponseCategories>('https://opentdb.com/api_category.php')
      .pipe(map((response) => response.trivia_categories));
  }

  getQuestionCountsByCategory(categoryId: number) {
    return this.http.get<IResponseQuestionCountsByCategory>(`https://opentdb.com/api_count.php?category=${categoryId}`);
  }

  getQuestions(request: Partial<IQuestionsRequest>) {
    let apiCall = `https://opentdb.com/api.php?amount=${request.ammount}`;
    if (request.category) {
      apiCall += `&category=${request.category}`;
    }
    if (request.difficulty) {
      apiCall += `&difficulty=${request.difficulty}`;
    }
    if (request.token) {
      apiCall += `&token=${request.token}`;
    }
    return this.http.get<IResponseQuestions>(apiCall);
  }
}
