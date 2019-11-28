import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { TestComponent } from './test/test.component';
import { TestDetailComponent } from './test/test-detail.component';
import { TestService } from './test.service';
import { TestDetailService } from './test-detail.service';
import { AddTestComponent } from './test/add-test.component';
import { AddTestDetailComponent } from './test/add-test-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    TestComponent,
    TestDetailComponent,
    AddTestComponent,
    AddTestDetailComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: TestComponent, pathMatch: 'full' },
      { path: 'test', component: TestComponent, pathMatch: 'full' },
      { path: 'add-test', component: AddTestComponent },
      { path: 'test-detail/:testId', component: TestDetailComponent },
      { path: 'add-test-detail/:testDetailId', component: AddTestDetailComponent },
       { path: 'add-test-detail/:testId/Add', component: AddTestDetailComponent }
    ]),
    ReactiveFormsModule
  ],
  providers: [TestService, TestDetailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
