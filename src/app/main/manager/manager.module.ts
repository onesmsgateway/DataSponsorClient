import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenderComponent } from './sender/sender.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { PaginationModule, TabsModule, BsDatepickerModule, ModalModule, defineLocale, viLocale, BsLocaleService } from 'ngx-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule, Routes } from '@angular/router';
import { AppConst } from 'src/app/core/common/app.constants';
import { ManagerComponent } from './manager.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { SenderGroupComponent } from './sender-group/sender-group.component';
import { GroupsComponent } from './groups/groups.component';
import { MemberComponent } from './member/member.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const managerRoutes: Routes = [{
  path: '', component: ManagerComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'sender', component: SenderComponent, data: { MENU_CODE: 'SENDER' }, canActivate: [AuthGuard] },
    { path: 'sender-group', component: SenderGroupComponent, data: { MENU_CODE: 'SENDER-GROUP' }, canActivate: [AuthGuard] },
    { path: 'group', component: GroupsComponent, data: { MENU_CODE: 'GROUP' }, canActivate: [AuthGuard] }
  ]
}];

@NgModule({
  declarations: [
    ManagerComponent,
    SenderComponent,
    SenderGroupComponent,
    GroupsComponent,
    MemberComponent],
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
export class ManagerModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
