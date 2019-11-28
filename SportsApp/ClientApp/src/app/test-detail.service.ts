import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AllData } from './test/all-data';
import { Observable } from 'rxjs/Observable';
import { TestDetail } from './test/test-detail';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { User } from './test/user';

@Injectable()
export class TestDetailService {

  private testDetailUrl = "http://localhost:64371/api/TestDetail";

  constructor(private http: HttpClient) { }

  getTestDetailsByTestId(testId: number): Observable<AllData> {
    const url = `${this.testDetailUrl}/GetTestDetailByTestId/${testId}`;
    return this.http.get<AllData>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getTestDetailById(testDetailId: number): Observable<TestDetail> {
    if (testDetailId === 0) {
      return of(this.initializerTestDetail());
    }

    const url = `${this.testDetailUrl}/GetTestDetailByTestDetailId/${testDetailId}`;
    return this.http.get<TestDetail>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteTestDetail(TestDetailId: number): Observable<TestDetail> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.testDetailUrl}/${TestDetailId}`;

    return this.http.delete<TestDetail>(url, { headers })
      .pipe(
        tap(data => console.log('delete testDetail:' + TestDetailId)),
        catchError(this.handleError)
      );
  }

  createTestDetail(testDetail: TestDetail): Observable<TestDetail> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<TestDetail>(this.testDetailUrl, testDetail, { headers })
      .pipe(
        tap(data => console.log('create testDetail:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateTestDetail(testDetailId:number,testDetail: TestDetail): Observable<TestDetail> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.testDetailUrl}/${testDetailId}`;
    return this.http.put<TestDetail>(url, testDetail, { headers })
      .pipe(
        tap(data => console.log('update testDetail:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetUserForTestDetailByTestId(testDetailId: number): Observable<User[]> {
    const url = `${this.testDetailUrl}/GetUserForTestDetailByTestId/${testDetailId}`;
    return this.http.get<User[]>(url)
      .pipe(
        tap(data => console.log('user data:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `an error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `backend return code ${err.status} : ${err.body.error}`;
    }
    console.error(errorMessage);
    return _throw(errorMessage);
  }

  private initializerTestDetail(): TestDetail {
    return {
      testDetailId: 0,
      testId: 0,
      distance: 0,
      userId:0
    }
  }
}
