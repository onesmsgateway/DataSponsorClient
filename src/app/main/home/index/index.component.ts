import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';
import { ChartType, ChartOptions } from 'chart.js';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ChartComponent } from "ng-apexcharts";
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";
import { timeout } from 'rxjs/operators';

export type ChartOptionsOne = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  //bieu do nam 
  @ViewChild('chart', { static: false }) public chart: ChartComponent;
  public chartOptions: Partial<ChartOptionsOne>;
  //check radio
  public valueRadio: any;
  public withDay = '0';
  public withHour = '1';
  public click_event = 'Angular';
  // chon thang
  public name = 'Angular';
  public modelFromDate = new Date();
  public modelToDate = new Date();
  public fromMonth: string = "";
  public toMonth: string = "";

  public chartLabels: any;
  public pieChartType: ChartType;
  public pieChartLegend: boolean;
  public pieChartPlugins = [];
  public dataVT = [];
  public showOverlay = true;
  public smsErr = 0;
  public scenario_ran = 0;
  public scenario_end = 0;
  public campaign = 0;
  public total_money_sent = 0;
  public total_data_sent = 0;
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
  public selectedFromMonth = [];
  public dataHour = [];
  public dataMonth = [];
  public settingsFilterFromHour = {};
  public settingsFilterMonth = {};
  public selectedToHour = [];
  public selectedToMonth = [];

  public fromhour: string = '';
  public tohour: string = '';
  public timeTo = new Date();

  public timeFrom = new Date(this.timeTo.getTime() - (30 * 24 * 60 * 60 * 1000));
  public timeMonthFrom = new Date(this.timeTo.getTime() - (180 * 24 * 60 * 60 * 1000));

  public fromDate: string = "";
  public toDate: string = "";
  public chooseeYear: string = "";


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

  //khach hang da nhan data mien phi theo ngay gio
  public barLabelsChartReceived: any = [];
  public barChartTypeReceived: string = '';
  public barChartLegendReceived: boolean = false;
  public barChartDataReceived: any = [];
  public dataReceivedViettel = [];
  public dataReceivedVina = [];
  public dataReceivedMobi = [];

  //khach hang da nhan data mien phi theo tháng
  public barLabelsChartReceivedMonth: any = [];
  public barChartTypeReceivedMonth: string = '';
  public barChartLegendReceivedMonth: boolean = false;
  public barChartDataReceivedMonth: any = [];
  public dataReceivedViettelMonth = [];
  public dataReceivedVinaMonth = [];
  public dataReceivedMobiMonth = [];

  //khach hang nhan data mien phi theo 3 nha mang hang thang
  public chartLabelReceiveDataByTelcoMonth: any = [];
  public chartDataReceiveDataByTelcoMonth: any = [];
  public chartTypeReceiveDataByTelcoMonth: string = '';
  public colorChartReceiveDataByTelMonth: any = [];

  //thong ke khach hang cu moi
  public barChartLabelsBuyDayRGTDay: any = [];
  public barChartLabelsBuyHourRGTHour: any = [];
  public barChartTypeBuyDayRGTDay: string = '';
  public barChartLegendBuyDayRGTDay: boolean = false;
  public barChartDataBuyDayRGTDay: any = [];
  public dataBuyDay = [];
  public dataBuyHour = [];
  public dataGPCBuyDay = [];
  public dataVMSBuyDay = [];
  public dataRGTDay = [];
  public dataRGTHour = [];
  public dataGPCRGTDay = [];
  public dataVMSRGTDay = [];
  public barChartLabelsBuyDay: any = [];
  public barChartLabelsRGTDay: any = [];

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
  public datacall: any = [];

  //get check gio
  public isHour: boolean = false;
  public isDay: boolean = true;
  public isDayCheck: boolean = false;


  public grossSmsTelco: any = [];
  public grossSmsGroupSender: any = [];

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

    //bieu do hinh tron
    this.chartOptions = {
      series: [0, 0, 0],
      chart: {
        width: 500,
        type: "pie"
      },
      labels: ["Khách hàng Viettel", "Khách hàng Vinaphone", "Khách hàng Mobifone"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
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
    this.chooseeYear = this.utilityService.formatDateToString(this.timeTo, "yyyy");
    this.chosseDate = this.utilityService.formatDateToString(this.timeday, "yyyyMMdd");
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    this.toMonth = this.utilityService.formatDateToString(this.timeTo, "yyyyMM");
    this.fromMonth = this.utilityService.formatDateToString(this.timeMonthFrom, "yyyyMM");
    for (let hourList = 1; hourList < 25; hourList++) {
      this.dataHour.push(hourList < 10 ? { "id": '0' + hourList.toString(), "itemName": '0' + hourList.toString() + 'h' } : { "id": hourList.toString(), "itemName": hourList.toString() + 'h' });
    }
    for (let monthList = 1; monthList < 13; monthList++) {
      this.dataMonth.push(monthList < 10 ? { "id": '0' + monthList.toString(), "itemName": '0' + 'Tháng' + monthList.toString() } : { "id": monthList.toString(), "itemName": 'Tháng' + monthList.toString() });
    }
    setTimeout(() => {
      this.getAccountLogin();
    }, 1000);
  }
  async getAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess != null && roleAccess == 50) {
      this.isAdmin = true;
      this.isAdminBranch = false;
      this.isCustomer = false;
    } else if (roleAccess == 53) {
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
      this.GetCountScenario();
    }, 1000);
    setTimeout(() => {
      this.getDataAccount();
    }, 1000);
    setTimeout(() => {
      this.getCampaign();
    }, 1000);

    setTimeout(() => {
      this.getScenario();
    }, 1000);
    for (let i = 0; i < 8; i++) {
      switch (i) {
        case 0: {
            this.getChartClickDayHour();
          break;
        }
        case 1: {
          this.getChartRegisterDayHour();
          break;
        }
        case 2: {
          this.getChartRegisterDayHourOld();
          break;
        } case 3: {
          this.getChartRegisterDayHourNew();
          break;
        } case 4: {
          this.getChartReceivedDayHour();
          break;
        } case 5: {
          this.getProportionBuyDayRegisterDayHour();
          break;
        } case 6: {
          this.getChartReceivedMonth();
          break;
        } case 7: {
          this.getdataChartPieWithYear();
          break;
        }
        default: {
          alert('da hoan thien');
          break;
        }
      }
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
    let responsecp: any = await this.dataService.getAsync('/api/datacampaign/GetDataCampaignByAccount?account_id=' + account)
    if (responsecp) {
      for (let index in responsecp.data) {
        this.dataCampaign.push({ "id": responsecp.data[index].ID, "itemName": responsecp.data[index].PROGRAM_NAME });
      }
    }
  }

  //dem so luong kich ban dang chay va da chay
  async GetCountScenario() {
    let account;
    if (this.isAdmin) {
      account = "";
    } else {
      account = this.authService.currentUserValue.ACCOUNT_ID;
    }
    let resScenario: any = await this.dataService.getAsync('/api/scenarios/GetCountScenario?account_id=' + account);
    if (resScenario) {
      if (resScenario.err_code == 0) {
        this.scenario_ran = resScenario.data[1].COUNT_SCENARIO;
        this.scenario_end = resScenario.data[0].COUNT_SCENARIO
      } else {
        this.scenario_ran = 0;
        this.scenario_end = 0;
      }
    }
  }
  //get data account
  async getDataAccount() {
    if (this.isAdmin) {
      this.selectedAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
      let responseacc: any = await this.dataService.getAsync('/api/account')
      for (let index in responseacc.data) {
        this.dataAccount.push({ "id": responseacc.data[index].ACCOUNT_ID, "itemName": responseacc.data[index].USER_NAME });
      }
    }
    else {
      let responseac = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in responseac.data) {
        this.dataAccount.push({ "id": responseac.data[index].ACCOUNT_ID, "itemName": responseac.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1) {
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }
  // lay danh sach kich ban
  async getScenario() {
    this.dataScenario = [];
    this.selectedScenario = [];
    let account = "";
    if (this.isAdmin)
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    else
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let responsesc: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosByAccount?account_id=' + account)
    if (responsesc) {
      for (let index in responsesc.data) {
        this.dataScenario.push({ "id": responsesc.data[index].ID, "itemName": responsesc.data[index].NAME });
      }
      if (this.dataScenario.length == 1) {
        this.selectedScenario.push({ "id": this.dataScenario[0].id, "itemName": this.dataScenario[0].itemName });
      } else {
        this.selectedScenario.push({ "id": "", "itemName": this.utilityService.translate('scenarios.choose_scenario') });
      }
    }
  }


  // Thống kê lượt KH click vào link truy cập hàng ngày
  async getChartClickDayHour() {
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

    if (this.isDay == true && this.isHour == false) {
      let responsecdh: any = await this.dataService.getAsync('/api/chartpopupviewsummaryday/GetFilterPopupViewDay?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE)
      if (responsecdh) {
        if (responsecdh.err_code == 0) {
          for (let i = 0; i < responsecdh.data.length; i++) {
            arrayLable.push(responsecdh.data[i].DAY_OF_MONTH);
            arrayData.push(parseInt(responsecdh.data[i].SUM_DAY));
          }
        }
      }
      this.barChartLabelsClick = arrayLable;
      this.barChartTypeClick = 'bar';
      this.barChartLegendClick = true;
      this.barChartDataClick = [
        { data: arrayData, label: 'Lượt truy cập', stack: '1', backgroundColor: '#00FF66', hoverBackgroundColor: '#CCFF00', borderColor: '#2F4F4F' },
      ];
    } else {
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

  }
  // Thống kê KH đăng ký nhận data theo ngay/gio
  async getChartRegisterDayHour() {
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
    if (this.isHour == false && this.isDay == true) {
      let responsecrd: any = await this.dataService.getAsync('/api/chartpopupregisterday/GetFilterPopupRegisterDay?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE +
        '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
      if (responsecrd) {
        if (responsecrd.err_code == 0) {
          for (let i = 0; i < responsecrd.data.length; i++) {
            this.labelsChartRegisterDay.push(responsecrd.data[i].DAY_OF_MONTH);
            this.dataSetViettel.push(parseInt(responsecrd.data[i].DAY_VIETTEL));
            this.dataSetVina.push(parseInt(responsecrd.data[i].DAY_GPC));
            this.dataSetMobi.push(parseInt(responsecrd.data[i].DAY_VMS));
          }
          this.chartDataRegisterDay = [
            { data: this.dataSetViettel, label: 'KH Viettel', stack: '1', backgroundColor: '#00BCD4', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
            { data: this.dataSetVina, label: 'KH Vina', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#90EE90', hoverBackgroundColor: '#A3E4D7' },
            { data: this.dataSetMobi, label: 'KH Mobi', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFCCBC', hoverBackgroundColor: '#DAF7A6' }
          ];
        }
      }
    } else {
      let responsecph: any = await this.dataService.getAsync('/api/chartpopupregisterhour/GetFilterPopupRegisterHour?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&day_of_month=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR +
        '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
      if (responsecph) {
        if (responsecph.err_code == 0) {
          for (let i = 0; i < responsecph.data.length; i++) {
            this.labelsChartRegisterDay.push(responsecph.data[i].HOUR_IN_DAY.slice(-2));
            this.dataSetViettel.push(parseInt(responsecph.data[i].HOUR_VIETTEL));
            this.dataSetVina.push(parseInt(responsecph.data[i].HOUR_GPC));
            this.dataSetMobi.push(parseInt(responsecph.data[i].HOUR_VMS));
          }
          this.chartDataRegisterDay = [
            { data: this.dataSetViettel, label: 'KH Viettel', stack: '1', backgroundColor: '#2E8B57', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
            { data: this.dataSetVina, label: 'KH Vina', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#3CB371', hoverBackgroundColor: '#A3E4D7' },
            { data: this.dataSetMobi, label: 'KH Mobi', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#90EE90', hoverBackgroundColor: '#DAF7A6' }
          ];
        }
      }
    }
  }
  // Thống kê KH đăng ký nhận data theo ngay/gio khach hang cu
  async getChartRegisterDayHourOld() {
    this.dataSetViettelOld = [];
    this.dataSetVinaOld = [];
    this.dataSetMobiOld = [];
    this.barChartDataRegisterOld = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeRegisterOld = 'bar';
    this.barChartLegendRegisterOld = true;
    this.barChartLabelsRegisterOld = [];

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let FROM_DATE = this.fromDate;
    let TO_DATE = this.toDate;
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
    if (this.isHour == false && this.isDay == true) {
      let responsecrdo: any = await this.dataService.getAsync('/api/chartpopupregisterday/GetFilterPopupRegisterDayOld?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE +
        '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
      if (responsecrdo) {
        if (responsecrdo.err_code == 0) {
          for (let i = 0; i < responsecrdo.data.length; i++) {
            this.barChartLabelsRegisterOld.push(responsecrdo.data[i].DAY_OF_MONTH);
            this.dataSetViettelOld.push(parseInt(responsecrdo.data[i].DAY_VIETTEL));
            this.dataSetVinaOld.push(parseInt(responsecrdo.data[i].DAY_GPC));
            this.dataSetMobiOld.push(parseInt(responsecrdo.data[i].DAY_VMS));
          }
          this.barChartDataRegisterOld = [
            { data: this.dataSetViettelOld, label: 'KH Viettel cũ', stack: '1', backgroundColor: '#FFCDD2', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
            { data: this.dataSetVinaOld, label: 'KH Vina cũ', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#BBDEFB', hoverBackgroundColor: '#A3E4D7' },
            { data: this.dataSetMobiOld, label: 'KH Mobi cũ', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFF8E1', hoverBackgroundColor: '#DAF7A6' }
          ];
        }
      }
    } else {
      let responsecrdoh: any = await this.dataService.getAsync('/api/chartpopupregisterhour/GetFilterPopupRegisterHourOld?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&day_of_month=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR +
        '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
      if (responsecrdoh) {
        if (responsecrdoh.err_code == 0) {
          for (let i = 0; i < responsecrdoh.data.length; i++) {
            this.barChartLabelsRegisterOld.push(responsecrdoh.data[i].HOUR_IN_DAY.slice(-2));
            this.dataSetViettelOld.push(parseInt(responsecrdoh.data[i].HOUR_VIETTEL));
            this.dataSetVinaOld.push(parseInt(responsecrdoh.data[i].HOUR_GPC));
            this.dataSetMobiOld.push(parseInt(responsecrdoh.data[i].HOUR_VMS));
          }
          this.barChartDataRegisterOld = [
            { data: this.dataSetViettelOld, label: 'KH Viettel cũ', stack: '1', backgroundColor: '#FFCDD2', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
            { data: this.dataSetVinaOld, label: 'KH Vina cũ', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#BBDEFB', hoverBackgroundColor: '#A3E4D7' },
            { data: this.dataSetMobiOld, label: 'KH Mobi cũ', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFF8E1', hoverBackgroundColor: '#DAF7A6' }
          ];
        }
      }
    }
  }
  // Thống kê KH đăng ký nhận data theo ngay khach hang cu
  async getChartRegisterDayHourNew() {
    this.dataSetViettelNew = [];
    this.dataSetVinaNew = [];
    this.dataSetMobiNew = [];
    this.barChartDataRegisterNew = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeRegisterNew = 'bar';
    this.barChartLegendRegisterNew = true;
    this.barChartLabelsRegisterNew = [];

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let FROM_DATE = this.fromDate;
    let TO_DATE = this.toDate;

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
    if (this.isHour == false && this.isDay == true) {
      let responsecrpnd: any = await this.dataService.getAsync('/api/chartpopupregisterday/GetFilterPopupRegisterDayNew?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE +
        '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
      if (responsecrpnd) {
        if (responsecrpnd.err_code == 0) {
          for (let i = 0; i < responsecrpnd.data.length; i++) {
            this.barChartLabelsRegisterNew.push(responsecrpnd.data[i].DAY_OF_MONTH);
            this.dataSetViettelNew.push(parseInt(responsecrpnd.data[i].DAY_VIETTEL));
            this.dataSetVinaNew.push(parseInt(responsecrpnd.data[i].DAY_GPC));
            this.dataSetMobiNew.push(parseInt(responsecrpnd.data[i].DAY_VMS));
          }
          this.barChartDataRegisterNew = [
            { data: this.dataSetViettelNew, label: 'KH Viettel mới', stack: '1', backgroundColor: '#F44336', borderColor: '#03A9F4', hoverBackgroundColor: '#73C6B6' },
            { data: this.dataSetVinaNew, label: 'KH Vina mới', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#03A9F4', hoverBackgroundColor: '#A3E4D7' },
            { data: this.dataSetMobiNew, label: 'KH Mobi mới', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFF59D', hoverBackgroundColor: '#DAF7A6' }
          ];
        }
      }
    } else {
      let responsecrpnh: any = await this.dataService.getAsync('/api/chartpopupregisterhour/GetFilterPopupRegisterHourNew?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&day_of_month=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR +
        '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
      if (responsecrpnh) {
        if (responsecrpnh.err_code == 0) {
          for (let i = 0; i < responsecrpnh.data.length; i++) {
            this.barChartLabelsRegisterNew.push(responsecrpnh.data[i].HOUR_IN_DAY.slice(-2));
            this.dataSetViettelNew.push(parseInt(responsecrpnh.data[i].HOUR_VIETTEL));
            this.dataSetVinaNew.push(parseInt(responsecrpnh.data[i].HOUR_GPC));
            this.dataSetMobiNew.push(parseInt(responsecrpnh.data[i].HOUR_VMS));
          }
          this.barChartDataRegisterNew = [
            { data: this.dataSetViettelNew, label: 'KH Viettel mới', stack: '1', backgroundColor: '#F44336', borderColor: '#03A9F4', hoverBackgroundColor: '#73C6B6' },
            { data: this.dataSetVinaNew, label: 'KH Vina mới', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#03A9F4', hoverBackgroundColor: '#A3E4D7' },
            { data: this.dataSetMobiNew, label: 'KH Mobi mới', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFF59D', hoverBackgroundColor: '#DAF7A6' }
          ];
        }
      }
    }
  }
  // Thống kê KH đăng ký nhận data theo ngay/gio
  async getChartReceivedDayHour() {
    //  this.chartLabels = ChartDataLabels;
    this.barLabelsChartReceived = [];
    this.dataReceivedViettel = [];
    this.dataReceivedVina = [];
    this.dataReceivedMobi = [];
    this.barChartDataReceived = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeReceived = 'bar';
    this.barChartLegendReceived = true;

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let FROM_DATE = this.fromDate;
    let TO_DATE = this.toDate;
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
    if (this.isHour == false && this.isDay == true) {
      let responsecrd: any = await this.dataService.getAsync('/api/chartpopupregisterday/GetChartPopupRegisterDayReceived?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DATE + '&to_day=' + TO_DATE +
        '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
      if (responsecrd) {
        if (responsecrd.err_code == 0) {
          for (let i = 0; i < responsecrd.data.length; i++) {
            let checkExis = this.barLabelsChartReceived.includes(responsecrd.data[i].DAY_OF_MONTH);
            if (checkExis == false) {
              this.barLabelsChartReceived.push(responsecrd.data[i].DAY_OF_MONTH);
              this.dataReceivedViettel.push(parseInt(responsecrd.data[i].DAY_VIETTEL));
              this.dataReceivedVina.push(parseInt(responsecrd.data[i].DAY_GPC));
              this.dataReceivedMobi.push(parseInt(responsecrd.data[i].DAY_VMS));
            }
          }
          this.barChartDataReceived = [
            { data: this.dataReceivedViettel, label: 'KH Viettel', stack: '1', backgroundColor: '#2196F3', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
            { data: this.dataReceivedVina, label: 'KH Vina', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#00BCD4', hoverBackgroundColor: '#A3E4D7' },
            { data: this.dataReceivedMobi, label: 'KH Mobi', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#FFCCBC', hoverBackgroundColor: '#DAF7A6' }
          ];
        }
      }

    } else {
      let responsecrdh: any = await this.dataService.getAsync('/api/chartpopupregisterhour/GetFilterPopupRegisterHour?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&day_of_month=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR +
        '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)
      if (responsecrdh) {
        if (responsecrdh.err_code == 0) {
          for (let i = 0; i < responsecrdh.data.length; i++) {
            this.barLabelsChartReceived.push(responsecrdh.data[i].HOUR_IN_DAY.slice(-2));
            this.dataReceivedViettel.push(parseInt(responsecrdh.data[i].HOUR_VIETTEL));
            this.dataReceivedVina.push(parseInt(responsecrdh.data[i].HOUR_GPC));
            this.dataReceivedMobi.push(parseInt(responsecrdh.data[i].HOUR_VMS));
            this.barChartDataReceived = [
              { data: this.dataReceivedViettel, label: 'KH Viettel', stack: '1', backgroundColor: '#2E8B57', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
              { data: this.dataReceivedVina, label: 'KH Vina', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#3CB371', hoverBackgroundColor: '#A3E4D7' },
              { data: this.dataReceivedMobi, label: 'KH Mobi', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#90EE90', hoverBackgroundColor: '#DAF7A6' }
            ];
          }
        }
      }
    }
  }
  //ty le mua hang tren ty le dang ky
  async getProportionBuyDayRegisterDayHour() {
    this.barChartLabelsBuyDayRGTDay = [];
    this.dataBuyDay = [];
    this.dataRGTDay = [];
    this.dataRGTHour = [];
    this.dataBuyHour = [];

    this.barChartDataBuyDayRGTDay = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeBuyDayRGTDay = 'bar';
    this.barChartLegendBuyDayRGTDay = true;

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;

    let FROM_DAY = this.fromDate;
    let TO_DAY = this.toDate;
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
    //get du lieu theo ngay
    if (this.isHour == false && this.isDay == true) {

      let responseBuyDay: any = await this.dataService.getAsync('/api/accountphonelist/GetAccountPhoneListBuyDay?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DAY + '&to_day=' + TO_DAY)

      let responseRGTDay: any = await this.dataService.getAsync('/api/chartpopupregisterday/GetChartPopupRegisterDayss?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_day=' + FROM_DAY + '&to_day=' + TO_DAY)
      if (responseBuyDay) {
        for (let i = 0; i < responseBuyDay.data.length; i++) {
          let checkArray = this.barChartLabelsBuyDayRGTDay.includes(responseBuyDay.data[i].DAY_TIME);
          if (checkArray == false) {
            this.barChartLabelsBuyDayRGTDay.push(responseBuyDay.data[i].DAY_TIME);
          }
        }
      }
      if (responseRGTDay) {
        for (let i = 0; i < responseRGTDay.data.length; i++) {
          let checkTwoArray = this.barChartLabelsBuyDayRGTDay.includes(responseRGTDay.data[i].DAY_OF_MONTH);
          if (checkTwoArray == false) {
            this.barChartLabelsBuyDayRGTDay.push(responseRGTDay.data[i].DAY_OF_MONTH);
          }
        }
      }
      if (responseBuyDay) {
        for (let i = 0; i < this.barChartLabelsBuyDayRGTDay.length; i++) {
          this.dataBuyDay.push(responseBuyDay.data[i] != "" && responseBuyDay.data[i] != null ? responseBuyDay.data[i].DAY_SUM : 0);
        }
      }
      if (responseRGTDay) {
        for (let i = 0; i < this.barChartLabelsBuyDayRGTDay.length; i++) {
          this.dataRGTDay.push(responseRGTDay.data[i] != "" && responseRGTDay.data[i] != null ? responseRGTDay.data[i].DAY_SUM : 0);
        }
      }
      this.barChartDataBuyDayRGTDay = [
        { data: this.dataBuyDay, label: 'Khách mua hàng', stack: '1', backgroundColor: '#E67E22', borderColor: '#73C6B6', hoverBackgroundColor: '#E67E22' },
        { data: this.dataRGTDay, label: 'Khách đăng ký', stack: '2', backgroundColor: '#FFCCBC', borderColor: '#73C6B6', hoverBackgroundColor: '#FFCCBC' }
      ];
      //get du lieu theo gio
    } else {
      let responseBuyHour: any = await this.dataService.getAsync('/api/accountphonelist/GetAccountPhoneListBuyHour?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&choose_day=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR)
      let responseRGTHour: any = await this.dataService.getAsync('/api/ChartPopupRegisterHour/GetFilterPopupRGTHour?account_id=' + ACCOUNT_ID +
        '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&choose_day=' + DAY_MONTH + '&from_hour=' + FROM_HOUR + '&to_hour=' + TO_HOUR)
      if (responseBuyHour) {
        for (let i = 0; i < responseBuyHour.data.length; i++) {
          let checkArray = this.barChartLabelsBuyDayRGTDay.includes(responseBuyHour.data[i].HOUR_TIME.slice(-2));
          if (checkArray == false) {
            this.barChartLabelsBuyDayRGTDay.push(responseBuyHour.data[i].HOUR_TIME.slice(-2));
          }
        }

      }
      if (responseRGTHour) {
        for (let i = 0; i < responseRGTHour.data.length; i++) {
          let checkTwoArray = this.barChartLabelsBuyDayRGTDay.includes(responseRGTHour.data[i].HOUR_IN_DAY.slice(-2));
          if (checkTwoArray == false) {
            this.barChartLabelsBuyDayRGTDay.push(responseRGTHour.data[i].HOUR_IN_DAY.slice(-2));
          }
        }
      }
      if (responseBuyHour) {
        for (let i = 0; i < this.barChartLabelsBuyDayRGTDay.length; i++) {
          this.dataBuyHour.push(responseBuyHour.data[i] != "" && responseBuyHour.data[i] != null ? responseBuyHour.data[i].HOUR_SUM : 0);
          this.dataRGTHour.push(responseRGTHour.data[i] != "" && responseRGTHour.data[i] != null ? responseRGTHour.data[i].HOUR_SUM : 0);
        }
      }
      if (responseRGTHour) {
        for (let i = 0; i < this.barChartLabelsBuyDayRGTDay.length; i++) {
          this.dataRGTHour.push(responseRGTHour.data[i] != "" && responseRGTHour.data[i] != null ? responseRGTHour.data[i].HOUR_SUM : 0);
        }
      }
      this.barChartDataBuyDayRGTDay = [
        { data: this.dataBuyHour, label: 'Khách mua hàng', stack: '1', backgroundColor: '#E67E22', borderColor: '#73C6B6', hoverBackgroundColor: '#E67E22' },
        { data: this.dataRGTHour, label: 'Khách đăng ký', stack: '2', backgroundColor: '#FFCCBC', borderColor: '#73C6B6', hoverBackgroundColor: '#FFCCBC' }
      ];
    }

  }

  // thong ke kh nhan data theo nha mang hang thang
  public async getChartReceivedMonth() {
    this.barLabelsChartReceivedMonth = [];
    this.dataReceivedViettelMonth = [];
    this.dataReceivedVinaMonth = [];
    this.dataReceivedMobiMonth = [];
    this.barChartDataReceivedMonth = [
      { data: [], label: '', stack: '' },
    ];
    this.barChartTypeReceivedMonth = 'bar';
    this.barChartLegendReceivedMonth = true;

    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let FROM_MONTH = this.fromMonth;
    let TO_MONTH = this.toMonth;
    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";

    let responsecrm: any = await this.dataService.getAsync('/api/chartpopupregister/GetFilterPopupRegisterMonth?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&from_month=' + FROM_MONTH + '&to_month=' + TO_MONTH +
      '&telco_viettel=' + this.stringVTL + '&telco_gpc=' + this.stringGPC + '&telco_vms=' + this.stringVMS)

    if (responsecrm) {
      if (responsecrm.err_code == 0) {
        for (let i = 0; i < responsecrm.data.length; i++) {
          this.barLabelsChartReceivedMonth.push(responsecrm.data[i].SUBMONTH);
          this.dataReceivedViettelMonth.push(parseInt(responsecrm.data[i].MONTH_VIETTEL));
          this.dataReceivedVinaMonth.push(parseInt(responsecrm.data[i].MONTH_GPC));
          this.dataReceivedMobiMonth.push(parseInt(responsecrm.data[i].MONTH_VMS));
        }
      }
    }
    this.barChartDataReceivedMonth = [
      { data: this.dataReceivedViettelMonth, label: 'KH Viettel', stack: '1', backgroundColor: '#E67E22', borderColor: '#73C6B6', hoverBackgroundColor: '#73C6B6' },
      { data: this.dataReceivedVinaMonth, label: 'KH Vina', stack: '1', borderColor: '#A3E4D7', backgroundColor: '#FFCC00', hoverBackgroundColor: '#A3E4D7' },
      { data: this.dataReceivedMobiMonth, label: 'KH Mobi', stack: '1', borderColor: '#DAF7A6', backgroundColor: '#5DADE2', hoverBackgroundColor: '#DAF7A6' }
    ];

  }

  //Biểu đồ Thống kê KH nhận data theo nhà mạng 2020
  public async getdataChartPieWithYear() {
    let datapie = [];
    let ACCOUNT_ID;
    let SCENARIO_ID;
    let CAMPAIGN_ID;
    let YEAR = this.chooseeYear;
    if (this.isAdmin) {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    } else {
      ACCOUNT_ID = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    SCENARIO_ID = this.selectedScenario.length != 0 && this.selectedScenario[0].id != "" ? this.selectedScenario[0].id : "";
    CAMPAIGN_ID = this.selectedCampaign.length != 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";

    let response: any = await this.dataService.getAsync('/api/chartpopupregister/GetChartPopupRegisterYear?account_id=' + ACCOUNT_ID +
      '&scenario_id=' + SCENARIO_ID + '&campaign_id=' + CAMPAIGN_ID + '&year=' + YEAR)
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          datapie.push(parseInt(response.data[i].YEAR_VIETTEL));
          datapie.push(parseInt(response.data[i].YEAR_GPC));
          datapie.push(parseInt(response.data[i].YEAR_VMS));
        }
      }
    }

    //bieu do hinh tron
    this.chartOptions = {
      series: datapie,
      chart: {
        width: 500,
        type: "pie",
        height: 313
      },
      labels: ["Khách hàng Viettel", "Khách hàng Vinaphone", "Khách hàng Mobifone"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  checkDay(event) {
    if (event == "1") {
      this.checkDayhour = false;
      this.isHour = true;
      this.isDay = false;
      this.isDayCheck = false;
      this.getChartClickDayHour();
      this.getChartReceivedDayHour();
      this.getChartRegisterDayHour();
      this.getChartRegisterDayHourOld();
      this.getChartRegisterDayHourNew();
      this.getProportionBuyDayRegisterDayHour();

    }
    else {
      this.checkDayhour = false;
      this.isHour = false;
      this.isDay = true;
      this.isDayCheck = true;

      this.getChartClickDayHour();
      this.getChartReceivedDayHour();
      this.getChartRegisterDayHour();
      this.getChartReceivedDayHour();
      this.getChartRegisterDayHourOld();
      this.getChartRegisterDayHourNew();
      this.getProportionBuyDayRegisterDayHour();

    }
  }
  onChangeChooseDate(event) {
    this.chosseDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
    if (this.chosseDate == '197001' && this.isDay == false) {
      this.chosseDate = '';
    }
    this.fromhour = '';
    this.tohour = '';
    this.getChartClickDayHour();
    this.getChartRegisterDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getProportionBuyDayRegisterDayHour();

  }
  ChangeDropdownListAccount() {
    this.getCampaign();
    this.getScenario();
    this.getChartClickDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getProportionBuyDayRegisterDayHour();

  }
  ChangeAccount() {
    this.getChartReceivedMonth();
    this.getdataChartPieWithYear();
  }

  ChangeDropdownList() {
    this.getChartClickDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getProportionBuyDayRegisterDayHour();

  }
  ChangeList() {
    this.getChartReceivedMonth();
    this.getdataChartPieWithYear();
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
    this.getChartClickDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getProportionBuyDayRegisterDayHour();

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

    this.getChartClickDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getProportionBuyDayRegisterDayHour();

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

    this.getChartClickDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getProportionBuyDayRegisterDayHour();
  }
  //#region check telco
  onChangeVTL(isChecked) {
    if (isChecked) {
      this.stringVTL = "VIETTEL"
    }
    else {
      this.stringVTL = "";
    }
    this.getChartRegisterDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getChartRegisterDayHourOld();
    this.getProportionBuyDayRegisterDayHour();
  }

  onChangeVTLMonthYear(isChecked) {
    if (isChecked) {
      this.stringVTL = "VIETTEL"
    }
    else {
      this.stringVTL = "";
    }
    this.getChartReceivedMonth();
  }

  onChangeVMS(isChecked) {
    if (isChecked) {
      this.stringVMS = "VMS";
    }
    else {
      this.stringVMS = "";
    }
    this.getChartRegisterDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getProportionBuyDayRegisterDayHour();
  }

  onChangeVMSMonthYear(isChecked) {
    if (isChecked) {
      this.stringVMS = "VMS";
    }
    else {
      this.stringVMS = "";
    }
    this.getChartReceivedMonth();
  }

  onChangeGPC(isChecked) {
    if (isChecked) {
      this.stringGPC = "GPC";
    }
    else {
      this.stringGPC = "";
    }
    this.getChartRegisterDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getProportionBuyDayRegisterDayHour();
  }

  onChangeGPCMonthYear(isChecked) {
    if (isChecked) {
      this.stringGPC = "GPC";
    }
    else {
      this.stringGPC = "";
    }
    this.getChartReceivedMonth();
  }

  //#endregion
  onOpenCalendar(container) {

    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  onChangeFromMonthYear(event) {
    this.fromMonth = this.utilityService.formatDateToString(event, "yyyyMM");
  }
  onChangeToMonthYear(event) {
    this.toMonth = this.utilityService.formatDateToString(event, "yyyyMM");
  }
  filterByMonth() {
    if (this.toMonth == '197001') {
      this.toMonth = '';
    }
    if (this.fromMonth !== '' && this.toMonth !== '') {
      if (this.fromMonth > this.toMonth) {
        this.notificationService.displayWarnMessage("Tháng lọc chưa thỏa mãn");
        return;
      }
    }
    this.getChartReceivedMonth();
  }
}
