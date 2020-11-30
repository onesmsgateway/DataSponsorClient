import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { Role } from 'src/app/core/models/role';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-account-discount',
  templateUrl: './account-discount.component.html',
  styleUrls: ['./account-discount.component.css'],
})
export class AccountDiscountComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmOtp', { static: false }) public confirmOtp: ModalDirective;

  public dataAccountDiscount = [];
  public pagination: Pagination = new Pagination();
  public role: Role = new Role();
  public formEditAccountDiscount: FormGroup;
  public dataAccount = [];
  public settingsFilterAccount = {};
  public selectedAccount = [];
  public selectedItemComboboxAccountCreate = [];
  public selectedItemComboboxAccountEdit = [];
  public dataTelco = [];
  public settingsFilterTelco = {};
  public selectedItemComboboxTelco = [];
  public hourStart = "00";
  public minuteStart = "00";
  public dateOld;
  public intervalId = null;
  public numberOtp: number;
  public limit_time: string = '';
  public countermin: number;
  public countersec: number;
  public disable_resend_otp: boolean = false;
  public otpSmsDataOtp: string = '';
  public senderNameDataOtp: string = '';
  public phoneReceiveOtp: string = '';

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
    this.formEditAccountDiscount = new FormGroup({
      discountId: new FormControl(),
      slAccount: new FormControl(),
      telco: new FormControl(),
      discount: new FormControl(),
      dateStart: new FormControl(),
      hourStart: new FormControl(),
      minuteStart: new FormControl()
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
    this.settingsFilterTelco = {
      text: this.utilityService.translate('global.choose_telco'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
  }

  ngOnInit() {
    this.getDataAccount();
    this.getDataTelco();
    this.getData();
    this.GetDataSysVarOtp();
  }

  async getDataAccount() {
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    let response: any = await this.dataService.getAsync('/api/account')
    for (let index in response.data) {
      this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
    }
  }

  async getDataTelco() {
    this.dataTelco.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataTelco.push({ "id": "VIETTEL", "itemName": "Viettel" });
    this.dataTelco.push({ "id": "GPC", "itemName": "VinaPhone" });
    this.dataTelco.push({ "id": "VMS", "itemName": "MobiFone" });
  }

  async getData() {
    let account = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/AccountDiscount/GetAccountDiscountPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&account_id=" + account)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataAccountDiscount = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getData();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getData();
  }

  confirmShowCreateModal() {
    this.hourStart = "00";
    this.minuteStart = "00";
    this.showModalCreate.show();
  }

  // create discount
  async createAccountDiscount(item) {
    let accDiscount = item.value;
    let combobox = item.controls;
    if (combobox.slAccountCr.value == null || combobox.slAccountCr.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.slAccountCr.value[0].id;
    if (combobox.telcoCr.value == null || combobox.telcoCr.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-121"));
      return;
    }
    let TELCO_CODE = combobox.telcoCr.value[0].id;
    let DISCOUNT_RATE = accDiscount.discount;
    if (DISCOUNT_RATE == "" || DISCOUNT_RATE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-122"));
      return;
    } else if (DISCOUNT_RATE < 0 || DISCOUNT_RATE > 100) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-126"));
      return;
    }
    let DATE_APPLY_START = accDiscount.dateStart;
    if (DATE_APPLY_START == "" || DATE_APPLY_START == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-123"));
      return;
    }
    DATE_APPLY_START = this.utilityService.formatDateToString(DATE_APPLY_START, "yyyyMMdd");
    let currentDate = this.utilityService.formatDateToString(new Date(), "yyyyMMdd");
    if (DATE_APPLY_START < currentDate) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-127"));
      return;
    }

    let HOUR_START = accDiscount.hourStart;
    let MINUTE_START = accDiscount.minuteStart;
    if (HOUR_START == "" || HOUR_START == null || MINUTE_START == "" || MINUTE_START == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-124"));
      return;
    }
    if (HOUR_START < 0 || HOUR_START > 23) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-125"));
      return;
    }
    DATE_APPLY_START = DATE_APPLY_START + HOUR_START + MINUTE_START + "00";

    let response: any = await this.dataService.postAsync('/api/AccountDiscount?is_edit=0', { ACCOUNT_ID, TELCO_CODE, DISCOUNT_RATE, DATE_APPLY_START })
    if (response.err_code == 0) {
      this.getData();
      item.reset();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    } 
    else if (response.err_code == -19) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/AccountDiscount/' + id)
    if (response.err_code == 0) {
      let accountDisEdit = response.data[0];
      this.dateOld = accountDisEdit.DATE_APPLY_START;
      this.formEditAccountDiscount = new FormGroup({
        discountId: new FormControl(id),
        slAccount: new FormControl([{ "id": accountDisEdit.ACCOUNT_ID, "itemName": accountDisEdit.USER_NAME }]),
        telco: new FormControl(accountDisEdit.TELCO_CODE == "VIETTEL" ? [{ "id": accountDisEdit.TELCO_CODE, "itemName": "Viettel" }] : accountDisEdit.TELCO_CODE == "GPC" ? [{ "id": accountDisEdit.TELCO_CODE, "itemName": "VinaPhone" }] : accountDisEdit.TELCO_CODE == "VMS" ? [{ "id": accountDisEdit.TELCO_CODE, "itemName": "MobiFone" }] : [{ "id": "", "itemName": this.utilityService.translate('global.choose_telco') }]),
        discount: new FormControl(accountDisEdit.DISCOUNT_RATE),
        dateStart: new FormControl(accountDisEdit.DATE_APPLY_START),
        hourStart: new FormControl(accountDisEdit.HOUR_START),
        minuteStart: new FormControl(accountDisEdit.MINUTE_START)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update telco
  async editAccountDiscount() {
    let formData = this.formEditAccountDiscount.controls;
    if (formData.slAccount.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    if (formData.telco.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-121"));
      return;
    }
    let DISCOUNT_RATE = formData.discount.value;
    if (DISCOUNT_RATE === '' || DISCOUNT_RATE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-122"));
      return;
    } else if (DISCOUNT_RATE < 0 || DISCOUNT_RATE > 100) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-126"));
      return;
    }
    let DATE_APPLY_START = "";
    if (formData.dateStart.value != null && formData.dateStart.value != "") {
      DATE_APPLY_START = formData.dateStart.value;
      DATE_APPLY_START = this.utilityService.formatDateToString(DATE_APPLY_START, "yyyyMMdd");
      let currentDate = this.utilityService.formatDateToString(new Date(), "yyyyMMdd");
      if (this.utilityService.formatDateToString(this.dateOld, "yyyyMMdd") != DATE_APPLY_START && DATE_APPLY_START < currentDate) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-127"));
        return;
      }
    } else {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-123"));
      return;
    }

    let HOUR_START = formData.hourStart.value.toString().length == 1 ? "0" + formData.hourStart.value : formData.hourStart.value;
    let MINUTE_START = formData.minuteStart.value.toString().length == 1 ? "0" + formData.minuteStart.value : formData.minuteStart.value;
    if (HOUR_START == "" || HOUR_START == null || MINUTE_START == "" || MINUTE_START == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-124"));
      return;
    }
    if (Number(HOUR_START) < 0 || Number(HOUR_START) > 23) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-125"));
      return;
    }

    this.createDataOtp();
  }

  async startTimer() {
    // if ((Number(this.limit_time) > 0)) {
    //   let smin = ((Number(this.limit_time) * 60));
    //   let minsec = (smin - 60) / 10;
    //   if (smin > 60) {
    //     this.countersec = 60;
    //   } else {
    //     this.countersec = smin;
    //   }
    //   if (minsec > 0) {
    //     this.countermin = Math.floor(Number(this.limit_time) / 100) + minsec;
    //   } else {
    //     this.countermin = Math.floor(Number(this.limit_time) / 100);
    //   }

    // }
    this.countermin = Number(this.limit_time) - 1;
    this.countersec = 59;


    this.intervalId = setInterval(() => {
      this.disable_resend_otp = false;
      if (this.countersec - 1 == -1) {
        this.countermin -= 1;
        this.countersec = 59
      }
      else {
        this.countersec -= 1
      }
      if (this.countermin === 0 && this.countersec == 0) {
        this.disable_resend_otp = true;
        clearInterval(this.intervalId)
      }
    }, 1000)
  }

  async GetDataSysVarOtp() {
    let result = await this.dataService.getAsync('/api/SysVar/GetSysVarOtp');
    if (result) {
      if (result.err_code == 0) {
        this.otpSmsDataOtp = result.data[0].VAR_VALUE;
        this.limit_time = result.data[1].VAR_VALUE;
        this.senderNameDataOtp = result.data[2].VAR_VALUE;
        this.phoneReceiveOtp = result.data[3].VAR_VALUE;
      }
    }
  }

  async confirmOtphide() {
    clearInterval(this.intervalId);
    this.confirmOtp.hide();
  }
  async checkOtpLength() {
    if (this.numberOtp != null && this.numberOtp.toString().length > 6) {
      this.numberOtp = Number(this.numberOtp.toString().substr(0, 5));
    }
  }
  async resendOtp() {
    this.createDataOtp();
  }

  async createDataOtp() {
    let response: any = await this.dataService.postAsync('/api/DataOtp/InsertDataOtp?phone=' + this.phoneReceiveOtp + '&telco=&account_id=' + 
    this.formEditAccountDiscount.controls.slAccount.value[0].id + '&sender_name=' + this.senderNameDataOtp + '&otp_sms=' + this.otpSmsDataOtp)
    if (response) {
      if (response.err_code == 0) {
        this.confirmOtp.show();
        this.startTimer();
      } else {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
  }

  async confirmSendDataOtp() {
    let otp = this.numberOtp;
    if (otp == 0 && otp == null) {
      this.notificationService.displayWarnMessage(this.utilityService.translate('data_otp.inputOtp'));
      return;
    }
    let response: any = await this.dataService.getAsync('/api/DataOtp/GetDataOtpByOtp?otp=' + otp)
    if (response) {
      if (response.err_code == 0) {
        this.confirmOtp.hide();
        this.confirmEdit();
      }
      else if (response.err_code == -117) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-117"));
        return;
      } else if (response.err_code == -118) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-118"));
        return;
      } else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
  }

  async confirmEdit(){
    let formData = this.formEditAccountDiscount.controls;
    let ACCOUNT_ID = formData.slAccount.value[0].id;
    let TELCO_CODE = formData.telco.value[0].id;
    let DISCOUNT_RATE = formData.discount.value;
    let DATE_APPLY_START = this.utilityService.formatDateToString(formData.dateStart.value, "yyyyMMdd");
    let HOUR_START = formData.hourStart.value.toString().length == 1 ? "0" + formData.hourStart.value : formData.hourStart.value;
    let MINUTE_START = formData.minuteStart.value.toString().length == 1 ? "0" + formData.minuteStart.value : formData.minuteStart.value;
    DATE_APPLY_START = DATE_APPLY_START + HOUR_START + MINUTE_START + "00";

    let response: any = await this.dataService.postAsync('/api/AccountDiscount?is_edit=1', { ACCOUNT_ID, TELCO_CODE, DISCOUNT_RATE, DATE_APPLY_START })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
}
