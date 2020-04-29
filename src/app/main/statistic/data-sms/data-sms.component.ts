import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/core/models/pagination';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-data-sms',
  templateUrl: './data-sms.component.html',
  styleUrls: ['./data-sms.component.css']
})
export class DataSmsComponent implements OnInit {

  public dataSms = [];
  public dataAccount = [];
  public dataPackage = [];
  public dataStatus = [];

  public pagination: Pagination = new Pagination();
  public smsContent: string = "";
  public phone: string = "";
  public fromDate: string = "";
  public toDate: string = "";
  public timeFrom: Date = new Date();
  public timeTo: Date = new Date();

  public isAdmin = false;
  public stringVTL = "VIETTEL";
  public stringGPC = "GPC";
  public stringVMS = "VMS";
  
  public countAll = 0;
  public countVTL = 0;
  public countGPC = 0;
  public countVMS = 0;

  public settingsFilterAccount = {};
  public selectedAccount = [];
  public settingsFilterPackage = {};
  public selectedPackage = [];
  public settingsFilterStatus = {};
  public selectedStatus = [];

  constructor(private authService: AuthService,
    private dataService: DataService,
    private utilityService: UtilityService,
    private notificationService: NotificationService) {

    this.settingsFilterAccount = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterPackage = {
      text: this.utilityService.translate('global.choose_package'),
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
    this.getAccountLogin();
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
  }

  async getAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess != null && roleAccess == 50) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.bindDataAccount();
    this.bindDataPackage();
    this.bindDataStatus();
    this.getListDataSms();
  }

  //#region account
  public async bindDataAccount() {
    if (this.isAdmin) {
      let response: any = await this.dataService.getAsync('/api/account');
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
      if (this.dataAccount.length == 1)
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      else
        this.selectedAccount.push({ "id": 0, "itemName": this.utilityService.translate('global.choose_account') });
    }
  }
  //#endregion

  ChangeDropdownList() {
    this.getListDataSms();
  }

  //#region package
  public async bindDataPackage() {
    this.selectedPackage = [];
    this.dataPackage = [];
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageDomainPaging?pageIndex=1&pageSize=9999&package_name=')
    for (let index in response.data) {
      this.dataPackage.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME });
    }
    if (this.dataPackage.length == 1)
      this.selectedPackage.push({ "id": this.dataPackage[0].id, "itemName": this.dataPackage[0].itemName });
  }
  //#endregion

  //#region smsType
  public async bindDataStatus() {
    this.dataStatus = [];
    this.dataStatus.push({ "id": "1", "itemName": this.utilityService.translate('global.success') });
    this.dataStatus.push({ "id": "0", "itemName": this.utilityService.translate('global.fail') });
  }
  //#endregion

  //#region load data and paging
  public async getListDataSms() {
    this.dataSms = [];
    let account_id = this.selectedAccount.length > 0 ? this.selectedAccount[0].id : "";
    let pack = this.selectedPackage.length > 0 ? this.selectedPackage[0].id : "";
    let status = this.selectedStatus.length > 0 ? this.selectedStatus[0].id : "";
    let response = await this.dataService.getAsync('/api/DataSms/GetDataSmsPaging?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&account_id=' + account_id +
      '&package=' + pack + '&status=' + status + '&from_date=' + this.fromDate + '&to_date=' + this.toDate + 
      '&content=' + this.smsContent + '&phone=' + this.phone + 
      '&viettel=' + this.stringVTL + '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS);
    if (response.err_code == 0) {
      this.dataSms = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }

      // let sumSms = response.pagination.TotalSms;
      // if (sumSms > 0) {
      //   let responseCountSms = await this.dataService.getAsync('/api/sms/CountSMSFillterByTelco?account_id=' + account_id +
      //     '&sender_id=' + (this.selectedSenderID.length > 0 ? this.selectedSenderID[0].id : "") +
      //     '&sms_content=' + this.smsContent + '&phone=' + this.phone +
      //     '&sms_type=' + (this.selectedSmsType.length > 0 ? this.selectedSmsType[0].id : "") +
      //     '&viettel=' + this.stringVTL +
      //     '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS +
      //     '&vnMobile=' + this.stringVNM + '&gtel=' + this.stringGTEL + '&sfone=' + this.stringSFONE +
      //     '&ddMobile=' + this.stringDD + '&tu_ngay=' + this.fromDate + '&den_ngay=' + this.toDate +
      //     '&partner_code=' + (this.selectedPartnerID.length > 0 ? this.selectedPartnerID[0].id : "") +
      //     '&receive_result=' + (this.selectedSmsStatus.length > 0 ? this.selectedSmsStatus[0].id : ""));
      //   if (responseCountSms != null && responseCountSms.data != null && responseCountSms.data.length > 0) {
      //     this.countVTL = responseCountSms.data[0].VIETTEL;
      //     this.countGPC = responseCountSms.data[0].GPC;
      //     this.countVMS = responseCountSms.data[0].VMS;
      //     this.countVNM = responseCountSms.data[0].VNM;
      //     this.countGtel = responseCountSms.data[0].GTEL;
      //     this.countAll = this.countVTL + this.countGPC + this.countVMS + this.countVNM + this.countGtel;
      //   }
      // } else {
      //   this.countVTL = 0;
      //   this.countGPC = 0;
      //   this.countVMS = 0;
      //   this.countVNM = 0;
      //   this.countGtel = 0;
      //   this.countAll = 0;
      // }
    }
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }
  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getListDataSms();
  }
  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getListDataSms();
  }
  //#endregion

  //#region search
  onChangeFromDate(event) {
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListDataSms();
  }

  onChangeToDate(event) {
    console.log(event);
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displaySuccessMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListDataSms();
  }

  public async searchSms(form) {
    this.smsContent = form.smsContent.trim();
    this.fromDate = this.utilityService.formatDateToString(form.fromDate, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(form.toDate, "yyyyMMdd");
    this.phone = form.phone.trim();
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListDataSms();
  }
  //#endregion

  //#region check telco
  onChangeVTL(isChecked) {
    if (isChecked) {
      this.stringVTL = "VIETTEL"
    }
    else {
      this.stringVTL = "";
    }
    this.getListDataSms();
  }

  onChangeVMS(isChecked) {
    if (isChecked) {
      this.stringVMS = "VMS";
    }
    else {
      this.stringVMS = "";
    }
    this.getListDataSms();
  }

  onChangeGPC(isChecked) {
    if (isChecked) {
      this.stringGPC = "GPC";
    }
    else {
      this.stringGPC = "";
    }
    this.getListDataSms();
  }
  //#endregion

  public async exportExcel() {
    let accountID = "0";
    if (this.isAdmin)
      accountID = this.selectedAccount.length > 0 ? this.selectedAccount[0].id : "";
    else if (!this.isAdmin && this.selectedAccount.length == 0)
      accountID = "0";
    else accountID = this.selectedAccount[0].id;
    let pack = this.selectedPackage.length > 0 ? this.selectedPackage[0].id : "";
    let status = this.selectedStatus.length > 0 ? this.selectedStatus[0].id : "";

    let result: boolean = await this.dataService.getFileExtentionDataSmsStatisticAsync("/api/FileExtention/ExportExcelDataSmsStatistic",
      accountID, pack, status, this.fromDate, this.toDate, this.smsContent, this.phone, this.stringVTL, this.stringGPC, this.stringVMS, "SmsList");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}
