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
import { TestDetail } from './test-detail';
import { User } from './user';

@Component({
  selector: 'app-add-test-detail',
  templateUrl: './add-test-detail.component.html',
  styleUrls: ['./add-test-detail.component.css']
})
export class AddTestDetailComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = "Add User";
  addTestDetailForm: FormGroup;
  users: User[] = [];
  testDetailId: number;
  addTest: number;
  private sub: Subscription;
  TestDetail: TestDetail;
  errorMessage: string;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string }
  };
  private genericValidator: GenericValidator;
  
  constructor(private fb: FormBuilder, private testDetailService: TestDetailService, private router: Router, private route: ActivatedRoute) {
    this.validationMessages = {
      userId: {
        required: 'Name field is required!'
      },
      distance: {
        required: 'Distance field is required!'
      },
      testId: {
        required: 'Test field is required'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }



  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.addTestDetailForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.addTestDetailForm);
    });

  }
  ngOnInit() {
    this.addTestDetailForm = this.fb.group({
      userId: ['', [Validators.required]],
      testId: ['', [Validators.required]],
      distance: ['', [Validators.required]]
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        this.testDetailId = +params.get('testDetailId');
        this.addTest = +params.get('testId');
        this.testDetailService.GetUserForTestDetailByTestId(this.testDetailId)
          .subscribe(
            users => { this.users = users; console.log(this.users);},
            error => this.errorMessage = error as any
          );
        this.getTestDetail(this.testDetailId);
        
        console.log(this.addTest);
      }
    );
    
  }

  getuserIdByTestDetailId(testDetailId: number): void {
   


  }

  getTestDetail(testDetailId: number): void {
    this.testDetailService.getTestDetailById(testDetailId)
      .subscribe({
        next: (TestDetail: TestDetail) => this.displayTestDetail(TestDetail),
        error: err => this.errorMessage = err
      });


  }

  displayTestDetail(TestDetail: TestDetail): void {
    if (this.addTestDetailForm) {
      this.addTestDetailForm.reset();
    }
    this.TestDetail = TestDetail;
    if (this.TestDetail.testDetailId === 0) {
      this.pageTitle = `ADD NEW ATHLETE TO TEST`;
    }
    else {
      this.pageTitle = `CHANGE DATA FOR ATHLETE`;
    }

    this.addTestDetailForm.patchValue({
      userId: this.TestDetail.userId,
      testId: this.TestDetail.testId,
      distance: this.TestDetail.distance
    });
  }

  onSave(): void {
    if (this.addTestDetailForm.valid) {
     // if (this.addTestDetailForm.dirty) {
        const u = {
          ...this.TestDetail, ...this.addTestDetailForm.value
        };
      if (this.testDetailId === 0) {
          u.testId = this.addTest;
          this.testDetailService.createTestDetail(u)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          u.testDetailId = this.testDetailId;
          this.testDetailService.updateTestDetail(this.testDetailId,u)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
     // }
      }
    }

  }

  onSaveComplete(): void {
    this.addTestDetailForm.reset();
    if (this.addTest == 0) {
      this.router.navigate(['test-detail', this.TestDetail.testId]);
    }
    else {
      this.router.navigate(['test-detail', this.addTest]);
    }
    
  }

  onDelete(): void {
    if (this.TestDetail.testDetailId === 0) {
      this.onSaveComplete();
    }
    else {
      if (confirm(`Do you wants to delete this athlete from the test?`)) {
        this.testDetailService.deleteTestDetail(this.TestDetail.testDetailId)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }
}
