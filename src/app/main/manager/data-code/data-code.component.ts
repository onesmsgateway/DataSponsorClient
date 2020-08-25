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
import { manager } from '../model/manager.model';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-data-code',
  templateUrl: './data-code.component.html',
  styleUrls: ['./data-code.component.css']
})
export class DataCodeComponent implements OnInit {
  @ViewChild('uploadFile', { static: false }) public uploadFile;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;
  @ViewChild('provisionDataCodeModal', { static: false }) public provisionDataCodeModal;

  payLoad: any;
  public manager = new manager();
  public DataArrayList = [];
  public count1 = 0; public count2 = 0; public count3 = 0; public count5 = 0;
  public count10 = 0; public count14 = 0; public count20 = 0; public count28 = 0; public count42 = 0; public count56 = 0;
  public count84 = 0; public count500 = 0; public count300 = 0; public countAll = 0;
  public dataMoney = [];
  public dataMoneyPro = [];
  public dataAmt = [];
  public dataQuan = [];
  public dataObj = [];
  public dataCode = [];
  public dataAccount = [];
  public dataStatus = [];
  public pagination: Pagination = new Pagination();
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public isActive = true;
  public loading = false;
  public checkcount = true;
  public resJSON;
  public description;

  public fromDate: string = "";
  public toDate: string = "";
  public timeTo: Date = new Date();
  public timeFrom = new Date(this.timeTo.getTime() - (30 * 24 * 60 * 60 * 1000));

  public settingsFilterAccount = {};
  public settingsFilterMoney = {};
  public settingsFilterAccountEdit = {};
  public selectedItemComboboxAccount = [];
  public selectedItemMoney = [];
  public selectedItemMoneyPro = [];
  public selectedAccountCreate=[];
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

    this.DataArrayList.push(this.manager);
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd") + "235959";
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd") + "000000";
    this.getAccountLogin();
    this.bindDataStatus();
    this.bindDataAmt();

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
    this.CountDataCodeByAmt();
  }

  //#region smsType
  public async bindDataStatus() {
    this.dataStatus = [];
    this.dataStatus.push({ "id": "1", "itemName": this.utilityService.translate('data_code.status_active') });
    this.dataStatus.push({ "id": "0", "itemName": this.utilityService.translate('data_code.status_lock') });
  }
  //lay data menh gia tien
  public async bindDataAmt() {
    this.dataMoney = [];
    this.dataMoneyPro = [];
    let response: any = await this.dataService.getAsync('/api/packagetelco/GetPackageAmt')
    if (response) {
      if (response.err_code == 0) {
        let id = 1;
        for (let index in response.data) {
          this.dataMoney.push({ id: id, "itemName": response.data[index].AMT });
          this.dataMoneyPro.push({ id: id, "itemName": response.data[index].AMT });
          id++;
        }
      }
    }
  }

  public async CountDataCodeByAmt() {
    this.countAll = 0;
    this.count1 = 0; this.count2 = 0; this.count3 = 0; this.count5 = 0;
    this.count10 = 0; this.count14 = 0; this.count20 = 0; this.count28 = 0;
    this.count42 = 0; this.count56 = 0; this.count84 = 0; this.count300 = 0;
    this.count500 = 0;
    let account = "";
    if (this.isAdmin)
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    else
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let amt = this.selectedItemMoney.length != 0 && this.selectedItemMoney[0].id != "" ? this.selectedItemMoney[0].itemName : "";
    let is_used = this.selectedStatus.length > 0 ? this.selectedStatus[0].id : "";
    let from_date = this.fromDate;
    let to_date = this.toDate;
    let response: any = await this.dataService.getAsync('/api/datacode/CountDatacodeAmt?account_id=' + account + '&amt=' +
      amt + '&is_used=' + is_used + '&from_date=' + from_date + '&to_date=' + to_date)
    if (response) {
      if (response.err_code == 0) {
        if (this.selectedItemMoney.length == 0) {
          this.checkcount = true;
          for (var i = 0; i < response.data.length; i++) {
            switch (response.data[i].AMT) {
              case "1000": {
                this.count1 = response.data[i].COUNT_AMT;
                break;
              }
              case "2000": {
                this.count2 = response.data[i].COUNT_AMT;;
                break;
              }
              case "3000": {
                this.count3 = response.data[i].COUNT_AMT;;
                break;
              }
              case "5000": {
                this.count5 = response.data[i].COUNT_AMT;;
                break;
              }
              case "10000": {
                this.count10 = response.data[i].COUNT_AMT;;
                break;
              }
              case "14000": {
                this.count14 = response.data[i].COUNT_AMT;;
                break;
              }
              case "20000": {
                this.count20 = response.data[i].COUNT_AMT;;
                break;
              }
              case "28000": {
                this.count28 = response.data[i].COUNT_AMT;;
                break;
              }
              case "42000": {
                this.count42 = response.data[i].COUNT_AMT;;
                break;
              }
              case "56000": {
                this.count56 = response.data[i].COUNT_AMT;;
                break;
              }
              case "84000": {
                this.count84 = response.data[i].COUNT_AMT;;
                break;
              }
              case "300000": {
                this.count300 = response.data[i].COUNT_AMT;;
                break;
              } case "500000": {
                this.count500 = response.data[i].COUNT_AMT;;
                break;
              }
              default: {
                break;
              }
            }
          }
          this.countAll = this.count1 + this.count2 + this.count3 +
            this.count5 + this.count10 + this.count14 + this.count20 +
            this.count28 + this.count42 + this.count56 + this.count84 + this.count300 + this.count500
        }
        else {
          this.countAll = response.data[0].COUNT_AMT;
          this.checkcount = false;
        }
      }
    }
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
    this.CountDataCodeByAmt();
  }

  searchForm() {
    this.getData();
    this.CountDataCodeByAmt();
  }

  //#region load data
  async getData() {
    let account = "";
    if (this.isAdmin)
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    else
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let amt = this.selectedItemMoney.length != 0 && this.selectedItemMoney[0].id != "" ? this.selectedItemMoney[0].itemName : "";
    let is_used = this.selectedStatus.length > 0 ? this.selectedStatus[0].id : "";
    let from_date = this.fromDate;
    let to_date = this.toDate;
    // this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/datacode/GetDataCodePaging?page_index=' + this.pagination.pageIndex +
      "&page_size=" + this.pagination.pageSize + "&account_id=" + account + "&amt=" + amt + "&is_used=" + is_used + "&from_date=" + from_date + "&to_date=" + to_date);
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataCode = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getData();
    this.CountDataCodeByAmt();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getData();
    this.CountDataCodeByAmt();
  }
  //#endregion
  // export template excel
  async excelTemplateMember() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplateMember", "DataSms", "tmp_datacode.xlsx");
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
  public async submitUploadFile() {
    this.loading = true;
    let file = this.uploadFile.nativeElement;
    if (file.files.length > 0) {
      let accountId = this.selectedItemComboboxAccountMember.length > 0 && this.selectedItemComboboxAccountMember[0].id != "" ? this.selectedItemComboboxAccountMember[0].id : "";
      if (accountId == null && accountId == "") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
        return;
      }
      let response: any = await this.dataService.importExcelDataCodeVMSAsync(null, file.files, accountId);
      if (response) {
        if (response.err_code == -19) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-100"));
          this.loading = false;
          return;
        }
        this.selectedItemComboboxAccount.push({ "id": response.data[0].ACCOUNT_ID, "itemName": response.data[0].USER_NAME });
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("130"));
        this.uploadExcelModal.hide();
        this.getData();
        this.CountDataCodeByAmt();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        this.loading = false;
      }
    }
    this.loading = false;
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
        this.notificationService.displayWarnMessage("Ngày lọc chưa thỏa mãn");
        return;
      }
    }
    this.getData();
    this.CountDataCodeByAmt();
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
    this.getData();
    this.CountDataCodeByAmt();
  }
  addFrom() {

    this.manager = new manager();
    if (this.DataArrayList.length < 14) {
      this.payLoad = JSON.stringify(this.DataArrayList);
      this.resJSON = JSON.parse(this.payLoad);
      let i = this.resJSON.length - 1;
      if ((this.resJSON[i].quan != null && this.resJSON[i].quan != "") && (this.resJSON[i].selectedItemMoneyPro[0].itemName != null && this.resJSON[i].selectedItemMoneyPro[0].itemName != "")) {
        this.DataArrayList.push(this.manager);
      } else {
        alert("Giá trị không để trống");
      }
    }
    else {
      alert("Số lượng cấp data code vượt quá quy định");
    }

  }
  remoFor(index) {
    this.DataArrayList.splice(index, 1);
  }

 async sendDataCode(item) {
    if (item.accountID.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = item.accountID[0].id;
    let DESCRIPTION = item.description;
    let dataArray = JSON.stringify(this.DataArrayList);
    let resJSON = JSON.parse(dataArray);
    this.dataObj = resJSON;
    for (let i = 0; i < this.dataObj.length; i++) {
        this.dataQuan.push(resJSON[i].quan);
        this.dataAmt.push(resJSON[i].selectedItemMoneyPro[0].itemName);
    }
    let dataquan = this.dataQuan.toString();
    let dataamt=this.dataAmt.toString();
    let res: any = await this.dataService.getAsync('/api/datacode/EditDataCodeChild?account_id=' + ACCOUNT_ID + '&data_amt='+dataamt+'&data_quan=' +dataquan+'&description='+ DESCRIPTION);
    if (res) {
      if (res.err_code == 0) {
        this.selectedStatus = [];
        this.provisionDataCodeModal.hide();
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
        this.getData();
      } else if(res.err_code == -206){
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-206"));
        return;
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
  }
  async onItemSelectamt(index) {

  }

}

