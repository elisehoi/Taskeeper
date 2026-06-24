import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateAccountComponent } from './user.createAccount.component';

describe('UserCreateAccountComponent', () => {
  let component: UserCreateAccountComponent;
  let fixture: ComponentFixture<UserCreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
