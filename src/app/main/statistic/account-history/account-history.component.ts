import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/core/models/pagination';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-account-history',
  templateUrl: './account-history.component.html',
  styleUrls: ['./account-history.component.css']
})
export class AccountHistoryComponent implements OnInit {

  public dataHistory = [];
  public dataAccount = [];
  public dataCampaign = [];

  public pagination: Pagination = new Pagination();
  public smsContent: string = "";
  public ip: string = "";
  public fromDate: string = "";
  public toDate: string = "";
  public timeFrom: Date = new Date();
  public timeTo: Date = new Date();

  public isAdmin = false;

  public settingsFilterAccount = {};
  public selectedAccount = [];
  public settingsFilterCampaign = {};
  public selectedCampaign = [];

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
  }

  ngOnInit() {
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
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
    this.dataCampaign.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.selectedCampaign = [];
    let account = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : null;
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignByAccount?account_id=' + account)
    if(response){
      for (let index in response.data) {
        this.dataCampaign.push({ "id": response.data[index].ID, "itemName": response.data[index].PROGRAM_NAME });
      }
    }
  
  }

  //#region load data and paging
  public async getListDataSms() {
    this.dataHistory = [];
    let account_id = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let campaign_id = this.selectedCampaign.length > 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response = await this.dataService.getAsync('/api/AccountHistory/GetAccountHistoryPaging?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&account_id=' + account_id + '&campaign_id=' + campaign_id + '&content=' + this.smsContent + '&ip=' + this.ip +
      '&begin_date=' + this.fromDate + '&end_date=' + this.toDate);
    if (response.err_code == 0) {
      this.dataHistory = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
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
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListDataSms();
  }

  onChangeToDate(event) {
    
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
    this.ip = form.ip.trim();
    if (this.fromDate > this.toDate) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getListDataSms();
  }
  //#endregion
}
