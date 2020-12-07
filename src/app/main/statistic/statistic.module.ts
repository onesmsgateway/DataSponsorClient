import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppConst } from 'src/app/core/common/app.constants';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { defineLocale, viLocale, PaginationModule, ModalModule, TabsModule, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap';

import { StatisticComponent } from './statistic.component';
import { DataSmsComponent } from './data-sms/data-sms.component';
import { AccountHistoryComponent } from './account-history/account-history.component';
import { ReportQuantityComponent } from './report-quantity/report-quantity.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const smsRoutes: Routes = [{
  path: '', component: StatisticComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'statistic-data', component: DataSmsComponent, data: {MENU_CODE: 'STATISTIC-DATA'}, canActivate: [AuthGuard] },
    { path: 'account-history', component: AccountHistoryComponent, data: {MENU_CODE: 'ACCOUNT-HISTORY'}, canActivate: [AuthGuard] },
    { path: 'report-quantity', component: ReportQuantityComponent, data: {MENU_CODE: 'REPORT-QUANTITY'}, canActivate: [AuthGuard] }
  ]
}];

@NgModule({
  declarations: [
    StatisticComponent,
    DataSmsComponent,
    AccountHistoryComponent,
    ReportQuantityComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AngularMultiSelectModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(smsRoutes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: function (http: HttpClient) {
          return new TranslateHttpLoader(http)
        },
        deps: [HttpClient]
      }
    })
  ]
})

export class StatisticModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
