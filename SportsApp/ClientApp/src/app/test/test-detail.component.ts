import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Test } from './test';
import { GenericValidator } from '../shared/generic-validator';
import { TestDetailService } from '../test-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { TestListData } from './test-list-data';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { AllData } from './all-data';
import { TestService } from '../test.service';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  addTestDetailForm: FormGroup;
  private sub: Subscription;
  testId: number;
  Test: Test;
  AllData: AllData;
  errorMessage: string;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string }
  };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private testDetailService: TestDetailService, private router: Router, private route: ActivatedRoute, private testService: TestService) {
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
    this.sub = this.route.paramMap.subscribe(
      params => {
        this.testId = +params.get('testId');
      }
    );
    this.testService.getTestById(this.testId).subscribe(
      Test => { this.Test = Test; },
      error => this.errorMessage = error as any
    );
    this.testDetailService.getTestDetailsByTestId(this.testId).subscribe(
      AllData => { this.AllData = AllData; },
      error => this.errorMessage = error as any
    );
  }


  onSaveComplete(): void {
    this.router.navigate(['/test']);
  }

  onDelete(): void {
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


