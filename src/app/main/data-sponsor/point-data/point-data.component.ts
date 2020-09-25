import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { UtilityService } from 'src/app/core/services/utility.service';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Pagination } from 'src/app/core/models/pagination';

@Component({
  selector: 'app-point-data',
  templateUrl: './point-data.component.html',
  styleUrls: ['./point-data.component.css']
})
export class PointDataComponent implements OnInit {
  @ViewChild('createPackagePointModal', { static: false }) public createPackagePointModal: ModalDirective;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;
  @ViewChild('uploadFile', { static: false }) public uploadFile;

  public dataBank = [];
  public settingsFilterItemBank = {};
  public selectedItemBank = [];
  public dataAccount = [];
  public settingsFilterAccount = {};
  public selectedItemAccount = [];
  public dataPackagePointVTL = [];
  public settingsFilterPackagePointVTL = {};
  public selectedItemPackagePointVTL = [];
  public dataPackagePointGPC = [];
  public settingsFilterPackagePointGPC = {};
  public selectedItemPackagePointGPC = [];
  public dataPackagePointVMS = [];
  public settingsFilterPackagePointVMS = {};
  public selectedItemPackagePointVMS = [];
  public isAdmin = false;
  public loading = false;
  public checkUpload = true;
  public ischeckgroup = false;
  public groupCode = "";
  public groupName = "";
  public dataGroup = [];
  public selectedGroup = [];
  public settingsFilterGroup = {};

  public dataGroupAdd = [];
  public selectedGroupUploadAdd = [];
  public settingsFilterGroupUploadAdd = {};

  public date: Date = new Date();
  public checkPackagePoint = false;
  public loadingGroup = false;
  public listSmsSend = [];
  public bank_id;
  public phone_number;
  public point;
  public phone_point: any = "";
  public yourPoint: any = "";
  public selectedItemSender = [];
  public settingsFilterSender = {};
  public dataSenderName = [];
  public dataPhoneTamp = [];
  public dataPhone = [];
  public totalNumber = 0;
  public totalNumberSendSms = 0;
  public numberPhone = 0;
  public dataPhonePaging = [];
  public dataPhoneAddNew = [];
  public lstChecked = [];
  public lstCheckedName = [];
  public fileList: string = "";

  public pagination: Pagination = new Pagination();

  constructor(private utilityService: UtilityService,
    private dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationService) {

    this.settingsFilterItemBank = {
      text: this.utilityService.translate('point.select_bank'),
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
    this.settingsFilterGroup = {
      text: this.utilityService.translate('send_data.phone_list'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data')
    };
    
    this.settingsFilterGroupUploadAdd = {
      text: this.utilityService.translate('send_data.phone_list'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterPackagePointVTL = {
      text: this.utilityService.translate('point.choose_data_VTL'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterPackagePointGPC = {
      text: this.utilityService.translate('point.choose_data_GPC'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterPackagePointVMS = {
      text: this.utilityService.translate('point.choose_data_VMS'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
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
    this.GetAccountByBank();
    this.GetBankDataByAccount();
    this.getDataSenderName();
    this.getDataGroup();
  }

  async getDataAccount() {
    if (this.isAdmin) {
      this.selectedItemAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
      let response: any = await this.dataService.getAsync('/api/account')
      if (response) {
        for (let index in response.data) {
          this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
        }
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetAccountByBank?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      if (response) {
        for (let index in response.data) {
          this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
        }
      }
      if (this.dataAccount.length == 1) {
        this.selectedItemAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedItemAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }
  async GetBankDataByAccount() {
    debugger
    let account_id;
    if (this.authService.currentUserValue.USER_NAME == 'admin')
      account_id = "";
    else
      account_id = this.authService.currentUserValue.ACCOUNT_ID;
    let response = await this.dataService.getAsync('/api/BankData/GetBankDataByAccount?account_id=' + account_id);
    if (response) {
      if (response.err_code == 0) {
        for (let index in response.data) {
          this.dataBank.push({ "id": response.data[index].BANK_ID, "itemName": response.data[index].BANK_NAME });
        }
        if (this.dataBank.length == 1)
          this.selectedItemBank.push({ "id": this.dataBank[0].BANK_ID, "itemName": this.dataBank[0].itemName });
      }
    }
  }

  async GetAccountByBank() {
    debugger
    this.dataAccount = [];
    this.selectedItemAccount = [];
    let bank_id = this.selectedItemBank.length != 0 && this.selectedItemBank[0].id != "" ? this.selectedItemBank[0].id : "";
    let response = await this.dataService.getAsync('/api/account/GetAccountByBank?bank_id=' + bank_id);
    if (response) {
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    if (this.dataAccount.length == 1) {
      this.selectedItemAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
    }
    else
      this.selectedItemAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    this.getDataSenderName();
  }
  showModalUpload() {
    let accountId;
    if (this.isAdmin) {
      accountId = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : "";
      if (accountId == "") {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-21"));
        this.loading = false;
        return;
      }
    }
    else
      accountId = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    this.uploadExcelModal.show();
  }

  checkboxInput() {
    this.checkUpload = !this.checkUpload;
  }

  async checkboxGroup() {
    this.ischeckgroup = !this.ischeckgroup;
    if (this.ischeckgroup == true) {
      this.settingsFilterGroup = {
        text: this.utilityService.translate('send_data.inGroup'),
        singleSelection: false,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: true
      };
      this.createCodeGroup();
    } else {
      this.settingsFilterGroup = {
        text: this.utilityService.translate('send_data.inGroup'),
        singleSelection: false,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: false
      };
      this.groupCode = "";
    }
  }

  async getDataSenderName() {
    let Account_id;
    if (this.selectedItemAccount.length > 0) {
      Account_id = this.selectedItemAccount[0].id;
    } else {
      Account_id = "";
    }
    this.selectedItemSender = [];
    this.dataSenderName = [];
    let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
      Account_id)
    for (let index in response.data) {
      this.dataSenderName.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
    }
    if (this.dataSenderName.length == 1)
      this.selectedItemSender.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
  }

  async createCodeGroup() {
    let USER_NAME;
    if (this.isAdmin) {
      USER_NAME = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].itemName : this.authService.currentUserValue.USER_NAME;
    } else {
      USER_NAME = this.authService.currentUserValue.USER_NAME;
    }
    if (this.ischeckgroup == true) {
      if (USER_NAME != null || USER_NAME != "") {
        let accountName = USER_NAME.substring(0, 3);
        let codeGroup = (accountName + '_' + 'GRP' + '_' + this.utilityService.formatDateToString(this.date, "yyMMdd") + '_' + this.utilityService.formatDateToString(this.date, "HHmm")).toUpperCase();
        this.groupCode = codeGroup;
      }
    } else {
      this.groupCode = "";
    }
  }

  async getDataGroup() {
    this.selectedGroup = [];
    this.dataGroup = [];
    this.dataGroupAdd = [];
    let account = "";
    account = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupByAccount?account_id=' + account)
    for (let index in response.data) {
      this.dataGroup.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
      this.dataGroupAdd.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
    }
  }

  async excelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync('/api/FileExtention/ExportExcelTemplate', 'DataSms', 'phone_point.xlsx');
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  showModalPackagePoint() {
    this.createPackagePointModal.show();
  }

  changeAccount() {
    this.getDataSenderName();
    this.getDataGroup();
  }
  deSelectAccount() {
    this.getDataSenderName();
    this.getDataGroup();
  }

  async getTelco(phone: any) {
    let telco = ""
    let response: any = await this.dataService.getAsync('/api/Person/GetTelco?phone=' + phone);
    if (response != null)
      telco = response;
    return telco;
  }

  async getDataPackagePoint() {
    debugger
    if (this.selectedItemBank.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-209"));
      return;
    }
    // if (this.phone_point == "" || this.phone_point == null) {
    //   this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
    //   return;
    // }
    if (this.yourPoint == "" || this.yourPoint == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-300"));
      return;
    }
    this.point = this.yourPoint;
    this.bank_id = this.selectedItemBank[0].id;
    this.checkPackagePoint = true;
    let resVTL: any = await this.dataService.getAsync('/api/PackageTelco/GetPackageTelcoByPoint?bank_id=' + this.bank_id + '&point=' + this.point + '&telco=VIETTEL')
    if (resVTL) {
      if (resVTL.err_code == 0) {
        for (let index in resVTL.data) {
          this.dataPackagePointVTL.push({ "id": resVTL.data[index].ID, "itemName": resVTL.data[index].POINT_NAME + 'điểm' + ' x ' + resVTL.data[index].PACKAGE_NAME_DISPLAY });
        }
      }
    }
    let resGPC: any = await this.dataService.getAsync('/api/PackageTelco/GetPackageTelcoByPoint?bank_id=' + this.bank_id + '&point=' + this.point + '&telco=GPC')
    if (resGPC) {
      if (resGPC.err_code == 0) {
        for (let index in resGPC.data) {
          this.dataPackagePointGPC.push({ "id": resGPC.data[index].ID, "itemName": resGPC.data[index].POINT_NAME + 'điểm' + ' x ' + resGPC.data[index].PACKAGE_NAME_DISPLAY });
        }
      }
    }

    let resVMS: any = await this.dataService.getAsync('/api/PackageTelco/GetPackageTelcoByPoint?bank_id=' + this.bank_id + '&point=' + this.point + '&telco=VMS')
    if (resVMS) {
      if (resVMS.err_code == 0) {
        for (let index in resVMS.data) {
          this.dataPackagePointVMS.push({ "id": resVMS.data[index].ID, "itemName": resVMS.data[index].POINT_NAME + 'điểm' + ' x ' + resVMS.data[index].PACKAGE_NAME_DISPLAY });
        }
      }
    }
  }

  CreateDataSms(formAdd1) {
    debugger
    let dataSms = formAdd1.value;
    let comboboxData = formAdd1.controls;
    let ACCOUNT_ID = comboboxData.slAccount.value[0].id;


  }
  //#region load data grid
  phonePaging(data?: any) {
    if (this.pagination.pageSize != 'ALL') {
      data = (data == null) ? this.dataPhoneTamp : data;
      this.pagination.totalRow = data.length;
      this.pagination.totalPage = this.utilityService.formatNumberTotalPage(this.pagination.totalRow / this.pagination.pageSize);
      let beginItem: number = (this.pagination.pageIndex - 1) * this.pagination.pageSize;

      let dataPaging: any = [];
      for (let index in data) {
        if (Number(index) >= beginItem && Number(index) < (beginItem + Number(this.pagination.pageSize))) {
          dataPaging.push(data[index]);
        }
      }
      this.dataPhone = dataPaging;
      this.totalNumber = this.pagination.totalRow;
      this.totalNumberSendSms = this.pagination.totalRow + this.numberPhone;
      if (this.totalNumberSendSms == 0) {
        this.totalNumberSendSms = this.numberPhone;
      }
    }
    else {
      this.dataPhone = this.dataPhonePaging;
      this.totalNumber = this.dataPhoneTamp.length;
      this.totalNumberSendSms = this.dataPhoneTamp.length + this.numberPhone;
      if (this.totalNumberSendSms == 0) {
        this.totalNumberSendSms = this.numberPhone;
      }
    }
  }
  async countPhone(phone) {
    let phoneList: any = [];
    this.dataPhoneAddNew = [];
    phoneList = this.checkPhone(phone);
    if (phoneList.length == 0) {
      this.numberPhone = 0;
    }
    else if (phoneList.includes(";")) {
      this.numberPhone = phoneList.split(';').length - 1;
      let lstSplit = phoneList.substr(0, phoneList.length - 1).split(';');
      for (let i in lstSplit) {
        let telco = await this.getTelco(lstSplit[i]);
        if (telco != null && telco != "") {
          let phone = this.dataPhoneAddNew.filter(s => lstSplit[i].includes(s.PHONE));
        }
      }
    }
    else {
      this.numberPhone = 1;
      this.dataPhoneAddNew.push({ PHONE: phoneList.substr(0, phoneList.length - 1) });
    }
  }
  checkPhone(phone) {
    let phoneSplit: any = [];
    let temp = "";
    phoneSplit = phone.split(';');
    for (let i in phoneSplit) {
      let phoneNew = this.utilityService.FilterPhone(phoneSplit[i].replace(/\s/g, ""));
      if (this.utilityService.getTelco(phoneNew) != "") {
        temp += phoneNew + ";";
      }
    }
    return temp;
  }
  
  // upload file
  public async submitUploadFile() {
    this.loading = true;
    let account = "";
    account = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    if (this.selectedGroupUploadAdd.length == 0 && (this.groupCode == null || this.groupCode == "")) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-99"));
      this.loading = false;
      return;
    } else if (this.selectedGroupUploadAdd.length == 0 && (this.groupCode != null || this.groupCode != "")) {
      if (this.groupName == null || this.groupName == "") {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-96"));
        this.loading = false;
        return;
      }

    }
    let file = this.uploadFile.nativeElement;
    if (file.files.length > 0) {
      let groupId = this.selectedGroupUploadAdd.length > 0 && this.selectedGroupUploadAdd[0].id != "" ? this.selectedGroupUploadAdd[0].id : "";
      let groupName = this.selectedGroupUploadAdd.length > 0 && this.selectedGroupUploadAdd[0].itemName != "" ? this.selectedGroupUploadAdd[0].itemName : "";
      let response: any = await this.dataService.importExcelAndSavePhoneListDataAsync(null, file.files, groupId, this.groupCode, this.groupName, account);
      debugger
      if (response) {
        if (response.err_code == -100) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-100"));
          this.loading = false;
          return;
        } else if (response.err_code == -109) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-109"));
          this.loading = false;
          return;
        } else {
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("130"));
          this.groupCode = "";
          this.groupName = "";
          this.uploadExcelModal.hide();
          //this.pageRefresh();
          this.getDataGroup();
          if (groupId != null && groupId != "") {
            this.selectedGroup.push({ "id": groupId, "itemName": groupName });
          } else {
            this.selectedGroup.push({ "id": response.data[0].GROUP_ID, "itemName": response.data[0].GROUP_NAME })
          }
          this.getPhoneNumber(this.selectedGroup[0]);
        }

      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        this.loading = false;
      }
    }
    this.loading = false;
  }

  // get phone by file list 
  async getPhoneNumber(event) {
    debugger
    this.dataPhoneTamp = [];
    this.dataPhone = [];
   
    if (!this.lstChecked.includes(event.id)) {
      this.lstChecked.push(event.id);
      this.lstCheckedName.push(event.itemName);
    }
    else {
      let index = this.lstChecked.indexOf(event.id);
      if (index != -1) {
        this.lstChecked.splice(index, 1);
        this.lstCheckedName.splice(index, 1);
      }
    }
    let ids = this.lstChecked.join(",");
    this.fileList = this.lstCheckedName.join(",");
   
    this.loadingGroup = true;
    let response: any = await this.dataService.getAsync('/api/Person/GetPersonByGroupIds?groupIds=' + ids)
    this.loadingGroup = false;
    if (response) {
      this.dataPhone = response.data.listPhoneTelco;
      let data = response.data;
      response = [];
      for (let i in this.dataPhone) {
        this.dataPhoneTamp.push(this.dataPhone[i]);
      }
      this.totalNumber = this.dataPhoneTamp.length;
      this.totalNumberSendSms = this.dataPhoneTamp.length + this.numberPhone;
      if (this.dataPhoneTamp.length == 0) {
        this.totalNumberSendSms = this.numberPhone;
      }
      this.phonePaging(response.data);
    }
    //this.GetPackage();
  }
}

