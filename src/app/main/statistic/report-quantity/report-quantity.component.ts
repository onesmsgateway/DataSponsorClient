import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/core/models/pagination';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-report-quantity',
  templateUrl: './report-quantity.component.html',
  styleUrls: ['./report-quantity.component.css']
})
export class ReportQuantityComponent implements OnInit {

  public dataDetail = [];
  public dataAmt = [];
  public dataVol = [];
  public dataAccount = [];
  public pagination: Pagination = new Pagination();
  public dateUse: string = "";
  public fromDate: string = "";
  public toDate: string = "";
  public timeTo: Date = new Date();
  public timeFrom = new Date(this.timeTo.getTime() - (30 * 24 * 60 * 60 * 1000));
  public isAdmin = false;
  public settingsFilterAccount = {};
  public selectedAccount = [];
  public settingsFilterAmt = {};
  public selectedAmt = [];
  public settingsFilterVol = {};
  public selectedVol = [];

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

    this.settingsFilterAmt = {
      text: this.utilityService.translate('global.choose_money'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterVol = {
      text: this.utilityService.translate('statistic-data-sms.choose_data'),
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
    if (roleAccess != null && (roleAccess == 50 || result.data[0].IS_ADMIN == 1)) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.bindDataAccount();
    this.bindDataAmt();
    this.bindDataVol();
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

  async bindDataAmt() {
    this.dataAmt = [];
    this.dataAmt.push({ id: "", "itemName": this.utilityService.translate('global.all') });
    let response: any = await this.dataService.getAsync('/api/packagetelco/GetPackageAmt')
    if (response) {
      if (response.err_code == 0) {
        let id = 1;
        for (let index in response.data) {
          this.dataAmt.push({ id: id, "itemName": response.data[index].AMT });
          id++;
        }
      }
    }
  }

  async bindDataVol() {
    this.dataVol = [];
    this.dataVol.push({ id: "", "itemName": this.utilityService.translate('global.all') });
    let response: any = await this.dataService.getAsync('/api/packagetelco/GetPackageNameDisplay')
    let ID = 1;
    if (response) {
      for (let index in response.data) {
        this.dataVol.push({ "id": response.data[index].DATA, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
        ID++;
      }
    }
  }

  //#region load data and paging
  public async getListDataSms() {
    this.dataDetail = [];
    let account_id = "";
    if (this.isAdmin) {
      account_id = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      account_id = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    let amt = this.selectedAmt.length > 0 && this.selectedAmt[0].id != "" ? this.selectedAmt[0].itemName : "";
    let vol = this.selectedVol.length > 0 && this.selectedVol[0].id != "" ? this.selectedVol[0].id : "";
    let dateUse = this.dateUse != null ? this.dateUse : "";
    let response = await this.dataService.getAsync('/api/ReportData/GetReportDataFilter?account_id=' + account_id + '&vol=' + vol + '&amt=' + amt + '&date_use=' + dateUse +
      '&from_date=' + this.fromDate + '&to_date=' + this.toDate);
    if (response.err_code == 0) {
      this.dataDetail = response.data;
    }
  }
  //#endregion

  public async searchForm(form) {
    this.fromDate = this.utilityService.formatDateToString(form.fromDate, "yyyyMMdd");
    this.toDate = this.utilityService.formatDateToString(form.toDate, "yyyyMMdd");
    this.getListDataSms();
  }
  //#endregion
}
