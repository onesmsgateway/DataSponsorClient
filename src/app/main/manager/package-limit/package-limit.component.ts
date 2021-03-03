import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { Role } from 'src/app/core/models/role';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-package-limit',
  templateUrl: './package-limit.component.html',
  styleUrls: ['./package-limit.component.css']
})
export class PackageLimitComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataPackageLimited = [];
  public dataAccount = [];
  public settingsFilterAccount = {};
  public selectedAccount = [];
  public selectedItemComboboxAccountCreate = [];
  public dataPackage = [];
  public settingsFilterPackage = {};
  public selectedItemComboboxPackage = [];
  public selectedItemComboboxPackageCreate = [];
  public fromDate: string = "";
  public packageName: string = "";
  public pkId: string = "";
  public timeFrom: Date = new Date();
  public pagination: Pagination = new Pagination();
  public role: Role = new Role();
  public isAdmin = false;

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
    this.settingsFilterPackage = {
      text: this.utilityService.translate('global.choose_package'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
  }

  ngOnInit() {
    this.fromDate = this.utilityService.formatDateToString(this.timeFrom, "yyyyMMdd");
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
    this.getPackageTelco();
  }

  //#region account
  public async getDataAccount() {
    this.dataAccount = [];
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    if (this.isAdmin) {
      let response: any = await this.dataService.getAsync('/api/account');
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
      if (this.dataAccount.length == 1)
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
    }
    this.getData();
  }
  //#endregion

  async getPackageTelco() {
    this.selectedItemComboboxPackage = [];
    this.dataPackage = [];
    this.dataPackage.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    let response: any = await this.dataService.getAsync('/api/PackageTelco/GetPackageTelco')
    for (let index in response.data) {
      this.dataPackage.push({ "id": response.data[index].PACKAGE_NAME, "itemName": response.data[index].TELCO + " - " + response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }
  }

  async getData() {
    let account = this.selectedAccount.length > 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let packageName = this.selectedItemComboboxPackage.length > 0 && this.selectedItemComboboxPackage[0].id != "" ? this.selectedItemComboboxPackage[0].id : "";
    let response: any = await this.dataService.getAsync('/api/PackageLimited/GetPackageLimitedPaging?pageIndex=' + this.pagination.pageIndex + '&pageSize=' +
      this.pagination.pageSize + "&account_id=" + account + "&package_name=" + packageName + "&from_date=" + this.fromDate)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataPackageLimited = response.data;
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

  onChangeFromDate(event) {
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMdd");
  }

  // create package limited
  async createPackageLimited(item) {
    let detail = item.value;
    let combobox = item.controls;
    if (combobox.slAccountCr.value == null || combobox.slAccountCr.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.slAccountCr.value[0].id;

    if (combobox.packageCr.value == null || combobox.packageCr.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-121"));
      return;
    }
    let PACKAGE_NAME = combobox.packageCr.value[0].id;
    let LIMITED = detail.limited;

    let response: any = await this.dataService.postAsync('/api/PackageLimited', { ACCOUNT_ID, PACKAGE_NAME, LIMITED })
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

  showConfirmDelete(id, package_name) {
    this.packageName = package_name;
    this.pkId = id;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/PackageLimited/' + id)
    if (response.err_code == 0) {
      this.getData();
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
}
