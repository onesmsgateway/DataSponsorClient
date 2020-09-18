import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ChartComponent } from "ng-apexcharts";
import { ApexNonAxisChartSeries, ApexResponsive, ApexChart } from "ng-apexcharts";
import {
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";
import {
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
} from "ng-apexcharts";


export type ChartOptionsLine = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
export type ChartOptionsChart = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  @ViewChild('chartline', { static: false }) public chartline: ChartComponent;
  @ViewChild('chartSlFail', { static: false }) public chartSlFail: ChartComponent;
  @ViewChild('chartSlSuccess', { static: false }) public chartSlSuccess: ChartComponent;
  public chartOptionsLine: Partial<ChartOptionsLine>;
  public chartOptionsChart: Partial<ChartOptionsChart>;
  public chartOptionsChartFail: Partial<ChartOptionsChart>;

  //bieu do nam 
  @ViewChild('chartpie', { static: false }) public chartpie: ChartComponent;
  public chartOptionsPie: Partial<ChartOptionsPie>;

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
  public fromMonthadmin: string = "";
  public toMonth: string = "";
  public toMonthadmin: string = "";

  public chartLabels: any;
  public dataVT = [];
  public showOverlay = true;
  public showdate = true;
  public smsErr = 0;
  public total_customer = 0;
  public scenario_ran = 0;
  public scenario_end = 0;
  public campaign = 0;
  public total_data_sent = 0;
  public newCustomer = 0;
  public accountExpiredQuota = 0;
  public senderExpired = 0;

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
  public timeToadmin = new Date();

  public timeFrom = new Date(this.timeTo.getTime() - (30 * 24 * 60 * 60 * 1000));
  public timeMonthFrom = new Date(this.timeTo.getTime() - (180 * 24 * 60 * 60 * 1000));
  public timeMonthFromadmin = new Date(this.timeToadmin.getTime() - (365 * 24 * 60 * 60 * 1000));


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
  public dataStatus: any = [];
  public dataAcountOuntMoney = '';

  public grossSmsTelco: any = [];
  public grossSmsGroupSender: any = [];

  valueText: string;
  public totalSenderExpired = 0;
  public totalSmsWaitApprove = 0;
  public thisAccount;
  public isAdmin: boolean = true;
  public checkdataMax: boolean = false;
  public total_account = 0;
  public total_account_new = 0;
  public total_money_out = 0;
  public total_data_error = 0;

  public settingsFilterSender = {};
  public settingsFilterStatus = {};
  public selectedStatus = [];
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
    this.chartOptionsPie = {
      series: [44, 55, 13],
      chart: {
        width: 380,
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

    //bieu do hang ngay admin
    this.chartOptionsChart = {
      series: [
        {
          name: "Viettel",
          data: []
        },
        {
          name: "Vinaphone",
          data: []
        },
        {
          name: "Mobifone",
          data: []
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: [

        ]
      },
      legend: {
        position: "top",
      },
      fill: {
        opacity: 1
      }
    };

    this.chartOptionsChartFail = {
      series: [
        {
          name: "Viettel",
          data: []
        },
        {
          name: "Vinaphone",
          data: []
        },
        {
          name: "Mobifone",
          data: []
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: []
      },
      legend: {
        markers: {
          fillColors: ["#2471A3", "#76D7C4", "#FFAB91"],
        },
        position: "top"
      },
      fill: {
        colors: ["#2471A3", "#76D7C4", "#FFAB91"],
        opacity: 1
      }
    };
    //line
    this.chartOptionsLine = {
      series: [
        {
          name: "Low - 2013",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: [],
        title: {
          text: ""
        }
      },
      yaxis: {
        title: {
          text: ""
        },
        min: 5,
        max: 40
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
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
    this.chooseeYear = this.utilityService.formatDateToString(this.timeTo, "yyyy");
    this.chosseDate = this.utilityService.formatDateToString(this.timeday, "yyyyMMdd");
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    this.toMonth = this.utilityService.formatDateToString(this.timeTo, "yyyyMM");
    this.fromMonth = this.utilityService.formatDateToString(this.timeMonthFrom, "yyyyMM");
    this.toMonthadmin = this.utilityService.formatDateToString(this.timeToadmin, "yyyyMM");
    this.fromMonthadmin = this.utilityService.formatDateToString(this.timeMonthFromadmin, "yyyyMM");
    for (let hourList = 1; hourList < 25; hourList++) {
      this.dataHour.push(hourList < 10 ? { "id": '0' + hourList.toString(), "itemName": '0' + hourList.toString() + 'h' } : { "id": hourList.toString(), "itemName": hourList.toString() + 'h' });
    }
    this.getAccountLogin();
    this.GetCheckMoneyDataCimast();
  }

  public async GetCheckMoneyDataCimast() {
    let arr = [];
    let resDataCimast: any = await this.dataService.getAsync('/api/datacimast/GetCheckMoneyDataCimast');
    if (resDataCimast) {
      if (resDataCimast.err_code == 0) {
        for (let i = 0; i < resDataCimast.data.length; i++) {
          this.total_money_out += resDataCimast.data[i].TOTAL_CIMAST;
          arr.push(resDataCimast.data[i].ACCOUNT_ID)
        }
        this.dataAcountOuntMoney = arr.toString();
      }
    }
  }

  async getAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess != null && roleAccess == 50) {
      this.isAdmin = true;
    }else {
      this.isAdmin = false;
    }
    this.getDataAccount();
    this.getCampaign();
    this.getScenario();
    this.bindDataFailByDay();
    if (!this.isAdmin) {
      this.GetCoutMember();
      this.GetCountDataSms();
      this.GetCountCampaign();
      this.GetCountScenario();
      this.getChartClickDayHour();
      this.getChartRegisterDayHour();
      this.getChartRegisterDayHourOld();
      this.getChartRegisterDayHourNew();
      this.getChartReceivedDayHour();
      this.getChartReceivedMonth();
      this.getdataChartPieWithYear();
    }
    if (this.isAdmin) {
      this.GetCountAccountNew();
      this.GetCountAccount();
      this.getchartChartFail();
      this.getchartChartSuccess();
      this.getCustomerMonth();
    }
  }

  //count member_person
  async GetCoutMember(){
    let account = this.authService.currentUserValue.ACCOUNT_ID;
    let res: any = await this.dataService.getAsync('/api/person/GetCoutMember?account_id=' + account);
    if(res){
      if (res.err_code == 0) {
        for (let i = 0; i < res.data.length; i++) {
          this.total_customer += res.data[i].COUNT_PERSON;
        }
      }
    }
  }
//count data loi
  public async bindDataFailByDay() {
    let account = "";
    if (this.isAdmin)
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    else
      account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let resDataFail: any = await this.dataService.getAsync('/api/datasms/GetCountDataFailByDay?account_id=' + account);
    if (resDataFail) {
      if (resDataFail.err_code == 0) {
        for (let i = 0; i < resDataFail.data.length; i++) {
          this.total_data_error += resDataFail.data[i].COUNT_DATA_FAIL;
        }
      }
    }
  }
  //count account
  async GetCountAccount() {
    let account_id = this.authService.currentUserValue.ACCOUNT_ID;
    let res: any = await this.dataService.getAsync('/api/account/GetCountAccount?account_id=' + account_id)
    if (res) {
      if (res.err_code == 0) {
        this.total_account = res.data.COUNT_ACCOUNT;
      }
    }
  }
  //count account new
  async GetCountAccountNew() {
    let account_id = this.authService.currentUserValue.ACCOUNT_ID;
    let res: any = await this.dataService.getAsync('/api/account/GetCountAccountNew?account_id=' + account_id)
    if (res) {
      if (res.err_code == 0) {
        this.total_account_new = res.data.COUNT_ACCOUNT_NEW;
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

  //dem so luong campaign 
  async GetCountCampaign() {
    let account = this.authService.currentUserValue.ACCOUNT_ID;
    let resCampaign: any = await this.dataService.getAsync('/api/DataCampaign/GetCountDataCampaign?account_id=' + account);
    if (resCampaign) {
      if (resCampaign.err_code == 0 && resCampaign.data.length > 0) {
        this.campaign = Math.round(resCampaign.data[0].COUNT_CAMPAIGN);
      } else {
        this.campaign = 0;
      }
    }
  }

  //dem amt vol code
  //dem so luong campaign 
  async GetCountDataSms() {
    let account = this.authService.currentUserValue.ACCOUNT_ID;
    let resDataSms: any = await this.dataService.getAsync('/api/datasms/GetCountDataSms?account_id=' + account);
    if (resDataSms) {
      if (resDataSms.err_code == 0 && resDataSms.data.length > 0) {
        for (let i = 0; i < resDataSms.data.length; i++) {
          this.total_data_sent += resDataSms.data[i].COUNT_VOL;
        }
      } else {
        this.total_data_sent = 0;
      }
    }
  }
  //dem so luong kich ban dang chay va da chay
  async GetCountScenario() {
    let account = this.authService.currentUserValue.ACCOUNT_ID;
    let resScenario: any = await this.dataService.getAsync('/api/scenarios/GetCountScenario?account_id=' + account);
    if (resScenario) {
      if (resScenario.err_code == 0 && resScenario.data.length > 0) {
        for (let i = 0; i < resScenario.data.length; i++) {
          if (resScenario.data[i].IS_ACTIVE == 1) {
            this.scenario_ran += Math.round(resScenario.data[i].COUNT_SCENARIO);
          } else if (resScenario.data[i].IS_ACTIVE == 0) {
            this.scenario_end += Math.round(resScenario.data[i].COUNT_SCENARIO);
          } else {
            this.scenario_ran = 0;
            this.scenario_end = 0;
          }
        }
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
  // Thống kê KH đăng ký nhận data theo ngay/gio theo 3 nha mang
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
      let responsecrd: any = await this.dataService.getAsync('/api/chartpopupregister/GetChartPopupRegisterDays?account_id=' + ACCOUNT_ID +
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
      let responsecph: any = await this.dataService.getAsync('/api/chartpopupregisterhour/GetChartPopupRegisterHourFilter?account_id=' + ACCOUNT_ID +
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
      let responsecrdo: any = await this.dataService.getAsync('/api/chartpopupregister/GetChartPopupRegisterDayOldFilter?account_id=' + ACCOUNT_ID +
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
      let responsecrdoh: any = await this.dataService.getAsync('/api/chartpopupregister/GetChartPopupRegisterHourOldFilter?account_id=' + ACCOUNT_ID +
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
  // Thống kê KH đăng ký nhận data theo ngay khach hang cmoi
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
      let responsecrpnd: any = await this.dataService.getAsync('/api/chartpopupregister/GetChartPopupRegisterDayNewFilter?account_id=' + ACCOUNT_ID +
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
      let responsecrpnh: any = await this.dataService.getAsync('/api/chartpopupregister/GetFilterPopupRegisterHourNew?account_id=' + ACCOUNT_ID +
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
      let responsecrd: any = await this.dataService.getAsync('/api/chartpopupregister/GetChartPopupDayReceivedFilter?account_id=' + ACCOUNT_ID +
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
      let responsecrdh: any = await this.dataService.getAsync('/api/chartpopupregister/GetChartPopupRegisterHourReceivedFilter?account_id=' + ACCOUNT_ID +
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
    this.chartOptionsPie = {
      series: datapie,
      chart: {
        width: 500,
        height: 300,
        type: "pie"
      },
      labels: ["Khách hàng Viettel", "Khách hàng Vinaphone", "Khách hàng Mobifone"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "top"
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
  }
  ChangeDropdownListAccount() {
    this.getCampaign();
    this.getScenario();
    this.getChartClickDayHour();
    this.getChartReceivedDayHour();
    this.getChartRegisterDayHour();
    this.getChartRegisterDayHourOld();
    this.getChartRegisterDayHourNew();
    this.getchartChartSuccess();
    this.getchartChartFail();
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
    this.getchartChartSuccess();
    this.getchartChartFail();
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
    this.getchartChartSuccess();
    this.getchartChartFail();

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
    this.getchartChartSuccess();
    this.getchartChartFail();
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

  getchartChartSuccess() {
    let arrayDayMonth = [];
    let arrayDataVT = [];
    let arrayDataGPC = [];
    let arrayDataVMS = [];
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
    this.dataService.getData('/api/datasms/GetCountDataSmsSuccess?account_id=' + ACCOUNT_ID + '&campaign_id=' + CAMPAIGN_ID
      + '&scenario_id=' + SCENARIO_ID + '&from_date=' + FROM_DATE + '&to_date=' + TO_DATE +
      '&viettel=' + this.stringVTL + '&gpc=' + this.stringGPC + '&vms=' + this.stringVMS)
      .subscribe(res => {
        if (res) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.err_code == 0) {
              arrayDayMonth.push(res.data[i].DAY_MONTH);
              arrayDataVT.push(res.data[i].COUNT_DATA_VT);
              arrayDataGPC.push(res.data[i].COUNT_DATA_GPC);
              arrayDataVMS.push(res.data[i].COUNT_DATA_VMS);
            }
          }
          this.chartOptionsChart = {
            series: [
              {
                name: "Viettel",
                data: arrayDataVT
              },
              {
                name: "Vinaphone",
                data: arrayDataGPC
              },
              {
                name: "Mobifone",
                data: arrayDataVMS
              },
            ],
            chart: {
              type: "bar",
              height: 350,
              stacked: true,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }
            ],
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            xaxis: {
              type: "category",
              categories: arrayDayMonth
            },
            legend: {
              position: "top",
            },
            fill: {
              opacity: 1
            }
          };
        }
      });
  }
  getchartChartFail() {
    let arrayDayMonthF = [];
    let arrayDataVTF = [];
    let arrayDataGPCF = [];
    let arrayDataVMSF = [];
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
    this.dataService.getData('/api/datasms/GetCountDataSmsFail?account_id=' + ACCOUNT_ID + '&campaign_id=' + CAMPAIGN_ID
      + '&scenario_id=' + SCENARIO_ID + '&from_date=' + FROM_DATE + '&to_date=' + TO_DATE +
      '&viettel=' + this.stringVTL + '&gpc=' + this.stringGPC + '&vms=' + this.stringVMS)
      .subscribe(res => {
        if (res) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.err_code == 0) {
              arrayDayMonthF.push(res.data[i].DAY_MONTH_FAIL);
              arrayDataVTF.push(res.data[i].COUNT_DATA_VT_FAIL);
              arrayDataGPCF.push(res.data[i].COUNT_DATA_GPC_FAIL);
              arrayDataVMSF.push(res.data[i].COUNT_DATA_VMS_FAIL);
            }
          }
          this.chartOptionsChartFail = {
            series: [
              {
                name: "Viettel",
                data: arrayDataVTF
              },
              {
                name: "Vinaphone",
                data: arrayDataGPCF
              },
              {
                name: "Mobifone",
                data: arrayDataVMSF
              },
            ],
            chart: {
              type: "bar",
              height: 350,
              stacked: true,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }
            ],
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            xaxis: {
              type: "category",
              categories: arrayDayMonthF
            },
            legend: {
              markers: {
                fillColors: ["#2471A3", "#76D7C4", "#FFAB91"],
              },
              position: "top"
            },
            fill: {
              colors: ["#2471A3", "#76D7C4", "#FFAB91"],
              opacity: 1
            }
          };
        }
      });
  }
  onChangeVTLData(ischeck) {
    if (ischeck) {
      this.stringVTL = "VIETTEL"
    }
    else {
      this.stringVTL = "";
    }
    this.getchartChartSuccess();
  }
  onChangeGPCData(ischeck) {
    if (ischeck) {
      this.stringGPC = "GPC"
    }
    else {
      this.stringGPC = "";
    }
    this.getchartChartSuccess();
  }
  onChangeVMSData(ischeck) {
    if (ischeck) {
      this.stringVMS = "VMS"
    }
    else {
      this.stringVMS = "";
    }
    this.getchartChartSuccess();
  }
  onChangeVTLDataF(ischeck) {
    if (ischeck) {
      this.stringVTL = "VIETTEL"
    }
    else {
      this.stringVTL = "";
    }
    this.getchartChartFail();
  }
  onChangeGPCDataF(ischeck) {
    if (ischeck) {
      this.stringGPC = "GPC"
    }
    else {
      this.stringGPC = "";
    }
    this.getchartChartFail();
  }
  onChangeVMSDataF(ischeck) {
    if (ischeck) {
      this.stringVMS = "VMS"
    }
    else {
      this.stringVMS = "";
    }
    this.getchartChartFail();
  }
  //thong ke khach hang dang ky hang thang
  async getCustomerMonth() {
    let arrayDataMonth = [];
    let arrayDataAcount = [];
    let maxVl = 0;
    let FROM_MONTH = this.fromMonthadmin;
    let TO_MONTH = this.toMonthadmin;
    let res: any = await this.dataService.postAsync('/api/account/GetCountAccountByMonth', {
      FROM_MONTH, TO_MONTH
    })
    if (res) {
      for (let i = 0; i < res.data.length; i++) {
        if (res.err_code == 0) {
          arrayDataMonth.push(res.data[i].MONTH_ACCOUNT);
          arrayDataAcount.push(res.data[i].COUNT_ACCOUNT_MONTH);
        }
      }
      maxVl = Math.max.apply(Math, arrayDataAcount);
      this.chartOptionsLine = {
        series: [
          {
            name: "",
            data: arrayDataAcount
          }
        ],
        chart: {
          height: 350,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          }
        },
        colors: ["#77B6EA", "#545454"],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          align: "left"
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: arrayDataMonth
        },
        yaxis: {
          min: 0,
          max: maxVl
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      };
    }
  }
  onChangeFromMonthYearAdmin(event) {
    this.fromMonthadmin = this.utilityService.formatDateToString(event, "yyyyMM");
  }
  onChangeToMonthYearAdmin(event) {
    this.toMonthadmin = this.utilityService.formatDateToString(event, "yyyyMM");
  }
  filterByMonthAdmin() {
    if (this.toMonthadmin == '197001') {
      this.toMonthadmin = '';
    }
    if (this.fromMonthadmin !== '' && this.toMonthadmin !== '') {
      if (this.fromMonthadmin > this.toMonthadmin) {
        this.notificationService.displayWarnMessage("Tháng lọc chưa thỏa mãn");
        return;
      }
    }
    this.getCustomerMonth();
  }
}
