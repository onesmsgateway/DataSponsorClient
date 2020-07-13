import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';
import { Chart } from 'chart.js';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

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
  public isCheckUser:boolean=false;

  public settingsFilterSender = {};
  public selectedSenderID = [];
  public dataSender = [];
  public dataSmsByPhone = [];

  public phone = "";
  public pagination: Pagination = new Pagination();

  constructor(private dataService: DataService,
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
  }


  ngOnInit() {
    this.getAccountLogin();
    this.CustomerFilterChart();
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
    let checkUser=result.data[0].USER_NAME;
    if(checkUser=="admin"|| checkUser=="demo"){
      this.isCheckUser=true;
    }
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
  // Thống kê lượt KH kích vào link truy cập hàng ngày
  public barChartLabels = ['03/07/2020', '04/07/2020', '05/07/2020', '06/07/2020', '07/07/2020', '08/07/2020','09/07/2020','10/10/2020'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [150, 120, 200, 350, 300, 250, 150,270], label: 'Lượt truy cập',stack:'1'},
  ];

  public barChartLabels1 = ['03/07/2020', '04/07/2020', '05/07/2020', '06/07/2020', '07/07/2020', '08/07/2020','09/07/2020','10/07/2020'];
  public barChartType1 = 'bar';
  public barChartLegend1 = true;
  public barChartData1 = [
    {data: [15, 10, 80, 150, 60, 40, 20,10], label: 'KH Viettel mới',stack:'1'},
    {data: [10, 10, 40, 30, 70, 40, 40,20], label: 'KH Vina mới',stack:'1'},
    {data: [20, 15, 40, 30, 80, 40, 90,30], label: 'KH Mobi mới',stack:'1'},
    {data: [50, 40, 20, 40, 30, 40, 50,40], label: 'KH Vietel cũ',stack:'2'},
    {data: [40, 30, 15, 50, 30, 50, 30,10], label: 'KH Vina cũ',stack:'2'},
    {data: [15, 15, 5, 50, 30, 40, 40,20], label: 'KH Mobi cũ',stack:'2'},

  ];
  
  // Thống kê KH nhận data hàng tháng
  barChart;
  levelsArr = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July'];
  months = [{month: 'Jan', value: '0'},
  {month: 'Feb', value: '1'},
  {month: 'Mar', value: '2'},
  {month: 'Apr', value: '3'},
  {month: 'May', value: '4'},
  {month: 'Jun', value: '5'},
  {month: 'Jul', value: '6'}];

  from = '0';

  toMonth = '6';
  chartData = {
    "dataSet1" :[350, 200, 300, 250, 56, 500, 515],
    "dataSet2" :  [250, 215, 240, 230, 86, 410, 530],
    "dataSet3":[220,200,140,90,150,300,560],
  };
  public CustomerFilterChart(){
    this.barChart = new Chart('test', {
      type: 'bar',
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Thống kê KH nhận data hàng tháng'
        },
      },
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            type: 'bar',
            label: 'KH Viettel',
            data: this.chartData.dataSet1,
            backgroundColor: '#ffa1b5',
            borderColor: 'rgba(20,200,10,0.4)',
            fill: false,
            stack:'1',
          }, {
            type: 'bar',
            label: 'KH Vina',
            data: this.chartData.dataSet2,
            backgroundColor: '#86c7f3',
            borderColor: 'rgba(100,189,200,0.4)',
            fill: false,
            stack:'1',
          },
          {
            type: 'bar',
            label: 'KH Mobi',
            data: this.chartData.dataSet3,
            backgroundColor: '#ffe29a',
            borderColor: 'rgba(100,200,200,0.4)',
            fill: false,
            stack:'1',
          }
        ]
      }
    });
  }
  applyDateFilter(){
    this.barChart.data.labels = this.levelsArr.slice(parseInt(this.from), parseInt(this.toMonth) + 1);
  debugger;
    this.barChart.update();
   
  }
  //Biểu đồ Thống kê KH nhận data từng giờ
  public lineChartLabels = ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM'];
  public lineChartType = 'line';
  public lineChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Viettel',backgroundColor:"rgba(0, 0, 0, 0.1)"},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Vina',backgroundColor:"rgba(0, 0, 0, 0.1)"},
    {data: [10, 50, 100, 7, 80, 20, 40], label: 'Mobi',backgroundColor:"rgba(0, 0, 0, 0.1)"}
  ];
  public lineChartOptions={
    title: {
      text: 'Thống kê từng giờ được số KH đã đăng ký nhận data',
      display: true
    }
  };
 //Biểu đồ Thống kê KH nhận data theo nhà mạng 2020
  public LabelChartReceiveDataByTel = ['Viettel', 'Vina', 'Mobi'];
  public dataChartReceiveDataByTel = [2171,1961, 1660];
  public TypeChartReceiveDataByTel = 'pie';
  colorChartReceiveDataByTel:any = [
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
          debugger;
          let sum:number=0;
         for(let i=0;i<data.datasets[0].data.length;i++){
           sum+=Number.parseFloat(data.datasets[0].data[i].toString());
            debugger;
          }
          let value:number=parseFloat(data.datasets[0].data[tooltipItems.index].toString());
          let percent=(value*100/sum).toFixed(2);
          return data.labels[tooltipItems.index] +" : " + percent+' %';
        }
      }
    },
  };

  //Thống kê KHSDTX
  public labelKHSDTX = ['7/2020'];
  public typeKHSDTX = 'bar';
  public legendKHSDTX = true;
  public dataKHSDTX = [
    {data: [400], label: 'Viettel',stack:'1'},
    {data: [320], label: 'Vina',stack:'2'},
    {data: [360], label: 'Mobi',stack :'3'}
  ];
  
}
