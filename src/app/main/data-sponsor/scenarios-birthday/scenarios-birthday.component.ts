import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from 'src/app/core/models/role';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AppConst } from 'src/app/core/common/app.constants';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-scenarios-birthday',
  templateUrl: './scenarios-birthday.component.html',
  styleUrls: ['./scenarios-birthday.component.css']
})
export class ScenariosBirthdayComponent implements OnInit {
  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('showModalCreateLink', { static: false }) public showModalCreateLink: ModalDirective;
  @ViewChild('uploadImageEdit', { static: false }) public uploadImageEdit;
  @ViewChild('uploadImage', { static: false }) public uploadImage;

  public user: User = this.authService.currentUserValue;
  public dataScenariosbirthday = [];
  public pagination: Pagination = new Pagination();
  public scenarioId = "";
  public srcold = "";
  public quantityVTL = 1;
  public quantityGPC = 1;
  public quantityVMS = 1;
  public linkinput: string = '';
  public id;
  public dataGroup = [];
  public selectedComboboxGroup = [];
  public name;
  public group_id;
  public inCodeScenar: string = '';
  public inNameScenar: string = '';
  public src: string = '/assets/img/user_icon.jpg';
  public formEditScenariosBirthday: FormGroup;
  public formLinkDetail: FormGroup;
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public isHidden: boolean = true;
  public isScPopup: boolean = true;
  public isHiddenSen: boolean = true;
  public isHiddencheckOne: boolean = true;
  public isHiddencheckSms: boolean = true;
  public isAdded: boolean = false;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public checkActive: boolean = false;
  public checkSendSms: boolean = false;
  public checkRewardOneTime: boolean = false;
  public RewardOneTimeInDay = 0;
  public checkDataCode = 0
  public isCheckAccumulatePoint: boolean = false;
  public dataStatus = [];
  public checkSendSmsEdit: boolean = true;
  public data = [];
  public dataAccount = [];
  public dataAccountAdd = [];
  public scenariosDetail = [];
  public dataPackage = [];
  public dataPackageVTL = [];
  public settingsFilterPackageVTL = {};
  public selectedPackageVTL = [];
  public dataPackageGPC = [];
  public settingsFilterPackageGPC = {};
  public selectedPackageGPC = [];
  public dataPackageVMS = [];
  public settingsFilterPackageVMS = {};
  public selectedPackageVMS = [];
  public settingsFilterStatus = {};
  public selectedStatus = [];
  public settingsFilterAccount = {};
  public settingsFilterAccountEdit = {};
  public selectedComboboxGroupEdit = [];
  public settingsFilterGroup = {};
  public settingsFilterGroupEdit = {};
  public settingsFilterAccountAdd = {};
  public settingsFilterGroupCreate = {};

  public settingsFilterScenariosAdd = {};
  public selectedAccount = [];
  public settingsFilterPackage = {};
  public selectedPackage = [];
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxAccountEdit = [];
  public selectedItemComboboxAccountAdd = [];
  public selectedComboboxGroupCreate = [];
  public selectedItemComboboxscenariosDetail = [];


  public selectedItemComboboxSender = [];
  public selectedItemComboboxSenderAdd = [];
  public selectedItemComboboxSenderEdit = [];
  public dataSenderName = [];
  public dataSenderNameAdd = [];
  public dataSenderNameEdit = [];
  public dataGroupCreate = [];
  public dataGroupEdit = [];
  public settingsFilterSender = {};
  public settingsFilterSenderAdd = {};
  public settingsFilterSenderEdit = {};
  public scenario_type: string = '';
  public isscenario: boolean = false;
  public checkcodetrim: boolean = false;
  public codetrim: string = "";


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

    this.settingsFilterStatus = {
      text: this.utilityService.translate('global.choose_status'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
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
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterGroup = {
      text: this.utilityService.translate('global.choose_group'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterGroupEdit = {
      text: this.utilityService.translate('global.choose_group'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterAccountAdd = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterGroupCreate = {
      text: this.utilityService.translate('global.choose_group'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterScenariosAdd = {
      text: this.utilityService.translate('global.choose_scenarios_type'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };


    this.settingsFilterPackage = {
      text: this.utilityService.translate('global.choose_package'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false

    };

    this.settingsFilterPackageVTL = {
      text: this.utilityService.translate('global.choose_package'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterPackageGPC = {
      text: this.utilityService.translate('global.choose_package'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterPackageVMS = {
      text: this.utilityService.translate('global.choose_package'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.formEditScenariosBirthday = new FormGroup({
      id: new FormControl(),
      accountEdit: new FormControl(),
      slGroupEdit: new FormControl(),
      nameEdit: new FormControl(),
      slSenderNameEdit: new FormControl(),
      SendAtTimeEdit: new FormControl(),
      SendBeforeDaysEdit: new FormControl(),
      packageVTLEdit: new FormControl(),
      packageGPCEdit: new FormControl(),
      packageVMSEdit: new FormControl(),
      contentEdit: new FormControl(),
      isActiveEdit: new FormControl()

    });


  }

  ngOnInit() {
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataGroup.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataGroupEdit.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataGroupCreate.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.getAccountLogin();

  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
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
    this.getDataGroup();
    this.bindDataStatus();
    this.getData();

  }

  async getDataAccount() {
    if (this.isAdmin) {
      this.selectedAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
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
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
        this.selectedItemComboboxAccountAdd.push({ "id": this.dataAccountAdd[0].id, "itemName": this.dataAccountAdd[0].itemName });
        this.getDataSenderName(this.dataAccount[0].id);
      }
      else
        this.selectedItemComboboxAccountAdd.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }

  }
  changeAccount() {
    this.getDataSenderName(this.selectedItemComboboxAccount[0].id);
  }
  changeAccountAdd() {
    this.getDataSenderNameAdd(this.selectedItemComboboxAccountAdd[0].id);
    this.getDataGroupCreate(this.selectedItemComboboxAccountAdd[0].id);
  }

  deSelectAccount() {
    this.getData();
  }

  ChangeDropdownList() {
    this.getData();
  }
  searchForm() {
    this.getData();
  }

  async getDataGroup() {
    let account = "";
    if (this.isAdmin) {
      account = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : "";
    }
    else {
      account = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupByAccount?account_id=' + account)

    if (response)
      for (let index in response.data) {
        this.dataGroup.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
      }
  }
  //#region load group sender
  async getDataGroupCreate(account_id) {
    this.selectedComboboxGroupCreate = [];
    this.dataGroupCreate = [];
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupByAccount?account_id=' + account_id)
    for (let index in response.data) {
      this.dataGroupCreate.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
    }
    if (this.dataGroupCreate.length == 1)
      this.selectedComboboxGroupCreate.push({ "id": this.dataGroupCreate[0].id, "itemName": this.dataGroupCreate[0].itemName });
  }
  //#endregion
  //get data sender
  async getDataGroupEdit(account_id) {
    this.selectedComboboxGroupEdit = [];
    this.dataGroupEdit = [];
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupByAccount?account_id=' + account_id)
    for (let index in response.data) {
      this.dataGroupEdit.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
    }

  }

  //#region load data
  async getData() {
    let account = "";
    if (this.isAdmin) {
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    }
    else {
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    let group = this.selectedComboboxGroup.length > 0 && this.selectedComboboxGroup[0].id != "" ? this.selectedComboboxGroup[0].id : "";
    let response: any = await this.dataService.getAsync('/api/BirthdayScenario/GetBirthdayScenarioPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&group_id=" + group +
      "&scenario_name=" + this.inNameScenar)
    this.loadData(response);

  }

  loadData(response?: any) {
    if (response) {
      this.dataScenariosbirthday = response.data;
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

  //#region smsType
  public async bindDataStatus() {
    this.dataStatus = [];
    this.dataStatus.push({ "id": "1", "itemName": this.utilityService.translate('scenarios.active') });
    this.dataStatus.push({ "id": "0", "itemName": this.utilityService.translate('scenarios.inActive') });
  }
  //#endregion

  confirmShowModalCreate() {
    this.selectedItemComboboxAccountAdd=[];
    this.selectedComboboxGroupCreate=[];
    this.selectedPackageVTL=[];
    this.selectedPackageGPC=[];
    this.selectedPackageVMS=[];
    let account;
    if (this.isAdmin) {
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    }
    else {
      account = this.selectedItemComboboxAccountAdd.length != 0 && this.selectedItemComboboxAccountAdd[0].id != "" ? this.selectedItemComboboxAccountAdd[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }
    this.isAdded = false;
    this.getDataPackageVTL();
    this.getDataPackageGPC();
    this.getDataPackageVMS();
    this.getDataGroupCreate(account);
    this.getDataSenderNameAdd(account);
    this.isHidden = true;
    this.showModalCreate.show();

  }

  //#region create new
  async createScenariosBirthday(item) {
    let scenar = item.value;
    let combobox = item.controls;
    let SENDER_NAME = "";
    let GROUP_ID;

    if (combobox.slAccountAdd.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.slAccountAdd.value[0].id;

    if (combobox.slGroupcreate.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-96"));
      return;
    } else {
      GROUP_ID = combobox.slGroupcreate.value[0].id;
    }

    let SCENARIO_NAME = scenar.name;
    if (SCENARIO_NAME == "" || SCENARIO_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-93"));
      return;
    }
    if (combobox.slSenderName.value.length == 0) {
      SENDER_NAME = "";
    } else {
      SENDER_NAME = combobox.slSenderName.value[0].itemName;
    }
    let SEND_AT_TIME = scenar.SendAtTime;
    if (SEND_AT_TIME != null || SEND_AT_TIME != "") {
      SEND_AT_TIME.toString();
    }

    let SEND_BEFORE_DAYS;
    if (SEND_BEFORE_DAYS == null || SEND_BEFORE_DAYS == "") {
      SEND_BEFORE_DAYS=0;
    }else{
      SEND_BEFORE_DAYS = scenar.SendBeforeDays;
    }
    let PACKAGE_ID_VTL;
     if (combobox.packageVTL.value.length != 0) {
       PACKAGE_ID_VTL = Number(combobox.packageVTL.value[0].id);
     }
    let PACKAGE_ID_GPC;
    if (combobox.packageGPC.value.length != 0) {
      PACKAGE_ID_GPC = Number(combobox.packageGPC.value[0].id);
    }
    let PACKAGE_ID_VMS;
     if (combobox.packageVMS.value.length != 0) {
      PACKAGE_ID_VMS= Number(combobox.packageVMS.value[0].id);
   }
  
    let SMS_CONTENT = scenar.content;
    if (SMS_CONTENT == "" || SMS_CONTENT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      return;
    }
    let IS_ACTIVE = this.checkActive == true ? 1 : 0;
    let response: any = await this.dataService.postAsync('/api/BirthdayScenario', {
      ACCOUNT_ID, GROUP_ID, SCENARIO_NAME, SENDER_NAME, SMS_CONTENT, SEND_AT_TIME, SEND_BEFORE_DAYS, PACKAGE_ID_VTL
      , PACKAGE_ID_GPC,
      PACKAGE_ID_VMS, IS_ACTIVE
    })
    if (response) {
      if (response.err_code == 0) {
        this.getData();
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
        this.showModalCreate.hide();

      }
      else if (response.err_code == -19) {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-19"));
        return;
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
  }
  //#endregion

  // show update modal
  async confirmUpdateModal(id) {
    this.getDataPackageVTL();
    this.getDataPackageGPC();
    this.getDataPackageVMS();
    let account_id = 0;
    let sender_id = 0;
    let groupId = 0;
    let groupName = "";
    let sender_name = "";
    this.selectedComboboxGroupEdit = [];
    this.selectedItemComboboxSenderEdit = [];
    let response: any = await this.dataService.getAsync('/api/BirthdayScenario/' + id);
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      account_id = dataDetail.ACCOUNT_ID;
      sender_id = dataDetail.ID != "" && dataDetail.ID != null ? dataDetail.ID : "";;
      sender_name = dataDetail.ID != "" && dataDetail.ID != null ? dataDetail.SENDER_NAME : this.utilityService.translate('package.choose_sender');
      groupId = dataDetail.GROUP_ID != "" && dataDetail.GROUP_ID != null ? dataDetail.GROUP_ID : "";
      groupName = dataDetail.GROUP_ID != "" && dataDetail.GROUP_ID != null ? dataDetail.GROUP_NAME : "";
      this.formEditScenariosBirthday = new FormGroup({
        id: new FormControl(id),
        accountEdit: new FormControl(dataDetail.ACCOUNT_ID != "" && dataDetail.ACCOUNT_ID != null ? [{ "id": dataDetail.ACCOUNT_ID, "itemName": dataDetail.USER_NAME }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }]),
        slGroupEdit: new FormControl(dataDetail.GROUP_ID != "" && dataDetail.GROUP_ID != null ? [{ "id": dataDetail.GROUP_ID, "itemName": dataDetail.GROUP_NAME }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_group') }]),
        nameEdit: new FormControl(dataDetail.SCENARIO_NAME),
        slSenderNameEdit: new FormControl(dataDetail.ID != "" && dataDetail.ID != null ? [{ "id": dataDetail.ID, "itemName": dataDetail.SENDER_NAME }]
          : [{ "id": "", "itemName": this.utilityService.translate('package.choose_sender') }]),
        SendAtTimeEdit: new FormControl(dataDetail.SEND_AT_TIME),
        SendBeforeDaysEdit: new FormControl(dataDetail.SEND_BEFORE_DAYS == 0 ? parseInt(""): dataDetail.SEND_BEFORE_DAYS),
        packageVTLEdit: new FormControl(dataDetail.PACKAGE_ID_VTL != "" && dataDetail.PACKAGE_ID_VTL != null ? [{ "id": dataDetail.PACKAGE_ID_VTL, "itemName": dataDetail.PACKAGE_NAME_VTL }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        packageGPCEdit: new FormControl(dataDetail.PACKAGE_ID_GPC != "" && dataDetail.PACKAGE_ID_GPC != null ? [{ "id": dataDetail.PACKAGE_ID_GPC, "itemName": dataDetail.PACKAGE_NAME_GPC }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        packageVMSEdit: new FormControl(dataDetail.PACKAGE_ID_VMS != "" && dataDetail.PACKAGE_ID_VMS != null ? [{ "id": dataDetail.PACKAGE_ID_VMS, "itemName": dataDetail.PACKAGE_NAME_VMS }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        contentEdit: new FormControl(dataDetail.SMS_CONTENT),
        isActiveEdit: new FormControl(dataDetail.IS_ACTIVE)
      });

      this.getDataGroupEdit(account_id);
      if (this.selectedComboboxGroupEdit.length == 0)
        this.selectedComboboxGroupEdit.push({ "id": groupId, "itemName": groupName });
      this.getDataSenderNameEdit(account_id);
      if (this.selectedItemComboboxSenderEdit.length == 0)
        this.selectedItemComboboxSenderEdit.push({ "id": sender_id, "itemName": sender_name });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
    this.settingsFilterAccountEdit = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false,
      disabled: true
    };
  }

  // update tin mẫu
  async editScenariosBirthday() {
    let formData = this.formEditScenariosBirthday.controls;
    let ID = formData.id.value;
    if (formData.accountEdit.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = formData.accountEdit.value[0].id;

    if (formData.slGroupEdit.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-96"));
      return;
    }
    let GROUP_ID = formData.slGroupEdit.value[0].id;

    let SCENARIO_NAME = formData.nameEdit.value;
    if (SCENARIO_NAME == "" || SCENARIO_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-93"));
      return;
    }
    if (formData.slSenderNameEdit.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-104"));
      return;
    }
    let SENDER_NAME = formData.slSenderNameEdit.value[0].itemName;
    let SEND_AT_TIME = formData.SendAtTimeEdit.value.toString();
    let SEND_BEFORE_DAYS = formData.SendBeforeDaysEdit.value;
    let PACKAGE_ID_VTL;
    if (formData.packageVTLEdit.value.length != 0) {
      PACKAGE_ID_VTL= Number(formData.packageVTLEdit.value[0].id);
    }
    let PACKAGE_ID_GPC;
    if (formData.packageGPCEdit.value.length != 0) {
      PACKAGE_ID_GPC= Number(formData.packageGPCEdit.value[0].id);
    }
   
    let PACKAGE_ID_VMS;
    if (formData.packageVMSEdit.value.length != 0) {
     PACKAGE_ID_VMS = Number(formData.packageVMSEdit.value[0].id);
    }
    let SMS_CONTENT = formData.contentEdit.value;
    if (SMS_CONTENT == "" || SMS_CONTENT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      return;
    }
    let IS_ACTIVE = formData.isActiveEdit.value == true ? 1 : 0;
    let response: any = await this.dataService.putAsync('/api/BirthdayScenario/' + ID, {
      ACCOUNT_ID, GROUP_ID, SCENARIO_NAME, SEND_AT_TIME, IS_ACTIVE, SEND_BEFORE_DAYS,
      PACKAGE_ID_VTL, PACKAGE_ID_GPC, PACKAGE_ID_VMS, SENDER_NAME, SMS_CONTENT,
    })

    if (response.err_code == 0) {
      this.selectedStatus = [];
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getData();
    }
    else if (response.err_code == 103) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-103"));
      return;
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      return;
    }

  }

  showConfirmDelete(id, name) {
    this.id = id;
    this.name = name;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/BirthdayScenario/' + id)
    if (response.err_code == 0) {
      this.getData();
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      return;
    }
  }

  //#region scenario detail  
  // get data package viettel
  async getDataPackageVTL() {
    this.dataPackageVTL = [];
    this.selectedPackageVTL = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VIETTEL' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVTL.length == 1)
      this.selectedPackageVTL.push({ "id": this.dataPackageVTL[0].id, "itemName": this.dataPackageVTL[0].itemName });
  }

  // get data package vina
  async getDataPackageGPC() {
    this.dataPackageGPC = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=GPC' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageGPC.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageGPC.length == 1)
      this.selectedPackageGPC.push({ "id": this.dataPackageGPC[0].id, "itemName": this.dataPackageGPC[0].itemName });
  }

  // get data package mobi
  async getDataPackageVMS() {
    this.dataPackageVMS = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VMS' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageVMS.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVMS.length == 1)
      this.selectedPackageVMS.push({ "id": this.dataPackageVMS[0].id, "itemName": this.dataPackageVMS[0].itemName });
  }


  async showModalCreateLinkDetail(id) {

    let response: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosLink?id=' + id)
    if (response.err_code == 0) {
      this.linkinput = response.data;
      this.showModalCreateLink.show();
    } else if (response.err_code == 135) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("135"));
      return;
    }
    else if (response.err_code == 136) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("136"));
      return;
    }
    else if (response.err_code == 137) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("137"));
      return;
    }
  }
  setPageIndexDetail(pageNo: number): void {
    this.pagination.pageIndex = pageNo;

  }

  pageChangedDetail(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSizeDetail(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;

  }
  //#endregion

  // show update modal

  async oncheckActive() {
    this.checkActive = !this.checkActive;
  }


  //get data sender
  async getDataSenderName(accountID) {
    this.selectedItemComboboxSender = [];
    this.dataSenderName = [];
    let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
      accountID)
    for (let index in response.data) {
      this.dataSenderName.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
    if (this.dataSenderName.length == 1)
      this.selectedItemComboboxSender.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
  }

  ////get data sender
  async getDataSenderNameAdd(accountID) {
    this.selectedItemComboboxSenderAdd = [];
    this.dataSenderNameAdd = [];
    let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
      accountID)
    for (let index in response.data) {
      this.dataSenderNameAdd.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
    }
   
  }
  //get data sender
  async getDataSenderNameEdit(accountID) {
    this.selectedItemComboboxSenderEdit = [];
    this.dataSenderNameEdit = [];
    let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
      accountID)
    for (let index in response.data) {
      this.dataSenderNameEdit.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
    }
  }
}
