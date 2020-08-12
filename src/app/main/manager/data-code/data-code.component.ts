import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from 'src/app/core/models/role';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-data-code',
  templateUrl: './data-code.component.html',
  styleUrls: ['./data-code.component.css']
})
export class DataCodeComponent implements OnInit {
  @ViewChild('uploadFile', { static: false }) public uploadFile;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;

  public dataMoney = [];
  public dataAccount = [];
  public dataStatus = [];
  public pagination: Pagination = new Pagination();
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public isActive = true;
  public loading = false;

  public fromDate: string = "";
  public toDate: string = "";
  public timeTo: Date = new Date();
  public timeFrom = new Date(this.timeTo.getTime() - (30 * 24 * 60 * 60 * 1000));

  public settingsFilterAccount = {};
  public settingsFilterMoney = {};
  public settingsFilterAccountEdit = {};
  public selectedItemComboboxAccount = [];
  public selectedItemMoney = [];
  public selectedItemComboboxAccountMember = [];
  public selectedItemComboboxAccountEdit = [];
  public selectedItemComboboxAccountCreate = [];
  public settingsFilterStatus = {};
  public selectedStatus = [];

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private authService: AuthService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterAccount = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterMoney = {
      text: this.utilityService.translate('global.choose_money'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterAccountEdit = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
 this.settingsFilterStatus = {
      text: this.utilityService.translate('global.choose_status'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
  }

  ngOnInit() {
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd") + "235959";
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd") + "000000";
    this.getAccountLogin();
    this.bindDataStatus();

  }

  async getAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess != null && roleAccess == 50) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.getDataAccount();
    this.getData();
  }

  //#region smsType
  public async bindDataStatus() {
    this.dataStatus = [];
    this.dataStatus.push({ "id": "1", "itemName": this.utilityService.translate('data_code.status_active') });
    this.dataStatus.push({ "id": "0", "itemName": this.utilityService.translate('data_code.status_lock') });
  }
  async getDataAccount() {

    if (this.isAdmin) {
      this.selectedItemComboboxAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
      this.selectedItemComboboxAccountMember = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
      let response: any = await this.dataService.getAsync('/api/account')
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1) {
        this.selectedItemComboboxAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
        this.selectedItemComboboxAccountMember.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedItemComboboxAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
      this.selectedItemComboboxAccountMember.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }
  ChangeDropdownList() {
    this.getData();
  }

  searchForm() {
    this.getData();
  }

  //#region load data
  async getData() {
    let account = "";
    if (this.isAdmin)
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    else
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    // this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/Person/GetPersonPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&code=");
    // + "&account_id=" + account + "&group_id=" + group + "&code=" + this.code + "&name=" + this.name + "&phone=" + this.phone
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataMoney = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getData();
  }

  pageChanged(event: any): void {

    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getData();
  }
  //#endregion
  // export template excel
  async excelTemplateMember() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplateMember", "DataSms", "template_member.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
  clearData() {
    this.uploadFile.nativeElement.value = "";
  }
  // upload file
  // public async submitUploadFile() {
  //   this.loading = true;
  //   let file = this.uploadFile.nativeElement;
  //   if (file.files.length > 0) {

  //     let accountId = this.selectedItemComboboxAccountMember.length > 0 && this.selectedItemComboboxAccountMember[0].id != "" ? this.selectedItemComboboxAccountMember[0].id : "";
  //     let response: any = await this.dataService.importExcelAndSaveMemberListDataAsync(null, file.files, accountId);
  //     if (response) {
  //       if (response.err_code == -19) {
  //         this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-100"));
  //         this.loading = false;
  //         return;
  //       }
  //       this.getDataGroup();

  //       this.selectedItemComboboxAccount.push({ "id": response.data[0].ACCOUNT_ID, "itemName": response.data[0].USER_NAME });
  //       this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("130"));
  //       this.uploadExcelModal.hide();
  //       this.getData();
  //     }
  //     else {
  //       this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
  //       this.loading = false;
  //     }
  //   }
  //   this.loading = false;
  // }
  //#endregion
  //#region search
  onChangeFromDate(event) {

    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd") + "000000";
    if (this.fromDate == '19700101000000') {
      this.fromDate = '';
    }
    if (this.fromDate !== '' && this.toDate !== '') {
      if (this.fromDate > this.toDate) {
        this.notificationService.displayWarnMessage("Ngày lọc chưa thỏa mãn");
        return;
      }
    }
   

  }

  onChangeToDate(event) {

    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd") + "235959";
    if (this.toDate == '19700101000000') {
      this.toDate = '';
    }
    if (this.fromDate !== '' && this.toDate !== '') {
      if (this.fromDate > this.toDate) {
        this.notificationService.displayWarnMessage("Ngày lọc chưa thỏa mãn");
        return;
      }
    }
   

  }

}

