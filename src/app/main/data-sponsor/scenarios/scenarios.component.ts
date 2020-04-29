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

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataScenarios = [];
  public pagination: Pagination = new Pagination();
  public id;
  public name;
  public inCodeScenar: string = '';
  public inNameScenar: string = '';
  public formEditScenarios: FormGroup;
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public checkActive = true;
  public dataStatus = [];
  public dataAccount = [];
  public dataPackage = [];

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

    this.formEditScenarios = new FormGroup({
      id: new FormControl(),
      account: new FormControl(),
      code: new FormControl(),
      name: new FormControl(),
      content: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      isActive: new FormControl()
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

    let response: any = await this.dataService.postAsync('/api/Scenarios', {
      ACCOUNT_ID, CODE, NAME, CONTENT, START_DATE, END_DATE, IS_ACTIVE
    })
    if (response.err_code == 0) {
      item.reset();
      this.getData();
      this.showModalCreate.hide();
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
        isActive: new FormControl(dataDetail.IS_ACTIVE)
      });
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

    let response: any = await this.dataService.putAsync('/api/Scenarios/' + ID, {
      ACCOUNT_ID, CODE, NAME, CONTENT, START_DATE, END_DATE, IS_ACTIVE
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
}
