import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user';
import { Pagination } from 'src/app/core/models/pagination';
import { DataService } from 'src/app/core/services/data.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppConst } from 'src/app/core/common/app.constants';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  @ViewChild("modalAccountInfo", { static: true }) public modalAccountInfo: ModalDirective;
  @ViewChild('editInfoModal', { static: false }) public editInfoModal: ModalDirective;
  @ViewChild('uploadImageEdit', { static: false }) public uploadImageEdit;

  public user: User = this.authService.currentUserValue;
  public pagination: Pagination = new Pagination();
  public dataLog = [];

  public companyName;
  public phone;
  public email;

  public formEditInfo: FormGroup;
  public urlImageUploadEdit

  constructor(private authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationService) {
    this.formEditInfo = new FormGroup({
      company: new FormControl(),
      email: new FormControl()
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadDataLog();
    }, 1000);
   
  }

  async loadDataLog() {
    //#region get infor
    let dataUser = await this.dataService.getAsync('/api/account/' + this.user.ACCOUNT_ID);
    if (dataUser.err_code == 0) {
      let userDetail = dataUser.data
      this.companyName = userDetail[0].COMPANY_NAME
      this.email = userDetail[0].EMAIL
      this.phone = userDetail[0].PHONE
      this.user.AVATAR = (userDetail[0].AVATAR != "" && userDetail[0].AVATAR != null && userDetail[0].AVATAR != "undefined") ?
        userDetail[0].AVATAR : "../../assets/img/user_icon.jpg"
    }
    //#endregion
    let response: any = await this.dataService.getAsync("/api/account/GetLogAsync?pageIndex=" + this.pagination.pageIndex + "&pageSize=" + this.pagination.pageSize);
    if (response) {
      this.dataLog = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  async pageChanged(event: any) {
    this.pagination.pageIndex = event.page;
    await this.loadDataLog();
  }

  async changePageSize(size) {
    this.pagination.pageSize = size;
    await this.loadDataLog();
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      this.pagination.pageIndex = 1;
    }, 1);
  }

  //#region Sua thong tin
  public async showEditInfo() {
    let response = await this.dataService.getAsync('/api/account/' + this.user.ACCOUNT_ID);
    if (response.err_code == 0) {
      let dataAccount = response.data[0];
      this.formEditInfo = new FormGroup({
        company: new FormControl(dataAccount.COMPANY_NAME),
        email: new FormControl(dataAccount.EMAIL)
      });
    }
    this.editInfoModal.show();
  }

  //#region upload avatar
  public async submitUploadImageEdit() {
    let file = this.uploadImageEdit.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.postFileAsync(null, file.files);
      if (response) {
        this.urlImageUploadEdit = AppConst.DATA_SPONSOR_API + response.data;
      }
      else {
        this.notificationService.displayErrorMessage("Upload ảnh không thành công");
      }
    }
  }

  removeImage() {
    this.uploadImageEdit.nativeElement.value = "";
    this.urlImageUploadEdit = this.user.AVATAR;
  }
 
  //#endregion

  public async editInforAccount() {
    let formData = this.formEditInfo.controls;
    let EMAIL = formData.email.value;
    let COMPANY_NAME = formData.company.value;
    let AVATAR = (this.urlImageUploadEdit != null && this.urlImageUploadEdit != "undefined" && this.urlImageUploadEdit != "") ?
      this.urlImageUploadEdit : "../../assets/img/user_icon.jpg"

    let dataEdit = await this.dataService.putAsync('/api/account/UpdateAccountInfo?accountid=' + this.user.ACCOUNT_ID, {
      COMPANY_NAME, EMAIL, AVATAR
    })
    if (dataEdit.err_code == 0) {
      this.loadDataLog()
      this.editInfoModal.hide()
    }
  }
  //#endregion
}
