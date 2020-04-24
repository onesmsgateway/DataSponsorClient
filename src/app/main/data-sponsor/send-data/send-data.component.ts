import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { Role } from 'src/app/core/models/role';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-send-data',
  templateUrl: './send-data.component.html',
  styleUrls: ['./send-data.component.css']
})
export class SendDataComponent implements OnInit {
  @ViewChild('contentSMS', { static: false }) public contentSMS;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('confirmDeleteFilePhoneModal', { static: false }) public confirmDeleteFilePhoneModal: ModalDirective;
  @ViewChild('confirmAfterSuccessModal', { static: false }) public confirmAfterSuccessModal: ModalDirective;
  @ViewChild('confirmSendDataSMSModal', { static: false }) public confirmSendDataSMSModal: ModalDirective;
  @ViewChild('uploadFile', { static: false }) public uploadFile;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;

  public dataPhone = [];
  public dataPhoneTamp = [];
  public dataType = [];
  public dataFileList = [];
  public dataPackage = [];
  public dataAccount = [];
  public dataPhonePaging = [];
  public dataSenderName = [];
  public settingsFilterAccount = {};
  public settingsFilterFileList = {};
  public settingsFilterPackage = {};
  public settingsFilterSender = {};
  public settingsFilterType = {};
  public selectedItemComboboxType = [];
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxFileList = [];
  public selectedItemComboboxPackage = [];
  public selectedItemComboboxSender = [];
  public lstIdsAccountPhoneList = [];
  public lstChecked = [];
  public lstCheckedName = [];
  public phone;
  public lstId;
  public lstName;
  public accountId;
  public isShowDateTime;
  public isSendSMS: boolean = false;
  public isSendExcel: boolean = false;
  public phoneList: string = "";
  public fileName;
  public slType;
  public senderName: string = "";
  public account: string = "";
  public timeSend: string = "";
  public quotaExpected: string = "";
  public fileList: string = "";
  public ACCOUNT_ID: any = null;
  public SENDER_ID: any = null;
  public SMS_TEMPLATE: any = null;
  public PROGRAM_NAME: any = null;
  public TIMESCHEDULE: any = null;
  public IS_SEND_SMS: any = null;
  public PACKAGE_ID: any = null;
  public packageNum: string = "";

  public amt_expected = null;
  public numberPhone = 0;
  public totalNumber = 0;
  public numberChar = 0;
  public numberSMS = 0;
  public smsContent: string = '';
  public minDate: Date;
  public pagination: Pagination = new Pagination();

  public timeSchedule: Date;
  public programName: string = '';

  public total_amt = 0;
  public quota = 0;
  public role: Role = new Role();
  public loading: boolean = false;
  public isAdmin: boolean = false;

  constructor(private dataService: DataService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private authService: AuthService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterAccount = {
      //text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterFileList = {
      text: this.utilityService.translate('package.choose_phone_list'),
      singleSelection: false,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data')
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

    this.settingsFilterType = {
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      showCheckbox: false
    };

    this.settingsFilterPackage = {
      text: this.utilityService.translate('package.choose_package'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.dataType.push({ id: "0", itemName: this.utilityService.translate('package.send_from_sys') });
    this.dataType.push({ id: "1", itemName: this.utilityService.translate('package.send_from_excel') });

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
  }
  ngOnInit() {
    this.getAccountLogin();
    this.selectedItemComboboxType.push({ id: "0", itemName: this.utilityService.translate('package.send_from_sys') });
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
  }

  //#region view quy data
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
  //#endregion

  //#region load and change phone list
  public async bindDataPhoneList() {
    this.dataFileList = [];
    this.selectedItemComboboxFileList = [];
    if (this.selectedItemComboboxAccount.length > 0) {
      let accountId = this.accountId == null || this.accountId == "" ? this.selectedItemComboboxAccount[0].id : this.accountId;
      let response: any = await this.dataService.getAsync('/api/AccountPhoneList/GetPhoneListByAccountAndType?accountID=' +
        accountId + '&listType=Data-Sponsor');
      for (let index in response.data) {
        this.dataFileList.push({ "id": response.data[index].ID, "itemName": response.data[index].LIST_NAME });
      }
    }
  }

  // change type
  changeType() {
    if (this.selectedItemComboboxType.length > 0) {
      if (this.selectedItemComboboxType[0].id == 1) {
        this.isSendExcel = true;
      } else {
        this.isSendExcel = false;
        this.amt_expected = null;
        this.selectedItemComboboxPackage = [];
      }
    }
  }

  // get phone by file list 
  async getPhoneNumber(event) {
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
    if (ids != "") {
      this.lstIdsAccountPhoneList = [];
      this.lstIdsAccountPhoneList.push(ids);
    }
    // get và lọc trùng sđt
    let listTelco = "VIETTEL,GPC,VMS";
    let response: any = await this.dataService.getAsync('/api/AccountPhoneListDetail/GetPhoneByListID?listID=' + ids + '&listTelco=' + listTelco)
    if (response) {
      this.dataPhone = response.data.listPhoneTelco;
      response = [];
      let tamp = Array.from(new Set(this.dataPhone.map(s => s.PHONE))).map(p => {
        return {
          LIST_ID: this.dataPhone.find(s => s.PHONE == p).LIST_ID,
          PHONE: p,
          TELCO: this.dataPhone.find(s => s.PHONE == p).TELCO
        }
      });
      this.dataPhone = tamp;
      for (let i in this.dataPhone) {
        this.dataPhoneTamp.push(this.dataPhone[i]);
      }
      this.totalNumber = this.dataPhoneTamp.length;
      this.phonePaging(response.data);
    }
    this.GetPackage();
  }
  //#endregion

  // count mes
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

  //#region load data account
  async getDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess == 50) {
      this.selectedItemComboboxAccount = [{ "id": 0, "itemName": "Chọn tài khoản" }];
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
        this.getDataSenderName(this.dataAccount[0].id);
        this.bindDataPhoneList();
        this.viewQuyData(this.selectedItemComboboxAccount[0].id);
      }
      else
        this.selectedItemComboboxAccount.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
  }

  changeAccount() {
    this.getDataSenderName(this.selectedItemComboboxAccount[0].id);
    this.dataPhone = [];
    this.lstChecked = [];
    this.bindDataPhoneList();
    this.viewQuyData(this.selectedItemComboboxAccount[0].id);
  }

  deSelectAccount() {
    this.bindDataPhoneList();
    this.total_amt = 0;
  }
  //#endregion

  // get data sender
  async getDataSenderName(accountID) {
    this.selectedItemComboboxSender = [];
    this.dataSenderName = [];
    let response: any = await this.dataService.getAsync('/api/SenderName/GetSenderByAccountAndType?accountID=' +
      accountID + "&smsType=CSKH")
    for (let index in response.data) {
      this.dataSenderName.push({ "id": response.data[index].ID, "itemName": response.data[index].NAME });
    }
    if (this.dataSenderName.length == 1)
      this.selectedItemComboboxSender.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
  }

  // get data package
  async getDataPackage() {
    this.selectedItemComboboxPackage = [];
    this.dataPackage = [];
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageDomainPaging?pageIndex=1&pageSize=9999&package_name=')
    for (let index in response.data) {
      this.dataPackage.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].DATA + "MB" + " - Giá: " + response.data[index].TOTAL_AMT + " VNĐ - " + response.data[index].DATE_USE + " ngày" });
    }
    if (this.dataPackage.length == 1)
      this.selectedItemComboboxSender.push({ "id": this.dataPackage[0].id, "itemName": this.dataPackage[0].itemName });
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
    }
    else {
      this.dataPhone = this.dataPhonePaging;
      this.totalNumber = this.dataPhone.length;
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.phonePaging();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
    this.phonePaging();
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.phonePaging();
  }
  //#endregion

  // export phone number
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

  //#region 
  // show modal upload excel
  showModalUpload() {
    this.clearData();
    this.lstName = '';
    let accountId = this.authService.currentUserValue;
    this.accountId = accountId.ACCOUNT_ID;
    this.uploadExcelModal.show();
  }

  // upload file
  public async submitUploadFile() {
    this.loading = true;
    if (this.lstName === '' || this.lstName === null || this.lstName === 'undefined') {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      return;
    }
    let file = this.uploadFile.nativeElement;
    if (file.files.length > 0) {
      let response: any = await this.dataService.importExcelAndSavePhoneListDataAsync(null, file.files, 2, this.lstName);
      if (response) {
        if (response == null || response.err_code != 0) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
          this.loading = false;
          return;
        }
        this.dataFileList = [];
        this.bindDataPhoneList();
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("130"));
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        this.loading = false;
      }
    }
    this.loading = false;
  }
  //#endregion

  clearData() {
    this.uploadFile.nativeElement.value = "";
  }

  checkTimeSchedule(event) {
    if (event) {
      this.isShowDateTime = true;
    }
    else {
      this.isShowDateTime = false;
    }
  }

  //#region  show modal and send sms
  // showModalSendSMS() {
  //   this.loading = false;
  //   this.confirmSendSMSModal.show();
  // }

  //show confirm send data sms
  async sendDataSMS() {
    this.ACCOUNT_ID = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : 0;
    if (this.ACCOUNT_ID == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-21"));
      this.confirmSendDataSMSModal.hide();
      return;
    }
    this.account = this.selectedItemComboboxAccount[0].itemName;

    //send sms to customer from One
    if (this.isSendSMS) {
      this.SENDER_ID = this.selectedItemComboboxSender.length > 0 ? this.selectedItemComboboxSender[0].id : "";
      if (this.SENDER_ID == "") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
        this.confirmSendDataSMSModal.hide();
        return;
      }
      this.senderName = this.selectedItemComboboxSender[0].itemName;

      // check đã nhập nội dung tin nhắn chưa
      this.SMS_TEMPLATE = this.utilityService.removeSign4VietnameseString(this.utilityService.removeDiacritics(this.smsContent));
      if (this.SMS_TEMPLATE === '' || this.SMS_TEMPLATE === null) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
        this.confirmSendDataSMSModal.hide();
        return;
      }
    }

    // check tên chương trình
    this.PROGRAM_NAME = this.programName;
    if (this.PROGRAM_NAME === '' || this.PROGRAM_NAME === null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
      this.confirmSendDataSMSModal.hide();
      return;
    }

    let time = new Date();
    if (this.isShowDateTime) {
      time = this.timeSchedule;
    }
    this.TIMESCHEDULE = this.utilityService.formatDateToString(time, "yyyyMMddHHmmss");
    this.timeSend = this.utilityService.formatDateToString(time, "yyyy/MM/dd HH:mm:ss");
    this.IS_SEND_SMS = this.isSendSMS ? 1 : 0;

    // check gói cước
    this.PACKAGE_ID = this.selectedItemComboboxPackage.length > 0 ? this.selectedItemComboboxPackage[0].id : "";
    if (this.PACKAGE_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      this.confirmSendDataSMSModal.hide();
      return;
    }

    if (this.isSendExcel)
      this.fileList = "Tất cả";
    this.confirmSendDataSMSModal.show();
  }

  // send data sms
  async confirmSendSMS() {
    this.loading = true;
    if (this.isSendExcel) {
      if (this.lstName === '' || this.lstName === null || this.lstName === 'undefined') {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
        this.loading = false;
        this.confirmSendDataSMSModal.hide();
        return;
      }
      let file = this.uploadFile.nativeElement;
      if (file.files.length > 0) {
        let response: any = await this.dataService.getDataFromExcelAsync(null, file.files);
        if (response && response.err_code == 0) {
          let listSmsSend = [];
          if (this.isSendSMS) {
            for (let i = 0; i < response.data.length; i++) {
              let phone = response.data[i].PHONE;
              let DATA_VOL = response.data[i].DATA_VOL;
              listSmsSend.push({
                ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, DATA_VOL: DATA_VOL, SENDER_ID: this.SENDER_ID, SMS_CONTENT: this.SMS_TEMPLATE
                , TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS
                , PACKAGE_ID: this.PACKAGE_ID
              });
            }
          } else {
            for (let i = 0; i < response.data.length; i++) {
              let phone = response.data[i].PHONE;
              let DATA_VOL = response.data[i].DATA_VOL;
              listSmsSend.push({
                ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, DATA_VOL: DATA_VOL
                , TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS
                , PACKAGE_ID: this.PACKAGE_ID
              });
            }
          }

          let insertSms: any = await this.dataService.postAsync('/api/DataSMS/InsertListSMS', listSmsSend);
          if (insertSms != null && insertSms.err_code == 0)
            this.notificationService.displaySuccessMessage(insertSms.err_message);
          else this.notificationService.displayErrorMessage(insertSms.err_message);

          this.viewQuyData(this.ACCOUNT_ID);
          this.confirmSendDataSMSModal.hide();
        }
        else {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
          this.loading = false;
          return;
        }
        this.dataFileList = [];
      }
    }
    else {
      // check đã nhập số data chưa
      if (this.selectedItemComboboxPackage.length == 0) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
        this.loading = false;
        this.confirmSendDataSMSModal.hide();
        return;
      }
      let DATA: number = this.selectedItemComboboxPackage[0].itemName.substr(this.selectedItemComboboxPackage[0].itemName.indexOf('-'), this.selectedItemComboboxPackage[0].itemName.indexOf('-') - 1).replace('-', '').replace('-', '').replace('MB', '').trim();

      // check exists phone list
      if (this.dataPhoneTamp.length == 0) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-25"));
        this.loading = false;
        this.confirmSendDataSMSModal.hide();
        return;
      }

      let listSmsSend = [];
      if (this.isSendSMS) {
        for (let i = 0; i < this.dataPhoneTamp.length; i++) {
          let phone = this.dataPhoneTamp[i].PHONE;
          listSmsSend.push({
            ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, DATA_VOL: Number(DATA), SENDER_ID: this.SENDER_ID, SMS_CONTENT: this.SMS_TEMPLATE
            , TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS
            , PACKAGE_ID: this.PACKAGE_ID
          });
        }
      }
      else {
        for (let i = 0; i < this.dataPhoneTamp.length; i++) {
          let phone = this.dataPhoneTamp[i].PHONE;
          listSmsSend.push({
            ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, DATA_VOL: Number(DATA), SENDER_ID: this.SENDER_ID, PROGRAM_NAME: this.PROGRAM_NAME, TIME_SCHEDULE: this.TIMESCHEDULE
            , TYPE: "DATA_SPONSOR", IS_READ: 1, PACKAGE_ID: this.PACKAGE_ID
          });
        }
      }

      let insertSms = await this.dataService.postAsync('/api/DataSMS/InsertListDataCampaign', listSmsSend);
      if (insertSms.err_code == 0)
        this.notificationService.displaySuccessMessage(insertSms.err_message);
      else this.notificationService.displayErrorMessage(insertSms.err_message);

      this.viewQuyData(this.ACCOUNT_ID);
    }
    this.confirmSendDataSMSModal.hide();
    this.loading = false;
  }
  //#endregion

  // enable/disable sms content
  enableSend(event) {
    if (event) {
      this.contentSMS.nativeElement.readOnly = false;
    }
    else {
      this.contentSMS.nativeElement.readOnly = true;
    }
  }

  // input money to choose package
  async GetPackage() {
    if (this.isSendExcel) {
      let file = this.uploadFile.nativeElement;
      if (this.amt_expected > 0 && file.files.length > 0) {
        let phoneList = await this.dataService.getDataFromExcelAsync(null, file.files);
        if (phoneList.data.length > 0) {
          let total_amt = this.amt_expected * phoneList.data.length;
          let detail = await this.dataService.getAsync('/api/PackageDomain/GetPackageDomainByAmt?&amt=' + total_amt);
          if (detail.err_code == 0) {
            this.selectedItemComboboxPackage = [];
            this.selectedItemComboboxPackage.push({ "id": detail.data[0].ID, "itemName": detail.data[0].PACKAGE_NAME + " - " + detail.data[0].DATA + "MB" + " - Giá: " + detail.data[0].TOTAL_AMT + " VNĐ - " + detail.data[0].DATE_USE + " ngày" });
          }
        }
      }
    }
    else {
      if (this.selectedItemComboboxFileList.length > 0 && this.amt_expected > 0) {
        if (this.dataPhoneTamp.length > 0) {
          let total_amt = this.amt_expected * this.dataPhoneTamp.length;
          let detail = await this.dataService.getAsync('/api/PackageDomain/GetPackageDomainByAmt?&amt=' + total_amt);
          if (detail.err_code == 0) {
            this.selectedItemComboboxPackage = [];
            this.selectedItemComboboxPackage.push({ "id": detail.data[0].ID, "itemName": detail.data[0].PACKAGE_NAME + " - " + detail.data[0].DATA + "MB" + " - Giá: " + detail.data[0].TOTAL_AMT + " VNĐ - " + detail.data[0].DATE_USE + " ngày" });
          }
        }
      }
    }
  }

  //send sms continue
  confirmAfterSuccess() {
    this.confirmAfterSuccessModal.hide();
    this.selectedItemComboboxAccount = [];
    this.selectedItemComboboxSender = [];
    this.selectedItemComboboxFileList = [];
    this.selectedItemComboboxPackage = [];
    this.lstChecked = [];
    this.smsContent = "";
    this.phoneList = "";
    this.programName = "";
    this.dataPhone = [];
    this.dataPhoneTamp = [];
    this.numberPhone = 0;
  }

  // export template excel
  async excelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "DataSms", "template_add_data.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  // export template excel
  async excelTemplateOnlyPhone() {
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "Sms", "Sample_PhoneList.xlsx");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  // show modal delete phone
  showConfirmDelete(list_id, phone) {
    this.lstId = list_id;
    this.phone = phone;
    this.confirmDeleteModal.show();
  }

  // delete phone
  async confirmDelete() {
    let response: any = await this.dataService.deleteAsync('/api/accountphonelistdetail/DeletePhone?lstId=' + this.lstId + '&phone=' + this.phone)
    if (response.err_code == 0) {
      this.phonePaging(response.data);
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("103"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // show modal delete phone
  showConfirmDeleteFile(list_id, fileName) {
    this.lstId = list_id;
    this.fileName = fileName;
    this.confirmDeleteFilePhoneModal.show();
  }

  // delete file phone list
  async confirmDeleteListFile() {
    let response: any = await this.dataService.deleteAsync('/api/AccountPhoneList/' + this.lstId)
    if (response.err_code == 0) {
      let responseDetail: any = await this.dataService.deleteAsync('/api/AccountPhoneListDetail/DeleteAccountPhoneListDetailByAccountPhoneList?id=' + this.lstId)
      if (responseDetail.err_code == 0) {
        this.bindDataPhoneList();
        this.dataPhone = [];
        this.lstChecked = [];
        this.confirmDeleteFilePhoneModal.hide();
      }
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
}
