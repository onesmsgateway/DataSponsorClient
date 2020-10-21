import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Pagination } from 'src/app/core/models/pagination';
import { async } from 'rxjs/internal/scheduler/async';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-point',
  templateUrl: './data-point.component.html',
  styleUrls: ['./data-point.component.css']
})
export class DataPointComponent implements OnInit {
  @ViewChild('contentSMS', { static: false }) public contentSMS;
  @ViewChild('createPackagePointModal', { static: false }) public createPackagePointModal: ModalDirective;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;
  @ViewChild('uploadFile', { static: false }) public uploadFile;
  @ViewChild('confirmAfterSuccessModal', { static: false }) public confirmAfterSuccessModal: ModalDirective;
  @ViewChild('confirmSendDataSMSModal', { static: false }) public confirmSendDataSMSModal: ModalDirective;

  public messageAfterSend: string = "";
  public dataBank = [];
  public settingsFilterItemBank = {};
  public selectedItemBank = [];

  public dataPhonePoint = [];
  public selectedPhonePoint = [];
  public settingsFilterPhonePoint = {};
  public countDup = 0;

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
  public lstCheckedPhone = [];
  public lstCheckedPhoneNumber = [];
  public fileList: string = "";
  public phoneList: string = '';
  public numberChar = 0;
  public numberSMS = 0;
  public dataOptionInsert = [];
  public settingsFilterOptionInsert = {};
  public selectedOptionInsert = [];
  public dataOptionInsertSms = [];
  public settingsFilterOptionTempSms = {};
  public selectedOptionTempSms = [];
  public smsContent = "";
  public countVTL = 0;
  public countGPC = 0;
  public countVMS = 0;
  public ids = "";
  public isSendSMS: boolean = true;
  public pagination: Pagination = new Pagination();
  public total_amt = 0;
  public quota = 0;
  public bankName: string = '';
  public timeSend: string = '';
  public account: string = '';
  public senderName: string = '';
  public cntVTL = 0;
  public cntGPC = 0;
  public cntVMS = 0;
  public countTotal = 0;
  public packViettel: string = '';
  public packGPC: string = '';
  public packVMS: string = '';

  constructor(private utilityService: UtilityService,
    private dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private _formBuilder: FormBuilder) {

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
      singleSelection: false,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data')
    };
    this.settingsFilterPhonePoint = {
      text: this.utilityService.translate('point.choose_phone'),
      singleSelection: false,
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
    this.settingsFilterOptionInsert = {
      text: this.utilityService.translate('send_data.option_insert'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterOptionTempSms = {
      text: this.utilityService.translate('send_data.optionSms'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inPoint'), "itemName": this.utilityService.translate('send_data.inPoint') });
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inPack'), "itemName": this.utilityService.translate('send_data.inPack') });
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inData'), "itemName": this.utilityService.translate('send_data.inData') });
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
    this.GetBankDataByAccount();
    this.getDataSenderName();
    this.getDataGroup();
    this.getDataSmsTemp();
    this.ReturnPointBankMember();
  }
  async getDataSmsTemp() {
    this.dataOptionInsertSms = [];
    this.selectedOptionTempSms = [];
    let response: any = await this.dataService.getAsync('/api/SmsTemplate')
    for (let index in response.data) {
      this.dataOptionInsertSms.push({ "id": response.data[index].ID, "itemName": response.data[index].TEMP_NAME, "conten_sms": response.data[index].TEMPLATE_CONTENT });
    }
  }

  async GetBankDataByAccount() {
    this.dataBank = [];
    let account_id;
    if (this.authService.currentUserValue.USER_NAME == 'admin')
      account_id = "";
    else
      account_id = this.authService.currentUserValue.ACCOUNT_ID;
    let response = await this.dataService.getAsync('/api/BankData/GetBankDataByAccount?account_id=' + account_id);
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          this.dataBank.push({ "id": response.data[i].BANK_ID, "itemName": response.data[i].BANK_NAME });
        }
      }
    }
  }
  async GetAccountByBank() {
    this.selectedItemAccount = [];
    this.dataAccount = [];
    let bank_id = this.selectedItemBank.length != 0 && this.selectedItemBank[0].id != "" ? this.selectedItemBank[0].id : "";
    let response: any = await this.dataService.getAsync('/api/account/GetAccountByBank?bank_id=' + bank_id);
    if (response) {
      if (response.err_code == 0) {
        for (let i = 0; i < response.data.length; i++) {
          this.dataAccount.push({ "id": response.data[i].ACCOUNT_ID, "itemName": response.data[i].USER_NAME });
        }
      }
    }
    if (this.dataAccount.length == 1) {
      this.selectedItemAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
    }
    else
      this.selectedItemAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    this.getDataSenderName();
    this.getDataGroup();
    this.account = this.selectedItemAccount[0].itemName;
  }
  ChangeAccountBank() {
    this.GetAccountByBank();
    if (this.selectedItemBank.length > 0) {
      this.bankName = this.selectedItemBank[0].itemName;
    }

  }

  showModalUpload() {
    let account_id;
    if (this.isAdmin) {
      account_id = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : "";
      if (account_id == "") {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-21"));
        this.loading = false;
        return;
      }
    }
    else
      account_id = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;

    this.clearData();
    this.selectedGroupUploadAdd = [];
    //this.getDataGroup();
    this.uploadExcelModal.show();
  }


  checkboxInput() {
    this.checkUpload = !this.checkUpload;
  }

  async checkboxGroup() {
    this.ischeckgroup = !this.ischeckgroup;
    if (this.ischeckgroup == true) {
      this.selectedGroupUploadAdd = [];
      this.settingsFilterGroupUploadAdd = {
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
      this.settingsFilterGroupUploadAdd = {
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
    if (this.selectedItemSender.length > 0) {
      this.senderName = this.selectedItemSender[0].itemName;
    }

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
    debugger
    this.selectedGroup = [];
    this.dataGroup = [];
    this.dataGroupAdd = [];
    let account = "";
    if (this.isAdmin) {
      account = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : "";
    } else {
      account = this.selectedItemAccount.length > 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    }

    let response: any = await this.dataService.getAsync('/api/GroupMember/GetGroupMemberByAccount?account_id=' + account)
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

  //#region load data
  async ReturnPointBankMember() {
    let account = "";
    if (!this.isAdmin) {
      account = this.selectedItemAccount.length != 0 && this.selectedItemAccount[0].id != "" ? this.selectedItemAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
      let response: any = await this.dataService.getAsync('/api/bankmember/ReturnBankMemberPoint?account_id=' + account);
      if (response) {
        if (response.err_code == 0) {

        }
      }
    }
  }

  async getDataPackagePoint() {
    this.selectedItemPackagePointVTL = [];
    this.selectedItemPackagePointGPC = [];
    this.selectedItemPackagePointVMS = [];

    this.dataPackagePointVTL = [];
    this.dataPackagePointGPC = [];
    this.dataPackagePointVMS = [];
    if (this.selectedItemBank.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-209"));
      return;
    }
    if (this.yourPoint == "" || this.yourPoint == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-300"));
      return;
    }
    this.point = this.yourPoint;
    this.bank_id = this.selectedItemBank[0].id;
    this.checkPackagePoint = true;
    let resVTL: any = await this.dataService.getAsync('/api/PackageTelco/GetPackageTelcoByPoint?bank_id=' + this.bank_id + '&point=' + this.point + '&telco=VIETTEL')
    if (resVTL.data.length > 0) {
      if (resVTL.err_code == 0) {
        if (resVTL.data.length == 1) {
          this.dataPackagePointVTL.push({ "id": resVTL.data[0].ID, "itemName": resVTL.data[0].POINT_NAME + 'điểm' + ' x ' + resVTL.data[0].PACKAGE_NAME_DISPLAY });
        }
        if (resVTL.data.length > 1) {
          this.dataPackagePointVTL.push({ "id": resVTL.data[0].ID, "itemName": resVTL.data[0].POINT_NAME + 'điểm' + ' x ' + resVTL.data[0].PACKAGE_NAME_DISPLAY });
          this.dataPackagePointVTL.push({ "id": resVTL.data[1].ID, "itemName": resVTL.data[1].POINT_NAME + 'điểm' + ' x ' + resVTL.data[1].PACKAGE_NAME_DISPLAY });
        }
        else {
          this.dataPackagePointVTL = [];
        }
      }
    }
    let resGPC: any = await this.dataService.getAsync('/api/PackageTelco/GetPackageTelcoByPoint?bank_id=' + this.bank_id + '&point=' + this.point + '&telco=GPC')
    if (resGPC.data.length > 0) {
      if (resGPC.err_code == 0) {
        if (resGPC.data.length == 1) {
          this.dataPackagePointGPC.push({ "id": resGPC.data[0].ID, "itemName": resGPC.data[0].POINT_NAME + 'điểm' + ' x ' + resGPC.data[0].PACKAGE_NAME_DISPLAY });
        } else {
          this.dataPackagePointGPC.push({ "id": resGPC.data[0].ID, "itemName": resGPC.data[0].POINT_NAME + 'điểm' + ' x ' + resGPC.data[0].PACKAGE_NAME_DISPLAY });
          this.dataPackagePointGPC.push({ "id": resGPC.data[1].ID, "itemName": resGPC.data[1].POINT_NAME + 'điểm' + ' x ' + resGPC.data[1].PACKAGE_NAME_DISPLAY });
        }
      }
    }

    let resVMS: any = await this.dataService.getAsync('/api/PackageTelco/GetPackageTelcoByPoint?bank_id=' + this.bank_id + '&point=' + this.point + '&telco=VMS')
    if (resVMS.data.length > 0) {
      if (resVMS.err_code == 0) {
        if (resVMS.data.length == 1) {
          this.dataPackagePointVMS.push({ "id": resVMS.data[0].ID, "itemName": resVMS.data[0].POINT_NAME + 'điểm' + ' x ' + resVMS.data[0].PACKAGE_NAME_DISPLAY });
        } else {
          this.dataPackagePointVMS.push({ "id": resVMS.data[0].ID, "itemName": resVMS.data[0].POINT_NAME + 'điểm' + ' x ' + resVMS.data[0].PACKAGE_NAME_DISPLAY });
          this.dataPackagePointVMS.push({ "id": resVMS.data[1].ID, "itemName": resVMS.data[1].POINT_NAME + 'điểm' + ' x ' + resVMS.data[1].PACKAGE_NAME_DISPLAY });
        }
      }
    }
  }
  //#region load data grid
  phonePaging(data?: any) {
    this.totalNumber = 0;
    this.dataPhone = [];
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

  // upload file
  public async submitUploadFile() {
    debugger
    this.countDup = 0;
    this.loading = true;
    let account = "";
    let file;
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
    file = this.uploadFile.nativeElement;
    if (file.files.length == 0) {
      this.notificationService.displayErrorMessage(this.utilityService.translate('point.isChooseFile'));
      this.loading = false;
      return;
    }
    if (file.files.length > 0) {
      let groupId = this.selectedGroupUploadAdd.length > 0 && this.selectedGroupUploadAdd[0].id != "" ? this.selectedGroupUploadAdd[0].id : "";
      let groupName = this.selectedGroupUploadAdd.length > 0 && this.selectedGroupUploadAdd[0].itemName != "" ? this.selectedGroupUploadAdd[0].itemName : "";
      let response: any = await this.dataService.importExcelAndSavePhoneListDataPointAsync(null, file.files, groupId, this.groupCode, this.groupName, account);
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
          let filtered = this.selectedGroup.filter(a => this.selectedGroupUploadAdd.some(b => b.id === a.id));
          if (filtered.length == 0) {
            if (groupId != null && groupId != "") {
              this.selectedGroup.push({ "id": groupId, "itemName": groupName });
            } else {
              this.selectedGroup.push({ "id": response.data[0].GROUP_ID, "itemName": response.data[0].GROUP_NAME })
            }
          }
          this.getPhoneNumber(this.selectedGroup);
          this.loading = false;
          this.getDataGroup();
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
    if (event.length > 0) {
      this.lstChecked = [];
      this.lstCheckedName = [];
      for (let i = 0; i < event.length; i++) {
        if (!this.lstChecked.includes(event[i].id)) {
          this.lstChecked.push(event[i].id);
          this.lstCheckedName.push(event[i].itemName);
        }
        else {
          let index = this.lstChecked.indexOf(event[i].id);
          if (index != -1) {
            this.lstChecked.splice(index, 1);
            this.lstCheckedName.splice(index, 1);
          }
        }
      }
    } else {
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
    }

    this.ids = this.lstChecked.join(",");
    this.fileList = this.lstCheckedName.join(",");
    if (this.ids == null || this.ids == "" && this.numberPhone == 0) {
      this.countVTL = 0;
      this.countGPC = 0;
      this.countVMS = 0;
      this.totalNumber = 0;
      this.phonePaging(this.dataPhoneTamp);
      return;
    }
    this.loadingGroup = true;
    if (this.yourPoint == null) {
      this.yourPoint = "";
    }
    let response: any = await this.dataService.getAsync('/api/bankmember/GetBankMemberByGroupIdsPoint?groupIds=' + this.ids + '&point=' + this.yourPoint)
    this.loadingGroup = false;
    debugger
    if (response) {
      this.dataPhone = response.data.listPhoneTelco;
      let data = response.data;
      response = [];
      this.dataPhoneTamp = [];
      for (let i in this.dataPhone) {
        this.dataPhoneTamp.push(this.dataPhone[i]);
      }
      this.countVTL = data.countVIETTEL;
      this.countGPC = data.countVINAPHONE;
      this.countVMS = data.countMOBIFONE;
      this.totalNumber = this.countVTL + this.countGPC + this.countVMS;
      this.totalNumberSendSms = this.totalNumber + this.numberPhone;
      if (this.dataPhoneTamp.length == 0) {
        this.totalNumberSendSms = this.numberPhone;
      }
      this.phonePaging(this.dataPhoneTamp);
    }
    //this.GetPackage();
  }
  enableSend(event) {
    if (event) {
      this.isSendSMS = true;
      this.contentSMS.nativeElement.readOnly = false;
      this.settingsFilterOptionInsert = {
        text: this.utilityService.translate('package.choose_sender'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: false
      };
      this.settingsFilterOptionTempSms = {
        text: this.utilityService.translate('send_data.optionSms'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: false
      };
    }
    else {
      this.isSendSMS = false;
      this.contentSMS.nativeElement.readOnly = true;
      this.settingsFilterOptionInsert = {
        text: this.utilityService.translate('package.choose_sender'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: true
      };
      this.settingsFilterOptionTempSms = {
        text: this.utilityService.translate('send_data.optionSms'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: true
      };
    }
  }
  //option insert
  changeOptionInsert() {
    this.contentSMS.nativeElement.focus();
    let startString = this.contentSMS.nativeElement.value.substr(0, this.contentSMS.nativeElement.selectionStart);
    let endString = this.contentSMS.nativeElement.value.substr(this.contentSMS.nativeElement.selectionStart, this.contentSMS.nativeElement.value.length);
    this.smsContent = startString.trim() + this.selectedOptionInsert[0].id + endString.trim();
    this.contentSMS.nativeElement.focus();
    this.countSMS(this.smsContent);

  }
  //option insert
  changeOptionInsertSms() {
    this.contentSMS.nativeElement.value = "";
    this.contentSMS.nativeElement.focus();
    let startString = this.contentSMS.nativeElement.value.substr(0, this.contentSMS.nativeElement.selectionStart);
    let endString = this.contentSMS.nativeElement.value.substr(this.contentSMS.nativeElement.selectionStart, this.contentSMS.nativeElement.value.length);
    this.smsContent = startString.trim() + this.selectedOptionTempSms[0].conten_sms + endString.trim();
    this.contentSMS.nativeElement.focus();
    this.countSMS(this.smsContent);
  }
  countSMS(sms) {
    this.smsContent = this.utilityService.removeSign4VietnameseString(this.utilityService.removeDiacritics(sms));
    let result = "";

    for (var i = 0, len = this.smsContent.length; i < len; i++) {
      if (this.smsContent.charCodeAt(i) == 160) {
        result += " ";
      }
      else if (this.smsContent.charCodeAt(i) <= 127) {
        result += this.smsContent[i];
      }
    }
    this.smsContent = result;
    var lengthsms = 0
    for (var k = 0; k < this.smsContent.length; k++) {
      if (this.smsContent.charAt(k) == '\\' || this.smsContent.charAt(k) == '^'
        || this.smsContent.charAt(k) == '{' || this.smsContent.charAt(k) == '}' || this.smsContent.charAt(k) == '['
        || this.smsContent.charAt(k) == ']' || this.smsContent.charAt(k) == '|') {
        lengthsms = lengthsms + 2;
      }
      else {
        lengthsms = lengthsms + 1;
      }
    }
    this.numberChar = lengthsms;
    if (lengthsms == 0) {
      this.numberSMS = 0;
    }
    else if (lengthsms < 161) {
      this.numberSMS = 1;
    }
    else if (lengthsms < 307) {
      this.numberSMS = 2;
    }
    else if (lengthsms < 460) {
      this.numberSMS = 3;
    }
    else {
      this.numberSMS = 4;
      if (lengthsms > 612)
        this.smsContent = this.smsContent.substr(0, 612);
    }
  }

  async exportPhoneNumber() {
    if (this.lstChecked.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
      return;
    }
    let lstIdPhoneNumber = this.lstChecked.toString();
    let result: boolean = await this.dataService.getFileExtentionPhoneListAsync("/api/FileExtention/ExportExcelPhoneList", lstIdPhoneNumber, "ExportExcelPhoneList");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }
  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.phonePaging();
  }
  pageChanged(event: any): void {
    this.setPageIndex(event.page);
    this.phonePaging();
  }
  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.phonePaging();
  }
  clearData() {
    this.uploadFile.nativeElement.value = "";
  }

  showMessageModalSendData() {
    let time = new Date();
    this.timeSend = this.utilityService.formatDateToString(time, "yyyy/MM/dd HH:mm:ss");
    this.confirmSendDataSMSModal.show();
  }

  confirmSendDataSMS() {
    if (this.selectedItemBank.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-209"));
      return;
    }
    if (this.selectedItemAccount.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-21"));
      this.confirmSendDataSMSModal.hide();
      return;
    }
    if (this.yourPoint == "" || this.yourPoint == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-300"));
      return;
    }
    if (this.selectedItemPackagePointVTL.length == 0 && this.selectedItemPackagePointGPC.length == 0 && this.selectedItemPackagePointVMS.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    if (this.phoneList == "" && this.ids == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-25"));
      return;
    }
    if (this.dataPhoneTamp.length == 0 && this.phoneList == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-25"));
      return;
    }
    if (this.isSendSMS) {
      if (this.selectedItemSender.length == 0) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
        this.confirmSendDataSMSModal.hide();
        return;
      }

      // check đã nhập nội dung tin nhắn chưa
      let SMS_TEMP = this.utilityService.removeSign4VietnameseString(this.utilityService.removeDiacritics(this.smsContent));
      if (SMS_TEMP === '' || SMS_TEMP === null) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
        this.confirmSendDataSMSModal.hide();
        return;
      }
    }
    this.showMessageModalSendData();
  }

  async sendDataSMS() {
    this.loading = true;
    let ACCOUNT_ID = this.selectedItemAccount.length > 0 ? this.selectedItemAccount[0].id : 0;
    //tinh so diem da doi
    let BANK_ID = this.selectedItemBank.length > 0 ? this.selectedItemBank[0].id : 0;
    let POINT_BANK = 0;
    let EXCHANGE = 0;
    let resBank: any = await this.dataService.getAsync('/api/bankdata/GetBankDataById?bank_id=' + BANK_ID);
    if (resBank.data.length > 0) {
      if (resBank.err_code == 0) {
        POINT_BANK = resBank.data[0].POINT;
        EXCHANGE = resBank.data[0].EXCHANGE;
      }
    }
    let listPhoneNew = this.phoneList;
    let groups = this.ids;
    let PACKAGE_ID_VTL = this.selectedItemPackagePointVTL.length > 0 ? this.selectedItemPackagePointVTL[0].id : 0;
    let SMS_TEMP = this.utilityService.removeSign4VietnameseString(this.utilityService.removeDiacritics(this.smsContent));
    //get package name, package name display viettel, vina, mobifone
    let PACKAGE_NAME_VTL = '';
    let DATA_VOL_VTL = 0;
    let DATA_AMT_VTL = 0;
    let PACKAGE_NAME_DISPLAY_VTL = "";
    let POINT_USE_VTL = 0;
    let SMS_CONTENT_VTL = "";
    let resPackageVTL: any = await this.dataService.getAsync('/api/packagetelco/GetPackageTelcoById?id=' + PACKAGE_ID_VTL);
    if (resPackageVTL.data.length > 0) {
      if (resPackageVTL.err_code == 0) {
        PACKAGE_NAME_VTL = resPackageVTL.data[0].PACKAGE_NAME;
        DATA_VOL_VTL = resPackageVTL.data[0].DATA;
        DATA_AMT_VTL = resPackageVTL.data[0].AMT;
        PACKAGE_NAME_DISPLAY_VTL = resPackageVTL.data[0].PACKAGE_NAME_DISPLAY;
        POINT_USE_VTL = (DATA_AMT_VTL * POINT_BANK) / EXCHANGE;
        SMS_CONTENT_VTL = SMS_TEMP.replace(this.utilityService.translate('send_data.inPoint'), POINT_USE_VTL + ' diem').replace(this.utilityService.translate('send_data.inPack'), PACKAGE_NAME_VTL).replace(this.utilityService.translate('send_data.inData'), PACKAGE_NAME_DISPLAY_VTL);

      }
    }
    let PACKAGE_ID_GPC = this.selectedItemPackagePointGPC.length > 0 ? this.selectedItemPackagePointGPC[0].id : 0;
    let PACKAGE_NAME_GPC = '';
    let DATA_VOL_GPC = 0;
    let DATA_AMT_GPC = 0;
    let PACKAGE_NAME_DISPLAY_GPC = '';
    let POINT_USE_GPC = 0;
    let SMS_CONTENT_GPC = '';
    let resPackageGPC: any = await this.dataService.getAsync('/api/packagetelco/GetPackageTelcoById?id=' + PACKAGE_ID_GPC);
    if (resPackageGPC.data.length > 0) {
      if (resPackageGPC.err_code == 0) {
        PACKAGE_NAME_GPC = resPackageGPC.data[0].PACKAGE_NAME;
        DATA_VOL_GPC = resPackageGPC.data[0].DATA;
        DATA_AMT_GPC = resPackageGPC.data[0].AMT;
        PACKAGE_NAME_DISPLAY_GPC = resPackageGPC.data[0].PACKAGE_NAME_DISPLAY;
        POINT_USE_GPC = (DATA_AMT_GPC * POINT_BANK) / EXCHANGE;
        SMS_CONTENT_GPC = SMS_TEMP.replace(this.utilityService.translate('send_data.inPoint'), POINT_USE_GPC + ' diem').replace(this.utilityService.translate('send_data.inPack'), PACKAGE_NAME_GPC).replace(this.utilityService.translate('send_data.inData'), PACKAGE_NAME_DISPLAY_GPC);
      }
    }
    let PACKAGE_ID_VMS = this.selectedItemPackagePointVMS.length > 0 ? this.selectedItemPackagePointVMS[0].id : 0;
    let PACKAGE_NAME_VMS = '';
    let DATA_VOL_VMS = 0;
    let DATA_AMT_VMS = 0;
    let PACKAGE_NAME_DISPLAY_VMS = '';
    let POINT_USE_VMS = 0;
    let SMS_CONTENT_VMS = '';
    let resPackageVMS: any = await this.dataService.getAsync('/api/packagetelco/GetPackageTelcoById?id=' + PACKAGE_ID_VMS);
    if (resPackageVMS.data.length > 0) {
      if (resPackageVMS.err_code == 0) {
        PACKAGE_NAME_VMS = resPackageVMS.data[0].PACKAGE_NAME;
        DATA_VOL_VMS = resPackageVMS.data[0].DATA;
        DATA_AMT_VMS = resPackageVMS.data[0].AMT;
        PACKAGE_NAME_DISPLAY_VMS = resPackageVMS.data[0].PACKAGE_NAME_DISPLAY;
        POINT_USE_VMS = (DATA_AMT_VMS * POINT_BANK) / EXCHANGE;
        SMS_CONTENT_VMS = SMS_TEMP.replace(this.utilityService.translate('send_data.inPoint'), POINT_USE_VMS + ' diem').replace(this.utilityService.translate('send_data.inPack'), PACKAGE_NAME_VMS).replace(this.utilityService.translate('send_data.inData'), PACKAGE_NAME_DISPLAY_VMS);
      }
    }

    let SENDER_NAME = this.selectedItemSender.length > 0 ? this.selectedItemSender[0].itemName : "";
    let IS_SEND_SMS = this.isSendSMS == true ? 1 : 0;
    //insert data sms
    let resInsertDataSms: any = await this.dataService.getAsync('/api/DataSMS/InsertDataSmsDataPoint?account_id=' + ACCOUNT_ID + '&listPhoneNew=' + listPhoneNew
      + '&groups=' + groups + '&packVTL=' + PACKAGE_NAME_VTL + '&packGPC=' + PACKAGE_NAME_GPC + '&packVMS=' + PACKAGE_NAME_VMS + '&volVTL=' + DATA_VOL_VTL
      + '&volGPC=' + DATA_VOL_GPC + '&volVMS=' + DATA_VOL_VMS + '&amtVTL=' + DATA_AMT_VTL + '&amtGPC=' + DATA_AMT_GPC + '&amtVMS=' + DATA_AMT_VMS + '&smsVTL=' + SMS_CONTENT_VTL
      + '&smsGPC=' + SMS_CONTENT_GPC + '&smsVMS=' + SMS_CONTENT_VMS + '&sender=' + SENDER_NAME + '&point_use_vtl=' + POINT_USE_VTL + '&point_use_gpc=' + POINT_USE_GPC + '&point_use_vms=' + POINT_USE_VMS + '&point=' + this.yourPoint + '&is_send_sms=' + IS_SEND_SMS)
    if (resInsertDataSms) {
      if (resInsertDataSms.err_code == 0) {
        this.loading = false;
        this.messageAfterSend = resInsertDataSms.err_message;
        this.confirmAfterSuccessModal.show();
        setTimeout(() => {
          this.pageRefresh();
        }, 2000);
      }
      else this.notificationService.displayErrorMessage(resInsertDataSms.err_message);
      this.viewQuyData(ACCOUNT_ID);
      this.confirmSendDataSMSModal.hide();
      this.loading = false;
    }
  }

  pageRefresh() {
    location.reload();
  }
  public async viewQuyData(accountID) {
    if (accountID != undefined && accountID != "") {
      // get money by account
      let getDataAccount: any = await this.dataService.getAsync('/api/DataCimast/GetDataAccount?account_id=' +
        accountID);
      if (getDataAccount != null && getDataAccount.data.length > 0) {
        this.total_amt = getDataAccount.data[0].TOTAL_REMAIN;
      }
      else {
        this.total_amt = 0;
      }

      // get quota by account
      let getQuotaAccount: any = await this.dataService.getAsync('/api/AccountCimast/GetAccountCimastByAccountService?accountID=' +
        accountID + '&serviceName=CSKH');
      if (getQuotaAccount != null && getQuotaAccount.data.length > 0) {
        this.quota = getQuotaAccount.data[0].VOL;
      }
      else {
        this.quota = 0;
      }
    }
    else {
      this.total_amt = 0;
      this.quota = 0;
    }
  }

  ChangePackageVTL() {
    this.packViettel = this.selectedItemPackagePointVTL[0].itemName;
  }
  ChangePackageGPC() {
    this.packGPC = this.selectedItemPackagePointGPC[0].itemName;
  }
  ChangePackageVMS() {
    this.packVMS = this.selectedItemPackagePointVMS[0].itemName;
  }
  //#endregion
}

