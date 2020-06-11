import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PopupComponent } from './popup.component'



export const popupRoutes: Routes = [
  { path: '', component: PopupComponent }
];

@NgModule({
  declarations: [PopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(popupRoutes),
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
export class PopupModule { }
