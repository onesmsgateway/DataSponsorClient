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
import { defineLocale, viLocale, PaginationModule, ModalModule, TabsModule, BsLocaleService } from 'ngx-bootstrap';
import { DxPieChartModule, DxChartModule } from 'devextreme-angular';

import { HomeComponent } from './home.component';
import { IndexComponent } from './index/index.component';
import { ChartsModule } from 'ng2-charts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule} from '@angular/platform-browser';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { HttpClientModule }    from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";

import { setTheme } from 'ngx-bootstrap/utils';
setTheme('bs4'); // or 'bs4'

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const homeRoutes: Routes = [{
  path: '', component: HomeComponent, children: [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: IndexComponent, canActivate: [AuthGuard] },
  ]
}];

@NgModule({
  declarations: [
    HomeComponent,
    IndexComponent
  ],
  imports: [
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AngularMultiSelectModule,
    DxPieChartModule,
    DxChartModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(homeRoutes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: function (http: HttpClient) {
          return new TranslateHttpLoader(http)
        },
        deps: [HttpClient]
      }
    })
  ],
 
})

export class HomeModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
