import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Test } from './test';
import { GenericValidator } from '../shared/generic-validator';
import { TestService } from '../test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { TestListData } from './test-list-data';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';

@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css']
})
export class AddTestComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  addTestForm: FormGroup;
  private sub: Subscription;
  Test: Test;
  TestListData: TestListData;
  errorMessage: string;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string }
  };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private testService: TestService, private router: Router, private route: ActivatedRoute) {
    this.validationMessages = {
      testType: {
        required: 'Test type field is required!',
      },
      testDate: {
        required: 'Test Date field is required!'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.addTestForm.valueChanges, ...controlBlurs)
      .pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.addTestForm);
    });
  }

  ngOnInit() {
    this.addTestForm = this.fb.group({
      testDate: ['', [Validators.required]],
      testType: ['', [Validators.required]]
    });
  }

  onSave(): void {
    if (this.addTestForm.valid) {
      if (this.addTestForm.dirty) {
        const t = {
          ...this.Test, ...this.addTestForm.value
        };
        this.testService.createTest(t)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  onSaveComplete(): void {
    this.addTestForm.reset();
    this.router.navigate(['/test']);
  }

  onDeleteMessage(): void {
    if (this.Test.testId === 0) {
      this.onSaveComplete();
    }
    else {
      if (confirm(`Really dalete  the test: ${this.Test.testDate}?`)) {
        this.testService.deleteTest(this.Test.testId)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

}

