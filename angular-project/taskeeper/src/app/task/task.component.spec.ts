import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITask } from './task.interface';

describe('TaskComponent', () => {
  let component: ITask;
  let fixture: ComponentFixture<ITask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ITask ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
