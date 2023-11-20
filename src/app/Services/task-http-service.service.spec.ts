import { TestBed } from '@angular/core/testing';

import { TaskHttpServiceService } from './task-http-service.service';

describe('TaskHttpServiceService', () => {
  let service: TaskHttpServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskHttpServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
