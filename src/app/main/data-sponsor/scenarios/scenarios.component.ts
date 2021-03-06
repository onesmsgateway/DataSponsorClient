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
import { ScenariosDetailComponent } from '../scenarios-detail/scenarios-detail.component';
import { async } from '@angular/core/testing';
import { AppConst } from 'src/app/core/common/app.constants';
import { User } from 'src/app/core/models/user';
import { DataSmsComponent } from '../../statistic/data-sms/data-sms.component';


@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('componentScenariosDetail', { static: false }) public componentScenariosDetail: ScenariosDetailComponent;
  @ViewChild('showModalCreateDetail', { static: false }) public showModalCreateDetail: ModalDirective;
  @ViewChild('showModalUpdateDetail', { static: false }) public showModalUpdateDetail: ModalDirective;
  @ViewChild('confirmDeleteModalDetail', { static: false }) public confirmDeleteModalDetail: ModalDirective;
  @ViewChild('showModalCreateLink', { static: false }) public showModalCreateLink: ModalDirective;
  @ViewChild('uploadImageEdit', { static: false }) public uploadImageEdit;
  @ViewChild('uploadImage', { static: false }) public uploadImage;
  @ViewChild('dataComponent', { static: false }) public dataComponent: DataSmsComponent;
  @ViewChild('contentSMS', { static: false }) public contentSMS;


  public user: User = this.authService.currentUserValue;
  public dataScenarios = [];
  public dataScenarioDetail = [];
  public pagination: Pagination = new Pagination();
  public idDetail;
  public nameDetail;
  public scenarioId = "";
  public quantityVTL = 1;
  public quantityGPC = 1;
  public quantityVMS = 1;
  public linkinput: string = '';
  public Account_Id_SMS: string = '';
  public Scenario_Id_SMS: string = '';
  public limitUseEdit;
  public dataOptionInsert = [];
  public dataOptionInsertSms = [];
  public selectedOptionInsert = [];
  public selectedOptionInsertEdit = [];
  public packageAmtVTL = 0;
  public packageAmtGPC = 0;
  public packageAmtVMS = 0;
  public checkDataCode = 0;
  public id;
  public Idsend;
  public name;
  public inCodeScenar: string = '';
  public inNameScenar: string = '';
  public totalUse: number;
  public totalUseEdit: string = '';
  public formEditScenarios: FormGroup;
  public formEditScenariosDetail: FormGroup;
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
  public checkActive: boolean = true;
  public checkSendSms: boolean = false;
  public checkRewardOneTime: boolean = false;
  public RewardOneTimeInDay = 0;
  public isCheckAccumulatePoint: boolean = false;
  public isEdit: boolean = false;
  public dataStatus = [];
  public isCreatelink = [];
  public isCreatelinkfalse = [];
  public checkSendSmsEdit: boolean = true;
  public data = [];
  public dataAccount = [];
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
  public settingsFilterOptionInsert = {};
  public settingsFilterAccount = {};
  public settingsFilterAccountEdit = {};
  public settingsFilterAccountAdd = {};
  public settingsFilterScenariosAdd = {};
  public selectedAccount = [];
  public settingsFilterPackage = {};
  public selectedPackage = [];
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxAccountEdit = [];
  public selectedItemComboboxAccountCreate = [];
  public selectedItemComboboxscenariosDetail = [];
  public contentsms: string = '';
  public active;
  public activeold;


  public selectedItemComboboxSender = [];
  public selectedItemComboboxSenderEdit = [];
  public dataSenderName = [];
  public settingsFilterSender = {};
  public scenario_type: string = '';
  public isscenario: boolean = false;
  public checkcodetrim: boolean = false;
  public codetrim: string = "";
  public urlImageUpload
  public urlImageUploadEdit


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

    this.settingsFilterStatus = {
      text: this.utilityService.translate('global.choose_status'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterOptionInsert = {
      text: this.utilityService.translate('send_data.option_insert'),
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
    this.settingsFilterAccountAdd = {
      text: this.utilityService.translate('global.choose_account'),
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

    this.formEditScenarios = new FormGroup({
      id: new FormControl(),
      account: new FormControl(),
      code: new FormControl(),
      name: new FormControl(),
      url_poster: new FormControl(),
      slScenarioType: new FormControl(),
      checkRewardOneTime: new FormControl(),
      RewardOneTimeInDay: new FormControl(),
      isCheckAccumulatePoint: new FormControl(),
      checkSendSms: new FormControl(),
      contentsms: new FormControl(),
      content: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      isActive: new FormControl(),
      slSenderName: new FormControl(),
      limitUseEdit: new FormControl(),
      totalUseEdit: new FormControl(),
      slOptionInsert: new FormControl(),

    });

    this.formEditScenariosDetail = new FormGroup({
      id: new FormControl(),
      valueScenar: new FormControl(),
      packageVTL: new FormControl(),
      packageGPC: new FormControl(),
      packageVMS: new FormControl(),
      quantityVTL: new FormControl(),
      quantityGPC: new FormControl(),
      quantityVMS: new FormControl(),
      packageAmtVTL: new FormControl(),
      packageAmtGPC: new FormControl(),
      packageAmtVMS: new FormControl()
    });
  }

  ngOnInit() {
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inPack'), "itemName": this.utilityService.translate('send_data.inPack') });
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inData'), "itemName": this.utilityService.translate('send_data.inData') });
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inDateUse'), "itemName": this.utilityService.translate('send_data.inDateUse') });
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inPhone'), "itemName": this.utilityService.translate('send_data.inPhone') });
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.scenariosDetail.push({ "id": "", "itemName": this.utilityService.translate('scenarios.scenariosDetailOne') });
    this.scenariosDetail.push({ "id": "", "itemName": this.utilityService.translate('scenarios.scenariosDetailTwo') });
    this.scenariosDetail.push({ "id": "", "itemName": this.utilityService.translate('scenarios.scenariosDetailThree') });
    this.getAccountLogin();
    if (this.activatedRoute.snapshot.queryParamMap.get('status') != null && this.activatedRoute.snapshot.queryParamMap.get('status') != "") {
      this.active = this.activatedRoute.snapshot.queryParamMap.get('status');
    } else if (this.activatedRoute.snapshot.queryParamMap.get('statusold') != null && this.activatedRoute.snapshot.queryParamMap.get('statusold') != "") {
      this.active = this.activatedRoute.snapshot.queryParamMap.get('statusold');
    } else {
      this.active = "";
    }

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
    setTimeout(() => {
      this.getDataAccount();
    }, 1000);
    this.bindDataStatus();
    this.getDataPackage();
    setTimeout(() => {
      this.getData();
    }, 1000);
  }

  async getDataAccount() {
    if (this.isAdmin) {
      this.selectedAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
      let response: any = await this.dataService.getAsync('/api/account')
      if (response) {
        for (let index in response.data) {
          this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
        }
      }

    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      if (response) {
        for (let index in response.data) {
          this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
        }
      }
      if (this.dataAccount.length == 1) {
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }
  changeAccount() {
    this.getDataSenderName();
    this.getDataCimastAdd();

  }
  deSelectAccount() {
    this.getData();
  }

  ChangeDropdownList() {
    this.getData();
  }

  // get data package
  async getDataPackage() {
    this.selectedPackage = [];
    this.dataPackage = [];
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageDomainPaging?pageIndex=1&pageSize=9999&package_name=')
    if (response) {
      if (response.err_code == 0) {
        for (let index in response.data) {
          this.dataPackage.push({ "id": response.data[index].ID, "itemName": response.data[index].DATA + "MB" });
        }
        if (this.dataPackage.length == 1)
          this.selectedPackage.push({ "id": this.dataPackage[0].id, "itemName": this.dataPackage[0].itemName });
      }
    }
  }
  //#region load data
  async getData() {
    let account = "";
    if (this.isAdmin)
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    else
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    // let account = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    let isactive = this.selectedStatus.length > 0 && this.selectedStatus[0].id != "" ? this.selectedStatus[0].id : this.active;

    let response: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&code=" + this.inCodeScenar +
      "&name=" + this.inNameScenar + "&active=" + isactive)
    if (response) {
      if (response.err_code == 0) {
        this.loadData(response);
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].IS_ACTIVE == 1) {
            this.isCreatelink[response.data[i].ID] = true;
          }
          else {
            this.isCreatelink[response.data[i].ID] = false;

          }
        }
      }
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataScenarios = response.data;
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
    this.isAdded = false;
    this.isEdit = false;
    this.getDataPackageVTL();
    this.getDataPackageGPC();
    this.getDataPackageVMS();
    if (this.checkSendSms) {
      this.getDataSenderName();
    }
    this.isHidden = true;
    if (this.authService.currentUserValue.AVATAR == null || this.authService.currentUserValue.AVATAR == "") {
      this.urlImageUpload = "../../assets/img/logo-login.png";
    } else {
      this.urlImageUpload = this.authService.currentUserValue.AVATAR;
    }
    this.uploadImage.nativeElement.value = "";
    this.showModalCreate.show();
    this.settingsFilterAccountAdd = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false,
      disabled: false
    };
    this.settingsFilterScenariosAdd = {
      text: this.utilityService.translate('global.choose_scenarios_type'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false,
      disabled: false
    };

  }

  //#region create new
  async createScenarios(item) {
    let scenar = item.value;
    let combobox = item.controls;
    let SENDER_NAME = "";
    let SCENARIO_TYPE = "";
    if (combobox.slAccount.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }

    let ACCOUNT_ID = combobox.slAccount.value[0].id;
    let CODE = scenar.code;
    this.codetrim = CODE;
    if (CODE == "" || CODE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-92"));
      return;
    }
    let NAME = scenar.name;
    if (NAME == "" || NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-93"));
      return;
    }
    let URL_POSTER = (this.urlImageUpload != null && this.urlImageUpload != "undefined" && this.urlImageUpload != "") ? this.urlImageUpload : ""
    if (combobox.slScenarioType.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("139"));
      return;
    }
    this.scenario_type = combobox.slScenarioType.value[0].itemName;
    SCENARIO_TYPE = this.scenario_type;
    if (SCENARIO_TYPE.toUpperCase() == "kịch bản popup") {
      this.isScPopup = false;
    } else {
      this.isScPopup = false;
    }
    let DESC_CONTENT = scenar.content;
    if (DESC_CONTENT == "" || DESC_CONTENT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("141"));
      return;
    }
    let SMS_CONTENT = ""
    if ((scenar.contentsms == "" || scenar.contentsms == null) && this.checkSendSms == true) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      return;
    }
    else {
      SMS_CONTENT = scenar.contentsms;
    }
    let START_DATE = scenar.startDate;
    let END_DATE = scenar.endDate;
    if (START_DATE != '' && START_DATE != null && END_DATE != '' && END_DATE != null) {
      let fromDate = this.utilityService.formatDateTempalte(START_DATE.toString());
      let toDate = this.utilityService.formatDateTempalte(END_DATE.toString());
      if (fromDate > toDate) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
        return;
      }
    }
    START_DATE = this.utilityService.formatDateToString(START_DATE, "yyyyMMdd") + "000000";
    END_DATE = this.utilityService.formatDateToString(END_DATE, "yyyyMMdd") + "235959";
    let IS_ACTIVE = this.checkActive == true ? 1 : 0;
    let IS_SEND_SMS = this.checkSendSms == true ? 1 : 0;
    let IS_ACCUMULATE_POINT = this.isCheckAccumulatePoint == true ? 1 : 0;
    let REWARD_NUMBER_ONE_TIME = 0;
    if (scenar.checkRewardOneTime == null || scenar.checkRewardOneTime == "") {
      REWARD_NUMBER_ONE_TIME = 1;
    } else {
      REWARD_NUMBER_ONE_TIME = Number(scenar.checkRewardOneTime);
    }
    let REWARD_NUMBER_TIME_IN_DAYS = parseInt(scenar.RewardOneTimeInDay);
    if (this.checkSendSms == true) {
      if (combobox.slSenderName.value.length == 0) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-104"));
        return;
      } else {
        SENDER_NAME = combobox.slSenderName.value[0].itemName;
      }
    } else {
      SENDER_NAME = "";
    }

    let LIMIT_USE_MAX = scenar.limitUse;
    if (LIMIT_USE_MAX == null || LIMIT_USE_MAX == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-115"));
      return
    }
    let response: any = await this.dataService.postAsync('/api/Scenarios', {
      ACCOUNT_ID, CODE, NAME, DESC_CONTENT, START_DATE, END_DATE, IS_ACTIVE, IS_ACCUMULATE_POINT, IS_SEND_SMS, SCENARIO_TYPE
      , REWARD_NUMBER_ONE_TIME,
      REWARD_NUMBER_TIME_IN_DAYS, SMS_CONTENT, URL_POSTER, SENDER_NAME, LIMIT_USE_MAX
    })
    if (response) {
      if (response.err_code == 0) {
        //item.reset();
        this.getData();
        this.scenarioId = response.data[0].ID;
        this.isAdded = true;
        this.isHiddencheckSms = true;
        this.isHiddencheckOne = true;
        //this.showModalCreate.hide();
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
        this.isHidden = false;
        this.settingsFilterAccountAdd = {
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
      else if (response.err_code == -114) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-114"));
        this.isHidden = true;
        this.isHiddencheckOne = false;
        this.isHiddencheckSms = false;
        this.settingsFilterAccountAdd = {
          text: this.utilityService.translate('global.choose_account'),
          singleSelection: true,
          enableSearchFilter: true,
          enableFilterSelectAll: true,
          searchPlaceholderText: this.utilityService.translate('global.search'),
          noDataLabel: this.utilityService.translate('global.no_data'),
          showCheckbox: false,
          disabled: false
        };
        return
      } else if (response.err_code == -19) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-19"));
        this.isHidden = true;
        this.isHiddencheckOne = false;
        this.isHiddencheckSms = false;
        this.settingsFilterAccountAdd = {
          text: this.utilityService.translate('global.choose_account'),
          singleSelection: true,
          enableSearchFilter: true,
          enableFilterSelectAll: true,
          searchPlaceholderText: this.utilityService.translate('global.search'),
          noDataLabel: this.utilityService.translate('global.no_data'),
          showCheckbox: false,
          disabled: false
        };
        return
      } else if (response.err_code == -202) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-202"));
        return;
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        this.settingsFilterAccountAdd = {
          text: this.utilityService.translate('global.choose_account'),
          singleSelection: true,
          enableSearchFilter: true,
          enableFilterSelectAll: true,
          searchPlaceholderText: this.utilityService.translate('global.search'),
          noDataLabel: this.utilityService.translate('global.no_data'),
          showCheckbox: false,
          disabled: false
        };
        this.isHidden = true;
        this.isHiddencheckOne = false;
        this.isHiddencheckSms = false;
        return
      }
    }


  }
  //#endregion

  // show update modal
  async confirmUpdateModal(id) {
    this.selectedOptionInsertEdit = [];
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
    this.isEdit = true;
    let account_id;
    let checkSendSms;
    let response: any = await this.dataService.getAsync('/api/Scenarios/' + id);
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      account_id = dataDetail.ACCOUNT_ID;
      checkSendSms = dataDetail.IS_SEND_SMS;
      this.formEditScenarios = new FormGroup({
        id: new FormControl(id),
        account: new FormControl(dataDetail.ACCOUNT_ID != "" && dataDetail.ACCOUNT_ID != null ? [{ "id": dataDetail.ACCOUNT_ID, "itemName": dataDetail.USER_NAME }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }]),
        code: new FormControl(dataDetail.CODE),
        name: new FormControl(dataDetail.NAME),
        content: new FormControl(dataDetail.DESC_CONTENT),
        url_poster: new FormControl(dataDetail.URL_POSTER),
        slScenarioType: new FormControl(dataDetail.SCENARIO_TYPE != "" && dataDetail.SCENARIO_TYPE != null ? [{ "id": dataDetail.SCENARIO_TYPE, "itemName": dataDetail.SCENARIO_TYPE }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_scenarios_type') }]),
        startDate: new FormControl(dataDetail.START_DATE),
        checkRewardOneTime: new FormControl(dataDetail.REWARD_NUMBER_ONE_TIME == 0 ? parseInt("") : dataDetail.REWARD_NUMBER_ONE_TIME),
        RewardOneTimeInDay: new FormControl(dataDetail.REWARD_NUMBER_TIME_IN_DAYS == 0 ? parseInt("") : dataDetail.REWARD_NUMBER_TIME_IN_DAYS),
        checkSendSms: new FormControl(dataDetail.IS_SEND_SMS),
        contentsms: new FormControl(dataDetail.SMS_CONTENT),
        endDate: new FormControl(dataDetail.END_DATE),
        isActive: new FormControl(dataDetail.IS_ACTIVE),
        slSenderName: new FormControl(dataDetail.SENDER_NAME != "" && dataDetail.SENDER_NAME != null ? [{ "id": dataDetail.SENDER_NAME, "itemName": dataDetail.SENDER_NAME }]
          : [{ "id": "", "itemName": this.utilityService.translate('package.choose_sender') }]),
        isCheckAccumulatePoint: new FormControl(dataDetail.IS_ACCUMULATE_POINT),
        limitUseEdit: new FormControl(dataDetail.LIMIT_USE_MAX),
        totalUseEdit: new FormControl(0),
        slOptionInsert: new FormControl([{ "id": "", "itemName": this.utilityService.translate('send_data.option_insert') }]),
      });
      if (checkSendSms == 0) {
        this.checkSendSmsEdit = false;
      } else {
        this.checkSendSmsEdit = true;
      }
      this.componentScenariosDetail.scenarioId = id;
      this.componentScenariosDetail.quantityGPC = 1;
      this.componentScenariosDetail.quantityVMS = 1;
      this.componentScenariosDetail.quantityVTL = 1;
      this.componentScenariosDetail.getData();
      this.getDataCimastEdit(account_id);
      if (response.data[0].URL_POSTER == null || response.data[0].URL_POSTER == "") {
        this.urlImageUploadEdit = "../../assets/img/logo-login.png";
      } else {
        this.urlImageUploadEdit = response.data[0].URL_POSTER;
      }
      this.uploadImageEdit.nativeElement.value = "";
      this.showModalUpdate.show();

    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update tin mẫu
  async editScenarios() {
    let formData = this.formEditScenarios.controls;
    let ID = formData.id.value;
    if (formData.account.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = formData.account.value[0].id;
    if (formData.slScenarioType.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("139"));
      return;
    }
    this.scenario_type = formData.slScenarioType.value[0].itemName;
    let SCENARIO_TYPE = this.scenario_type;

    // let URL_POSTER = formData.url_poster.value;
    let URL_POSTER = (this.urlImageUploadEdit != null && this.urlImageUploadEdit != "undefined" && this.urlImageUploadEdit != "") ?
      this.urlImageUploadEdit : ""
    let CODE = formData.code.value;
    if (CODE == "" || CODE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-92"));
      return;
    }

    let NAME = formData.name.value;
    if (NAME == "" || NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-93"));
      return;
    }
    
    let SENDER_NAME = "";
    if(this.checkSendSms){
      if(formData.slSenderName.value.length > 0){
        SENDER_NAME = formData.slSenderName.value[0].itemName;
      }else{
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-104"));
        return;
      }
    }

    let DESC_CONTENT = formData.content.value;
    if (DESC_CONTENT == "" || DESC_CONTENT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      return;
    }
    let SMS_CONTENT = formData.contentsms.value;
    if ((SMS_CONTENT == "" || SMS_CONTENT == null) && this.checkSendSms == true) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      return;
    }
    let START_DATE = formData.startDate.value;
    let END_DATE = formData.endDate.value;
    if (START_DATE != '' && START_DATE != null && END_DATE != '' && END_DATE != null) {
      let fromDate = this.utilityService.formatDateTempalte(START_DATE.toString());
      let toDate = this.utilityService.formatDateTempalte(END_DATE.toString());
      if (fromDate > toDate) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
        return;
      }
    }
    START_DATE = this.utilityService.formatDateToString(START_DATE, "yyyyMMddHHmmss");
    END_DATE = this.utilityService.formatDateToString(END_DATE, "yyyyMMdd") + "235959";

    let IS_ACTIVE = formData.isActive.value == true ? 1 : 0;
    let IS_ACCUMULATE_POINT = formData.isCheckAccumulatePoint.value == true ? 1 : 0;
    let IS_SEND_SMS = formData.checkSendSms.value == true ? 1 : 0;
    let REWARD_NUMBER_ONE_TIME = parseInt(formData.checkRewardOneTime.value);
    let REWARD_NUMBER_TIME_IN_DAYS = parseInt(formData.RewardOneTimeInDay.value);
    let LIMIT_USE_MAX;
    if (formData.limitUseEdit.value == null || formData.limitUseEdit.value == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-115"));
      return
    } else {
      LIMIT_USE_MAX = formData.limitUseEdit.value;
    }
    let response: any = await this.dataService.putAsync('/api/Scenarios/' + ID, {
      ACCOUNT_ID, NAME, DESC_CONTENT, START_DATE, END_DATE, IS_ACTIVE, IS_ACCUMULATE_POINT,
      IS_SEND_SMS, SCENARIO_TYPE, REWARD_NUMBER_ONE_TIME, REWARD_NUMBER_TIME_IN_DAYS, SENDER_NAME, SMS_CONTENT, URL_POSTER, LIMIT_USE_MAX
    })
    if (response) {
      if (response.err_code == 0) {
        this.selectedStatus = [];
        this.showModalUpdate.hide();
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
        this.getData();
      } else if (response.err_code == -114) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-114"));
        return
      }
      else if (response.err_code == 103) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-103"));
        return
      }
      else if (response.err_code == -19) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
        return
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      }
    }
  }

  showConfirmDelete(id, name) {
    this.id = id;
    this.name = name;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/Scenarios/' + id)
    if (response.err_code == 0) {
      this.getData();
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  //#region scenario detail  
  // get data package viettel
  async getDataPackageVTL() {
    this.dataPackageVTL = [];
    this.selectedPackageVTL = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VIETTEL' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }

  }

  // get data package vina
  async getDataPackageGPC() {
    this.dataPackageGPC = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=GPC' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageGPC.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }

  }

  // get data package mobi
  async getDataPackageVMS() {
    this.dataPackageVMS = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VMS' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageVMS.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }

  }

  //#region load data
  async getDataDetail() {
    let response: any = await this.dataService.getAsync('/api/ScenariosDetail/GetScenariosDetailPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&scenario_id=" + this.scenarioId)
    this.loadDataDetail(response);
  }

  loadDataDetail(response?: any) {
    if (response) {
      this.dataScenarioDetail = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
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
    this.getDataDetail();
  }

  pageChangedDetail(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSizeDetail(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataDetail();
  }
  //#endregion

  //#region create new
  async createScenariosDetail(item) {
    let scenar = item.value;
    let combobox = item.controls;
    let SCENARIO_ID = this.scenarioId;
    let VALUE = scenar.valueScenar;
    if (this.scenario_type != this.utilityService.translate('scenarios.scenariosDetailTwo')) {
      if (VALUE == "" || VALUE == null) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
        return;
      }
    }

    if (combobox.packageVTL.value.length == 0 && combobox.packageGPC.value.length == 0 && combobox.packageVMS.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let PACKAGE_ID_VIETTEL = combobox.packageVTL.value.length > 0 && combobox.packageVTL.value[0].id != "" ? combobox.packageVTL.value[0].id : null;
    let PACKAGE_ID_VINAPHONE = combobox.packageGPC.value.length > 0 && combobox.packageGPC.value[0].id != "" ? combobox.packageGPC.value[0].id : null;
    let PACKAGE_ID_MOBIFONE = combobox.packageVMS.value.length > 0 && combobox.packageVMS.value[0].id != "" ? combobox.packageVMS.value[0].id : null;
    let PACKAGE_QUANTITY_VIETTEL = scenar.quantityVTL != "" && scenar.quantityVTL != "" ? scenar.quantityVTL : 1;
    let PACKAGE_QUANTITY_VINAPHONE = scenar.quantityGPC != "" && scenar.quantityGPC != "" ? scenar.quantityGPC : 1;
    let PACKAGE_QUANTITY_MOBIFONE = scenar.quantityVMS != "" && scenar.quantityVMS != "" ? scenar.quantityVMS : 1;

    let response: any = await this.dataService.postAsync('/api/ScenariosDetail', {
      SCENARIO_ID, VALUE, PACKAGE_ID_VIETTEL, PACKAGE_ID_VINAPHONE, PACKAGE_ID_MOBIFONE, PACKAGE_QUANTITY_VIETTEL, PACKAGE_QUANTITY_VINAPHONE, PACKAGE_QUANTITY_MOBIFONE
    })
    if (response.err_code == 0) {
      item.reset();
      this.getDataDetail();
      this.showModalCreateDetail.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
      if (this.scenario_type == this.utilityService.translate('scenarios.scenariosDetailTwo')) {
        this.isscenario = true;
      }
    }
    else if (response.err_code == -19) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-19"));
      this.isscenario = false;
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      this.isscenario = false;
    }
  }
  //#endregion

  // show update modal
  async confirmUpdateModalDetail(id) {
    let response: any = await this.dataService.getAsync('/api/ScenariosDetail/' + id)
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      this.formEditScenariosDetail = new FormGroup({
        id: new FormControl(id),
        valueScenar: new FormControl(dataDetail.VALUE),
        packageVTL: new FormControl(dataDetail.PACKAGE_ID_VIETTEL != "" && dataDetail.PACKAGE_ID_VIETTEL != null ? [{ "id": dataDetail.PACKAGE_ID_VIETTEL, "itemName": dataDetail.PACKAGE_NAME_VIETTEL }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        packageGPC: new FormControl(dataDetail.PACKAGE_ID_VINAPHONE != "" && dataDetail.PACKAGE_ID_VINAPHONE != null ? [{ "id": dataDetail.PACKAGE_ID_VINAPHONE, "itemName": dataDetail.PACKAGE_NAME_VINAPHONE }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        packageVMS: new FormControl(dataDetail.PACKAGE_ID_MOBIFONE != "" && dataDetail.PACKAGE_ID_MOBIFONE != null ? [{ "id": dataDetail.PACKAGE_ID_MOBIFONE, "itemName": dataDetail.PACKAGE_NAME_MOBIFONE }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        quantityVTL: new FormControl(dataDetail.PACKAGE_QUANTITY_VIETTEL),
        quantityGPC: new FormControl(dataDetail.PACKAGE_QUANTITY_VINAPHONE),
        quantityVMS: new FormControl(dataDetail.PACKAGE_QUANTITY_MOBIFONE),
        packageAmtVTL: new FormControl(dataDetail.AMT_VIETTEL),
        packageAmtGPC: new FormControl(dataDetail.AMT_VINAPHONE),
        packageAmtVMS: new FormControl(dataDetail.AMT_MOBIFONE)
      });
      this.showModalUpdateDetail.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update chi tiet kich ban
  async editScenariosDetail() {
    let formData = this.formEditScenariosDetail.controls;
    let ID = formData.id.value;
    let SCENARIO_ID = this.scenarioId;
    let VALUE = formData.valueScenar.value.toString();
    if (this.scenario_type != this.utilityService.translate('scenarios.scenariosDetailTwo')) {
      if (VALUE == "" || VALUE == null) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
        return;
      }
    }

    if (formData.packageVTL.value.length == 0 && formData.packageGPC.value.length == 0 && formData.packageVMS.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let PACKAGE_ID_VIETTEL = formData.packageVTL.value.length > 0 && formData.packageVTL.value[0].id != "" ? formData.packageVTL.value[0].id : null;
    let PACKAGE_ID_VINAPHONE = formData.packageGPC.value.length > 0 && formData.packageGPC.value[0].id != "" ? formData.packageGPC.value[0].id : null;
    let PACKAGE_ID_MOBIFONE = formData.packageVMS.value.length > 0 && formData.packageVMS.value[0].id != "" ? formData.packageVMS.value[0].id : null;
    let PACKAGE_QUANTITY_VIETTEL = formData.quantityVTL.value != "" && formData.quantityVTL.value != null ? formData.quantityVTL.value : 0;
    let PACKAGE_QUANTITY_VINAPHONE = formData.quantityGPC.value != "" && formData.quantityGPC.value != null ? formData.quantityGPC.value : 0;
    let PACKAGE_QUANTITY_MOBIFONE = formData.quantityVMS.value != "" && formData.quantityVMS.value != null ? formData.quantityVMS.value : 0;

    let response: any = await this.dataService.putAsync('/api/ScenariosDetail/' + ID, {
      SCENARIO_ID, VALUE, PACKAGE_ID_VIETTEL, PACKAGE_ID_VINAPHONE, PACKAGE_ID_MOBIFONE, PACKAGE_QUANTITY_VIETTEL, PACKAGE_QUANTITY_VINAPHONE, PACKAGE_QUANTITY_MOBIFONE
    })
    if (response.err_code == 0) {
      this.showModalUpdateDetail.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getDataDetail();
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-103"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  showConfirmDeleteDetail(id, name) {
    this.idDetail = id;
    this.nameDetail = name;
    this.confirmDeleteModalDetail.show();
  }


  // delete
  async confirmDeleteDetail(id) {
    let response: any = await this.dataService.deleteAsync('/api/ScenariosDetail/' + id)
    if (response.err_code == 0) {
      this.getDataDetail();
      this.confirmDeleteModalDetail.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  async oncheckActive(isCheckActive) {
    if (isCheckActive) {
      this.checkActive = true;
    } else {
      this.checkActive = false;
    }
  }
  async onisCheckAccumulatePoint() {
    this.isCheckAccumulatePoint = !this.isCheckAccumulatePoint;
  }

  oncheckSendSms() {
    if (this.checkSendSms == false) {
      this.checkSendSms = true;
      this.isHiddencheckSms = false;
      this.isHiddenSen = false;
      this.checkSendSmsEdit = true;
      this.contentSMS.nativeElement.readOnly = false;
      this.getDataSenderName();
    } else {
      this.checkSendSms = false;
      this.isHiddencheckSms = true;
      this.isHiddenSen = true;
      this.checkSendSmsEdit = false;
      this.contentSMS.nativeElement.readOnly = true;
    }
  }

  //#region upload avatar
  public async submitUploadImage() {
    let file = this.uploadImage.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.postFileAsync(null, file.files);
      if (response) {
        this.urlImageUpload = AppConst.DATA_SPONSOR_API + response.data;
      }
      else {
        this.notificationService.displayErrorMessage("Upload ảnh không thành công");
      }
    }
  }

  //get data sender
  async getDataSenderName() {
    if (!this.isEdit) {
      this.selectedItemComboboxSender = [];
      this.dataSenderName = [];
      let accountID = this.selectedItemComboboxAccountCreate.length > 0 && this.selectedItemComboboxAccountCreate[0].id != "" ? this.selectedItemComboboxAccountCreate[0].id : "";
      let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
        accountID)
      for (let index in response.data) {
        this.dataSenderName.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
      }
      if (this.dataSenderName.length == 1)
        this.selectedItemComboboxSender.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
    } else {
      this.selectedItemComboboxSenderEdit = [];
      this.dataSenderName = [];
      let formData = this.formEditScenarios.controls;

      let accountID = formData.account.value.length > 0 ? formData.account.value[0].id : "";
      let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
        accountID)
      for (let index in response.data) {
        this.dataSenderName.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
      }
      if (this.dataSenderName.length == 1)
        this.selectedItemComboboxSenderEdit.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
    }

  }

  public async submitUploadImageEdit() {
    let file = this.uploadImageEdit.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.postFileAsync(null, file.files);
      if (response) {
        this.urlImageUploadEdit = AppConst.DATA_SPONSOR_API + response.data;
      }
      else {
        this.notificationService.displayErrorMessage("Upload ảnh không thành công");
      }
    }
  }

  removeImage() {
    this.urlImageUploadEdit = ""
  }
  showDetailScenario() {

  }

  async getSendID(Id) {
    this.Idsend = Id;
    this.getScenarioById();
  }
  async getScenarioById() {
    let response: any = await this.dataService.getAsync('/api/Scenarios/' + this.Idsend)
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      this.Account_Id_SMS = dataDetail.ACCOUNT_ID;
      this.Scenario_Id_SMS = dataDetail.ID;

    }
  }
  async getDataCimastAdd() {
    let account = "";
    if (this.isAdmin)
      account = this.selectedItemComboboxAccountCreate.length != 0 && this.selectedItemComboboxAccountCreate[0].id != "" ? this.selectedItemComboboxAccountCreate[0].id : 0;
    else
      account = this.selectedItemComboboxAccountCreate.length != 0 && this.selectedItemComboboxAccountCreate[0].id != "" ? this.selectedItemComboboxAccountCreate[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/Scenarios/GetDataCimast?account_id=' + account);
    if (response != null && response.data.length > 0) {
      this.totalUse = Math.round(response.data[0].TOTAL_USE);
    }
  }


  //option insert
  changeOptionInsert() {
    this.contentSMS.nativeElement.focus();
    let startString = this.contentSMS.nativeElement.value.substr(0, this.contentSMS.nativeElement.selectionStart);
    let endString = this.contentSMS.nativeElement.value.substr(this.contentSMS.nativeElement.selectionStart, this.contentSMS.nativeElement.value.length);
    this.contentsms = startString.trim() + this.selectedOptionInsert[0].id + endString.trim();
    this.contentSMS.nativeElement.focus();
  }

  async getDataCimastEdit(account_id) {
    let response: any = await this.dataService.getAsync('/api/Scenarios/GetDataCimast?account_id=' + account_id);
    if (response != null && response.data.length > 0) {
      this.totalUseEdit = Number(Math.round(response.data[0].TOTAL_USE)).toLocaleString('en-GB');
    }
  }
  async changePackageVTL() {
    if (this.selectedPackageVTL.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageTelcoById?id=' + this.selectedPackageVTL[0].id);
      if (response != null && response.err_code == 0) {
        this.packageAmtVTL = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
      }
    }
    else
      this.packageAmtVTL = 0;
  }
  async changePackageGPC() {
    if (this.selectedPackageGPC.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageTelcoById?id=' + this.selectedPackageGPC[0].id);
      if (response != null && response.err_code == 0) {
        this.packageAmtGPC = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
      }
    }
    else
      this.packageAmtGPC = 0;
  }
  async changePackageVMS() {
    if (this.selectedPackageVMS.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageTelcoById?id=' + this.selectedPackageVMS[0].id);
      if (response != null && response.err_code == 0) {
        this.packageAmtVMS = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
      }
    }
    else
      this.packageAmtVMS = 0;
  }
}
