import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRedactComponent } from './task-redact.component';

describe('TaskRedactComponent', () => {
  let component: TaskRedactComponent;
  let fixture: ComponentFixture<TaskRedactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskRedactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskRedactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
