import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCredentialComponent } from './new-credential.component';

describe('NewCredentialComponent', () => {
  let component: NewCredentialComponent;
  let fixture: ComponentFixture<NewCredentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCredentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
