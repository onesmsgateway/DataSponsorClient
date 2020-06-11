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
  public dataCampaign = [];
  public dataPackageVTL = [];
  public dataPackageGPC = [];
  public dataPackageVMS = [];
  public dataStatus = [];

  public pagination: Pagination = new Pagination();
  public smsContent: string = "";
  public phone: string = "";
  public fromDate: string = "";
  public toDate: string = "";
  public timeFrom: string = "";
  public timeTo: string = "";

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
  public settingsFilterCampaign = {};
  public selectedCampaign = [];
  public settingsFilterPackageVTL = {};
  public selectedPackageVTL = [];
  public settingsFilterPackageGPC = {};
  public selectedPackageGPC = [];
  public settingsFilterPackageVMS = {};
  public selectedPackageVMS = [];
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

    this.settingsFilterCampaign = {
      text: this.utilityService.translate('send_data.inCampaign'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterPackageVTL = {
      text: this.utilityService.translate('statistic-data-sms.inPackageVTL'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterPackageGPC = {
      text: this.utilityService.translate('statistic-data-sms.inPackageGPC'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterPackageVMS = {
      text: this.utilityService.translate('statistic-data-sms.inPackageVMS'),
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
    this.dataPackageVTL.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataPackageGPC.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataPackageVMS.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
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
    this.getDataPackageVTL();
    this.getDataPackageGPC();
    this.getDataPackageVMS();
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

  ChangeDropdownListAccount() {
    this.getCampaign();
    this.getListDataSms();
    
  }

  ChangeDropdownList() {
    this.getListDataSms();
  }

  async getCampaign() {
    this.dataCampaign = [];
    this.selectedCampaign = [];
    let account = "";
    if (this.isAdmin)
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    else
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    // let account = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignByAccount?account_id=' + account)
    for (let index in response.data) {
      this.dataCampaign.push({ "id": response.data[index].ID, "itemName": response.data[index].PROGRAM_NAME });
    }
  }

  //#region package
  // viettel
  async getDataPackageVTL() {
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VIETTEL')
    for (let index in response.data) {
      this.dataPackageVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVTL.length == 1)
      this.selectedPackageVTL.push({ "id": this.dataPackageVTL[0].id, "itemName": this.dataPackageVTL[0].itemName });
  }

  // vina
  async getDataPackageGPC() {
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=GPC')
    for (let index in response.data) {
      this.dataPackageGPC.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageGPC.length == 1)
      this.selectedPackageGPC.push({ "id": this.dataPackageGPC[0].id, "itemName": this.dataPackageGPC[0].itemName });
  }

  // mobi
  async getDataPackageVMS() {
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VMS')
    for (let index in response.data) {
      this.dataPackageVMS.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVMS.length == 1)
      this.selectedPackageVMS.push({ "id": this.dataPackageVMS[0].id, "itemName": this.dataPackageVMS[0].itemName });
  }
  //#endregion

  //#region smsType
  public async bindDataStatus() {
    this.dataStatus = [];
    this.dataStatus.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataStatus.push({ "id": "1", "itemName": this.utilityService.translate('global.success') });
    this.dataStatus.push({ "id": "0", "itemName": this.utilityService.translate('global.fail') });
  }
  //#endregion

  //#region load data and paging
  public async getListDataSms() {
    
    this.dataSms = [];
    let account_id = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let campaign_id = this.selectedCampaign.length > 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let packVTL = this.selectedPackageVTL.length > 0 && this.selectedPackageVTL[0].id != "" ? this.selectedPackageVTL[0].itemName.substr(0, this.selectedPackageVTL[0].itemName.indexOf('-') - 1).trim() : "";
    let packGPC = this.selectedPackageGPC.length > 0 && this.selectedPackageGPC[0].id != "" ? this.selectedPackageGPC[0].itemName.substr(0, this.selectedPackageGPC[0].itemName.indexOf('-') - 1).trim() : "";
    let packVMS = this.selectedPackageVMS.length > 0 && this.selectedPackageVMS[0].id != "" ? this.selectedPackageVMS[0].itemName.substr(0, this.selectedPackageVMS[0].itemName.indexOf('-') - 1).trim() : "";
    let status = this.selectedStatus.length > 0 ? this.selectedStatus[0].id : "";
    let response = await this.dataService.getAsync('/api/DataSms/GetDataSmsPaging?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&account_id=' + account_id + '&campaign_id=' + campaign_id +
      '&packageVTL=' + packVTL + '&packageGPC=' + packGPC + '&packageVMS=' + packVMS + '&status=' + status + '&from_date=' + this.fromDate + '&to_date=' + this.toDate + 
      '&content=' + this.smsContent + '&phone=' + this.phone + '&viettel=' + this.stringVTL + '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS);
    if (response.err_code == 0) {
      this.dataSms = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }

      let sumSms = response.pagination.TotalRows;
      if (sumSms > 0) {
        let responseCountSms = await this.dataService.getAsync('/api/DataSms/CountPhoneFilterByTelco?account_id=' + account_id +
        '&packageVTL=' + packVTL + '&packageGPC=' + packGPC + '&packageVMS=' + packVMS + '&status=' + status + '&from_date=' + this.fromDate + '&to_date=' + this.toDate + 
        '&content=' + this.smsContent + '&phone=' + this.phone + '&viettel=' + this.stringVTL + '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS);
        if (responseCountSms != null && responseCountSms.data != null && responseCountSms.data.length > 0) {
          this.countVTL = responseCountSms.data[0].COUNT_VIETTEL;
          this.countGPC = responseCountSms.data[0].COUNT_VINAPHONE;
          this.countVMS = responseCountSms.data[0].COUNT_MOBIFONE;
          this.countAll = this.countVTL + this.countGPC + this.countVMS;
        }
      } else {
        this.countVTL = 0;
        this.countGPC = 0;
        this.countVMS = 0;
        this.countAll = 0;
      }
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

    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd") + "000000";
    if (this.fromDate == '19700101000000') {
      this.fromDate = '';
    }
    if(this.fromDate !== '' && this.toDate !== ''){
      if(this.fromDate > this.toDate){
        this.notificationService.displayWarnMessage("Ngày lọc chiến dịch chưa thỏa mãn");
        return;
      }
    }
    this.getListDataSms();

  }

  onChangeToDate(event) {
   
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd") + "230000";
    if (this.toDate == '19700101000000') {
      this.toDate = '';
    }
    if(this.fromDate !== '' && this.toDate !== ''){
      if(this.fromDate > this.toDate){
        this.notificationService.displayWarnMessage("Ngày lọc chiến dịch chưa thỏa mãn");
        return;
      }
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
      accountID = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    else if (!this.isAdmin && this.selectedAccount.length == 0)
      accountID = "0";
    else accountID = this.selectedAccount[0].id;
    let pack = this.selectedPackageVTL.length > 0 ? this.selectedPackageVTL[0].id : "";
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
