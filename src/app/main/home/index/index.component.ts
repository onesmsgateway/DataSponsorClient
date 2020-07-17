import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';
import { Chart } from 'chart.js';
import { ChartOptions, ChartType } from 'chart.js';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public showOverlay = true;
  public smsErr = 0;
  public newCustomer = 0;
  public accountExpiredQuota = 0;
  public senderExpired = 0;
  // public currentDate = this.utilityService.formatDateToString(new Date, "dd/MM/yyyy");
  public currentDate = "01/09/2019";

  public grossProductData: any = [];
  public month_now;
  public month_old1;
  public month_old2;

  //thong ke click
  public barChartLabelsClick: any = [];
  public barChartTypeClick: string = '';
  public barChartLegendClick: boolean = false;
  public checkDayhour: boolean = true;
  public barChartDataClick: any = [];
  public chooseMont: string = '';
  public timeday: Date = new Date();
  public chosseDate: string = '';
  public selectedFromHour = [];
  public dataHour = [];
  public settingsFilterFromHour = {};
  public selectedToHour = [];
  public fromhour: string = '';
  public tohour: string = '';
  public timeTo = new Date();
  public timeFrom = new Date(this.timeTo.getTime() - (30 * 24 * 60 * 60 * 1000));
  public fromDate: string = "";
  public toDate: string = "";

  //thong ke khach hang cu moi
  public barChartLabelsCustomer: any = [];
  public barChartTypeCustomer: string = '';
  public barChartLegendCustomer: boolean = false;
  public barChartDataCustomer: any = [];

  // thong ke khach dang ky nhan data theo ngay/gio
  public labelsChartRegisterDay: any = [];
  public barChartTypeRegisterDay: string = '';
  public barChartLegendRegisterDay: boolean = false;
  public stringVTL = "VIETTEL";
  public stringGPC = "GPC";
  public stringVMS = "VMS";
  public chartDataRegisterDay: any = [];
  public telco: string = '';
  public dataSetViettel = [];
  public dataSetVina = [];
  public dataSetMobi = [];

  //thong ke nhan data khach hang cu/moi
  //cu
  public barChartDataRegisterOld: any = [];
  public barChartLabelsRegisterOld: any = [];
  public barChartTypeRegisterOld: string = '';
  public barChartLegendRegisterOld: boolean = false;
  public dataSetViettelOld = [];
  public dataSetVinaOld = [];
  public dataSetMobiOld = [];

  //moi
  public barChartDataRegisterNew: any = [];
  public barChartLabelsRegisterNew: any = [];
  public barChartTypeRegisterNew: string = '';
  public barChartLegendRegisterNew: boolean = false;
  public dataSetViettelNew = [];
  public dataSetVinaNew = [];
  public dataSetMobiNew = [];

  // get acount
  public selectedAccount = [];
  public dataAccount = [];
  public settingsFilterAccount = {};

  // get campaign
  public selectedCampaign = [];
  public dataCampaign = [];
  public settingsFilterCampaign = {};

  //get scenario
  public selectedScenario = [];
  public dataScenario = [];
  public settingsFilterScenario = {};

  //get check gio
  public isHour: boolean = false;
  public isDay: boolean = false;

  public grossSmsTelco: any = [];
  public grossSmsGroupSender: any = [];

  public weatherData: any = [{
    month: "January",
    avgT: 98,
    // minT: 41,
    // maxT: 155,
    prec: 109
  }, {
    month: "February",
    avgT: 1180,
    prec: 104
  }, {
    month: "March",
    avgT: 134,
    prec: 92
  }, {
    month: "April",
    avgT: 154,
    minT: 81,
    maxT: 228,
    prec: 30
  }, {
    month: "May",
    avgT: 18,
    prec: 10
  }, {
    month: "June",
    avgT: 706,
    prec: 2
  }, {
    month: "July",
    avgT: 222,
    minT: 132,
    maxT: 313,
    prec: 2
  }, {
    month: "August",
    avgT: 222,
    prec: 1
  }, {
    month: "September",
    avgT: 1000,
    minT: 124,
    maxT: 299,
    prec: 8
  }, {
    month: "October",
    avgT: 19,
    minT: 97,
    maxT: 26.1,
    prec: 24
  }, {
    month: "November",
    avgT: 129,
    minT: 62,
    maxT: 196,
    prec: 64
  }, {
    month: "December",
    avgT: 960,
    minT: 34,
    maxT: 157,
    prec: 76
  }];

  valueText: string;
  public totalSenderExpired = 0;
  public totalSmsWaitApprove = 0;
  public thisAccount;
  public isAdmin: boolean = false;
  public isAdminBranch: boolean = false;
  public isCustomer: boolean = false;
  public isCheckUser: boolean = false;
  public checkdataMax: boolean = false;


  public settingsFilterSender = {};
  public selectedSenderID = [];
  public dataSender = [];
  public dataSmsByPhone = [];

  public phone = "";
  public pagination: Pagination = new Pagination();

  constructor(
    private notificationService: NotificationService,
    private dataService: DataService,
    private authService: AuthService,
    private utilityService: UtilityService) {
    this.settingsFilterSender = {
      text: "Chọn thương hiệu",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };
    this.settingsFilterAccount = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterFromHour = {
      text: this.utilityService.translate('index.choose_hour'),
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
  }


  ngOnInit() {
    this.chosseDate = this.utilityService.formatDateToString(this.timeday, "yyyyMMdd");
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    for (let hourList = 1; hourList < 25; hourList++) {
      this.dataHour.push(hourList < 10 ? { "id": '0' + hourList.toString(), "itemName": '0' + hourList.toString() + 'h' } : { "id": hourList.toString(), "itemName": hourList.toString() + 'h' });
    }
    setTimeout(() => {
      this.getAccountLogin();
    }, 1500);
    // this.getChartClick();
    // this.getChartCustomerOldNew();
    // this.getDataMonth();

  }

  // bind data account
  //#region account
  async getAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess == 50) {
      this.isAdmin = true;
      this.isAdminBranch = false;
      this.isCustomer = false;
    }
    else if (roleAccess == 53) {
      this.isAdmin = false;
      this.isAdminBranch = true;
      this.isCustomer = false;
    }
    else {
      this.isAdmin = false;
      this.isAdminBranch = false;
      this.isCustomer = true;
    }
    let checkUser = result.data[0].USER_NAME;
    if (checkUser == "admin" || checkUser == "demo") {
      this.isCheckUser = true;
    }
    setTimeout(() => {
      this.getDataAccount();
    }, 1000);

    setTimeout(() => {
      this.getCampaign();
    }, 1000);

    setTimeout(() => {
      this.getScenario();
    }, 1000);
    this.getChartClickDay();
    this.getChartRegisterDay();
    this.getChartRegisterDayOld();
    this.getChartRegisterDayNew();
  }

  customizeLabel(arg) {
    return arg.valueText + " (" + arg.percentText + ")";
  }

  customizeLabelPieChart(point) {
    return point.argumentText + ": " + point.valueText + "%";
  }

  onPointClick(e) {
    e.target.select();
  }

  temperatureCustomizeText() {
    return this.valueText + " SMS";
  }

  precipitationCustomizeText() {
    return this.valueText + " SMS";
  }

  //get data account
  async getDataAccount() {
    if (this.isAdmin) {
      this.selectedAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
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
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }

  //get campaign
  async getCampaign() {
    this.dataCampaign = [];
    this.selectedCampaign = [];
    let account = "";
    if (this.isAdmin)
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    else
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignByAccount?account_id=' + account)
    if (response) {
      for (let index in response.data) {
        this.dataCampaign.push({ "id": response.data[index].ID, "itemName": response.data[index].PROGRAM_NAME });
      }
    }

  }
  // get scenario
  //get data scenario
  async getScenario() {

    this.dataScenario = [];
    this.selectedScenario = [];
    let account = "";
    if (this.isAdmin)
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    else
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosByAccount?account_id=' + account)
    if (response) {
      for (let index in response.data) {
        this.dataScenario.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
      if (this.dataScenario.length == 1) {
        this.selectedScenario.push({ "id": this.dataScenario[0].id, "itemName": this.dataScenario[0].itemName });
      } else {
        this.selectedScenario.push({ "id": "", "itemName": this.utilityService.translate('scenarios.choose_scenario') });
      }

    }
  }
  // Thống kê lượt KH click vào link truy cập hàng ngày
  public async getChartClickDay() {
    this.barChartLabelsClick = [];
    this.barChartTypeClick = 'bar';
    this.barChartLegendClick = true;
    this.barChartDataClick = [
      { data: [], label: '', stack: '' },
    ];
    let arrayLable = [];
    let arrayData = [];
    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let FROM_DATE = this.fromDate;
    let TO_DATE = this.toDate;
    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ChartPopupViewSummaryDay/GetFilterPopupViewDay?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE)
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          arrayLable.push(response.data[i].DAY_OF_MONTH);
          arrayData.push(parseInt(response.data[i].SUM_DAY));
        }
      }
    }

    this.barChartLabelsClick = arrayLable;
    this.barChartTypeClick = 'bar';
    this.barChartLegendClick = true;
    this.barChartDataClick = [
      { data: arrayData, label: 'Lượt truy cập', stack: '1', backgroundColor: '#00FF66', hoverBackgroundColor: '#CCFF00', borderColor: '#2F4F4F' },
    ];
  }

  //thong ke khach hang click theo gio
  public async getChartClickHour() {
    this.barChartLabelsClick = [];
    this.barChartTypeClick = 'bar';
    this.barChartLegendClick = true;
    this.barChartDataClick = [
      { data: [], label: '', stack: '' },
    ];
    let arrayLable = [];
    let arrayData = [];
    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let DAY_MONTH = this.chosseDate;
    let FROM_HOUR = this.fromhour;
    let TO_HOUR = this.tohour;
    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ChartPopupViewSummaryHour/GetChartPopupViewSummaryHourFilter?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&dayMonth=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR)
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          arrayLable.push((response.data[i].HOUR_IN_DAY).slice(-2));
          arrayData.push(parseInt(response.data[i].HOUR_SUM));
        }
      }
    }

    this.barChartLabelsClick = arrayLable;
    this.barChartTypeClick = 'bar';
    this.barChartLegendClick = true;
    this.barChartDataClick = [
      { data: arrayData, label: 'Lượt truy cập', stack: '1', backgroundColor: '#008080', hoverBackgroundColor: '#2F4F4F', borderColor: '#2F4F4F' },
    ];

  }

  // Thống kê KH đăng ký nhận data theo ngay/gio
  public async getChartRegisterDay() {
    this.labelsChartRegisterDay = [];
    this.dataSetViettel = [];
    this.dataSetVina = [];
    this.dataSetMobi = [];
    this.chartDataRegisterDay = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeRegisterDay = 'bar';
    this.barChartLegendRegisterDay = true;

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let FROM_DATE = this.fromDate;
    let TO_DATE = this.toDate;
    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ChartPopupRegisterDay/GetFilterPopupRegisterDay?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE +
      '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          this.labelsChartRegisterDay.push(response.data[i].DAY_OF_MONTH);
          this.dataSetViettel.push(parseInt(response.data[i].DAY_VIETTEL));
          this.dataSetVina.push(parseInt(response.data[i].DAY_GPC));
          this.dataSetMobi.push(parseInt(response.data[i].DAY_VMS));
        }
      }
    }
    debugger
    this.chartDataRegisterDay = [
      { data: this.dataSetViettel, label: 'KH Viettel', stack: '1', backgroundColor: '#2E8B57', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
      { data: this.dataSetVina, label: 'KH Vina', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#3CB371', hoverBackgroundColor: '#A3E4D7' },
      { data: this.dataSetMobi, label: 'KH Mobi', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#90EE90', hoverBackgroundColor: '#DAF7A6' }
    ];

  }

  // Thống kê KH đăng ký nhận data theo ngay/gio khach hang cu
  public async getChartRegisterDayOld() {
    this.dataSetViettelOld = [];
    this.dataSetVinaOld = [];
    this.dataSetMobiOld = [];
    this.barChartDataRegisterOld = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeRegisterOld = 'bar';
    this.barChartLegendRegisterOld = true;
    this.barChartLabelsRegisterOld=[];

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let FROM_DATE = this.fromDate;
    let TO_DATE = this.toDate;
    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ChartPopupRegisterDay/GetFilterPopupRegisterDayOld?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE +
      '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)

      if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          this.barChartLabelsRegisterOld.push(response.data[i].DAY_OF_MONTH);
          this.dataSetViettelOld.push(parseInt(response.data[i].DAY_VIETTEL));
          this.dataSetVinaOld.push(parseInt(response.data[i].DAY_GPC));
          this.dataSetMobiOld.push(parseInt(response.data[i].DAY_VMS));
        }
        this.barChartDataRegisterOld = [
          { data: this.dataSetViettelOld, label: 'KH Viettel cũ', stack: '1', backgroundColor: '#FFCDD2', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
          { data: this.dataSetVinaOld, label: 'KH Vina cũ', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#BBDEFB', hoverBackgroundColor: '#A3E4D7' },
          { data: this.dataSetMobiOld, label: 'KH Mobi cũ', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFF8E1', hoverBackgroundColor: '#DAF7A6' }
        ];    
      }
    }
   
  }

  // Thống kê KH đăng ký nhận data theo ngay khach hang cu
  public async getChartRegisterDayNew() {
    this.dataSetViettelNew = [];
    this.dataSetVinaNew = [];
    this.dataSetMobiNew = [];
    this.barChartDataRegisterNew = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeRegisterNew = 'bar';
    this.barChartLegendRegisterNew = true;
    this.barChartLabelsRegisterNew=[];

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let FROM_DATE = this.fromDate;
    let TO_DATE = this.toDate;
    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ChartPopupRegisterDay/GetFilterPopupRegisterDayNew?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE +
      '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          this.barChartLabelsRegisterNew.push(response.data[i].DAY_OF_MONTH);
          this.dataSetViettelNew.push(parseInt(response.data[i].DAY_VIETTEL));
          this.dataSetVinaNew.push(parseInt(response.data[i].DAY_GPC));
          this.dataSetMobiNew.push(parseInt(response.data[i].DAY_VMS));
        }
      }
    }
    debugger
    this.barChartDataRegisterNew = [
      { data: this.dataSetViettelNew, label: 'KH Viettel mới', stack: '1', backgroundColor: '#F44336', borderColor: '#03A9F4', hoverBackgroundColor: '#73C6B6' },
      { data: this.dataSetVinaNew, label: 'KH Vina mới', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#03A9F4', hoverBackgroundColor: '#A3E4D7' },
      { data: this.dataSetMobiNew, label: 'KH Mobi mới', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFF59D', hoverBackgroundColor: '#DAF7A6' }
    ];

  }

  //thong ke khach hang nhan data theo gio
  public async getChartRegisterHour() {
    this.labelsChartRegisterDay = [];
    this.dataSetViettel = [];
    this.dataSetVina = [];
    this.dataSetMobi = [];
    this.chartDataRegisterDay = [];
    this.barChartTypeRegisterDay = 'bar';
    this.barChartLegendRegisterDay = true;

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let DAY_MONTH = this.chosseDate;
    let FROM_HOUR = this.fromhour;
    let TO_HOUR = this.tohour;

    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ChartPopupRegisterHour/GetFilterPopupRegisterHour?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&day_of_month=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR +
      '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          this.labelsChartRegisterDay.push(response.data[i].HOUR_IN_DAY.slice(-2));
          this.dataSetViettel.push(parseInt(response.data[i].HOUR_VIETTEL));
          this.dataSetVina.push(parseInt(response.data[i].HOUR_GPC));
          this.dataSetMobi.push(parseInt(response.data[i].HOUR_VMS));
        }
      }
    }
    this.chartDataRegisterDay = [
      { data: this.dataSetViettel, label: 'KH Viettel', stack: '1', backgroundColor: '#2E8B57', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
      { data: this.dataSetVina, label: 'KH Vina', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#3CB371', hoverBackgroundColor: '#A3E4D7' },
      { data: this.dataSetMobi, label: 'KH Mobi', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#90EE90', hoverBackgroundColor: '#DAF7A6' }
    ];
  }

  //thong ke khach hang nhan data theo gio khach hang cu
  public async getChartRegisterHourOld() {
    this.dataSetViettelOld = [];
    this.dataSetVinaOld = [];
    this.dataSetMobiOld = [];
    this.barChartLabelsRegisterOld = [];
    this.barChartDataRegisterOld = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeRegisterOld = 'bar';
    this.barChartLegendRegisterOld = true;

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let DAY_MONTH = this.chosseDate;
    let FROM_HOUR = this.fromhour;
    let TO_HOUR = this.tohour;

    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ChartPopupRegisterHour/GetFilterPopupRegisterHourOld?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&day_of_month=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR +
      '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          this.barChartLabelsRegisterOld.push(response.data[i].HOUR_IN_DAY.slice(-2));
          this.dataSetViettelOld.push(parseInt(response.data[i].HOUR_VIETTEL));
          this.dataSetVinaOld.push(parseInt(response.data[i].HOUR_GPC));
          this.dataSetMobiOld.push(parseInt(response.data[i].HOUR_VMS));
        }
      }
    }
    this.barChartDataRegisterOld = [
      { data: this.dataSetViettelOld, label: 'KH Viettel cũ', stack: '1', backgroundColor: '#FFCDD2', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
      { data: this.dataSetVinaOld, label: 'KH Vina cũ', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#BBDEFB', hoverBackgroundColor: '#A3E4D7' },
      { data: this.dataSetMobiOld, label: 'KH Mobi cũ', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFF8E1', hoverBackgroundColor: '#DAF7A6' }
    ];    
  }

  //thong ke khach hang nhan data theo gio khach hang cu
  public async getChartRegisterHourNew() {
    this.dataSetViettelNew = [];
    this.dataSetVinaNew = [];
    this.dataSetMobiNew = [];
    this.barChartLabelsRegisterNew = [];
    this.barChartDataRegisterNew = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeRegisterNew = 'bar';
    this.barChartLegendRegisterNew = true;

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let DAY_MONTH = this.chosseDate;
    let FROM_HOUR = this.fromhour;
    let TO_HOUR = this.tohour;

    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ChartPopupRegisterHour/GetFilterPopupRegisterHourNew?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&day_of_month=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR +
      '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
    debugger
      if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          this.barChartLabelsRegisterNew.push(response.data[i].HOUR_IN_DAY.slice(-2));
          this.dataSetViettelNew.push(parseInt(response.data[i].HOUR_VIETTEL));
          this.dataSetVinaNew.push(parseInt(response.data[i].HOUR_GPC));
          this.dataSetMobiNew.push(parseInt(response.data[i].HOUR_VMS));
        }
      }
    }

    this.barChartDataRegisterNew = [
      { data: this.dataSetViettelNew, label: 'KH Viettel mới', stack: '1', backgroundColor: '#F44336', borderColor: '#03A9F4', hoverBackgroundColor: '#73C6B6' },
      { data: this.dataSetVinaNew, label: 'KH Vina mới', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#03A9F4', hoverBackgroundColor: '#A3E4D7' },
      { data: this.dataSetMobiNew, label: 'KH Mobi mới', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFF59D', hoverBackgroundColor: '#DAF7A6' }
    ];
  }
  
  //Biểu đồ Thống kê KH nhận data theo nhà mạng 2020
  public LabelChartReceiveDataByTel = ['Viettel', 'Vina', 'Mobi'];
  public dataChartReceiveDataByTel = [2171, 1961, 1660];
  public TypeChartReceiveDataByTel = 'pie';
  colorChartReceiveDataByTel: any = [
    {
      backgroundColor: ['rgba(30, 169, 224, 0.8)',
        'rgba(255,165,0,0.9)',
        'rgba(139, 136, 136, 0.9)',
      ]
    }
  ]
  optionChartReceiveDataByTel: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems, data) {
          let sum: number = 0;
          for (let i = 0; i < data.datasets[0].data.length; i++) {
            sum += Number.parseFloat(data.datasets[0].data[i].toString());
          }
          let value: number = parseFloat(data.datasets[0].data[tooltipItems.index].toString());
          let percent = (value * 100 / sum).toFixed(2);
          return data.labels[tooltipItems.index] + " : " + percent + ' %';
        }
      }
    },
  };

  //Thống kê KHSDTX
  public labelKHSDTX = ['7/2020'];
  public typeKHSDTX = 'bar';
  public legendKHSDTX = true;
  public dataKHSDTX = [
    { data: [400], label: 'Viettel', stack: '1' },
    { data: [320], label: 'Vina', stack: '2' },
    { data: [360], label: 'Mobi', stack: '3' }
  ];

  checkDay(event) {
    if (event == "1") {
      this.checkDayhour = false;
      this.isHour = true;
      this.isDay = false;
      this.getChartClickHour();
      this.getChartRegisterHour();
      this.getChartRegisterHourOld();
      this.getChartRegisterHourNew();

    }
    else {
      this.checkDayhour = false;
      this.isHour = false;
      this.isDay = true;
      this.getChartClickDay();
      this.getChartRegisterDay();
      this.getChartRegisterDayOld();
      this.getChartRegisterDayNew();

    }
  }
  onChangeChooseDate(event) {
    this.chosseDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.chosseDate == '197001' && this.isDay == false) {
      this.chosseDate = '';
    }
    this.fromhour = '';
    this.tohour = '';
    this.getChartClickHour();
    this.getChartRegisterHour();
    this.getChartRegisterHourOld();
    this.getChartRegisterHourNew();

  }
  ChangeDropdownListAccount() {

    this.getCampaign();
    this.getScenario();
    if (this.isHour == true && this.isDay == false) {
      this.getChartClickHour();
      this.getChartRegisterHour();
      this.getChartRegisterHourOld();
      this.getChartRegisterHourNew();
    } else {
      this.getChartClickDay();
      this.getChartRegisterDay();
      this.getChartRegisterDayOld();
      this.getChartRegisterDayNew();
    }

  }
  ChangeDropdownList() {
    if (this.isHour == true && this.isDay == false) {
      this.getChartClickHour();
      this.getChartRegisterHour();
      this.getChartRegisterHourOld();
      this.getChartRegisterHourNew();
    } else {
      this.getChartClickDay();
      this.getChartRegisterDay();
      this.getChartRegisterDayOld();
      this.getChartRegisterDayNew();
    }
  }
  ChangeDropdownListHourn() {
    this.fromhour = this.selectedFromHour.length > 0 && this.selectedFromHour[0].id != "" ? this.selectedFromHour[0].id : "";
    this.tohour = this.selectedToHour.length > 0 && this.selectedToHour[0].id != "" ? this.selectedToHour[0].id : "";
    if (this.fromhour !== '' && this.tohour !== '') {
      if (parseInt(this.fromhour) > parseInt(this.tohour)) {
        this.notificationService.displayWarnMessage(this.utilityService.translate('index.filter_hour'));
        return;
      }
    }
    this.getChartClickHour();
    this.getChartRegisterHour();
    this.getChartRegisterHourOld();
    this.getChartRegisterHourNew();
  }

  //#region search
  onChangeFromDate(event) {

    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.fromDate == '19700101') {
      this.fromDate = '';
    }
    if (this.fromDate !== '' && this.toDate !== '') {
      if (this.fromDate > this.toDate) {
        this.notificationService.displayWarnMessage("Ngày lọc chưa thỏa mãn");
        return;
      }
    }
    this.getChartClickDay();
    this.getChartRegisterDay();
    this.getChartRegisterDayOld();
    this.getChartRegisterDayNew();

  }

  onChangeToDate(event) {
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.toDate == '19700101') {
      this.toDate = '';
    }
    if (this.fromDate !== '' && this.toDate !== '') {
      if (this.fromDate > this.toDate) {
        this.notificationService.displayWarnMessage("Ngày lọc chưa thỏa mãn");
        return;
      }
    }
    this.getChartClickDay();
    this.getChartRegisterDay();
    this.getChartRegisterDayOld();
    this.getChartRegisterDayNew();
  }
  //#region check telco
  onChangeVTL(isChecked) {
    if (isChecked) {
      this.stringVTL = "VIETTEL"
    }
    else {
      this.stringVTL = "";
    }
    this.getChartRegisterDay();
    this.getChartRegisterDayOld();
    this.getChartRegisterDayNew();
    this.getChartRegisterHour();
    this.getChartRegisterHourOld();
    this.getChartRegisterHourNew();
  }

  onChangeVMS(isChecked) {
    if (isChecked) {
      this.stringVMS = "VMS";
    }
    else {
      this.stringVMS = "";
    }
    this.getChartRegisterDay();
    this.getChartRegisterDayOld();
    this.getChartRegisterDayNew();
    this.getChartRegisterHour();
    this.getChartRegisterHourOld();
    this.getChartRegisterHourNew();
  }

  onChangeGPC(isChecked) {
    if (isChecked) {
      this.stringGPC = "GPC";
    }
    else {
      this.stringGPC = "";
    }
    this.getChartRegisterDay();
    this.getChartRegisterDayOld();
    this.getChartRegisterDayNew();
    this.getChartRegisterHour();
    this.getChartRegisterHourOld();
    this.getChartRegisterHourNew();
  }
  //#endregion
}
