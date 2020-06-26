import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/role';
import { UtilityService } from 'src/app/core/services/utility.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.css']
})
export class SmsTemplateComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataSMSTemp;
  public dataSenderName = [];
  public dataSenderNameAdd = [];
  public dataSenderNameEdit = [];
  public dataAccount = [];
  public dataAccountAdd = [];
  public dataAccountEdit = [];
  public pagination: Pagination = new Pagination();
  public id;
  public tempName: string = '';
  public slSender: string = '';
  public slSenderAdd: string = '';
  public slSenderEdit: string = '';
  public slAccount: string = '';
  public inTempName: string = '';
  public formEditSmsTemplate: FormGroup;
  public settingsFilterSender = {};
  public settingsFilterSenderAdd = {};
  public selectedItemComboboxSender = [];
  public selectedItemComboboxSenderAdd = [];
  public selectedItemComboboxSenderEdit = [];
  public selectedItemComboboxTempSms = [];
  public settingsFilterAccount = {};
  public settingsFilterAccountAdd = {};
  public settingsFilterAccountEdit = {};
  public settingsFilterTempSms = {};
  public settingsFilterSenderEdit = {};
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxAccountAdd = [];
  public selectedItemComboboxAccountEdit = [];
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public accountID: any;

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
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };
    this.settingsFilterAccountAdd = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };
    this.settingsFilterAccountEdit = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data"),
      showCheckbox: false
    };
  

    this.settingsFilterSender = {
      text: this.utilityService.translate('package.choose_sender'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterSenderAdd = {
      text: this.utilityService.translate('package.choose_sender'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterSenderEdit = {
      text: this.utilityService.translate('package.choose_sender'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };


    this.formEditSmsTemplate = new FormGroup({
      id: new FormControl(),
      slAccountEdit: new FormControl(),
      slSenderEdit: new FormControl(),
      tempNameEdit: new FormControl(),
      tempContentEdit: new FormControl()
    });

  }

  ngOnInit() {
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataAccountAdd.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataSenderName.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.getAccountLogin();
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
  }

  //#region load account
  async getDataAccount() {
    debugger
    if (this.isAdmin) {
      this.selectedItemComboboxAccount = [{ "id": "", "itemName": this.utilityService.translate("global.choose_account") }];
      this.selectedItemComboboxAccountAdd = [{ "id": "", "itemName": this.utilityService.translate("global.choose_account") }];
      let response: any = await this.dataService.getAsync('/api/account')
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
        this.dataAccountAdd.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
        this.dataAccountAdd.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1) {
        this.selectedItemComboboxAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
        this.selectedItemComboboxAccountAdd.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
        this.getData();
      }
      else
        this.selectedItemComboboxAccount.push({ "id": "", "itemName": this.utilityService.translate("global.choose_account") });
      this.selectedItemComboboxAccountAdd.push({ "id": "", "itemName": this.utilityService.translate("global.choose_account") });
    }
    if (this.selectedItemComboboxAccount.length > 0) {
      this.getDataSenderName();
    }
    if (this.selectedItemComboboxAccountAdd.length > 0) {
      this.getDataSenderNameAdd();
    }
  }

  onItemSelectAccount() {
    this.getData();
    this.getDataSenderName();
  }
  onItemSelectAccountAdd() {
    this.getDataSenderNameAdd();
  }
  //#endregion

  onItemSelectSender() {
    this.getData();
  }
  //#endregion

  onItemSelectSms() {
    debugger
    this.getData();
  }
  //#endregion

  //#region load data
  async getData() {
    let sender_id = "";
    if (this.isAdmin) {
      this.accountID = (this.selectedItemComboboxAccount.length > 0) ? this.selectedItemComboboxAccount[0].id : "";
      sender_id = this.selectedItemComboboxSender.length > 0 ? this.selectedItemComboboxSender[0].id : "";
    }
    else {
      this.accountID = (this.selectedItemComboboxAccount.length > 0) ? this.selectedItemComboboxAccount[0].id : "0";
      if (this.selectedItemComboboxSender.length > 0)
        sender_id = this.selectedItemComboboxSender[0].id;
      else if (this.selectedItemComboboxAccount.length > 0)
        sender_id = "";
      else
        sender_id = "0";
    }
    let response: any = await this.dataService.getAsync('/api/SmsTemplate/GetSmsTemplatePaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&accountID=" + this.accountID +
      "&senderId=" + sender_id + "&tempName=" + this.tempName
    )
    this.loadData(response);
    // if (response.err_code == 0) this.dataSMSTemp = response.data
  }

  loadData(response?: any) {
    if (response) {
      this.dataSMSTemp = response.data;
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

  // show add temp
  corfimShowModalCreate() {
    this.showModalCreate.show();
    this.getDataSenderNameAdd();
  }
  //#region create new
  async createSMSTemplate(item) {
    let smsTemp = item.value;
    let data = item.controls;
    if (data.slAccountAdd.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = data.slAccountAdd.value[0].id;

    if (data.slSenderAdd.value[0].id == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-44"));
      return;
    }
    let SENDER_ID = data.slSenderAdd.value[0].id;
    let SENDER_NAME = data.slSenderAdd.value[0].itemName;

    let TEMP_NAME = smsTemp.tempName;
    if (TEMP_NAME == "" || TEMP_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-113"));
      return;
    }
    let TEMPLATE_CONTENT = smsTemp.tempContent;
    if (TEMPLATE_CONTENT == "" || TEMPLATE_CONTENT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      return;
    }
    let response: any = await this.dataService.postAsync('/api/smstemplate', {
      ACCOUNT_ID, SENDER_ID, SENDER_NAME, TEMP_NAME
      , TEMPLATE_CONTENT
    })
    if (response.err_code == 0) {
      item.reset();
      this.selectedItemComboboxSender = [];
      this.getData();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  // show update modal
  async confirmUpdateModal(id) {
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
    this.selectedItemComboboxSenderEdit = [];
    let sender_id;
    let sender_name;
    let response: any = await this.dataService.getAsync('/api/smstemplate/' + id)
    if (response.err_code == 0) {
      let dataSmsTemp = response.data[0];
      sender_id = dataSmsTemp.SENDER_ID;
      sender_name = dataSmsTemp.SENDER_NAME;
      this.formEditSmsTemplate = new FormGroup({
        id: new FormControl(id),
        slAccountEdit: new FormControl([{ "id": dataSmsTemp.ACCOUNT_ID, "itemName": dataSmsTemp.USER_NAME }]),
        slSenderEdit: new FormControl([{ "id": dataSmsTemp.SENDER_ID, "itemName": dataSmsTemp.SENDER_NAME }]),
        tempNameEdit: new FormControl(dataSmsTemp.TEMP_NAME),
        tempContentEdit: new FormControl(dataSmsTemp.TEMPLATE_CONTENT)
      });
      this.getDataSenderNameEdit();
      if (this.selectedItemComboboxSenderEdit.length == 0)
        this.selectedItemComboboxSenderEdit.push({ "id": sender_id, "itemName": sender_name });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update tin mẫu
  async editSmsTemplate() {
    let formData = this.formEditSmsTemplate.controls;
    let ID = formData.id.value;
    let SENDER_ID = formData.slSenderEdit.value[0].id;
    if (SENDER_ID === '' || SENDER_ID === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-44"));
      return;
    }
    let SENDER_NAME = formData.slSenderEdit.value[0].itemName;

    let TEMP_NAME = formData.tempNameEdit.value;
    if (TEMP_NAME == "" || TEMP_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-113"));
      return;
    }

    let TEMPLATE_CONTENT = formData.tempContentEdit.value;
    if (TEMPLATE_CONTENT == "" || TEMPLATE_CONTENT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      return;
    }
    let response: any = await this.dataService.putAsync('/api/smstemplate/' + ID, {
      SENDER_ID, SENDER_NAME
      , TEMP_NAME, TEMPLATE_CONTENT
    })
    if (response.err_code == 0) {
      this.selectedItemComboboxSender = [];
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getData();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  showConfirmDelete(id, tempName) {
    this.id = id;
    this.tempName = tempName;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/smstemplate/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
    if (response.err_code == 0) {
      this.loadData(response);
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
  //get data sender
  async getDataSenderName() {
    this.selectedItemComboboxSender = [];
    this.dataSenderName = [];
    let account_id;
    if (this.isAdmin) {
      account_id = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : "";
    }
    else {
      account_id = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
      account_id)
    debugger
    for (let index in response.data) {
      this.dataSenderName.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
    }
    if (this.dataSenderName.length == 1)
      this.selectedItemComboboxSender.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
  }

  async getDataSenderNameAdd() {
    this.selectedItemComboboxSenderAdd = [];
    this.dataSenderNameAdd = [];
    let account_id = this.selectedItemComboboxAccountAdd.length > 0 ? this.selectedItemComboboxAccountAdd[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
      account_id)
    debugger
    for (let index in response.data) {
      this.dataSenderNameAdd.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
    }
    if (this.dataSenderNameAdd.length == 1)
      this.selectedItemComboboxSenderAdd.push({ "id": this.dataSenderNameAdd[0].id, "itemName": this.dataSenderNameAdd[0].itemName });
  }

  //edit
  async getDataSenderNameEdit() {
    this.selectedItemComboboxSenderEdit = [];
    this.dataSenderNameEdit = [];
    let account_id = this.selectedItemComboboxSenderEdit.length > 0 ? this.selectedItemComboboxSenderEdit[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
      account_id)
    debugger
    for (let index in response.data) {
      this.dataSenderNameEdit.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
    }
    if (this.dataSenderNameEdit.length == 1)
      this.selectedItemComboboxSenderEdit.push({ "id": this.dataSenderNameEdit[0].id, "itemName": this.dataSenderNameEdit[0].itemName });
  }
}
