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

@Component({
  selector: 'app-scenarios-detail',
  templateUrl: './scenarios-detail.component.html',
  styleUrls: ['./scenarios-detail.component.css']
})
export class ScenariosDetailComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataScenarioDetail = [];
  public pagination: Pagination = new Pagination();
  public id;
  public name;
  public formEditScenarios: FormGroup;
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public loading: boolean = true;

  public dataScenarios = [];
  public dataScenariosCreate = [];
  public dataScenariosEdit = [];
  public dataPackage = [];
  public dataAccount = [];
  public settingsFilterAccount = {};
  public selectedAccount = [];
  public settingsFilterScenarios = {};
  public selectedScenarios = [];
  public settingsFilterPackage = {};
  public selectedPackage = [];
  public selectedScenariosEdit = [];
  public selectedScenariosCreate = [];
  public selectedAccountEdit = [];
  public selectedAccountCreate = [];

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

    this.settingsFilterScenarios = {
      text: this.utilityService.translate('scenarios-detail.inScenario'),
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

    this.formEditScenarios = new FormGroup({
      id: new FormControl(),
      accountEdit: new FormControl(),
      scenariosEdit: new FormControl(),
      valueScenar: new FormControl(),
      package: new FormControl()
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
    this.getDataPackage();
    this.getData();
  }

  // get account
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

  OnSelectAccount() {
    this.getScenarios();
  }

  async getScenarios() {
    this.selectedScenarios = [];
    this.dataScenarios = [];
    let accountId = this.selectedAccount.length > 0 ? this.selectedAccount[0].id : 0;
    let response: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosByAccount?account_id=' + accountId)
    for (let index in response.data) {
      this.dataScenarios.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
    if (this.dataScenarios.length == 1)
      this.selectedScenarios.push({ "id": this.dataScenarios[0].id, "itemName": this.dataScenarios[0].itemName });
    this.getData();
  }

  // get data package
  async getDataPackage() {
    this.selectedPackage = [];
    this.dataPackage = [];
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageDomainPaging?pageIndex=1&pageSize=9999&package_name=')
    for (let index in response.data) {
      this.dataPackage.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME });
    }
    if (this.dataPackage.length == 1)
      this.selectedPackage.push({ "id": this.dataPackage[0].id, "itemName": this.dataPackage[0].itemName });
  }

  ChangeDropdownList() {
    this.getData();
  }

  //#region load data
  async getData() {
    let scenarioId = this.selectedScenarios.length > 0 ? this.selectedScenarios[0].id : "";
    let response: any = await this.dataService.getAsync('/api/ScenariosDetail/GetScenariosDetailPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&scenario_id=" + scenarioId)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataScenarioDetail = response.data;
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

  async ChangeDropdownCreate() {
    this.selectedScenariosCreate = [];
    this.dataScenariosCreate = [];
    let accountId = this.selectedAccountCreate.length > 0 ? this.selectedAccountCreate[0].id : 0;
    let response: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosByAccount?account_id=' + accountId)
    for (let index in response.data) {
      this.dataScenariosCreate.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
    if (this.dataScenariosCreate.length == 1)
      this.selectedScenariosCreate.push({ "id": this.dataScenariosCreate[0].id, "itemName": this.dataScenariosCreate[0].itemName });
  }

  async ChangeDropdownEdit() {
    this.selectedScenariosEdit = [];
    this.dataScenariosEdit = [];
    let accountId = this.selectedAccountEdit.length > 0 ? this.selectedAccountEdit[0].id : 0;
    let response: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosByAccount?account_id=' + accountId)
    for (let index in response.data) {
      this.dataScenariosEdit.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
    if (this.dataScenariosEdit.length == 1)
      this.selectedScenariosEdit.push({ "id": this.dataScenariosEdit[0].id, "itemName": this.dataScenariosEdit[0].itemName });
  }

  //#region create new
  async createScenariosDetail(item) {
    let scenar = item.value;
    let combobox = item.controls;
    if (combobox.scenariosCreate.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-92"));
      return;
    }
    let SCENARIO_ID = combobox.scenariosCreate.value[0].id;
    let VALUE = scenar.valueScenar.toString();
    if (VALUE == "" || VALUE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
      return;
    }
    if (combobox.package.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-82"));
      return;
    }
    let PACKAGE_ID = combobox.package.value[0].id;

    let response: any = await this.dataService.postAsync('/api/ScenariosDetail', {
      SCENARIO_ID, VALUE, PACKAGE_ID
    })
    if (response.err_code == 0) {
      item.reset();
      this.getData();
      this.showModalCreate.hide();
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
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/ScenariosDetail/' + id)
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      this.formEditScenarios = new FormGroup({
        id: new FormControl(id),
        accountEdit: new FormControl(dataDetail.ACCOUNT_ID != "" && dataDetail.ACCOUNT_ID != null ? [{ "id": dataDetail.ACCOUNT_ID, "itemName": dataDetail.USER_NAME }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }]),
        scenariosEdit: new FormControl(dataDetail.SCENARIO_ID != "" && dataDetail.SCENARIO_ID != null ? [{ "id": dataDetail.SCENARIO_ID, "itemName": dataDetail.SCENARIO_NAME }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_scenario') }]),
        valueScenar: new FormControl(dataDetail.VALUE),
        package: new FormControl(dataDetail.PACKAGE_ID != "" && dataDetail.PACKAGE_ID != null ? [{ "id": dataDetail.PACKAGE_ID, "itemName": dataDetail.PACKAGE_NAME }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }])
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update tin mẫu
  async editScenariosDetail() {
    let formData = this.formEditScenarios.controls;
    let ID = formData.id.value;
    if (formData.scenariosEdit.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let SCENARIO_ID = formData.scenariosEdit.value[0].id;
    let VALUE = formData.valueScenar.value.toString();
    if (VALUE == "" || VALUE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
      return;
    }
    if (formData.package.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-82"));
      return;
    }
    let PACKAGE_ID = formData.package.value[0].id;

    let response: any = await this.dataService.putAsync('/api/ScenariosDetail/' + ID, {
      SCENARIO_ID, VALUE, PACKAGE_ID
    })
    if (response.err_code == 0) {
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getData();
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

  showConfirmDelete(id, name) {
    this.id = id;
    this.name = name;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/ScenariosDetail/' + id)
    if (response.err_code == 0) {
      this.getData();
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
}
