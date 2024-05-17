import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IQuestionsRequest, IResponseCategories, IResponseQuestions, IResponseToken } from '../models/api.model';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getSessionToken() {
    return this.http.get<IResponseToken>('https://opentdb.com/api_token.php?command=request');
  }

  getCategories() {
    return this.http
      .get<IResponseCategories>('https://opentdb.com/api_category.php')
      .pipe(map((response) => response.trivia_categories));
  }

  getQuestions(request: Partial<IQuestionsRequest>) {
    let apiCall = `https://opentdb.com/api.php?amount=${request.ammount}`;
    console.log(request);
    if (request.category) {
      apiCall += `&category=${request.category}`;
    }
    if (request.difficulty) {
      apiCall += `&difficulty=${request.difficulty}`;
    }
    if (request.type) {
      apiCall += `&type=${request.type}`;
    }
    if (request.token) {
      apiCall += `&token=${request.token}`;
    }
    return this.http.get<IResponseQuestions>(apiCall);
  }
}
