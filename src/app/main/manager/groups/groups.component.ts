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
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataGroup = [];
  public dataAccount = [];
  public pagination: Pagination = new Pagination();
  public groupId;
  public name;
  public groupName: string = '';
  public groupCode: string = '';
  public formEditGroup: FormGroup;
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public isActive: boolean = true;

  public settingsFilterAccount = {};
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

    this.settingsFilterAccount = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.formEditGroup = new FormGroup({
      groupId: new FormControl(),
      account: new FormControl(),
      groupCode: new FormControl(),
      groupName: new FormControl(),
      note: new FormControl(),
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
    this.getData();
  }

  async getDataAccount() {
    if (this.isAdmin) {
      this.selectedItemComboboxAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
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
        this.selectedItemComboboxAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedItemComboboxAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }

  ChangeDropdownList() {
    this.getData();
  }

  searchForm(){
    this.getData();
  }

  //#region load data
  async getData() {
    let account = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&group_code=" + this.groupCode + "&group_name=" + this.groupName)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataGroup = response.data;
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

  //#region create new
  async createGroup(item) {
    let group = item.value;
    let combobox = item.controls;
    if (combobox.slAccount.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.slAccount.value[0].id;
    let GROUP_CODE = group.groupCode;
    if (GROUP_CODE == "" || GROUP_CODE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-95"));
      return;
    }
    let GROUP_NAME = group.groupName;
    if (GROUP_NAME == "" || GROUP_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-96"));
      return;
    }
    let NOTES = group.note;
    let IS_ACTIVE = this.isActive == true ? 1 : 0;

    let response: any = await this.dataService.postAsync('/api/Group', {
      ACCOUNT_ID, GROUP_CODE, GROUP_NAME, NOTES, IS_ACTIVE
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
    let response: any = await this.dataService.getAsync('/api/Group/' + id)
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      this.formEditGroup = new FormGroup({
        groupId: new FormControl(id),
        account: new FormControl(dataDetail.ACCOUNT_ID != "" && dataDetail.ACCOUNT_ID != null ? [{ "id": dataDetail.ACCOUNT_ID, "itemName": dataDetail.USER_NAME }]
          : this.utilityService.translate('global.choose_account')),
        groupCode: new FormControl(dataDetail.GROUP_CODE),
        groupName: new FormControl(dataDetail.GROUP_NAME),
        note: new FormControl(dataDetail.NOTES),
        isActive: new FormControl(dataDetail.IS_ACTIVE)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update tin mẫu
  async editGroup() {
    let formData = this.formEditGroup.controls;
    let ID = formData.groupId.value;
    if (formData.account.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = formData.account.value[0].id;
    let GROUP_CODE = formData.groupCode.value;
    if (GROUP_CODE == "" || GROUP_CODE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-95"));
      return;
    }
    let GROUP_NAME = formData.groupName.value;
    if (GROUP_NAME == "" || GROUP_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-96"));
      return;
    }
    let NOTES = formData.note.value;
    let IS_ACTIVE = formData.isActive.value == true ? 1 : 0;

    let response: any = await this.dataService.putAsync('/api/Group/' + ID, {
      ACCOUNT_ID, GROUP_CODE, GROUP_NAME, NOTES, IS_ACTIVE
    })
    if (response.err_code == 0) {
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
    this.groupId = id;
    this.name = name;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/Group/' + id)
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
