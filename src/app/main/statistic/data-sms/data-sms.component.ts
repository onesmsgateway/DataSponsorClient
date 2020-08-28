import { Component, OnInit, ViewChild } from '@angular/core';
import { Pagination } from 'src/app/core/models/pagination';
import { DataService } from 'src/app/core/services/data.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-data-sms',
  templateUrl: './data-sms.component.html',
  styleUrls: ['./data-sms.component.css'],

})
export class DataSmsComponent implements OnInit {

  public dataSms = [];
  public dataScenario = [];
  public dataAccount = [];
  public dataCampaign = [];
  public dataPkNameDisplay = [];
  public dataPackageVTL = [];
  public dataPackageGPC = [];
  public dataPackageVMS = [];
  public dataStatus = [];
  public dataSendData = [];
  public dataTelco = [];
  public checkMonney: boolean = false;
  public statusdata;
  public checkDataCode = 0;

  public pagination: Pagination = new Pagination();
  public smsContent: string = "";
  public phone: string = "";
  public fromDate: string = "";
  public toDate: string = "";
  public account_id_scenario: string = "";
  public scenario_id_scenario: string = "";
  public fromDate_scenario: string = "";
  public toDate_scenario: string = "";
  public timeTo: Date = new Date();
  public timeFrom = new Date(this.timeTo.getTime() - (30 * 24 * 60 * 60 * 1000));

  public isAdmin = false;
  public stringVTL = "VIETTEL";
  public stringGPC = "GPC";
  public stringVMS = "VMS";

  public countAll = 0;
  public countVTL = 0;
  public countGPC = 0;
  public countVMS = 0;

  public sumVTL = 0;
  public sumGPC = 0;
  public sumVMS = 0;
  public sumAll = 0;

  public sumDataVTL = 0;
  public sumDataGPC = 0;
  public sumDataVMS = 0;
  public sumDataAll = 0;

  public settingsFilterAccount = {};
  public selectedAccount = [];
  public settingsFilterCampaign = {};
  public selectedCampaign = [];
  public selectedScenario = [];
  public settingsFilterScenario = {};
  public settingsFilterPkNameDisplay = {};
  public settingsFilterPackageVTL = {};
  public settingsFilterTelco = {};
  public selectedPackageVTL = [];
  public settingsFilterPackageGPC = {};
  public selectedPackageGPC = [];
  public settingsFilterPackageVMS = {};
  public selectedPackageVMS = [];
  public settingsFilterStatus = {};
  public settingsFilterSendData = {};
  public selectedStatus = [];
  public selectedSendData = [];
  public selectedPkNameDisplay = [];

  constructor(private authService: AuthService,
    private dataService: DataService,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
  ) {

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
    this.settingsFilterScenario = {
      text: this.utilityService.translate('scenarios.choose_scenario'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterPkNameDisplay = {
      text: this.utilityService.translate('statistic-data-sms.choose_data'),
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
    this.settingsFilterTelco = {
      text: this.utilityService.translate('statistic-data-sms.inTelco'),
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
    this.settingsFilterSendData = {
      text: this.utilityService.translate('global.choose_senddata'),
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
    this.dataTelco.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd") + "235959";
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd") + "000000";
    setTimeout(() => {
      this.getAccountLogin();
    }, 500);

    if ((this.activatedRoute.snapshot.queryParamMap.get('account_id') != "" && this.activatedRoute.snapshot.queryParamMap.get('account_id') != null)
      && (this.activatedRoute.snapshot.queryParamMap.get('scenario_id') != "" && this.activatedRoute.snapshot.queryParamMap.get('scenario_id') != null)) {
      this.timeFrom = this.utilityService.formatDateTempalte(this.activatedRoute.snapshot.queryParamMap.get('fromDate'));
      this.timeTo = this.utilityService.formatDateTempalte(this.activatedRoute.snapshot.queryParamMap.get('enddate'));
      this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd") + "000000";
      this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd") + "235959";

      this.account_id_scenario = this.activatedRoute.snapshot.queryParamMap.get('account_id');
      this.scenario_id_scenario = this.activatedRoute.snapshot.queryParamMap.get('scenario_id')
      this.selectedAccount.push({ "id": this.account_id_scenario, "itemName": this.activatedRoute.snapshot.queryParamMap.get('account_name') });
      this.selectedScenario.push({ "id": this.scenario_id_scenario, "itemName": this.activatedRoute.snapshot.queryParamMap.get('scenario_name') });
    } else {
      this.scenario_id_scenario = "";
      this.account_id_scenario = "";
    }
    if (this.activatedRoute.snapshot.queryParamMap.get('statusdata') != null && this.activatedRoute.snapshot.queryParamMap.get('statusdata') != "") {
      this.statusdata = this.activatedRoute.snapshot.queryParamMap.get('statusdata');
      if(this.statusdata == 0){
        this.fromDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd") + "000000";
      }
    }else{
      this.statusdata = "";
    }

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
    this.bindDataSendData();
    this.getListDataSms();
    setTimeout(() => {
      this.getPackageNameDisplay();
    }, 1500);
    setTimeout(() => {
      this.getCampaign();
    }, 1500);
    setTimeout(() => {
      this.getScenario();
    }, 1500);

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
    }
  }
  //#endregion

  ChangeDropdownListAccount() {
    this.getCampaign();
    this.getScenario();
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
    let response: any = await this.dataService.getAsync('/api/datacampaign/GetDataCampaignByAccount?account_id=' + account)
    if (response) {
      for (let index in response.data) {
        this.dataCampaign.push({ "id": response.data[index].ID, "itemName": response.data[index].PROGRAM_NAME });
      }
    }

  }

  //get data scenario
  async getScenario() {
    this.dataScenario = [];
    this.selectedScenario = [];
    let account = "";
    if (this.isAdmin)
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    else
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/scenarios/GetScenariosByAccount?account_id=' + account)
    if (response) {
      for (let index in response.data) {
        this.dataScenario.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
      if (this.dataScenario.length == 1) {
        this.selectedScenario.push({ "id": this.dataScenario[0].id, "itemName": this.dataScenario[0].itemName });
      } else {
        this.selectedScenario.push({ "id": this.scenario_id_scenario, "itemName": this.activatedRoute.snapshot.queryParamMap.get('scenario_name') });
        if (this.selectedScenario[0].id == "" && this.selectedScenario[0].itemName == null) {
          this.selectedScenario = [];
          this.selectedScenario.push({ "id": 0, "itemName": this.utilityService.translate('global.choose_scenario') });
        }

      }

    }
  }

  // get package name display

  async getPackageNameDisplay() {
    this.dataPkNameDisplay = [];
    this.selectedPkNameDisplay = [];
    let response: any = await this.dataService.getAsync('/api/packagetelco/GetPackageNameDisplay')
    let ID = 1;
    if (response) {
      for (let index in response.data) {
        this.dataPkNameDisplay.push({ "id": ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
        ID++;
      }
    }

  }
  //#region package
  // viettel
  async getDataPackageVTL() {
    let response: any = await this.dataService.getAsync('/api/packagetelco/GetPackageByTelco?telco=VIETTEL' + '&ismoneydatacode=' + this.checkDataCode)
    if (response) {
      for (let index in response.data) {
        this.dataPackageVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
      }
      if (this.dataPackageVTL.length == 1)
        this.selectedPackageVTL.push({ "id": this.dataPackageVTL[0].id, "itemName": this.dataPackageVTL[0].itemName });
    }

  }

  // vina
  async getDataPackageGPC() {
    let response: any = await this.dataService.getAsync('/api/packagetelco/GetPackageByTelco?telco=GPC' + '&ismoneydatacode=' + this.checkDataCode)
    if (response) {
      for (let index in response.data) {
        this.dataPackageGPC.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
      }
      if (this.dataPackageGPC.length == 1)
        this.selectedPackageGPC.push({ "id": this.dataPackageGPC[0].id, "itemName": this.dataPackageGPC[0].itemName });
    }

  }

  // mobi
  async getDataPackageVMS() {
    let response: any = await this.dataService.getAsync('/api/packagetelco/GetPackageByTelco?telco=VMS' + '&ismoneydatacode=' + this.checkDataCode)
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
    this.dataStatus.push({ "id": "1", "itemName": this.utilityService.translate('global.success') });
    this.dataStatus.push({ "id": "0", "itemName": this.utilityService.translate('global.fail') });
  }
  public async bindDataSendData() {
    this.dataSendData = [];
    this.dataSendData.push({ "id": "0", "itemName": this.utilityService.translate('global.send_money')});
    this.dataSendData.push({ "id": "1", "itemName": this.utilityService.translate('global.send_data_code')});
  }
  //#endregion

  //#region load data and paging
  public async getListDataSms() {
    this.dataSms = [];
    let account_id = "";
    let scenario_id = "";
    let campaign_id = this.selectedCampaign.length > 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let packVTL = this.selectedPackageVTL.length > 0 && this.selectedPackageVTL[0].id != "" ? this.selectedPackageVTL[0].itemName.substr(0, this.selectedPackageVTL[0].itemName.indexOf('-') - 1).trim() : "";
    let packGPC = this.selectedPackageGPC.length > 0 && this.selectedPackageGPC[0].id != "" ? this.selectedPackageGPC[0].itemName.substr(0, this.selectedPackageGPC[0].itemName.indexOf('-') - 1).trim() : "";
    let packVMS = this.selectedPackageVMS.length > 0 && this.selectedPackageVMS[0].id != "" ? this.selectedPackageVMS[0].itemName.substr(0, this.selectedPackageVMS[0].itemName.indexOf('-') - 1).trim() : "";
    let package_name_display = this.selectedPkNameDisplay.length > 0 && this.selectedPkNameDisplay[0].itemName != "" ? this.selectedPkNameDisplay[0].itemName : "";
    debugger
    let status = this.selectedStatus.length > 0 ? this.selectedStatus[0].id : this.statusdata;
    let issenddata = this.selectedSendData.length > 0 ? this.selectedSendData[0].id : "";
    if (status == '1') {
      this.checkMonney = true;
    } else {
      this.checkMonney = false;
    }

    if (this.scenario_id_scenario != null && this.scenario_id_scenario != "" && this.account_id_scenario != null && this.account_id_scenario != "") {
      account_id = this.account_id_scenario;
      scenario_id = this.scenario_id_scenario;
    } else {
      if (this.isAdmin) {
        account_id = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
      } else {
        account_id = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
      }
      scenario_id = this.selectedScenario.length > 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    }
   
    let response = await this.dataService.getAsync('/api/datasms/GetDataSmsPaging?pageIndex=' + this.pagination.pageIndex +
      '&pageSize=' + this.pagination.pageSize + '&account_id=' + account_id + '&campaign_id=' + campaign_id + '&scenario_id=' + scenario_id +
      '&package_name_display=' + package_name_display + '&status=' + status + '&from_date=' + this.fromDate + '&to_date=' + this.toDate +
      '&content=' + this.smsContent + '&phone=' + this.phone + '&viettel=' + this.stringVTL + '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS + '&ismoneydatacode=' + issenddata); 
      if (response) {
      if (response.err_code == 0) {
        this.dataSms = response.data;
        if ('pagination' in response) {
          this.pagination.pageSize = response.pagination.PageSize;
          this.pagination.totalRow = response.pagination.TotalRows;
        }
        let sumSms = response.pagination.TotalRows;
        if (sumSms > 0) {
          let responseCountSms = await this.dataService.getAsync('/api/datasms/CountPhoneFilterByTelco?account_id=' + account_id +
            '&packageVTL=' + packVTL + '&packageGPC=' + packGPC + '&packageVMS=' + packVMS + '&status=' + status + '&from_date=' + this.fromDate + '&to_date=' + this.toDate +
            '&content=' + this.smsContent + '&phone=' + this.phone + '&viettel=' + this.stringVTL + '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS + '&ismoneydatacode='+issenddata);
          if (responseCountSms != null && responseCountSms.data != null && responseCountSms.data.length > 0) {
            this.countVTL = responseCountSms.data[0].COUNT_VIETTEL;
            this.countGPC = responseCountSms.data[0].COUNT_VINAPHONE;
            this.countVMS = responseCountSms.data[0].COUNT_MOBIFONE;
            this.countAll = this.countVTL + this.countGPC + this.countVMS;
          }
          let responseSumMoney: any = await this.dataService.getAsync('/api/datasms/SumMoneyFilterByTelco?account_id=' + account_id +
            '&packageVTL=' + packVTL + '&packageGPC=' + packGPC + '&packageVMS=' + packVMS + '&status=' + status + '&from_date=' + this.fromDate + '&to_date=' + this.toDate +
            '&content=' + this.smsContent + '&phone=' + this.phone + '&viettel=' + this.stringVTL + '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS + '&ismoneydatacode='+issenddata);
          if (responseSumMoney != null && responseSumMoney.data != null && responseSumMoney.data.length > 0) {
            this.sumVTL = Math.round(responseSumMoney.data[0].SUM_VIETTEL);
            this.sumGPC = Math.round(responseSumMoney.data[0].SUM_GPC);
            this.sumVMS = Math.round(responseSumMoney.data[0].SUM_VMS);
            this.sumAll = this.sumVTL + this.sumGPC + this.sumVMS;
          }
          let responseSumData = await this.dataService.getAsync('/api/datasms/SumDataFilterByTelco?account_id=' + account_id +
            '&packageVTL=' + packVTL + '&packageGPC=' + packGPC + '&packageVMS=' + packVMS + '&status=' + status + '&from_date=' + this.fromDate + '&to_date=' + this.toDate +
            '&content=' + this.smsContent + '&phone=' + this.phone + '&viettel=' + this.stringVTL + '&vina=' + this.stringGPC + '&mobi=' + this.stringVMS + '&ismoneydatacode='+issenddata);
          if (responseSumData != null && responseSumData.data != null && responseSumData.data.length > 0) {
            this.sumDataVTL = Math.round(responseSumData.data[0].SUM_DATA_VIETTEL);
            this.sumDataGPC = Math.round(responseSumData.data[0].SUM_DATA_GPC);
            this.sumDataVMS = Math.round(responseSumData.data[0].SUM_DATA_VMS);
            this.sumDataAll = this.sumDataVTL + this.sumDataGPC + this.sumDataVMS;
          }
        } else {
          this.countVTL = 0;
          this.countGPC = 0;
          this.countVMS = 0;
          this.countAll = 0;

          this.sumAll = 0;
          this.sumVTL = 0;
          this.sumGPC = 0;
          this.sumVMS = 0;

          this.sumDataAll = 0;
          this.sumDataVTL = 0;
          this.sumDataGPC = 0;
          this.sumDataVMS = 0;
        }

      }
    }
    this.account_id_scenario = "";
    this.scenario_id_scenario = "";
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
    if (this.fromDate !== '' && this.toDate !== '') {
      if (this.fromDate > this.toDate) {
        this.notificationService.displayWarnMessage("Ngày lọc chiến dịch chưa thỏa mãn");
        return;
      }
    }
    this.getListDataSms();

  }

  onChangeToDate(event) {

    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd") + "235959";
    if (this.toDate == '19700101000000') {
      this.toDate = '';
    }
    if (this.fromDate !== '' && this.toDate !== '') {
      if (this.fromDate > this.toDate) {
        this.notificationService.displayWarnMessage("Ngày lọc chiến dịch chưa thỏa mãn");
        return;
      }
    }
    this.getListDataSms();

  }

  public async searchSms(form) {
    this.smsContent = form.smsContent.trim();
    this.fromDate = this.utilityService.formatDateToString(form.fromDate, "yyyyMMdd") + "000000";
    this.toDate = this.utilityService.formatDateToString(form.toDate, "yyyyMMdd") + "235959";
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
    let issenddata = this.selectedSendData.length > 0 ? this.selectedSendData[0].id : "";

    let result: boolean = await this.dataService.getFileExtentionDataSmsStatisticAsync("/api/FileExtention/ExportExcelDataSmsStatistic",
      accountID, pack, status, this.fromDate, this.toDate, this.smsContent, this.phone, this.stringVTL, this.stringGPC, this.stringVMS,issenddata, "DataList");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}
