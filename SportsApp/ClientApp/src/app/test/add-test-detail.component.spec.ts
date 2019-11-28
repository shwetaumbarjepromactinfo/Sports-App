import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestDetailComponent } from './add-test-detail.component';

describe('AddTestDetailComponent', () => {
  let component: AddTestDetailComponent;
  let fixture: ComponentFixture<AddTestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
