import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnyWindowComponent } from './funny-window.component';

describe('FunnyWindowComponent', () => {
  let component: FunnyWindowComponent;
  let fixture: ComponentFixture<FunnyWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunnyWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnyWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
