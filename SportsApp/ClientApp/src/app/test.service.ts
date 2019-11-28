import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TestListData } from './test/test-list-data';
import { Test } from './test/test';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class TestService {

  private testUrl = "http://localhost:64371/api/Test";

  constructor(private http: HttpClient) { }

  getTests(): Observable<TestListData> {

    return this.http.get<TestListData>(this.testUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getTestById(testId: number): Observable<Test> {
    if (testId === 0) {
      return of(this.initializerTest());
    }

    const url = `${this.testUrl}/${testId}`;
    return this.http.get<Test>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createTest(test: Test): Observable<Test> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Test>(this.testUrl, test, { headers })
      .pipe(
        tap(data => console.log('create test:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteTest(testId: number): Observable<Test> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.testUrl}/${testId}`;

    return this.http.delete<Test>(url, { headers })
      .pipe(
        tap(data => console.log('delete test:' + testId)),
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

  private initializerTest(): Test {
    return {
      testId: 0,
      testDate: null,
      testType:null
    }
  }

}
