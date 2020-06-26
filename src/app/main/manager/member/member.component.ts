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
  @ViewChild('uploadFile', { static: false }) public uploadFile;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;

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
  public isNameCode: boolean = false;
  public isName: boolean = false;
  public loading: boolean = false;
  public isActive = true;

  public settingsFilterAccount = {};
  public settingsFilterAccountEdit = {};
  public settingsFilterGroup = {};
  public settingsFilterGroupCreate = {};
  public settingsFilterGroupEdit = {};
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxAccountMember = [];
  public selectedItemComboboxAccountEdit = [];
  public selectedItemComboboxAccountCreate = [];
  public selectedItemComboboxGroup = [];
  public selectedItemComboboxGroupEdit = [];
  public selectedItemComboboxGroupCreate = [];
  public settingsFilterGroupUpload = {};
  public selectedGroupUpload = [];
  public dataGroupCreate = [];
  public groupCode = "";
  public groupName = "";

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
    this.settingsFilterAccountEdit = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterGroupUpload = {
      text: this.utilityService.translate('send_data.inGroup'),
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
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterGroupCreate = {
      text: this.utilityService.translate('global.choose_group'),
      singleSelection: false,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.formEditMember = new FormGroup({
      personId: new FormControl(),
      account: new FormControl(),
      groupedit: new FormControl(),
      code: new FormControl(),
      name: new FormControl(),
      phone: new FormControl(),
      mail: new FormControl(),
      address: new FormControl(),
      notes: new FormControl(),
      accumulatedPoint: new FormControl(),
      isActive: new FormControl(),
      birthdayEdit: new FormControl()
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
    if (this.isAdmin) {
      this.selectedItemComboboxAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
      this.selectedItemComboboxAccountMember = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
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
        this.selectedItemComboboxAccountMember.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedItemComboboxAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
      this.selectedItemComboboxAccountMember.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }

  //#region load group sender
  async getDataGroup() {
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
  async getDataGroupEdit(account_id) {
    this.selectedItemComboboxGroupEdit = [];
    this.dataGroupEdit = [];
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupByAccount?account_id=' + account_id)
    for (let index in response.data) {
      this.dataGroupEdit.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
    }

  }

  async getDataGroupCreate(account_id) {
    this.selectedItemComboboxGroupCreate = [];
    this.dataGroupCreate = [];
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupByAccount?account_id=' + account_id)
    for (let index in response.data) {
      this.dataGroupCreate.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
    }
    if (this.dataGroupCreate.length == 1)
      this.selectedItemComboboxGroupCreate.push({ "id": this.dataGroupCreate[0].id, "itemName": this.dataGroupCreate[0].itemName });
  }
  ChangeDropdownList() {
    this.getData();
   
    this.getDataGroupCreate( this.selectedItemComboboxAccountCreate[0].id);
  }

  searchForm() {
    this.getData();
  }

  //#region load data
  async getData() {
    let account = "";
    if (this.isAdmin)
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    else
      account = this.selectedItemComboboxAccount.length != 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    // this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    let group = this.selectedItemComboboxGroup.length > 0 && this.selectedItemComboboxGroup[0].id != "" ? this.selectedItemComboboxGroup[0].id : "";
    let response: any = await this.dataService.getAsync('/api/Person/GetPersonPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&group_id=" + group + "&code=" + this.code + "&name=" + this.name + "&phone=" + this.phone);
    // + "&account_id=" + account + "&group_id=" + group + "&code=" + this.code + "&name=" + this.name + "&phone=" + this.phone
    this.loadData(response);
  }

  loadData(response?: any) {
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
    if (combobox.slAccountCreate.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = combobox.slAccountCreate.value[0].id;
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
    let BIRTHDAY = member.birthday;
    if (BIRTHDAY != '' && BIRTHDAY != null) {
      let birthday = this.utilityService.formatDateTempalte(BIRTHDAY.toString());
    }
    BIRTHDAY = this.utilityService.formatDateToString(BIRTHDAY, "yyyyMMdd") + "000000";
    let response: any = await this.dataService.postAsync('/api/Person', {
      ACCOUNT_ID, PERSON_CODE, PERSON_FULLNAME, PHONE_NUMBER, EMAIL, ADDRESS, NOTES, IS_ACTIVE, ACCUMULATED_POINTS, GROUP_IDS, BIRTHDAY
    })
    debugger
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
    debugger
    let account_id = 0;
    let group_id = 0;
    let groupName="";
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
    let response: any = await this.dataService.getAsync('/api/Person/' + id)
    debugger
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      account_id= dataDetail.ACCOUNT_ID;
      let group = response.data[1].GROUP_MODEL;
      if (group.length > 0) {
        this.selectedItemComboboxGroupEdit = [];
        for (let i = 0; i < group.length; i++) {
          this.selectedItemComboboxGroupEdit.push({ "id": group[i].GROUP_ID, "itemName": group[i].GROUP_NAME });
          group_id= group[i].GROUP_ID != "" && group[i].GROUP_ID ? group[i].GROUP_ID : "";
          groupName = group[i].GROUP_ID != "" && group[i].GROUP_ID != "" != null ? group[i].GROUP_NAME : "";
        }
      } else {
        this.selectedItemComboboxGroupEdit = [];
      }
     
      this.formEditMember = new FormGroup({
        personId: new FormControl(id),
        account: new FormControl(dataDetail.ACCOUNT_ID != "" && dataDetail.ACCOUNT_ID != null ? [{ "id": dataDetail.ACCOUNT_ID, "itemName": dataDetail.USER_NAME }]
          : this.utilityService.translate('global.choose_account')),
        groupedit: new FormControl(this.selectedItemComboboxGroupEdit),
        code: new FormControl(dataDetail.PERSON_CODE),
        name: new FormControl(dataDetail.PERSON_FULLNAME),
        phone: new FormControl(dataDetail.PHONE_NUMBER),
        mail: new FormControl(dataDetail.EMAIL),
        address: new FormControl(dataDetail.ADDRESS),
        accumulatedPoint: new FormControl(dataDetail.ACCUMULATED_POINTS),
        isActive: new FormControl(dataDetail.IS_ACTIVE),
        birthdayEdit: new FormControl(dataDetail.BIRTHDAY)
      });
      this.getDataGroupEdit(account_id);
      if (this.selectedItemComboboxGroupEdit.length == 0)
      this.selectedItemComboboxGroupEdit.push({ "id": group_id, "itemName": groupName });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update member
  async editMember() {
    let EMAIL;
    let ADDRESS;
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
          GROUP_IDS = this.selectedItemComboboxGroupEdit[i].id.toString();
        else
          GROUP_IDS += "," + this.selectedItemComboboxGroupEdit[i].id.toString();
      }
    }
    if (formData.mail.value == null || formData.mail.value == "") {
      this.notificationService.displayWarnMessage(this.utilityService.translate('global.inputEmail'));
      return;
    } else {
      EMAIL = formData.mail.value;
    }
    if (formData.address.value == null || formData.address.value == "") {
      this.notificationService.displayWarnMessage(this.utilityService.translate('global.inputAddre'));
      return;
    } else {
      ADDRESS = formData.address.value;
    }

    let ACCUMULATED_POINTS = formData.accumulatedPoint.value == true ? 1 : 0;
    let IS_ACTIVE = formData.isActive.value == true ? 1 : 0;
    let response: any = await this.dataService.putAsync('/api/Person/' + ID, {
      ACCOUNT_ID, PERSON_CODE, PERSON_FULLNAME, PHONE_NUMBER, EMAIL, ADDRESS, IS_ACTIVE, ACCUMULATED_POINTS, GROUP_IDS
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
  // export template excel
  async excelTemplateMember() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplateMember", "DataSms", "template_member.xlsx");
    debugger
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
  clearData() {
    this.uploadFile.nativeElement.value = "";
  }
  // upload file
  public async submitUploadFile() {
    debugger
    if (this.selectedGroupUpload.length == 0 && (this.groupCode == null || this.groupCode == "")) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-99"));
      this.loading = false;
      return;
    }
    this.loading = true;
    let file = this.uploadFile.nativeElement;
    if (file.files.length > 0) {
      let groupId = this.selectedGroupUpload.length > 0 && this.selectedGroupUpload[0].id != "" ? this.selectedGroupUpload[0].id : "";
      let accountId = this.selectedItemComboboxAccountMember.length > 0 && this.selectedItemComboboxAccountMember[0].id != "" ? this.selectedItemComboboxAccountMember[0].id : "";
      let response: any = await this.dataService.importExcelAndSaveMemberListDataAsync(null, file.files, accountId, groupId, this.groupCode, this.groupName);
      if (response) {
        if (response.err_code == -19) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-100"));
          this.loading = false;
          return;
        }
        this.getDataGroup();
        this.selectedGroupUpload.push({ "id": response.data[0].GROUP_ID, "itemName": response.data[0].GROUP_NAME });
        this.selectedItemComboboxAccount.push({ "id": response.data[0].ACCOUNT_ID, "itemName": response.data[0].USER_NAME });
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("130"));
        this.groupCode = "";
        this.groupName = "";
        this.uploadExcelModal.hide();
        this.getData();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        this.loading = false;
      }
    }
    this.loading = false;
  }
  //#endregion
  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/Person/' + id)
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
