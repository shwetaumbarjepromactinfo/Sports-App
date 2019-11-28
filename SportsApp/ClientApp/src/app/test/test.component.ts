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
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  addTestForm: FormGroup;
  private sub: Subscription;
  Test: Test;
  TestListData: TestListData;
  errorMessage: string;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string} 
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

 
  ngOnInit() {

    this.testService.getTests().subscribe(
      TestListData => { this.TestListData = TestListData; },
      error => this.errorMessage = error as any
    );
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

