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
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataMember = [];
  public dataAccount = [];
  public dataGroup = [];
  public dataGroupEdit = [];
  public lstChecked = [];
  public pagination: Pagination = new Pagination();
  public personId;
  public fullName: string = '';
  public code: string = '';
  public name: string = '';
  public phone: string = '';
  public ids: string = '';
  public formEditMember: FormGroup;
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public isActive = true;

  public settingsFilterAccount = {};
  public settingsFilterGroup = {};
  public settingsFilterGroupEdit = {};
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxAccountEdit = [];
  public selectedItemComboboxAccountCreate = [];
  public selectedItemComboboxGroup = [];
  public selectedItemComboboxGroupEdit = [];
  public selectedItemComboboxGroupCreate = [];

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
      singleSelection: false,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data')
    };

    this.formEditMember = new FormGroup({
      personId: new FormControl(),
      account: new FormControl(),
      group: new FormControl(),
      code: new FormControl(),
      name: new FormControl(),
      phone: new FormControl(),
      mail: new FormControl(),
      address: new FormControl(),
      notes: new FormControl(),
      accumulatedPoint: new FormControl(),
      isActive: new FormControl()
    });
  }

  ngOnInit() {
    this.dataAccount.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
    this.dataGroup.push({ "id": "", "itemName": this.utilityService.translate('global.all') });
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
    this.getDataGroup();
    this.getData();
  }

  async getDataAccount() {
    debugger
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

  //#region load group sender
  async getDataGroup() {
    debugger
    let account = "";
    if (this.isAdmin)
      account = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : "";
    else
      account = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupByAccount?account_id=' + account)
    if (response)
      for (let index in response.data) {
        this.dataGroup.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
      }
  }
  //#endregion

  ChangeDropdownList() {
    this.getData();
  }

  searchForm() {
    this.getData();
  }

  //#region load data
  async getData() {
    debugger
    let account = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    let group = this.selectedItemComboboxGroup.length > 0 && this.selectedItemComboboxGroup[0].id != "" ? this.selectedItemComboboxGroup[0].id : "";
    let response: any = await this.dataService.getAsync('/api/Person/GetPersonPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&group_id=" + group + "&code=" + this.code + "&name=" + this.name + "&phone=" + this.phone);
      // + "&account_id=" + account + "&group_id=" + group + "&code=" + this.code + "&name=" + this.name + "&phone=" + this.phone
    this.loadData(response);
    console.log(response);
  }

  loadData(response?: any) {
    debugger
    if (response) {
      this.dataMember = response.data;
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

  getIdGroup(event) {

    this.ids = '';
    if (!this.lstChecked.includes(event.id)) {
      this.lstChecked.push(event.id);
    }
    else {
      let index = this.lstChecked.indexOf(event.id);
      if (index != -1) {
        this.lstChecked.splice(index, 1);
      }
    }
    this.ids = this.lstChecked.join(",");
  }

  //#region create new
  async createMember(item) {
    let member = item.value;
    let combobox = item.controls;
    if (combobox.slAccount.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.slAccount.value[0].id;
    let PERSON_CODE = member.code;
    if (PERSON_CODE == "" || PERSON_CODE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-98"));
      return;
    }
    let PERSON_FULLNAME = member.name;
    if (PERSON_FULLNAME == "" || PERSON_FULLNAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-97"));
      return;
    }
    let PHONE_NUMBER = member.phone;
    if (PHONE_NUMBER == "" || PHONE_NUMBER == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
      return;
    }
    let GROUP_IDS = this.ids;
    let EMAIL = member.mail;
    let ADDRESS = member.address;
    let NOTES = member.notes;
    let IS_ACTIVE = this.isActive == true ? 1 : 0;
    let ACCUMULATED_POINTS = this.isActive == true ? 1 : 0;

    let response: any = await this.dataService.postAsync('/api/Person', {
      ACCOUNT_ID, PERSON_CODE, PERSON_FULLNAME, PHONE_NUMBER, EMAIL, ADDRESS, NOTES, IS_ACTIVE, ACCUMULATED_POINTS, GROUP_IDS
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
    let response: any = await this.dataService.getAsync('/api/Person/' + id)
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      let group = response.data[1].GROUP_MODEL;
      if (group.length > 0) {
        this.selectedItemComboboxGroupEdit = [];
        for (let i = 0; i < group.length; i++) {
          this.selectedItemComboboxGroupEdit.push({ "id": group[i].GROUP_ID, "itemName": group[i].GROUP_NAME });
        }
      } else {
        this.selectedItemComboboxGroupEdit = [];
      }
      this.formEditMember = new FormGroup({
        personId: new FormControl(id),
        account: new FormControl(dataDetail.ACCOUNT_ID != "" && dataDetail.ACCOUNT_ID != null ? [{ "id": dataDetail.ACCOUNT_ID, "itemName": dataDetail.USER_NAME }]
          : this.utilityService.translate('global.choose_account')),
        group: new FormControl(this.selectedItemComboboxGroupEdit),
        code: new FormControl(dataDetail.PERSON_CODE),
        name: new FormControl(dataDetail.PERSON_FULLNAME),
        phone: new FormControl(dataDetail.PHONE_NUMBER),
        mail: new FormControl(dataDetail.EMAIL),
        address: new FormControl(dataDetail.ADDRESS),
        notes: new FormControl(dataDetail.NOTES),
        accumulatedPoint: new FormControl(dataDetail.ACCUMULATED_POINTS),
        isActive: new FormControl(dataDetail.IS_ACTIVE)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update member
  async editMember() {
  
    let formData = this.formEditMember.controls;
    let ID = formData.personId.value;
    if (formData.account.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = formData.account.value[0].id;
    let PERSON_CODE = formData.code.value;
    if (PERSON_CODE == "" || PERSON_CODE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-98"));
      return;
    }
    let PERSON_FULLNAME = formData.name.value;
    if (PERSON_FULLNAME == "" || PERSON_FULLNAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-97"));
      return;
    }
    let PHONE_NUMBER = formData.phone.value;
    if (PHONE_NUMBER == "" || PHONE_NUMBER == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
      return;
    }
    let GROUP_IDS = "";
    if (this.selectedItemComboboxGroupEdit.length > 0) {
      for (let i = 0; i < this.selectedItemComboboxGroupEdit.length; i++) {
        if (i == 0)
          GROUP_IDS = this.selectedItemComboboxGroupEdit[i].id;
        else
          GROUP_IDS += "," + this.selectedItemComboboxGroupEdit[i].id;
      }
    }

    let EMAIL = formData.mail.value;
    let ADDRESS = formData.address.value;
    let NOTES = formData.notes.value;
    let ACCUMULATED_POINTS = formData.accumulatedPoint.value == true ? 1 : 0;
    let IS_ACTIVE = formData.isActive.value == true ? 1 : 0;

    let response: any = await this.dataService.putAsync('/api/Person/' + ID, {
      ACCOUNT_ID, PERSON_CODE, PERSON_FULLNAME, PHONE_NUMBER, EMAIL, ADDRESS, NOTES, IS_ACTIVE, ACCUMULATED_POINTS, GROUP_IDS
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
    this.personId = id;
    this.fullName = name;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/Person/' + id)
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
