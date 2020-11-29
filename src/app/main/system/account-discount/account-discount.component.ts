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
  styleUrls: ['./account-discount.component.css']
})
export class AccountDiscountComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;

  public dataAccountDiscount = [];
  public pagination: Pagination = new Pagination();
  public role: Role = new Role();
  public formEditAccountDiscount: FormGroup;
  public dataAccount = [];
  public settingsFilterAccount = {};
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxAccountCreate = [];
  public selectedItemComboboxAccountEdit = [];
  public dataTelco = [];
  public settingsFilterTelco = {};
  public selectedItemComboboxTelco = [];

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
      timeStart: new FormControl()
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
    let account = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
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

  // create discount
  async createAccountDiscount(item) {
    let accDiscount = item.value;
    let combobox = item.controls;
    if (combobox.slAccountCr.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.slAccountCr.value[0].id;

    if (combobox.telcoCr.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-121"));
      return;
    }
    let TELCO_CODE = accDiscount.telcoCr;
    let DISCOUNT_RATE = accDiscount.discount;
    if (DISCOUNT_RATE == "" || DISCOUNT_RATE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-122"));
      return;
    }
    let DATE_APPLY_START = accDiscount.dateStart;
    if (DATE_APPLY_START == "" || DATE_APPLY_START == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-123"));
      return;
    }
    DATE_APPLY_START = this.utilityService.formatDateToString(DATE_APPLY_START, "yyyyMMdd");

    let TIME_START = accDiscount.dateStart;
    if (TIME_START == "" || TIME_START == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-124"));
      return;
    }
    DATE_APPLY_START = this.utilityService.formatDateToString(DATE_APPLY_START, "yyyyMMdd");




    let response: any = await this.dataService.postAsync('/api/AccountDiscount', { ACCOUNT_ID, TELCO_CODE, DISCOUNT_RATE, DATE_APPLY_START })
    if (response.err_code == 0) {
      this.getData();
      item.reset();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-110"));
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/AccountDiscount/' + id)
    if (response.err_code == 0) {
      let accountDisEdit = response.data[0];
      this.formEditAccountDiscount = new FormGroup({
        discountId: new FormControl(id),
        slAccount: new FormControl([{ "id": accountDisEdit.ACCOUNT_ID, "itemName": accountDisEdit.USER_NAME }]),
        telco: new FormControl(accountDisEdit.TELCO_CODE == "VIETTEL" ? [{ "id": accountDisEdit.TELCO_CODE, "itemName": "Viettel" }] : accountDisEdit.TELCO_CODE == "GPC" ? [{ "id": accountDisEdit.TELCO_CODE, "itemName": "VinaPhone" }] : accountDisEdit.TELCO_CODE == "VMS" ? [{ "id": accountDisEdit.TELCO_CODE, "itemName": "MobiFone" }] : [{ "id": "", "itemName": this.utilityService.translate('global.choose_telco') }]),
        discount: new FormControl(accountDisEdit.DISCOUNT_RATE),
        dateStart: new FormControl(accountDisEdit.DATE_APPLY_START),
        timeStart: new FormControl(accountDisEdit.TIME_APPLY_START)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update telco
  async editAccountDiscount() {
    let formData = this.formEditAccountDiscount.controls;
    let ID = formData.personId.value;
    if (formData.slAccount.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = formData.account.value[0].id;
    if (formData.telco.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-121"));
      return;
    }
    let TELCO_CODE = formData.telco.value[0].id;

    let DISCOUNT_RATE = formData.discount.value;
    if (DISCOUNT_RATE === '' || DISCOUNT_RATE === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-122"));
      return;
    }
    let DATE_APPLY_START = "";
    if(formData.dateStart.value!=null && formData.dateStart.value!=""){
      DATE_APPLY_START= formData.birthdayEdit.value;
      DATE_APPLY_START = this.utilityService.formatDateToString(DATE_APPLY_START, "yyyyMMdd");
     }else{
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-123"));
      return;
     }

     let TIME_APPLY_START = "";
    if(formData.dateStart.value!=null && formData.dateStart.value!=""){
      TIME_APPLY_START= formData.birthdayEdit.value;
      TIME_APPLY_START = this.utilityService.formatDateToString(TIME_APPLY_START, "yyyyMMdd");
     }else{
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-123"));
      return;
     }




    let response: any = await this.dataService.putAsync('/api/telco/' + ID, { ACCOUNT_ID, TELCO_CODE, DISCOUNT_RATE, DATE_APPLY_START })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
}
