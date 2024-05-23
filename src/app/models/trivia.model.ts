import { ITriviaCategory } from '../state/trivia';

export interface IResponseBase {
  response_code: number;
  response_message?: string;
}

export interface IResponseCategories {
  trivia_categories: ITriviaCategory[];
}

export interface IResponseQuestionCountsByCategory {
  category_id: number;
  category_question_count: {
    total_question_count: number;
    total_easy_question_count: number;
    total_medium_question_count: number;
    total_hard_question_count: number;
  };
}

export type IResponseToken = IResponseBase & { token: string };

export interface IQuestionsRequest {
  ammount: number;
  token: string;
  category: number;
  difficulty: QuestionDifficulty;
}

export enum QuestionDifficulty {
  ANY = 'any',
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuestionType {
  ANY = 'any',
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean',
}

export type IResponseQuestions = IResponseBase & { results: IResponseQuestion[] };

export interface IResponseQuestion {
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
}

export interface IQuestion {
  category: IResponseQuestion['category'];
  correctAnswer: IResponseQuestion['correct_answer'];
  incorrectAnswers: IResponseQuestion['incorrect_answers'];
  question: IResponseQuestion['question'];
  type: IResponseQuestion['type'];
  difficulty: IResponseQuestion['difficulty'];
}

export interface IQuestionCountsByCategory {
  categoryId: IResponseQuestionCountsByCategory['category_id'];
  categoryQuestionCount: {
    [QuestionDifficulty.ANY]: IResponseQuestionCountsByCategory['category_question_count']['total_easy_question_count'];
    // eslint-disable-next-line max-len
    [QuestionDifficulty.EASY]: IResponseQuestionCountsByCategory['category_question_count']['total_easy_question_count'];
    // eslint-disable-next-line max-len
    [QuestionDifficulty.MEDIUM]: IResponseQuestionCountsByCategory['category_question_count']['total_medium_question_count'];
    // eslint-disable-next-line max-len
    [QuestionDifficulty.HARD]: IResponseQuestionCountsByCategory['category_question_count']['total_hard_question_count'];
  };
}

export interface IQuestionsRequest {
  category: number;
  type: IResponseQuestion['type'];
  difficulty: IResponseQuestion['difficulty'];
}

export enum TriviaStep {
  HOME = 'home',
  QUIZ = 'quiz',
}

export enum QuizType {
  CLASSIC = 'classic',
  ENDLESS = 'endless',
}

export enum GetQuestionsType {
  OVERWRITE = 'overwrite',
  APPEND = 'append',
}

export interface IGetQuestionsPayload {
  request: Partial<IQuestionsRequest>;
  type: GetQuestionsType;
}

export type IGetQuestionCountsByCategoryPayload = Omit<IGetQuestionsPayload, 'request'> & {
  request: Omit<IGetQuestionsPayload['request'], 'category'> & { category: number };
};
