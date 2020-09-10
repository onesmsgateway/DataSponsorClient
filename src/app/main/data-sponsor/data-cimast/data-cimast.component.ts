import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Role } from 'src/app/core/models/role';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-data-cimast',
  templateUrl: './data-cimast.component.html',
  styleUrls: ['./data-cimast.component.css']
})
export class DataCimastComponent implements OnInit {

  @ViewChild('createDataCimastModal', { static: false }) public createDataCimastModal: ModalDirective;
  @ViewChild('createDataCimastFreeModal', { static: false }) public createDataCimastFreeModal: ModalDirective;
  @ViewChild('viewDataAccountCimastTransModal', { static: false }) public viewDataAccountCimastTransModal: ModalDirective;
  @ViewChild('createDataCimastModalDetail', { static: false }) public createDataCimastModalDetail: ModalDirective;
  @ViewChild('createDataCimastFreeModalDetail', { static: false }) public createDataCimastFreeModalDetail: ModalDirective;
  

  public dataAccountCimast;
  public dataQuotaHistory = [];
  public total_amt_telco = 0;
  public total_vol_telco = 0;
  public total_data_vol_telco = 0;
  public total_amt_system = 0;
  public total_amt_system_remain = 0;
  public total_vol_system = 0;
  public total_vol_system_remain = 0;
  public totalAmt = 0;
  public totalVol_Vt = 0;
  public totalVol_Gpc = 0;
  public totalVol_Vms = 0;
  public account_Index = "";
  public description = "";
  public isAdmin: boolean = false;
  public ok: boolean = false;
  public checkUserLogin: boolean = false;

  public settingsFilterAccount = {};
  public dataAccount = [];
  public selectedAccountID = [];

  public selectedAccountCreate = [];
  public selectedTypeCreate = [];

  public selectedType = [];
  public dataType = [];
  public settingsFilterType = {};

  public timeTo = new Date();
  public timeFrom = new Date(this.timeTo.getTime() - (30 * 24 * 60 * 60 * 1000));
  public fromDate: string = "";
  public toDate: string = "";

  public TOTAL_AMT;
  public ACCOUNT_ID;
  public TYPE;
  public DESCRIPTION;
  public account_name;
  public account_user;
  public TOTAL_DATA_VIETTEL_FREE;
  public TOTAL_DATA_GPC_FREE;
  public TOTAL_DATA_VMS_FREE;
  public TOTAL_DATA_VOL_FREE;
  public ACCOUNT_ID_FREE;
  public TYPE_FREE;
  public DESCRIPTION_FREE;
  public account_name_free;
  public account_user_free;

  public pagination: Pagination = new Pagination();
  public role: Role = new Role();

  constructor(private authService: AuthService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu",
      showCheckbox: false
    };

    this.settingsFilterType = {
      text: "Chọn loại",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu",
      showCheckbox: false
    };

    this.dataType.push({ id: "DATA_SPONSOR", itemName: "DATA_SPONSOR" });
    this.dataType.push({ id: "DATA_CODE", itemName: "DATA_CODE" });
  }

  async ngOnInit() {
    this.account_Index = this.activatedRoute.snapshot.queryParamMap.get('account');
    this.toDate = this.utilityService.formatDateToString(this.timeTo, "yyyyMMdd");
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
    await this.bindDataAccount();
    await this.getDataTotal();
  }

  // get total data
  async getDataTotal() {
    this.total_amt_system = 0;
    this.total_amt_system_remain = 0;
    this.total_vol_system = 0;
    this.total_vol_system_remain = 0;
    let account = this.selectedAccountID.length != 0 && this.selectedAccountID[0].id != "" ? this.selectedAccountID[0].id :this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/DataCimast/GetDataAccount?account_id=' + account);
    if (response != null && response.data.length > 0) {
      this.total_amt_system = Math.round(response.data[0].TOTAL_AMT);
      this.total_amt_system_remain = Math.round(response.data[0].TOTAL_REMAIN);
      this.total_vol_system = Math.round(response.data[0].TOTAL_DATA_VOL);
      this.total_vol_system_remain = Math.round(response.data[0].TOTAL_DATA_REMAIN);
    } else {
      this.total_amt_system = 0;
      this.total_amt_system_remain = 0;
      this.total_vol_system = 0;
      this.total_vol_system_remain = 0;
    }
  }

  //#region account
  public async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    let isCheckAdmin = result.data[0].IS_ADMIN;
    if (isCheckAdmin == 1) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      this.isAdmin = true;
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1) {
        this.selectedAccountID.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccountID.push({ "id": 0, "itemName": "Chọn tài khoản" });
      this.isAdmin = false;
    }
    this.getDataAccountCimast();
  }

  onItemSelect() {
    this.getDataAccountCimast();
  }

  OnItemDeSelect() {
    this.getDataAccountCimast();
  }

  onItemSelectCreate() {
    if (this.selectedAccountCreate.length > 0 && this.selectedAccountCreate[0].id == this.authService.currentUserValue.ACCOUNT_ID) {
      this.checkUserLogin = true;
    }
    else {
      this.checkUserLogin = false;
    }
  }

  //#endregion
  //#region Load data
  public async getDataAccountCimast() {
    let FROM_DATE = this.fromDate;
    let TO_DATE = this.toDate;
    let account = [];
    if (this.account_Index != null && this.account_Index != "") {
      let response = await this.dataService.getAsync('/api/DataCimast/GetDataCimastPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
        this.pagination.pageSize + "&account_id=" + this.account_Index + "&from_date=" + FROM_DATE + "&to_date=" + TO_DATE);
      this.loadData(response);
    } else {
      if (this.isAdmin)
        account.push(this.selectedAccountID.length != 0 && this.selectedAccountID[0].id != "" ? this.selectedAccountID[0].id : "");
      else
        account.push(this.selectedAccountID.length != 0 && this.selectedAccountID[0].id != "" ? this.selectedAccountID[0].id : this.authService.currentUserValue.ACCOUNT_ID);
      let response = await this.dataService.getAsync('/api/DataCimast/GetDataCimastPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
        this.pagination.pageSize + "&account_id=" + account + "&from_date=" + FROM_DATE + "&to_date=" + TO_DATE);
      this.loadData(response);
    }
  }

  //#endregion

  loadData(response?: any) {
    if (response) {
      this.dataAccountCimast = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  //#region them giao dich tin
  openFormData() {
    this.clearBox();
    this.createDataCimastModal.show();
  }

  public async createDataCimast(data) {
    this.ACCOUNT_ID = "";
    this.TYPE = "";
    this.DESCRIPTION = "";
    this.TOTAL_AMT = "";
    this.ACCOUNT_ID = data.accountID.length > 0 ? data.accountID[0].id : "";
    this.TYPE = data.type.length > 0 ? data.type[0].id : "";
    this.DESCRIPTION = data.description;
    this.TOTAL_AMT = data.totalAmt;
    if (this.ACCOUNT_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    if (this.TYPE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-67"));
      return;
    }
    if (this.TOTAL_AMT == 0 || this.TOTAL_AMT == '') {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-80"));
      return;
    }
    this.account_name = data.accountID[0].itemName;
    this.createDataCimastModalDetail.show();
  }
  //#endregion
  //cap dât mien phi

  openFormDataFree() {
    this.clearBox();
    this.createDataCimastFreeModal.show();
  }

  public async createDataCimastFree(resData) {
    this.ACCOUNT_ID_FREE="";
    this.TYPE_FREE="";
    this.DESCRIPTION_FREE="";
    this.account_name_free="";
    this.account_user_free="";
    this.TOTAL_DATA_VIETTEL_FREE = 0;
    this.TOTAL_DATA_GPC_FREE = 0
    this.TOTAL_DATA_VMS_FREE = 0
    this.TOTAL_DATA_VOL_FREE = 0
    this.ACCOUNT_ID_FREE = resData.accountID.length > 0 ? resData.accountID[0].id : "";
    this.TYPE_FREE = "DATA_SPONSOR";
    this.TOTAL_DATA_VIETTEL_FREE = resData.totalVol_Vt;
    this.TOTAL_DATA_GPC_FREE = resData.totalVol_Gpc;
    this.TOTAL_DATA_VMS_FREE = resData.totalVol_Vms;
    this.TOTAL_DATA_VOL_FREE = this.TOTAL_DATA_VIETTEL_FREE + this.TOTAL_DATA_GPC_FREE + this.TOTAL_DATA_VMS_FREE;
    this.DESCRIPTION_FREE = resData.description;

    if (this.ACCOUNT_ID_FREE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    if (this.TOTAL_DATA_VOL_FREE == 0 || this.TOTAL_DATA_VOL_FREE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-204"));
      return;
    }
    this.account_name_free =  resData.accountID[0].itemName;
    this.createDataCimastFreeModalDetail.show();
  }
  // clear box
  clearBox() {
    this.selectedAccountCreate = [];
    this.selectedTypeCreate = [];
    this.selectedTypeCreate.push({ "id": "DATA_SPONSOR", "itemName": "DATA_SPONSOR" });
    this.totalAmt = 0;
    this.description = "";
  }

  //#region view lich su cap tin
  public async showConfirmViewHis(accountID) {
    let response: any = await this.dataService.getAsync('/api/DataCimast/GetDataCimastTran?account_id=' + accountID);
    if (response.err_code == 0) {
      this.dataQuotaHistory = response.data;
    }
    this.viewDataAccountCimastTransModal.show();
  }
  //#endregion

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
    this.getDataAccountCimast();
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
    this.getDataAccountCimast();
  }
  async confirmInsertDataCimast() {
    let ACCOUNT_ID = this.ACCOUNT_ID;
    let TOTAL_AMT = this.TOTAL_AMT;
    let TYPE = this.TYPE;
    let DESCRIPTION = this.DESCRIPTION;
    let account: any = await this.dataService.getAsync('/api/DataCimast/GetDataAccount?isAdmin=false&account_id=' + ACCOUNT_ID);
    if (account != null && account.data.length > 0) {
      // update data account cimast
      if (!this.isAdmin) {
        //so data cap khong duoc lon hon data tong
        if (this.TOTAL_AMT > this.total_amt_system_remain) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-75") + (TOTAL_AMT - this.total_amt_system));
          return;
        }
      }
      let TOTAL_USE = account.data[0].TOTAL_USE;
      let TOTAL_REMAIN = TOTAL_AMT;
      let TOTAL_DATA = 0;
      let response = await this.dataService.putAsync('/api/DataCimast', {
        ACCOUNT_ID, TYPE, DESCRIPTION, TOTAL_DATA, TOTAL_USE, TOTAL_REMAIN, TOTAL_AMT
      });
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
        this.getDataAccountCimast();
        this.getDataTotal();
        this.createDataCimastModal.hide();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }

    else {
      // insert data account cimast
      let TOTAL_USE = 0;
      let TOTAL_REMAIN = this.TOTAL_AMT;
      let TOTAL_DATA = 0;
      if (!this.isAdmin) {
        // so data cap khong duoc lon hon data tong
        if (this.TOTAL_AMT > this.total_amt_system_remain) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-75") + (this.TOTAL_AMT - this.total_amt_system));
          return;
        }
      }
      else if (this.TOTAL_AMT + this.total_amt_system_remain > this.total_amt_telco) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-75") + (TOTAL_AMT - this.total_amt_system));
        return;
      }
      let response = await this.dataService.postAsync('/api/DataCimast', {
        ACCOUNT_ID, TYPE, DESCRIPTION, TOTAL_DATA, TOTAL_USE, TOTAL_REMAIN, TOTAL_AMT
      });
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
        this.getDataAccountCimast();
        this.getDataTotal();
        this.createDataCimastModal.hide();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
    this.createDataCimastModalDetail.hide();
  }

  async confirmInsertDataCimastFree() {
   let TOTAL_DATA_VOL = this.TOTAL_DATA_VOL_FREE;
   let TOTAL_DATA_VIETTEL = this.TOTAL_DATA_VIETTEL_FREE;
   let ACCOUNT_ID = this.ACCOUNT_ID_FREE;
   let TYPE = this.TYPE_FREE;
   let DESCRIPTION = this.DESCRIPTION_FREE;
   let TOTAL_DATA_GPC = this.TOTAL_DATA_GPC_FREE;
   let TOTAl_DATA_VMS = this.TOTAL_DATA_VMS_FREE;
    let account: any = await this.dataService.getAsync('/api/DataCimast/GetDataAccount?isAdmin=false&account_id=' + this.ACCOUNT_ID_FREE);
    if (account != null && account.data.length > 0) {
      // update data account cimast
      if (!this.isAdmin) {
        //so data cap khong duoc lon hon data tong
        if (this.TOTAL_DATA_VOL_FREE > this.total_vol_system_remain) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-203") + (this.TOTAL_DATA_VOL_FREE - this.total_vol_system));
          return;
        }
      }
      let TOTAL_DATA_USE = account.data[0].TOTAL_DATA_USE;
      let TOTAL_DATA_REMAIN = this.TOTAL_DATA_VOL_FREE;
      let TOTAL_DATA = 0;

      let response = await this.dataService.putAsync('/api/DataCimast/PutFree', {
        ACCOUNT_ID, TYPE, DESCRIPTION, TOTAL_DATA, TOTAL_DATA_USE, TOTAL_DATA_REMAIN, TOTAL_DATA_VOL, TOTAL_DATA_VIETTEL, TOTAL_DATA_GPC, TOTAl_DATA_VMS
      });
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
        this.getDataAccountCimast();
        this.getDataTotal();
        this.createDataCimastFreeModal.hide();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
    else {
      // insert data account cimast
      let TOTAL_DATA_USE = 0;
      let TOTAL_DATA_REMAIN = TOTAL_DATA_VOL;
      let TOTAL_DATA = 0;
      if (!this.isAdmin) {
        // so data cap khong duoc lon hon data tong
        if (TOTAL_DATA_VOL > this.total_vol_system_remain) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-203") + (TOTAL_DATA_VOL - this.total_vol_system));
          return;
        }
      }
      let response = await this.dataService.postAsync('/api/DataCimast/PostFree', {
        ACCOUNT_ID, TYPE, DESCRIPTION, TOTAL_DATA, TOTAL_DATA_USE, TOTAL_DATA_REMAIN, TOTAL_DATA_VOL, TOTAL_DATA_VIETTEL, TOTAL_DATA_GPC, TOTAl_DATA_VMS
      });
      if (response.err_code == 0) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
        this.getDataAccountCimast();
        this.getDataTotal();
        this.createDataCimastFreeModal.hide();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
    this.createDataCimastFreeModalDetail.hide();
  }

}
