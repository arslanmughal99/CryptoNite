import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordListItemComponent } from './password-list-item.component';

describe('PasswordListItemComponent', () => {
  let component: PasswordListItemComponent;
  let fixture: ComponentFixture<PasswordListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
