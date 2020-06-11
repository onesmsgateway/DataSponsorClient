import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSponsorComponent } from './data-sponsor.component';
import { defineLocale, viLocale, PaginationModule, TabsModule, BsDatepickerModule, ModalModule, BsLocaleService } from 'ngx-bootstrap';
import { AppConst } from 'src/app/core/common/app.constants';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { DataCimastComponent } from './data-cimast/data-cimast.component';
import { SendDataComponent } from './send-data/send-data.component';
import { PackageComponent } from './package/package.component';
import { DataCampaignComponent } from './data-campaign/data-campaign.component';
import { PackageTelcoComponent } from './package-telco/package-telco.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { ScenariosDetailComponent } from './scenarios-detail/scenarios-detail.component';
import { SmsBirthdayComponent } from './sms-birthday/sms-birthday.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const managerRoutes: Routes = [{
  path: '', component: DataSponsorComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'data-cimast', component: DataCimastComponent, data: { MENU_CODE: 'DATA-CIMAST' }, canActivate: [AuthGuard] },
    { path: 'send-data', component: SendDataComponent, data: { MENU_CODE: 'SEND-DATA' }, canActivate: [AuthGuard] },
    { path: 'package', component: PackageComponent, data: { MENU_CODE: 'PACKAGE' }, canActivate: [AuthGuard] },
    { path: 'data-campaign', component: DataCampaignComponent, data: { MENU_CODE: 'DATA-CAMPAIGN' }, canActivate: [AuthGuard] },
    { path: 'package-telco', component: PackageTelcoComponent, data: { MENU_CODE: 'PACKAGE-TELCO' }, canActivate: [AuthGuard] },
    { path: 'scenarios', component: ScenariosComponent, data: { MENU_CODE: 'SCENARIOS' }, canActivate: [AuthGuard] },
    { path: 'scenarios-detail', component: ScenariosDetailComponent, data: { MENU_CODE: 'SCENARIOS_DETAIL' }, canActivate: [AuthGuard] },
    { path: 'sms-birthday', component: SmsBirthdayComponent, data: { MENU_CODE: 'SMS-BIRTHDAY' }, canActivate: [AuthGuard] }
   
  ]
}];

@NgModule({
  declarations: [DataSponsorComponent, DataCimastComponent, SendDataComponent, PackageComponent, DataCampaignComponent, PackageTelcoComponent, ScenariosComponent, ScenariosDetailComponent, SmsBirthdayComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AngularMultiSelectModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(managerRoutes),
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
export class DataSponsorModule { 
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
