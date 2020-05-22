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

  public dataScenarios = [];
  public dataScenarioDetail = [];
  public pagination: Pagination = new Pagination();
  public idDetail;
  public nameDetail;
  public scenarioId = "";
  public quantityVTL = 1;
  public quantityGPC = 1;
  public quantityVMS = 1;
  public id;
  public name;
  public inCodeScenar: string = '';
  public inNameScenar: string = '';
  public formEditScenarios: FormGroup;
  public formEditScenariosDetail: FormGroup;
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public isAdded: boolean = false;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public checkActive = true;
  public isCheckAccumulatePoint = false;
  public dataStatus = [];
  public dataAccount = [];
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
  public selectedAccount = [];
  public settingsFilterPackage = {};
  public selectedPackage = [];
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxAccountEdit = [];
  public selectedItemComboboxAccountCreate = [];

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
      content: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      isActive: new FormControl(),
      isCheckAccumulatePoint: new FormControl()
    });

    this.formEditScenariosDetail = new FormGroup({
      id: new FormControl(),
      valueScenar: new FormControl(),
      packageVTL: new FormControl(),
      packageGPC: new FormControl(),
      packageVMS: new FormControl(),
      quantityVTL: new FormControl(),
      quantityGPC: new FormControl(),
      quantityVMS: new FormControl()
    });
  }

  ngOnInit() {
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
    this.bindDataStatus();
    this.getDataPackage();
    this.getData();
  }

  async getDataAccount() {
    if (this.isAdmin) {
      this.selectedAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
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
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }

  ChangeDropdownList(){
    this.getData();
  }

  // get data package
  async getDataPackage() {
    this.selectedPackage = [];
    this.dataPackage = [];
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageDomainPaging?pageIndex=1&pageSize=9999&package_name=')
    for (let index in response.data) {
      this.dataPackage.push({ "id": response.data[index].ID, "itemName": response.data[index].DATA + "MB" });
    }
    if (this.dataPackage.length == 1)
      this.selectedPackage.push({ "id": this.dataPackage[0].id, "itemName": this.dataPackage[0].itemName });
  }

  //#region load data
  async getData() {
    let account = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    let active = this.selectedStatus.length > 0 && this.selectedStatus[0].id != "" ? this.selectedStatus[0].id : "";
    let response: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&code=" + this.inCodeScenar +
      "&name=" + this.inNameScenar + "&active=" + active)
    this.loadData(response);
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

  confirmShowModalCreate(){
    this.isAdded = false;
    this.getDataPackageVTL();
    this.getDataPackageGPC();
    this.getDataPackageVMS();
    this.showModalCreate.show();
  }

  //#region create new
  async createScenarios(item) {
    let scenar = item.value;
    let combobox = item.controls;
    if (combobox.slAccount.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.slAccount.value[0].id;
    let CODE = scenar.code;
    if (CODE == "" || CODE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-92"));
      return;
    }
    let NAME = scenar.name;
    if (NAME == "" || NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-93"));
      return;
    }
    let CONTENT = scenar.content;
    if (CONTENT == "" || CONTENT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
      return;
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
    START_DATE = this.utilityService.formatDateToString(START_DATE, "yyyyMMddHHmmss");
    END_DATE = this.utilityService.formatDateToString(END_DATE, "yyyyMMddHHmmss");
    let IS_ACTIVE = this.checkActive == true ? 1 : 0;
    let IS_ACCUMULATE_POINT = this.isCheckAccumulatePoint == true ? 1 : 0;

    let response: any = await this.dataService.postAsync('/api/Scenarios', {
      ACCOUNT_ID, CODE, NAME, CONTENT, START_DATE, END_DATE, IS_ACTIVE, IS_ACCUMULATE_POINT
    })
    if (response.err_code == 0) {
      //item.reset();
      this.getData();
      this.scenarioId = response.data[0].ID;
      this.isAdded = true;
      //this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/Scenarios/' + id)
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      this.formEditScenarios = new FormGroup({
        id: new FormControl(id),
        account: new FormControl(dataDetail.ACCOUNT_ID != "" && dataDetail.ACCOUNT_ID != null ? [{ "id": dataDetail.ACCOUNT_ID, "itemName": dataDetail.USER_NAME }]
          : this.utilityService.translate('global.choose_account')),
        code: new FormControl(dataDetail.CODE),
        name: new FormControl(dataDetail.NAME),
        content: new FormControl(dataDetail.CONTENT),
        startDate: new FormControl(dataDetail.START_DATE),
        endDate: new FormControl(dataDetail.END_DATE),
        isActive: new FormControl(dataDetail.IS_ACTIVE),
        isCheckAccumulatePoint: new FormControl(dataDetail.IS_ACCUMULATE_POINT)
      });
      this.componentScenariosDetail.scenarioId = id;
      this.componentScenariosDetail.getData();
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
    let CONTENT = formData.content.value;
    if (CONTENT == "" || CONTENT == null) {
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
    END_DATE = this.utilityService.formatDateToString(END_DATE, "yyyyMMddHHmmss");
    let IS_ACTIVE = formData.isActive.value == true ? 1 : 0;
    let IS_ACCUMULATE_POINT = formData.isCheckAccumulatePoint.value == true ? 1 : 0;

    let response: any = await this.dataService.putAsync('/api/Scenarios/' + ID, {
      ACCOUNT_ID, CODE, NAME, CONTENT, START_DATE, END_DATE, IS_ACTIVE, IS_ACCUMULATE_POINT
    })
    if (response.err_code == 0) {
      this.selectedStatus = [];
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getData();
    }
    else if (response.err_code == 103) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-103"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
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
      this.notificationService.displaySuccessMessage(response.err_message);
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
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VIETTEL')
    for (let index in response.data) {
      this.dataPackageVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVTL.length == 1)
      this.selectedPackageVTL.push({ "id": this.dataPackageVTL[0].id, "itemName": this.dataPackageVTL[0].itemName });
  }

  // get data package vina
  async getDataPackageGPC() {
    this.dataPackageGPC = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=GPC')
    for (let index in response.data) {
      this.dataPackageGPC.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageGPC.length == 1)
      this.selectedPackageGPC.push({ "id": this.dataPackageGPC[0].id, "itemName": this.dataPackageGPC[0].itemName });
  }

  // get data package mobi
  async getDataPackageVMS() {
    this.dataPackageVMS = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VMS')
    for (let index in response.data) {
      this.dataPackageVMS.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVMS.length == 1)
      this.selectedPackageVMS.push({ "id": this.dataPackageVMS[0].id, "itemName": this.dataPackageVMS[0].itemName });
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
    let VALUE = scenar.valueScenar.toString();
    if (VALUE == "" || VALUE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
      return;
    }
    if (combobox.packageVTL.value.length == 0 && combobox.packageGPC.value.length == 0 && combobox.packageVMS.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let PACKAGE_ID_VIETTEL = combobox.packageVTL.value.length > 0 && combobox.packageVTL.value[0].id != "" ? combobox.packageVTL.value[0].id : null;
    let PACKAGE_ID_VINAPHONE = combobox.packageGPC.value.length > 0 && combobox.packageGPC.value[0].id != "" ? combobox.packageGPC.value[0].id : null;
    let PACKAGE_ID_MOBIFONE = combobox.packageVMS.value.length > 0 && combobox.packageVMS.value[0].id != "" ? combobox.packageVMS.value[0].id : null;
    let PACKAGE_QUANTITY_VIETTEL = scenar.quantityVTL != "" && scenar.quantityVTL != "" ? scenar.quantityVTL : 0;
    let PACKAGE_QUANTITY_VINAPHONE = scenar.quantityGPC != "" && scenar.quantityGPC != "" ? scenar.quantityGPC : 0;
    let PACKAGE_QUANTITY_MOBIFONE = scenar.quantityVMS != "" && scenar.quantityVMS != "" ? scenar.quantityVMS : 0;

    let response: any = await this.dataService.postAsync('/api/ScenariosDetail', {
      SCENARIO_ID, VALUE, PACKAGE_ID_VIETTEL, PACKAGE_ID_VINAPHONE, PACKAGE_ID_MOBIFONE, PACKAGE_QUANTITY_VIETTEL, PACKAGE_QUANTITY_VINAPHONE, PACKAGE_QUANTITY_MOBIFONE
    })
    if (response.err_code == 0) {
      item.reset();
      this.getDataDetail();
      this.showModalCreateDetail.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
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
        quantityVMS: new FormControl(dataDetail.PACKAGE_QUANTITY_MOBIFONE)
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
    if (VALUE == "" || VALUE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
      return;
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
      this.notificationService.displaySuccessMessage(response.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  //#endregion
}
