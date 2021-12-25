import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnciensExamensComponent } from './anciens-examens.component';

describe('AnciensExamensComponent', () => {
  let component: AnciensExamensComponent;
  let fixture: ComponentFixture<AnciensExamensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnciensExamensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnciensExamensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
