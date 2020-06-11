import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from 'src/app/core/models/role';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public pagination: Pagination = new Pagination();
  public formEditMapping: FormGroup;
  public role: Role = new Role();
  public dataSenderMapping = [];
  public dataSender = [];
  public dataTelco = [];
  public dataPartner = [];
  public dataSenderGroup = [];
  public settingsFilterSender = {};
  public settingsFilterPartner = {};
  public settingsFilterTelco = {};

  public selectedItemComboboxAccount = [];
  public selectedItemComboboxSender = [];
  public selectedItemComboboxTelco = [];
  public selectedItemComboboxPartner = [];
  public selectedItemComboboxPartnerViettel = [];
  public selectedItemComboboxPartnerGPC = [];
  public selectedItemComboboxPartnerVMS = [];
  public selectedItemComboboxPartnerVNM = [];
  public selectedItemComboboxPartnerGtel = [];

  public partnerSenderId;
  public settingsFilterAccount = {};
  public settingsFilterAccountFilter = {}
 
  public dataAccount = [];
  public selectedAccountID = [];
  public selectedAccountFilter = []

  public settingsFilterAccountEdit = {}
  public selectedAccountEdit = []

  public settingsFilterSenderEdit = {}
  public settingsFilterTelcoEdit = {}

  public selectedSenderFilter = []

  public checkActiveViettel = true
  public checkActiveGPC = true
  public checkActiveVMS = true
  public checkActiveVNM = true
  public checkActiveGtel = true

  constructor(
    private dataService: DataService,
    modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterAccountFilter = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
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

    this.settingsFilterAccountEdit = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false,
      disabled: true
    };

    this.settingsFilterSender = {
      text: this.utilityService.translate("global.choose_sender"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };

    this.settingsFilterPartner = {
      text: this.utilityService.translate("global.choose_port"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };

    this.settingsFilterTelco = {
      text: this.utilityService.translate("global.choose_telco"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };

    this.settingsFilterSenderEdit = {
      text: this.utilityService.translate("global.choose_sender"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false,
      disabled: true
    };

    this.settingsFilterTelcoEdit = {
      text: this.utilityService.translate("global.choose_telco"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false,
      disabled: true
    };

    this.formEditMapping = new FormGroup({
      id: new FormControl(),
      accountID: new FormControl(),
      partner: new FormControl(),
      sender: new FormControl(),
      telco: new FormControl(),
      active: new FormControl(),
      maintainingFee: new FormControl(),
      orderTamp: new FormControl(),
      order: new FormControl(),
      timeReset: new FormControl()
    });
  }

  ngOnInit() {
    this.getDataAccount()
    this.getDataSender();
    this.getDataPartner();
    this.pagination.pageSize = 20;
    this.getData();
  }

  //#region load data account
  public async getDataAccount() {
    this.dataAccount = []
    this.dataAccount.push({ "id": "", "itemName": "Chọn tài khoản" });
    let response: any = await this.dataService.getAsync('/api/account');
    for (let index in response.data) {
      this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
    }
  }

  onItemSelectAccount() {
    this.getData();
  }
  //#endregion

  //#region load data and paging
  async getData() {
    debugger
    this.dataSenderMapping = [];
    let accountID = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    let senderID = this.selectedItemComboboxSender.length>0 && this.selectedItemComboboxSender[0].id!=""? this.selectedItemComboboxSender[0].id : "";
    let response: any = await this.dataService.getAsync('/api/accountsender/GetAccountSenderPaging?pageIndex=' +
      this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize + "&accountId=" + accountID + "&senderId=" + senderID)
    this.loadData(response);
    console.log(response);
  }

  loadData(response?: any) {
    debugger
    if (response) {
      this.dataSenderMapping = response.data;
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
  //#endregion

  //#region load sender
  async getDataSender() {
    this.dataSender = []
    this.dataSender.push({ "id": "", "itemName": this.utilityService.translate("global.choose_sender") });
    let response: any = await this.dataService.getAsync('/api/sendername')
    if (response)
      for (let index in response.data) {
        this.dataSender.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
      }
  }

  deSelectAccount() {
    this.getData();
  }

  ChangeDropdownList() {
    this.getData();
  }
  //#endregion

  async getDataPartner() {
    this.dataPartner.push({ "id": "", "itemName": this.utilityService.translate("global.choose_port") });
    let response: any = await this.dataService.getAsync('/api/partner')
    if (response)
      for (let index in response.data) {
        this.dataPartner.push({ "id": response.data[index].ID, "itemName": response.data[index].PARTNER_NAME });
      }
  }

  async getDataTelco() {
    this.dataTelco.push({ "id": "", "itemName": this.utilityService.translate("global.choose_telco") });
    let response: any = await this.dataService.getAsync('/api/telco')
    if (response)
      for (let index in response.data) {
        this.dataTelco.push({ "id": response.data[index].TEL_CODE, "itemName": response.data[index].TEL_NAME });
      }
  }

  //#region create
  confimShowModalCreate() {
    this.checkActiveViettel = true
    this.checkActiveVMS = true
    this.checkActiveGPC = true
    this.checkActiveVNM = true
    this.checkActiveGtel = true
    this.selectedItemComboboxPartnerViettel = []
    this.selectedItemComboboxPartnerVMS = []
    this.selectedItemComboboxPartnerGPC = []
    this.selectedItemComboboxPartnerVNM = []
    this.selectedItemComboboxPartnerGtel = []
    this.showModalCreate.show();
  }

  async createMapping(item) {
    debugger
    let combobox = item.controls;
    if (combobox.accountID.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.accountID.value[0].id;
    if (combobox.senderID.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-104"));
      return;
    }
    let SENDER_ID = combobox.senderID.value[0].id;
    let response: any = await this.dataService.postAsync('/api/AccountSender', {
      ACCOUNT_ID, SENDER_ID
    })
    console.log(response);
    if (response.err_code == 0) {
      
      this.getData();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    } else if (response.err_code == -19) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-19"));
    }
    else{
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

     
  
  //#endregion

  //#region update
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/accountsender/GetAccountSenderById?id=' + id)
    if (response.err_code == 0) {
      let dataSenderMap = response.data[0];
      this.formEditMapping = new FormGroup({
        id: new FormControl(id),
        accountID: new FormControl([{ "id": dataSenderMap.ACCOUNT_ID, "itemName": dataSenderMap.USER_NAME }]),
        senderID: new FormControl([{ "id": dataSenderMap.SENDER_ID, "itemName": dataSenderMap.NAME }]),
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  async editMapping() {
    let formData = this.formEditMapping.controls;
    let ID = formData.id.value;

    if (formData.accountID.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-63"));
      return;
    }
    let strAccount = "";
    for (let i = 0; i < formData.accountID.value.length; i++) {
      if (i == 0) strAccount = formData.accountID.value[i].id
      else strAccount += "," + formData.accountID.value[i].id
    }

    if (formData.sender.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
      return;
    }
    let SENDER_ID = formData.sender.value[0].id;
    let SENDER_NAME = formData.sender.value[0].itemName

    let TEL_CODE = formData.telco.value[0].id;
    if (TEL_CODE == null || TEL_CODE == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-40"));
      return;
    }

    let PARTNER_ID = formData.partner.value[0].id;
    if (PARTNER_ID == null || PARTNER_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-33"));
      return;
    }

    let FEE_IN_MONTH = formData.maintainingFee.value != '' ? formData.maintainingFee.value : null;
    let ORDER_REAL = formData.order.value != '' ? formData.order.value : null;;
    let ORDER_TMP = formData.orderTamp.value != '' ? formData.orderTamp.value : null;;
    let TIME_RESET = formData.timeReset.value;
    let SMS_TYPE = 'CSKH';
    let ACTIVE = formData.active.value == true ? "1" : "0";

    let response: any = await this.dataService.putAsync('/api/PartnerSender/UpdatePartnerSender?id=' + ID +
      '&strAccount=' + strAccount, {
      SENDER_ID, SENDER_NAME, SMS_TYPE, TEL_CODE, PARTNER_ID, FEE_IN_MONTH, ORDER_REAL, ORDER_TMP, TIME_RESET, ACTIVE
    })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  //#region delete
  showConfirmDelete(id, sender) {
    this.partnerSenderId = id;
    this.confirmDeleteModal.show();
  }

  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/partnersender/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) {
      this.getData();
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  async exportExcel() {
    let listParameter = "accountID=" + (this.selectedAccountFilter.length > 0 ? this.selectedAccountFilter[0].id : "") +
      ",senderID=" + (this.selectedSenderFilter.length > 0 ? this.selectedSenderFilter[0].id : "") +
      ",type=CSKH"
    let result: boolean = await this.dataService.getFileExtentionParameterAsync("/api/FileExtention/ExportExcelParameter",
      "PartnerSender", listParameter, "PartnerSender")
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
}
