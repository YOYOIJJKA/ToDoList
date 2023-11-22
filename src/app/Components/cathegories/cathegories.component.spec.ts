import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CathegoriesComponent } from './cathegories.component';

describe('CathegoriesComponent', () => {
  let component: CathegoriesComponent;
  let fixture: ComponentFixture<CathegoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CathegoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CathegoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
