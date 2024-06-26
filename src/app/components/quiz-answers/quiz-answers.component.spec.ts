import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAnswersComponent } from './quiz-answers.component';

describe('QuizAnswersComponent', () => {
  let component: QuizAnswersComponent;
  let fixture: ComponentFixture<QuizAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizAnswersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
