import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { Role } from 'src/app/core/models/role';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { async } from '@angular/core/testing';

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
  @ViewChild('choosePackageModal', { static: false }) public choosePackageModal: ModalDirective;
  @ViewChild('uploadFile', { static: false }) public uploadFile;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;

  public dataPhone = [];
  public dataPhoneTamp = [];
  public dataAccount = [];
  public dataSenderName = [];
  public dataPackageVTL = [];
  public dataPackageGPC = [];
  public dataPackageVMS = [];
  public dataPhonePaging = [];
  public dataGroup = [];
  public dataCampaign = [];
  public settingsFilterAccount = {};
  public settingsFilterSender = {};
  public settingsFilterPackageVTL = {};
  public settingsFilterPackageGPC = {};
  public settingsFilterPackageVMS = {};
  public settingsFilterGroup = {};
  public settingsFilterCampaign = {};
  public settingsFilterGroupUpload = {};
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxSender = [];
  public selectedGroup = [];
  public selectedCampaign = [];
  public selectedGroupUpload = [];
  public selectedPackageVTL = [];
  public selectedPackageGPC = [];
  public selectedPackageVMS = [];
  public lstChecked = [];
  public lstCheckedName = [];
  public phone;
  public lstId;
  public isShowDateTime;
  public effectiveDateVTL;
  public effectiveDateGPC;
  public effectiveDateVMS;
  public packageAmtVTL;
  public packageAmtGPC;
  public packageAmtVMS;
  public groupCode = "";
  public groupName = "";
  public packCountVTL = 1;
  public packCountGPC = 1;
  public packCountVMS = 1;
  public totalPackVTL = 0;
  public totalPackGPC = 0;
  public totalPackVMS = 0;
  public totalAmtVTL = 0;
  public totalAmtGPC = 0;
  public totalAmtVMS = 0;
  public countVTL = 0;
  public countGPC = 0;
  public countVMS = 0;
  public totalAmt = 0;
  public timeDonate: string = "";
  public isSendSMS: boolean = true;
  public chkcampaign: boolean = true;
  public chkOnlyOne: boolean = false;
  public campaign: boolean = true;
  public phoneList: string = "";
  public fileName;
  public senderName: string = "";
  public account: string = "";
  public timeSend: string = "";
  public quotaExpected: string = "";
  public fileList: string = "";
  public phoneNew: string = "";
  public packViettel: string = "0";
  public packGPC: string = "0";
  public packVMS: string = "0";
  public ACCOUNT_ID: any = null;
  public SENDER_ID: any = null;
  public SMS_TEMPLATE: any = null;
  public PROGRAM_NAME: any = null;
  public TIMESCHEDULE: any = null;
  public IS_SEND_SMS: any = null;
  public PACKAGE_ID: any = null;

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

    this.settingsFilterGroup = {
      text: this.utilityService.translate('send_data.phone_list'),
      singleSelection: false,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data')
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

    this.settingsFilterSender = {
      text: this.utilityService.translate('package.choose_sender'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterGroup = {
      text: this.utilityService.translate('send_data.group'),
      singleSelection: false,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data')
    };

    this.settingsFilterGroupUpload = {
      text: this.utilityService.translate('send_data.phone_list'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterCampaign = {
      text: this.utilityService.translate('send_data.inCampaign'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
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

  checkCampaign(event) {
    if (event == "0") {
      this.chkcampaign = true;
    }
    else {
      this.chkcampaign = false;
      this.getCampaign();
    }
  }

  async getCampaign() {
    this.dataCampaign = [];
    this.selectedCampaign = [];
    let account = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignByAccount?account_id=' + account)
    for (let index in response.data) {
      this.dataCampaign.push({ "id": response.data[index].ID, "itemName": response.data[index].PROGRAM_NAME });
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
    let response: any = await this.dataService.getAsync('/api/Person/GetPersonByGroupIds?groupIds=' + ids)
    if (response) {
      this.dataPhone = response.data.listPhoneTelco;
      let data = response.data;
      response = [];
      // let tamp = Array.from(new Set(this.dataPhone.map(s => s.PHONE))).map(p => {
      //   return {
      //     LIST_ID: this.dataPhone.find(s => s.PHONE == p).LIST_ID,
      //     PHONE: p,
      //     TELCO: this.dataPhone.find(s => s.PHONE == p).TELCO
      //   }
      // });
      // this.dataPhone = tamp;
      for (let i in this.dataPhone) {
        this.dataPhoneTamp.push(this.dataPhone[i]);
      }
      this.countVTL = data.countVIETTEL;
      this.countGPC = data.countGPC;
      this.countVMS = data.countVMS;
      this.totalNumber = this.dataPhoneTamp.length;

      // total amt by telco
      if (this.packCountVTL != null && this.packCountVTL > 0 && this.packageAmtVTL != null && this.packageAmtVTL > 0 && this.dataPhoneTamp.length > 0) {
        this.totalPackVTL = this.packCountVTL * this.countVTL;
        this.totalAmtVTL = this.packageAmtVTL * this.totalPackVTL;
      }
      if (this.packCountGPC != null && this.packCountGPC > 0 && this.packageAmtGPC != null && this.packageAmtGPC > 0 && this.dataPhoneTamp.length > 0) {
        this.totalPackGPC = this.packCountGPC * this.countGPC;
        this.totalAmtGPC = this.packageAmtGPC * this.totalPackGPC;
      }
      if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS != null && this.packageAmtVMS > 0 && this.dataPhoneTamp.length > 0) {
        this.totalPackVMS = this.packCountVMS * this.countVMS;
        this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
      }
      this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
      if(this.selectedPackageVTL.length > 0) this.packViettel = this.selectedPackageVTL[0].itemName + " x " + this.totalPackVTL;
      if(this.selectedPackageGPC.length > 0) this.packGPC = this.selectedPackageGPC[0].itemName + " x " + this.totalPackGPC;
      if(this.selectedPackageVMS.length > 0) this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
      this.phonePaging(response.data);
    } else {
      this.totalAmtVTL = 0;
      this.totalAmtGPC = 0;
      this.totalAmtVMS = 0;
      this.totalAmt = 0;
    }
    //this.GetPackage();
  }

  countPhone(phone) {
    let phoneList: any = [];
    phoneList = this.checkPhone(phone);
    if (phoneList.length == 0)
      this.numberPhone = 0;
    else if (phoneList.includes(";"))
      this.numberPhone = phoneList.split(';').length - 1;
    else
      this.numberPhone = 1;
  }

  // count phone
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
    if (this.isAdmin) {
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
        this.getDataGroup();
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
    this.getDataGroup();
    this.getCampaign();
    this.viewQuyData(this.selectedItemComboboxAccount[0].id);
  }

  deSelectAccount() {
    this.getDataGroup();
    this.getCampaign();
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

  // get data package viettel
  async getDataPackageVTL() {
    this.dataPackageVTL = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VIETTEL')
    for (let index in response.data) {
      this.dataPackageVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVTL.length == 1)
      this.selectedPackageVTL.push({ "id": this.dataPackageVTL[0].id, "itemName": this.dataPackageVTL[0].itemName });
  }

  async changePackageVTL() {
    this.packViettel = "0";
    if (this.selectedPackageVTL.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/' + this.selectedPackageVTL[0].id);
      if (response != null && response.err_code == 0) {
        this.effectiveDateVTL = response.data[0].DATE_USE + " ngày";
        this.packageAmtVTL = response.data[0].AMT;
        if (this.packCountVTL != null && this.packCountVTL > 0 && this.packageAmtVTL != null && this.packageAmtVTL > 0 && this.dataPhoneTamp.length > 0) {
          this.totalPackVTL = this.packCountVTL * this.countVTL;
          this.totalAmtVTL = this.packageAmtVTL * this.totalPackVTL;
          this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
          this.packViettel = this.selectedPackageVTL[0].itemName + " x " + this.totalPackVTL;
        }
      }
    }
  }

  changeCountVTL() {
    this.packViettel = "0";
    if (this.packCountVTL != null && this.packCountVTL > 0 && this.packageAmtVTL != null && this.packageAmtVTL > 0 && this.dataPhoneTamp.length > 0) {
      this.totalPackVTL = this.packCountVTL * this.countVTL;
      this.totalAmtVTL = this.packageAmtVTL * this.totalPackVTL;
      this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
      this.packViettel = this.selectedPackageVTL[0].itemName + " x " + this.totalPackVTL;
    }
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

  async changePackageGPC() {
    this.packGPC = "0";
    if (this.selectedPackageGPC.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/' + this.selectedPackageGPC[0].id);
      if (response != null && response.err_code == 0) {
        this.effectiveDateGPC = response.data[0].DATE_USE + " ngày";
        this.packageAmtGPC = response.data[0].AMT;
        if (this.packCountGPC != null && this.packCountGPC > 0 && this.packageAmtGPC != null && this.packageAmtGPC > 0 && this.dataPhoneTamp.length > 0) {
          this.totalPackGPC = this.packCountGPC * this.countGPC;
          this.totalAmtGPC = this.packageAmtGPC * this.totalPackGPC;
          this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
          this.packGPC = this.selectedPackageGPC[0].itemName + " x " + this.totalPackGPC;
        }
      }
    }
  }

  changeCountGPC() {
    this.packGPC = "0";
    if (this.packCountGPC != null && this.packCountGPC > 0 && this.packageAmtGPC != null && this.packageAmtGPC > 0 && this.dataPhoneTamp.length > 0) {
      this.totalPackGPC = this.packCountGPC * this.countGPC;
      this.totalAmtGPC = this.packageAmtGPC * this.totalPackGPC;
      this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
      this.packGPC = this.selectedPackageGPC[0].itemName + " x " + this.totalPackGPC;
    }
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

  async changePackageVMS() {
    this.packVMS = "0";
    if (this.selectedPackageVMS.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/' + this.selectedPackageVMS[0].id);
      if (response != null && response.err_code == 0) {
        this.effectiveDateVMS = response.data[0].DATE_USE + " ngày";
        this.packageAmtVMS = response.data[0].AMT;
        if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS != null && this.packageAmtVMS > 0 && this.dataPhoneTamp.length > 0) {
          this.totalPackVMS = this.packCountVMS * this.countVMS;
          this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
          this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
          this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
        }
      }
    }
  }

  changeCountVMS() {
    this.packVMS = "0";
    if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS != null && this.packageAmtVMS > 0 && this.dataPhoneTamp.length > 0) {
      this.totalPackVMS = this.packCountVMS * this.countVMS;
      this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
      this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
      this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
    }
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
    this.getDataGroup();
    this.uploadExcelModal.show();
  }

  async getDataGroup() {
    this.selectedGroup = [];
    this.dataGroup = [];
    let account = "";
    account = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/Group/GetGroupByAccount?account_id=' + account)
    for (let index in response.data) {
      this.dataGroup.push({ "id": response.data[index].GROUP_ID, "itemName": response.data[index].GROUP_NAME });
    }
  }

  // upload file
  public async submitUploadFile() {
    this.loading = true;
    if (this.selectedGroupUpload.length == 0 && (this.groupCode == null || this.groupCode == "")) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-99"));
    }
    let accountId = "";
    if (this.isAdmin)
      accountId = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
    else
      accountId = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let file = this.uploadFile.nativeElement;
    if (file.files.length > 0) {
      let groupId = this.selectedGroupUpload.length > 0 && this.selectedGroupUpload[0].id != "" ? this.selectedGroupUpload[0].id : "";
      let response: any = await this.dataService.importExcelAndSavePhoneListDataAsync(null, file.files, groupId, this.groupCode, this.groupName, accountId);
      if (response) {
        if (response.err_code == -19) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-100"));
          this.loading = false;
          return;
        }
        this.getDataGroup();
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("130"));
        this.groupCode = "";
        this.groupName = "";
        this.uploadExcelModal.hide();
      }
      else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        this.loading = false;
      }
    }
    this.loading = false;
  }
  //#endregion

  showModalPackage() {
    this.getDataPackageVTL();
    this.getDataPackageGPC();
    this.getDataPackageVMS();
    this.choosePackageModal.show();
  }

  //chọn gói cước
  submitPackage() {
    this.choosePackageModal.hide();
  }

  clearData() {
    this.uploadFile.nativeElement.value = "";
  }

  checkTimeSchedule(event) {
    if (event == "1") {
      this.isShowDateTime = true;
    }
    else {
      this.isShowDateTime = false;
    }
  }

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
    
    // check package
    if (this.selectedPackageVTL.length == 0 && this.selectedPackageGPC.length == 0 && this.selectedPackageVMS.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      this.loading = false;
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
    this.PACKAGE_ID = this.selectedPackageVTL.length > 0 ? this.selectedPackageVTL[0].id : "";
    if (this.PACKAGE_ID == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      this.confirmSendDataSMSModal.hide();
      return;
    }

    this.confirmSendDataSMSModal.show();
  }

  // send data sms
  async confirmSendSMS() {
    this.loading = true;
    // if (this.isSendExcel) {
    //   if (this.lstName === '' || this.lstName === null || this.lstName === 'undefined') {
    //     this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
    //     this.loading = false;
    //     this.confirmSendDataSMSModal.hide();
    //     return;
    //   }
    //   let DATA_VOL = this.selectedPackageVTL[0].itemName.substr(this.selectedPackageVTL[0].itemName.indexOf('-'), this.selectedPackageVTL[0].itemName.indexOf('-') - 1).replace('-', '').replace('-', '').replace('M', '').replace('B', '').trim();
    //   let file = this.uploadFile.nativeElement;
    //   if (file.files.length > 0) {
    //     let response: any = await this.dataService.getDataFromExcelAsync(null, file.files);
    //     if (response && response.err_code == 0) {
    //       let listSmsSend = [];
    //       if (this.isSendSMS) {
    //         for (let i = 0; i < response.data.length; i++) {
    //           let phone = response.data[i];
    //           listSmsSend.push({
    //             ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, DATA_VOL: Number(DATA_VOL), SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, SMS_CONTENT: this.SMS_TEMPLATE
    //             , TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS, PACKAGE_ID: this.PACKAGE_ID
    //           });
    //         }
    //       } else {
    //         for (let i = 0; i < response.data.length; i++) {
    //           let phone = response.data[i].PHONE;
    //           listSmsSend.push({
    //             ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, DATA_VOL: Number(DATA_VOL)
    //             , TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS, PACKAGE_ID: this.PACKAGE_ID
    //           });
    //         }
    //       }

    //       let insertSms: any = await this.dataService.postAsync('/api/DataSMS/InsertListSMS', listSmsSend);
    //       if (insertSms != null && insertSms.err_code == 0)
    //         this.notificationService.displaySuccessMessage(insertSms.err_message);
    //       else this.notificationService.displayErrorMessage(insertSms.err_message);

    //       this.viewQuyData(this.ACCOUNT_ID);
    //       this.confirmSendDataSMSModal.hide();
    //     }
    //     else {
    //       this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    //       this.loading = false;
    //       return;
    //     }
    //     this.dataFileList = [];
    //   }
    // }
    let DATA: number = this.selectedPackageVTL[0].itemName.substr(this.selectedPackageVTL[0].itemName.indexOf('-'), this.selectedPackageVTL[0].itemName.indexOf('-') - 1).replace('-', '').replace('-', '').replace('M', '').replace('B', '').trim();

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
          ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, DATA_VOL: Number(DATA), SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, SMS_CONTENT: this.SMS_TEMPLATE
          , TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS, PACKAGE_ID: this.PACKAGE_ID
        });
      }
    }
    else {
      for (let i = 0; i < this.dataPhoneTamp.length; i++) {
        let phone = this.dataPhoneTamp[i].PHONE;
        listSmsSend.push({
          ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, DATA_VOL: Number(DATA), SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, PROGRAM_NAME: this.PROGRAM_NAME, TIME_SCHEDULE: this.TIMESCHEDULE
          , TYPE: "DATA_SPONSOR", IS_READ: 1, PACKAGE_ID: this.PACKAGE_ID
        });
      }
    }

    let insertSms = await this.dataService.postAsync('/api/DataSMS/InsertListDataCampaign', listSmsSend);
    if (insertSms.err_code == 0)
      this.notificationService.displaySuccessMessage(insertSms.err_message);
    else this.notificationService.displayErrorMessage(insertSms.err_message);

    this.viewQuyData(this.ACCOUNT_ID);
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
  // async GetPackage() {
  //   if (this.isSendExcel) {
  //     let file = this.uploadFile.nativeElement;
  //     if (this.amt_expected > 0 && file.files.length > 0) {
  //       let phoneList = await this.dataService.getDataFromExcelAsync(null, file.files);
  //       if (phoneList.data.length > 0) {
  //         let total_amt = this.amt_expected * phoneList.data.length;
  //         let detail = await this.dataService.getAsync('/api/PackageDomain/GetPackageDomainByAmt?&amt=' + total_amt);
  //         if (detail.err_code == 0) {
  //           this.selectedItemComboboxPackage = [];
  //           this.selectedItemComboboxPackage.push({ "id": detail.data[0].ID, "itemName": detail.data[0].PACKAGE_NAME + " - " + detail.data[0].DATA + "MB" + " - Giá: " + detail.data[0].TOTAL_AMT + " VNĐ - " + detail.data[0].DATE_USE + " ngày" });
  //         }
  //       }
  //     }
  //   }
  //   else {
  //     if (this.selectedItemComboboxFileList.length > 0 && this.amt_expected > 0) {
  //       if (this.dataPhoneTamp.length > 0) {
  //         let total_amt = this.amt_expected * this.dataPhoneTamp.length;
  //         let detail = await this.dataService.getAsync('/api/PackageDomain/GetPackageDomainByAmt?&amt=' + total_amt);
  //         if (detail.err_code == 0) {
  //           this.selectedItemComboboxPackage = [];
  //           this.selectedItemComboboxPackage.push({ "id": detail.data[0].ID, "itemName": detail.data[0].PACKAGE_NAME + " - " + detail.data[0].DATA + "MB" + " - Giá: " + detail.data[0].TOTAL_AMT + " VNĐ - " + detail.data[0].DATE_USE + " ngày" });
  //         }
  //       }
  //     }
  //   }
  // }

  //send sms continue
  confirmAfterSuccess() {
    this.confirmAfterSuccessModal.hide();
    this.selectedItemComboboxAccount = [];
    this.selectedItemComboboxSender = [];
    this.selectedGroup = [];
    this.selectedPackageVTL = [];
    this.selectedPackageGPC = [];
    this.selectedPackageVMS = [];
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
    let result: boolean = await this.dataService.getFileExtentionAsync("/api/FileExtention/ExportExcelTemplate", "DataSms", "template_phone.xlsx");
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
        this.getDataGroup();
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
