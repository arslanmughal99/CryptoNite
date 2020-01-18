import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshStartComponent } from './fresh-start.component';

describe('FreshStartComponent', () => {
  let component: FreshStartComponent;
  let fixture: ComponentFixture<FreshStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
