import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
  styleUrls: ['./send-data.component.css'],

})
export class SendDataComponent implements OnInit {
  @ViewChild('contentSMS', { static: false }) public contentSMS;
  @ViewChild('confirmDeleteFilePhoneModal', { static: false }) public confirmDeleteFilePhoneModal: ModalDirective;
  @ViewChild('confirmAfterSuccessModal', { static: false }) public confirmAfterSuccessModal: ModalDirective;
  @ViewChild('confirmSendDataSMSModal', { static: false }) public confirmSendDataSMSModal: ModalDirective;
  @ViewChild('confirmOtp', { static: false }) public confirmOtp: ModalDirective;
  @ViewChild('choosePackageModal', { static: false }) public choosePackageModal: ModalDirective;
  @ViewChild('uploadFile', { static: false }) public uploadFile;
  @ViewChild('uploadExcelModal', { static: false }) public uploadExcelModal;


  public dataPhone = [];
  public sendNow = '0';
  public cpm = '0';
  public cpm1 = '1';
  public timer = '1';
  public dataPhoneTamp = [];
  public listSmsSend = [];
  public dataCodeTamp = [];
  public dataPhoneAddNew = [];
  public dataAccount = [];
  public dataSenderName = [];
  public dataPackageVTL = [];
  public dataPackageGPC = [];
  public dataPackageVMS = [];
  public dataPackageVMSDataCode = [];
  public dataPhonePaging = [];
  public dataCampaign = [];
  public dataOptionInsert = [];
  public dataOptionInsertSms = [];
  public settingsFilterAccount = {};
  public settingsFilterSender = {};
  public settingsFilterPackageVTL = {};
  public settingsFilterPackageGPC = {};
  public settingsFilterPackageVMS = {};
  public settingsFilterPackageVMSDataCode = {};
  public dataGroup = [];
  public selectedGroup = [];
  public settingsFilterGroup = {};
  public settingsFilterGroupUpload = {};
  public settingsFilterCampaign = {};
  public settingsFilterOptionInsert = {};
  public settingsFilterOptionTempSms = {};
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxSender = [];
  public selectedCampaign = [];
  public selectedGroupUpload = [];
  public selectedPackageVTL = [];
  public selectedPackageGPC = [];
  public selectedPackageVMS = [];
  public selectedPackageVMSDataCode = [];
  public selectedOptionInsert = [];
  public selectedOptionTempSms = [];
  public lstChecked = [];
  public lstCheckedName = [];
  public phone;
  public code;
  public lstId;
  public isShowDateTime;
  public effectiveDateVTL;
  public effectiveDateGPC;
  public effectiveDateVMS;
  public effectiveDateVMSDataCode;
  public packageAmtVTL = 0;
  public packageAmtGPC = 0;
  public packageAmtVMS = 0;
  public packageAmtVMSDataCode = 0;
  public groupCode = "";
  public groupName = "";
  public packCountVTL = 1;
  public packCountGPC = 1;
  public packCountVMS = 1;
  public packCountVMSDataCode = 1;
  public totalPackVTL = 0;
  public totalPackGPC = 0;
  public totalPackVMS = 0;
  public totalPackVMSDataCode = 0;
  public totalAmtVTL = 0;
  public totalAmtGPC = 0;
  public totalAmtVMS = 0;
  public totalAmtVMSDataCode = 0;
  public cntVTL = 0;
  public cntGPC = 0;
  public cntVMS = 0;
  public cntVMSDataCode = 0;
  public countVTL = 0;
  public countGPC = 0;
  public countVMS = 0;
  public countVMSDataCode = 0;
  public totalAmt = 0;
  public timeDonateCreate = 0;
  public NumberRewardTimesInDay = 0;
  public NumberRewardTimesInDayOld = 0;
  public timeDonateOld = 0;
  public isSendSMS: boolean = true;
  public checkdatacode: boolean = false;
  public chkcampaign: boolean = true;
  public chkOnlyOneCreate: boolean = false;
  public disable_resend_otp: boolean = false;
  public chkOnlyOneOld: boolean = false;
  public campaign: boolean = true;
  public checkPhoneExit: boolean = true;
  public PhoneExit: string = "";
  public ischeckgroup: boolean = false;
  public isSendVTL: boolean = false;
  public isSendGPC: boolean = false;
  public isSendVMS: boolean = false;
  public isOneSend: boolean = false;
  public phoneList: string = "";
  public fileName;
  public accountId = "";
  public senderName: string = "";
  public account: string = "";
  public timeSend: string = "";
  public quotaExpected: string = "";
  public fileList: string = "";
  public telco: string = "";
  public packViettel: string = "0";
  public packGPC: string = "0";
  public packVMS: string = "0";
  public messageAfterSend: string = "";
  public ACCOUNT_ID: any = null;
  public SENDER_ID: any = "";
  public SMS_TEMPLATE: any = null;
  public PROGRAM_NAME: any = null;
  public TIMESCHEDULE: any = null;
  public IS_SEND_SMS: any = null;
  public PACKAGE_ID: any = null;
  public totalNumberSendSms = 0;
  public date: Date = new Date();
  public countermin: number;
  public countersec: number;
  public amt_expected = null;
  public numberPhone = 0;
  public totalNumber = 0;
  public numberChar = 0;
  public numberSMS = 0;
  public dataViettel = 0;
  public dataGPC = 0;
  public dataVMS = 0;
  public smsContent: string = '';
  public minDate: Date;
  public pagination: Pagination = new Pagination();
  public numberOtp: number;
  public campaign_id: number;

  public timeSchedule: Date;
  public programCode: string = '';
  public programName: string = '';
  public limit_time: string = '';

  public total_amt = 0;
  public total_code = 0;
  public quota = 0;
  public role: Role = new Role();
  public loading: boolean = false;
  public loadingGroup: boolean = false;
  public isAdmin: boolean = false;
  public enablePackageDataCode: boolean = true;
  public upload: boolean = false;

  // get data insert dataOtp
  public phoneDataOtp: string = '';
  public telcoDataOtp: string = '';
  public accountDataOtp: string = '';
  public otpDataOtp: number;
  public otpSmsDataOtp: string = '';
  public senderNameDataOtp: string = '';
  public ids;
  public SMS_CONTENT_VTL: string = '';
  public SMS_CONTENT_GPC: string = '';
  public SMS_CONTENT_VMS: string = '';
  public DATA_AMT_VTL;
  public DATA_AMT_GPC;
  public DATA_AMT_VMS;
  public DATA_VOL_VTL;
  public DATA_VOL_GPC;
  public DATA_VOL_VMS;



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
    this.settingsFilterPackageVMSDataCode = {
      text: this.utilityService.translate('global.choose_package'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false,
      disabled: true
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

    this.settingsFilterGroupUpload = {
      text: this.utilityService.translate('send_data.inGroup'),
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

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());

    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inPack'), "itemName": this.utilityService.translate('send_data.inPack') });
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inData'), "itemName": this.utilityService.translate('send_data.inData') });
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inDateUse'), "itemName": this.utilityService.translate('send_data.inDateUse') });
    this.dataOptionInsert.push({ "id": this.utilityService.translate('send_data.inPhone'), "itemName": this.utilityService.translate('send_data.inPhone') });

  }
  ngOnInit() {
    this.getAccountLogin();
    this.GetDataSysVarOtp();
  }
  async GetDataSysVarOtp() {
    let result = await this.dataService.getAsync('/api/SysVar/GetSysVarOtp');
    if (result) {
      if (result.err_code == 0) {
        this.otpSmsDataOtp = result.data[0].VAR_VALUE;
        this.limit_time = result.data[1].VAR_VALUE;
        this.senderNameDataOtp = result.data[2].VAR_VALUE;
      }
    }
  }
  async getAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    this.phoneDataOtp = result.data[0].PHONE;
    if (roleAccess != null && roleAccess == 50) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.getDataAccount();
    this.getDataSmsTemp();

  }

  //view data code
  public async viewQuyDataCode(accountID) {
    if (accountID != undefined && accountID != "") {
      // get money by account
      let resCountCode: any = await this.dataService.getAsync('/api/datacode/CountDatacode?account_id=' +
        accountID);
      if (resCountCode != null && resCountCode.data.length > 0) {
        this.total_code = resCountCode.data[0].COUNT_CODE;
        if (this.total_code != 0)
          this.enablePackageDataCode = true;
        else this.enablePackageDataCode = false;
      }
      else {
        this.total_code = 0;
        this.enablePackageDataCode = false;
      }
    }
    else {
      this.total_code = 0;
      this.enablePackageDataCode = false;
    }
  }
  //#endregion
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
      this.createCodeNameCampaing();
    }
    else {
      this.chkcampaign = false;
      this.programCode = "";
      this.getCampaign();
    }

  }

  async getCampaign() {
    this.dataCampaign = [];
    this.selectedCampaign = [];
    let account = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignByAccount?account_id=' + account)
    if (response) {
      for (let index in response.data) {
        this.dataCampaign.push({ "id": response.data[index].ID, "itemName": response.data[index].PROGRAM_NAME });
      }
    }

  }

  //get sms temp

  async getDataSmsTemp() {
    this.dataOptionInsertSms = [];
    this.selectedOptionTempSms = [];
    let response: any = await this.dataService.getAsync('/api/SmsTemplate')
    for (let index in response.data) {
      this.dataOptionInsertSms.push({ "id": response.data[index].ID, "itemName": response.data[index].TEMP_NAME, "conten_sms": response.data[index].TEMPLATE_CONTENT });
    }
  }

  async selectCampaign() {
    let campaignId = this.selectedCampaign.length > 0 && this.selectedCampaign[0].id != null ? this.selectedCampaign[0].id : 0;
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignById?id=' + campaignId);
    if (response.err_code == 0 && response.data.length > 0) {
      this.NumberRewardTimesInDayOld = response.data[0].REWARD_NUMBER;
      this.timeDonateOld = response.data[0].REWARD_NUMBER_TIME_IN_DAYS;
    }
  }

  deSelectCampaign() {
    this.NumberRewardTimesInDayOld = 0;
    this.timeDonateOld = 0;
  }

  // get phone by file list 
  async getPhoneNumber(event) {
    if (this.phoneList != null && this.phoneList != "") {
      this.countPhone(this.phoneList);
    }
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
      this.totalAmtVTL = 0;
      this.totalAmtGPC = 0;
      this.totalAmtVMS = 0;
      this.totalAmt = 0;
      this.packViettel = "0";
      this.packGPC = "0";
      this.packVMS = "0";
      this.countVTL = 0;
      this.countGPC = 0;
      this.countVMS = 0;
      this.countVMSDataCode = 0;
      this.totalNumber = 0;
      this.totalPackVTL = 0;
      this.totalPackGPC = 0;
      this.totalPackVMS = 0;
      this.totalPackVMSDataCode = 0;
      this.phonePaging(this.dataPhoneTamp);
      return;
    }
    this.loadingGroup = true;
    let response: any = await this.dataService.getAsync('/api/Person/GetPersonByGroupIds?groupIds=' + this.ids);
    this.loadingGroup = false;
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
      this.countVMSDataCode = data.countMOBIFONE;
      this.countVMS = data.countMOBIFONE;
      this.totalNumber = this.dataPhoneTamp.length;
      this.totalNumberSendSms = this.dataPhoneTamp.length + this.numberPhone;
      if (this.dataPhoneTamp.length == 0) {
        this.totalNumberSendSms = this.numberPhone;
      }

      // total amt by telco
      if (this.packCountVTL != null && this.packCountVTL > 0 && this.packageAmtVTL > 0) {
        this.totalPackVTL = (this.packCountVTL * this.countVTL) + (this.packCountVTL * this.cntVTL);
        this.totalAmtVTL = this.packageAmtVTL * this.totalPackVTL;
      }
      if (this.packCountGPC != null && this.packCountGPC > 0 && this.packageAmtGPC > 0) {
        this.totalPackGPC = (this.packCountGPC * this.countGPC) + (this.packCountGPC * this.cntGPC);
        this.totalAmtGPC = this.packageAmtGPC * this.totalPackGPC;
      }
      if (this.checkdatacode == true) {
        if (this.packCountVMSDataCode != null && this.packCountVMSDataCode > 0 && this.packageAmtVMSDataCode > 0) {
          this.totalPackVMSDataCode = (this.packCountVMSDataCode * this.countVMSDataCode) + (this.packCountVMSDataCode * this.cntVMSDataCode);
          this.totalAmtVMSDataCode = this.packageAmtVMSDataCode * this.totalPackVMSDataCode;
        }
      } else {
        if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS > 0) {
          this.totalPackVMS = (this.packCountVMS * this.countVMS) + (this.packCountVMS * this.cntVMS);
          this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
        }
      }
      this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS + this.totalAmtVMSDataCode;
      if (this.selectedPackageVTL.length > 0) this.packViettel = this.selectedPackageVTL[0].itemName + " x " + this.totalPackVTL;
      if (this.selectedPackageGPC.length > 0) this.packGPC = this.selectedPackageGPC[0].itemName + " x " + this.totalPackGPC;
      if (this.checkdatacode == true) {
        if (this.selectedPackageVMSDataCode.length > 0) this.packVMS = this.selectedPackageVMSDataCode[0].itemName + " x " + this.totalPackVMSDataCode;
      } else {
        if (this.selectedPackageVMS.length > 0) this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
      }
      this.phonePaging(this.dataPhoneTamp);
    } else {
      this.totalAmtVTL = 0;
      this.totalAmtGPC = 0;
      this.totalAmtVMS = 0;
      this.totalAmtVMSDataCode = 0;
      this.totalAmt = 0;
    }
    //this.GetPackage();
  }

  async countPhone(phone) {
    this.cntVTL = 0;
    this.cntGPC = 0;
    this.cntVMS = 0;
    this.cntVMSDataCode = 0;
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
          if (phone == null || phone.length == 0) {
            this.dataPhoneAddNew.push({ PHONE: lstSplit[i], TELCO: telco });
            if (telco == "VIETTEL") {
              this.cntVTL++;
            }
            else if (telco == "GPC") {
              this.cntGPC++;
            }
            else if (telco == "VMS") {
              this.cntVMSDataCode++;
              this.cntVMS++;
            }
          }
        }
      }
    }
    else {
      this.numberPhone = 1;
      this.dataPhoneAddNew.push({ PHONE: phoneList.substr(0, phoneList.length - 1), TELCO: this.telco });
    }

    if (this.packCountVTL != null && this.packCountVTL > 0 && this.packageAmtVTL > 0) {
      this.totalPackVTL = (this.packCountVTL * this.countVTL) + (this.packCountVTL * this.cntVTL);
      this.totalAmtVTL = this.packageAmtVTL * this.totalPackVTL;
      this.packViettel = this.selectedPackageVTL[0].itemName + " x " + this.totalPackVTL;
    }
    if (this.packCountGPC != null && this.packCountGPC > 0 && this.packageAmtGPC > 0) {
      this.totalPackGPC = (this.packCountGPC * this.countGPC) + (this.packCountGPC * this.cntGPC);
      this.totalAmtGPC = this.packageAmtGPC * this.totalPackGPC;
      this.packGPC = this.selectedPackageGPC[0].itemName + " x " + this.totalPackGPC;
    }
    if (this.checkdatacode == true) {
      if (this.packCountVMSDataCode != null && this.packCountVMSDataCode > 0 && this.packageAmtVMSDataCode > 0) {
        this.totalPackVMSDataCode = (this.packCountVMSDataCode * this.countVMSDataCode) + (this.packCountVMSDataCode * this.cntVMSDataCode);
        this.totalAmtVMSDataCode = this.packageAmtVMSDataCode * this.totalPackVMSDataCode;
        this.packVMS = this.selectedPackageVMSDataCode[0].itemName + " x " + this.totalPackVMSDataCode;
      }
    } else {
      if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS > 0) {
        this.totalPackVMS = (this.packCountVMS * this.countVMS) + (this.packCountVMS * this.cntVMS);
        this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
        this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
      }
    }
    this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS + this.totalAmtVMSDataCode;
    this.totalNumberSendSms = this.numberPhone + this.totalNumber;
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
      this.selectedItemComboboxAccount = [{ "id": 0, "itemName": this.utilityService.translate('global.choose_account') }];
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
        this.viewQuyDataCode(this.selectedItemComboboxAccount[0].id);
      }
      else
        this.selectedItemComboboxAccount.push({ "id": 0, "itemName": this.utilityService.translate('global.choose_account') });
    }
    this.createCodeNameCampaing();
  }

  changeAccount() {
    this.getDataSenderName(this.selectedItemComboboxAccount[0].id);
    this.dataPhone = [];
    this.lstChecked = [];
    this.getDataGroup();
    this.getCampaign();
    this.viewQuyData(this.selectedItemComboboxAccount[0].id);
    this.viewQuyDataCode(this.selectedItemComboboxAccount[0].id);
    this.createCodeNameCampaing();
    this.createCodeGroup();
  }

  deSelectAccount() {
    this.getDataGroup();
    this.getCampaign();
    this.total_amt = 0;
  }
  //#endregion

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
    //   this.selectedOptionTempSms=[];
    //  this.selectedOptionTempSms.push({"id": "" , "itemName":this.utilityService.translate('send_data.optionSms')});
  }

  async getDataSenderName(accountID) {
    this.selectedItemComboboxSender = [];
    this.dataSenderName = [];
    let response: any = await this.dataService.getAsync('/api/AccountSender/GetSenderByAccountId?account_id=' +
      accountID)
    for (let index in response.data) {
      this.dataSenderName.push({ "id": response.data[index].SENDER_ID, "itemName": response.data[index].NAME });
    }
    if (this.dataSenderName.length == 1)
      this.selectedItemComboboxSender.push({ "id": this.dataSenderName[0].id, "itemName": this.dataSenderName[0].itemName });
  }
  // get data package viettel
  async getDataPackageVTL() {
    let ismoneydatacode = 0;
    this.dataPackageVTL = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VIETTEL' + '&ismoneydatacode=' + ismoneydatacode)
    for (let index in response.data) {
        this.dataPackageVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVTL.length == 1)
      this.selectedPackageVTL.push({ "id": this.dataPackageVTL[0].id, "itemName": this.dataPackageVTL[0].itemName });
  }

  async changePackageVTL() {
    this.packViettel = "0";
    if (this.selectedPackageVTL.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageTelcoById?id=' + this.selectedPackageVTL[0].id);
      if (response != null && response.err_code == 0) {
        this.effectiveDateVTL = response.data[0].DATE_USE + " ngày";
        this.packageAmtVTL = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
        if (this.packCountVTL != null && this.packCountVTL > 0 && this.packageAmtVTL > 0) {
          this.totalPackVTL = (this.packCountVTL * this.countVTL) + (this.packCountVTL * this.cntVTL);
          this.totalAmtVTL = this.packageAmtVTL * this.totalPackVTL;
          this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
          this.packViettel = this.selectedPackageVTL[0].itemName + " x " + this.totalPackVTL;
          this.dataViettel = response.data[0].DATA;
          this.isSendVTL = true;
        }
      }
    }
    else {
      this.effectiveDateVTL = "0";
      this.packCountVTL = 1;
      this.packageAmtVTL = 0;
      this.totalPackVTL = 0;
      this.totalAmt = this.totalAmt - this.totalAmtVTL;
      this.totalAmtVTL = 0;
    }
  }

  changeCountVTL() {
    this.packViettel = "0";
    if (this.packCountVTL != null && this.packCountVTL > 0 && this.packageAmtVTL > 0) {
      this.totalPackVTL = (this.packCountVTL * this.countVTL) + (this.packCountVTL * this.cntVTL);
      this.totalAmtVTL = this.packageAmtVTL * this.totalPackVTL;
      this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
      this.packViettel = this.selectedPackageVTL[0].itemName + " x " + this.totalPackVTL;
    }
  }

  // get data package vina
  async getDataPackageGPC() {
    let ismoneydatacode = 0;
    this.dataPackageGPC = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=GPC' + '&ismoneydatacode=' + ismoneydatacode)
    for (let index in response.data) {
      this.dataPackageGPC.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageGPC.length == 1)
      this.selectedPackageGPC.push({ "id": this.dataPackageGPC[0].id, "itemName": this.dataPackageGPC[0].itemName });
  }

  async changePackageGPC() {
    this.packGPC = "0";
    if (this.selectedPackageGPC.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageTelcoById?id=' + this.selectedPackageGPC[0].id);
      if (response != null && response.err_code == 0) {
        this.effectiveDateGPC = response.data[0].DATE_USE + " ngày";
        this.packageAmtGPC = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
        if (this.packCountGPC != null && this.packCountGPC > 0 && this.packageAmtGPC > 0) {
          this.totalPackGPC = (this.packCountGPC * this.countGPC) + (this.packCountGPC * this.cntGPC);
          this.totalAmtGPC = this.packageAmtGPC * this.totalPackGPC;
          this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
          this.packGPC = this.selectedPackageGPC[0].itemName + " x " + this.totalPackGPC;
          this.dataGPC = response.data[0].DATA;
          this.isSendGPC = true;
        }
      }
    }
    else {
      this.effectiveDateGPC = "0";
      this.packCountGPC = 1;
      this.packageAmtGPC = 0;
      this.totalPackGPC = 0;
      this.totalAmt = this.totalAmt - this.totalAmtGPC;
      this.totalAmtGPC = 0;
    }
  }

  changeCountGPC() {
    this.packGPC = "0";
    if (this.packCountGPC != null && this.packCountGPC > 0 && this.packageAmtGPC > 0) {
      this.totalPackGPC = (this.packCountGPC * this.countGPC) + (this.packCountGPC * this.cntGPC);
      this.totalAmtGPC = this.packageAmtGPC * this.totalPackGPC;
      this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
      this.packGPC = this.selectedPackageGPC[0].itemName + " x " + this.totalPackGPC;
    }
  }

  // get data package mobi
  async getDataPackageVMS() {
    let ismoneydatacode = 0;
    if (this.checkdatacode == true) {
      ismoneydatacode = 1;
      this.dataPackageVMSDataCode = [];
      let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelcoCode')
      for (let index in response.data) {
        this.dataPackageVMSDataCode.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
      }
    } else {
      ismoneydatacode = 0;
      this.dataPackageVMS = [];
      let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VMS' + '&ismoneydatacode=' + ismoneydatacode)
      for (let index in response.data) {
        this.dataPackageVMS.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].PACKAGE_NAME_DISPLAY });
      }
    }

  }

  async changePackageVMS() {
    this.packVMS = "0";
    if (this.checkdatacode == true) {
      if (this.selectedPackageVMSDataCode.length > 0) {
        let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageTelcoById?id=' + this.selectedPackageVMSDataCode[0].id);
        if (response != null && response.err_code == 0) {
          this.effectiveDateVMSDataCode = response.data[0].DATE_USE + " ngày";
          this.packageAmtVMSDataCode = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
          if (this.packCountVMSDataCode != null && this.packCountVMSDataCode > 0 && this.packageAmtVMSDataCode > 0) {
            this.totalPackVMSDataCode = (this.packCountVMSDataCode * this.countVMSDataCode) + (this.packCountVMSDataCode * this.cntVMSDataCode);
            this.totalAmtVMSDataCode = this.packageAmtVMSDataCode * this.totalPackVMSDataCode;
            this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMSDataCode;
            this.packVMS = this.selectedPackageVMSDataCode[0].itemName + " x " + this.totalPackVMSDataCode;
            this.dataVMS = response.data[0].DATA;
            this.isSendVMS = true;
          }
        }
      }
      else {
        this.effectiveDateVMSDataCode = "0";
        this.packCountVMSDataCode = 1;
        this.packageAmtVMSDataCode = 0;
        this.totalPackVMSDataCode = 0;
        this.totalAmt = this.totalAmt - this.totalAmtVMSDataCode;
        this.totalAmtVMSDataCode = 0;
      }
    } else {
      if (this.selectedPackageVMS.length > 0) {
        let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageTelcoById?id=' + this.selectedPackageVMS[0].id);
        if (response != null && response.err_code == 0) {
          this.effectiveDateVMS = response.data[0].DATE_USE + " ngày";
          this.packageAmtVMS = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
          if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS > 0) {
            this.totalPackVMS = (this.packCountVMS * this.countVMS) + (this.packCountVMS * this.cntVMS);
            this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
            this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
            this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
            this.dataVMS = response.data[0].DATA;
            this.isSendVMS = true;
          }
        }
      }
      else {
        this.effectiveDateVMS = "0";
        this.packCountVMS = 1;
        this.packageAmtVMS = 0;
        this.totalPackVMS = 0;
        this.totalAmt = this.totalAmt - this.totalAmtVMS;
        this.totalAmtVMS = 0;
      }
    }

  }

  changeCountVMS() {
    this.packVMS = "0";
    if (this.checkdatacode == true) {
      if (this.packCountVMSDataCode != null && this.packCountVMSDataCode > 0 && this.packageAmtVMSDataCode > 0) {
        this.totalPackVMSDataCode = (this.packCountVMSDataCode * this.countVMSDataCode) + (this.packCountVMSDataCode * this.cntVMSDataCode);
        this.totalAmtVMSDataCode = this.packageAmtVMSDataCode * this.totalPackVMSDataCode;
        this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMSDataCode;
        this.packVMS = this.selectedPackageVMSDataCode[0].itemName + " x " + this.totalPackVMSDataCode;
      }
    } else {
      if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS > 0) {
        this.totalPackVMS = (this.packCountVMS * this.countVMS) + (this.packCountVMS * this.cntVMS);
        this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
        this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
        this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
      }
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
    if (this.isAdmin) {
      this.accountId = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : "";
      if (this.accountId == "") {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-21"));
        this.loading = false;
        return;
      }
    }
    else
      this.accountId = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].id : this.authService.currentUserValue.ACCOUNT_ID;

    this.clearData();
    this.selectedGroupUpload = [];
    //this.getDataGroup();
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
      //this.getPhoneNumber(response.data[index].GROUP_ID);
    }

  }

  // upload file
  public async submitUploadFile() {
    this.loading = true;
    if (this.selectedGroupUpload.length == 0 && (this.groupCode == null || this.groupCode == "")) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-99"));
      this.loading = false;
      return;
    } else if (this.selectedGroupUpload.length == 0 && (this.groupCode != null || this.groupCode != "")) {
      if (this.groupName == null || this.groupName == "") {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-96"));
        this.loading = false;
        return;
      }

    }
    let file = this.uploadFile.nativeElement;
    if (file.files.length > 0) {
      let groupId = this.selectedGroupUpload.length > 0 && this.selectedGroupUpload[0].id != "" ? this.selectedGroupUpload[0].id : "";
      let groupName = this.selectedGroupUpload.length > 0 && this.selectedGroupUpload[0].itemName != "" ? this.selectedGroupUpload[0].itemName : "";
      let response: any = await this.dataService.importExcelAndSavePhoneListDataAsync(null, file.files, groupId, this.groupCode, this.groupName, this.accountId);
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
          this.getDataGroup();
          this.groupCode = "";
          this.groupName = "";
          this.uploadExcelModal.hide();

            let filtered = this.selectedGroup.filter(a => this.selectedGroupUpload.some(b => b.id === a.id));
            if (filtered.length == 0) {
              if (groupId != null && groupId != "") {
                this.selectedGroup.push({ "id": groupId, "itemName": groupName });
              } else {
                this.selectedGroup.push({ "id": response.data[0].GROUP_ID, "itemName": response.data[0].GROUP_NAME })
              }
            }
            this.getPhoneNumber(this.selectedGroup);
        }
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
    this.accountDataOtp = this.ACCOUNT_ID;
    //send sms to customer from One
    if (this.isSendSMS) {
      this.SENDER_ID = this.selectedItemComboboxSender.length > 0 ? this.selectedItemComboboxSender[0].id : "";
      if (this.SENDER_ID == "") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-22"));
        this.confirmSendDataSMSModal.hide();
        return;
      }
      this.senderName = this.selectedItemComboboxSender[0].itemName;
      this.senderNameDataOtp = this.senderName;
      // check chiến dịch
      if (this.chkcampaign) {
        this.PROGRAM_NAME = this.programName;
        if (this.PROGRAM_NAME === '' || this.PROGRAM_NAME === null) {
          this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-23"));
          this.confirmSendDataSMSModal.hide();
          return;
        }
      } else {
        if (this.selectedCampaign.length == 0 || this.selectedCampaign[0].id == "") {
          this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-101"));
          this.confirmSendDataSMSModal.hide();
          return;
        }
      }
      // check đã nhập nội dung tin nhắn chưa
      this.SMS_TEMPLATE = this.utilityService.removeSign4VietnameseString(this.utilityService.removeDiacritics(this.smsContent));
      if (this.SMS_TEMPLATE === '' || this.SMS_TEMPLATE === null) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-24"));
        this.confirmSendDataSMSModal.hide();
        return;
      }
    }
    // check package
    if (this.selectedPackageVTL.length == 0 && this.selectedPackageGPC.length == 0 && this.selectedPackageVMS.length == 0 && this.selectedPackageVMSDataCode.length == 0) {
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
    this.confirmSendDataSMSModal.show();

  }

  // send data sms
  async confirmSendSMS() {
    this.loading = true;
    if (this.dataPhoneAddNew.length > 0) {
      for (let i in this.dataPhoneAddNew) {
        this.dataPhoneTamp.push({ PHONE: this.dataPhoneAddNew[i].PHONE, TELCO: this.dataPhoneAddNew[i].TELCO });
      }
    }
    // check exists phone list
    if (this.dataPhoneTamp.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-25"));
      this.loading = false;
      this.confirmSendDataSMSModal.hide();
      return;
    }

    let PACKAGE_ID_VTL = null;
    let PACKAGE_NAME_VTL = "";
    let DATA_VTL = 0;
    if (this.selectedPackageVTL.length > 0 && this.selectedPackageVTL[0].id != "") {
      PACKAGE_ID_VTL = this.selectedPackageVTL[0].id;
      PACKAGE_NAME_VTL = this.selectedPackageVTL[0].itemName.substr(0, this.selectedPackageVTL[0].itemName.indexOf('-') - 1).trim();
      DATA_VTL = this.dataViettel;
    }
    let PACKAGE_ID_GPC = null;
    let PACKAGE_NAME_GPC = "";
    let DATA_GPC = 0;

    if (this.selectedPackageGPC.length > 0 && this.selectedPackageGPC[0].id != "") {
      PACKAGE_ID_GPC = this.selectedPackageGPC[0].id;
      PACKAGE_NAME_GPC = this.selectedPackageGPC[0].itemName.substr(0, this.selectedPackageGPC[0].itemName.indexOf('-') - 1).trim();
      DATA_GPC = this.dataGPC;
    }
    let PACKAGE_ID_VMS = null;
    let PACKAGE_NAME_VMS = "";
    let DATA_VMS = 0;
    let IS_MONEY_DATA_CODE = 0;

    if (this.checkdatacode == true) {
      if (this.selectedPackageVMSDataCode.length > 0 && this.selectedPackageVMSDataCode[0].id != "") {
        PACKAGE_ID_VMS = this.selectedPackageVMSDataCode[0].id;
        PACKAGE_NAME_VMS = this.selectedPackageVMSDataCode[0].itemName.substr(0, this.selectedPackageVMSDataCode[0].itemName.indexOf('-') - 1).trim();
        DATA_VMS = this.dataVMS;
        let res: any = await this.dataService.getAsync('/api/datacode/GetDatacodeCampaign?package_id=' + PACKAGE_ID_VMS + '&count_code=' + this.totalPackVMSDataCode);
        if (res) {
          if (res.err_code == 0) {
            this.dataCodeTamp = [];
            for (let i = 0; i < res.data.length; i++) {
              let checkExis = this.dataCodeTamp.includes(res.data[i].ENCRYPTED_CODE);
              if (checkExis == false) {
                this.dataCodeTamp.push({ ENCRYPTED_CODE: res.data[i].ENCRYPTED_CODE });
              }
            }
            IS_MONEY_DATA_CODE = 1;
          } else if (res.err_code == -206) {
            this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-206"));
            return;
          } else {
            this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("110"));
            return;
          }
        }
      }

    } else {
      if (this.selectedPackageVMS.length > 0 && this.selectedPackageVMS[0].id != "") {
        PACKAGE_ID_VMS = this.selectedPackageVMS[0].id;
        PACKAGE_NAME_VMS = this.selectedPackageVMS[0].itemName.substr(0, this.selectedPackageVMS[0].itemName.indexOf('-') - 1).trim();
        DATA_VMS = this.dataVMS;
        IS_MONEY_DATA_CODE = 0;
      }
    }
    let REWARD_NUMBER;
    let REWARD_NUMBER_TIME_IN_DAYS
    if (this.chkcampaign == false) {
      REWARD_NUMBER = this.NumberRewardTimesInDayOld;
      REWARD_NUMBER_TIME_IN_DAYS = this.timeDonateOld;
    } else {
      if (this.NumberRewardTimesInDay == null) {
        REWARD_NUMBER = 0;
      } else {
        REWARD_NUMBER = this.NumberRewardTimesInDay;
      }
      if (this.timeDonateCreate == null) {
        REWARD_NUMBER_TIME_IN_DAYS = 0;
      } else
        REWARD_NUMBER_TIME_IN_DAYS = this.timeDonateCreate;
    }

    let chkCampaign = this.chkcampaign == true ? 0 : 1;
    let DATA_CAMPAIGN_ID = this.selectedCampaign.length > 0 && this.selectedCampaign[0].id != "" ? this.selectedCampaign[0].id : "";
    let j = 0;

    if (this.isSendSMS) {
      for (let i = 0; i < this.dataPhoneTamp.length; i++) {
        let phone = this.dataPhoneTamp[i].PHONE;
        if (this.isSendVTL && this.dataPhoneTamp[i].TELCO == "VIETTEL") {
          let SMS_CONTENT = this.SMS_TEMPLATE.replace(this.utilityService.translate('send_data.inPack'), PACKAGE_NAME_VTL).replace(this.utilityService.translate('send_data.inPhone'), phone)
            .replace(this.utilityService.translate('send_data.inData'), DATA_VTL).replace(this.utilityService.translate('send_data.inDateUse'), this.effectiveDateVTL.replace("ngày", "").trim());
          this.SMS_CONTENT_VTL = SMS_CONTENT;
          this.listSmsSend.push({
            ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, TELCO: this.dataPhoneTamp[i].TELCO, DATA_VOL: DATA_VTL, DATA_AMT: this.packageAmtVTL, SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, SMS_CONTENT: SMS_CONTENT
            , SMS_TEMPLATE: this.SMS_TEMPLATE, TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS, PACKAGE_ID: Number(PACKAGE_ID_VTL), PACKAGE_NAME: PACKAGE_NAME_VTL
            , REWARD_NUMBER, REWARD_NUMBER_TIME_IN_DAYS, COUNT_SEND: this.packCountVTL, DATA_CAMPAIGN_ID, PROGRAM_CODE: this.programCode, TOTAL_PACKAGES: this.totalPackVTL, DATA_CODE: "", IS_MONEY_DATA_CODE: 0
          });
        }
        else if (this.isSendGPC && this.dataPhoneTamp[i].TELCO == "GPC") {
          let SMS_CONTENT = this.SMS_TEMPLATE.replace(this.utilityService.translate('send_data.inPack'), PACKAGE_NAME_GPC).replace(this.utilityService.translate('send_data.inPhone'), phone)
            .replace(this.utilityService.translate('send_data.inData'), DATA_GPC).replace(this.utilityService.translate('send_data.inDateUse'), this.effectiveDateGPC.replace("ngày", "").trim());
          this.SMS_CONTENT_GPC = SMS_CONTENT;
          this.listSmsSend.push({
            ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, TELCO: this.dataPhoneTamp[i].TELCO, DATA_VOL: DATA_GPC, DATA_AMT: this.packageAmtGPC, SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, SMS_CONTENT: SMS_CONTENT
            , SMS_TEMPLATE: this.SMS_TEMPLATE, TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS, PACKAGE_ID: PACKAGE_ID_GPC, PACKAGE_NAME: PACKAGE_NAME_GPC
            , REWARD_NUMBER, REWARD_NUMBER_TIME_IN_DAYS, COUNT_SEND: this.packCountGPC, DATA_CAMPAIGN_ID, PROGRAM_CODE: this.programCode, TOTAL_PACKAGES: this.totalPackGPC, DATA_CODE: "", IS_MONEY_DATA_CODE: 0
          });
        }
        else if (this.isSendVMS && this.dataPhoneTamp[i].TELCO == "VMS") {
          let SMS_CONTENT = this.SMS_TEMPLATE.replace(this.utilityService.translate('send_data.inPack'), PACKAGE_NAME_VMS).replace(this.utilityService.translate('send_data.inPhone'), phone)
            .replace(this.utilityService.translate('send_data.inData'), DATA_VMS).replace(this.utilityService.translate('send_data.inDateUse'), this.effectiveDateVMS.replace("ngày", "").trim());
          this.SMS_CONTENT_VMS = SMS_CONTENT;
          if (this.checkdatacode == true) {
            let code = this.dataCodeTamp[j].ENCRYPTED_CODE;
            this.listSmsSend.push({
              ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, TELCO: this.dataPhoneTamp[i].TELCO, DATA_VOL: DATA_VMS, DATA_AMT: this.packageAmtVMSDataCode, SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, SMS_CONTENT: SMS_CONTENT
              , SMS_TEMPLATE: this.SMS_TEMPLATE, TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_CODE", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS, PACKAGE_ID: PACKAGE_ID_VMS, PACKAGE_NAME: PACKAGE_NAME_VMS
              , REWARD_NUMBER, REWARD_NUMBER_TIME_IN_DAYS, COUNT_SEND: this.packCountVMS, DATA_CAMPAIGN_ID, PROGRAM_CODE: this.programCode, TOTAL_PACKAGES: this.totalPackVMS, DATA_CODE: code, IS_MONEY_DATA_CODE: IS_MONEY_DATA_CODE
            });
            j++;
          } else {
            this.listSmsSend.push({
              ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, TELCO: this.dataPhoneTamp[i].TELCO, DATA_VOL: DATA_VMS, DATA_AMT: this.packageAmtVMS, SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, SMS_CONTENT: SMS_CONTENT
              , SMS_TEMPLATE: this.SMS_TEMPLATE, TIME_SCHEDULE: this.TIMESCHEDULE, TYPE: "DATA_SPONSOR", PROGRAM_NAME: this.PROGRAM_NAME, IS_SEND_SMS: this.IS_SEND_SMS, PACKAGE_ID: PACKAGE_ID_VMS, PACKAGE_NAME: PACKAGE_NAME_VMS
              , REWARD_NUMBER, REWARD_NUMBER_TIME_IN_DAYS, COUNT_SEND: this.packCountVMS, DATA_CAMPAIGN_ID, PROGRAM_CODE: this.programCode, TOTAL_PACKAGES: this.totalPackVMS, DATA_CODE: "", IS_MONEY_DATA_CODE: 0
            });
          }
        }
      }
    }
    else {
      for (let i = 0; i < this.dataPhoneTamp.length; i++) {
        let phone = this.dataPhoneTamp[i].PHONE;
        if (this.isSendVTL && this.dataPhoneTamp[i].TELCO == "VIETTEL") {
          this.listSmsSend.push({
            ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, TELCO: this.dataPhoneTamp[i].TELCO, DATA_VOL: DATA_VTL, DATA_AMT: this.packageAmtVTL, SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, PROGRAM_NAME: this.PROGRAM_NAME, TIME_SCHEDULE: this.TIMESCHEDULE
            , TYPE: "DATA_SPONSOR", IS_READ: 1, PACKAGE_ID: PACKAGE_ID_VTL, PACKAGE_NAME: PACKAGE_NAME_VTL, REWARD_NUMBER, REWARD_NUMBER_TIME_IN_DAYS, COUNT_SEND: this.packCountVTL, DATA_CAMPAIGN_ID, PROGRAM_CODE: this.programCode, TOTAL_PACKAGES: this.totalPackVTL, DATA_CODE: 0, IS_MONEY_DATA_CODE: 0
          });
        }
        else if (this.isSendGPC && this.dataPhoneTamp[i].TELCO == "GPC") {
          this.listSmsSend.push({
            ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, TELCO: this.dataPhoneTamp[i].TELCO, DATA_VOL: DATA_GPC, DATA_AMT: this.packageAmtGPC, SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, PROGRAM_NAME: this.PROGRAM_NAME, TIME_SCHEDULE: this.TIMESCHEDULE
            , TYPE: "DATA_SPONSOR", IS_READ: 1, PACKAGE_ID: PACKAGE_ID_GPC, PACKAGE_NAME: PACKAGE_NAME_GPC, REWARD_NUMBER, REWARD_NUMBER_TIME_IN_DAYS, COUNT_SEND: this.packCountGPC, DATA_CAMPAIGN_ID, PROGRAM_CODE: this.programCode, TOTAL_PACKAGES: this.totalPackGPC, DATA_CODE: 0, IS_MONEY_DATA_CODE: 0
          });
        }
        else if (this.isSendVMS && this.dataPhoneTamp[i].TELCO == "VMS") {
          if (this.checkdatacode == true) {
            let code = this.dataCodeTamp[j].ENCRYPTED_CODE;
            this.listSmsSend.push({
              ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, TELCO: this.dataPhoneTamp[i].TELCO, DATA_VOL: DATA_VMS, DATA_AMT: this.packageAmtVMSDataCode, SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, PROGRAM_NAME: this.PROGRAM_NAME, TIME_SCHEDULE: this.TIMESCHEDULE
              , TYPE: "DATA_CODE", IS_READ: 1, PACKAGE_ID: PACKAGE_ID_VMS, PACKAGE_NAME: PACKAGE_NAME_VMS, REWARD_NUMBER, REWARD_NUMBER_TIME_IN_DAYS, COUNT_SEND: this.packCountVMS, DATA_CAMPAIGN_ID, PROGRAM_CODE: this.programCode, TOTAL_PACKAGES: this.totalPackVMS, DATA_CODE: code, IS_MONEY_DATA_CODE: IS_MONEY_DATA_CODE
            });
            j++;
          } else {
            this.listSmsSend.push({
              ACCOUNT_ID: this.ACCOUNT_ID, PHONE: phone, TELCO: this.dataPhoneTamp[i].TELCO, DATA_VOL: DATA_VMS, DATA_AMT: this.packageAmtVMS, SENDER_ID: this.SENDER_ID, SENDER_NAME: this.senderName, PROGRAM_NAME: this.PROGRAM_NAME, TIME_SCHEDULE: this.TIMESCHEDULE
              , TYPE: "DATA_SPONSOR", IS_READ: 1, PACKAGE_ID: PACKAGE_ID_VMS, PACKAGE_NAME: PACKAGE_NAME_VMS, REWARD_NUMBER, REWARD_NUMBER_TIME_IN_DAYS, COUNT_SEND: this.packCountVMS, DATA_CAMPAIGN_ID, PROGRAM_CODE: this.programCode, TOTAL_PACKAGES: this.totalPackVMS, DATA_CODE: '', IS_MONEY_DATA_CODE: 0
            });
          }
        }
      }
    }
    // do whatever
    if (this.dataPhoneTamp.length < 2000) {
      let insertSms = await this.dataService.postAsync('/api/DataSMS/InsertListDataCampaign?isSendFromCampaignOld=' + chkCampaign, this.listSmsSend);
      if (insertSms.err_code == 0) {
        this.messageAfterSend = insertSms.err_message;
        this.confirmAfterSuccessModal.show();
        this.pageRefresh();
      } else if (insertSms.err_code == -501) {
        let phoneexit = this.utilityService.translate('data-campaign.phone_sended_exits');
        let phoneexit1 = this.utilityService.translate('data-campaign.phone_exits_1');
        this.checkPhoneExit = true;
        this.PhoneExit = phoneexit + insertSms.data + phoneexit1 + this.PROGRAM_NAME;
      }
      else this.notificationService.displayErrorMessage(insertSms.err_message);
      this.viewQuyData(this.ACCOUNT_ID);
      this.viewQuyDataCode(this.ACCOUNT_ID);
      this.confirmSendDataSMSModal.hide();
      this.loading = false;
    }
    else {
      let ACCOUNT_ID = this.ACCOUNT_ID;
      let SENDER_ID = this.SENDER_ID;
      let SENDER_NAME = this.senderName;
      let SMS_CONTENT;
      if (this.isSendSMS) {
        SMS_CONTENT = this.SMS_TEMPLATE;
      } else {
        SMS_CONTENT = "";
      }
      let TIME_SCHEDULE = this.TIMESCHEDULE;
      let TYPE = "DATA_SPONSOR";
      let PROGRAM_NAME = this.PROGRAM_NAME;
      let IS_SEND_SMS = this.IS_SEND_SMS;
      let PACKAGE_ID_VMS = this.selectedPackageVMS.length > 0 ? this.selectedPackageVMS[0].id : "";
      let PACKAGE_ID_VTL = this.selectedPackageVTL.length > 0 ? this.selectedPackageVTL[0].id : "";
      let PACKAGE_ID_GPC = this.selectedPackageGPC.length > 0 ? this.selectedPackageGPC[0].id : "";
      let PROGRAM_CODE = this.programCode;
      let checkcode = this.checkdatacode == true ? 1 : 0;
      let GROUP_IDS = this.ids;
      this.DATA_AMT_VTL = this.packageAmtVTL;
      this.DATA_AMT_GPC = this.packageAmtGPC;
      this.DATA_AMT_VMS = this.packageAmtVMS;
      this.DATA_VOL_VTL = DATA_VTL;
      this.DATA_VOL_GPC = DATA_GPC;
      this.DATA_VOL_VMS = DATA_VMS;
      let res: any = await this.dataService.getAsync('/api/DataSMS/InsertListDataCampaignMultiple?isSendFromCampaignOld=' + chkCampaign + '&checkcode=' + checkcode + '&account_id=' + ACCOUNT_ID + '&sender_id=' + SENDER_ID + '&sender_name=' + SENDER_NAME + '&sms_content=' + SMS_CONTENT + '&time_schedule=' + TIME_SCHEDULE + '&type=' + TYPE + '&program_name=' + PROGRAM_NAME + '&package_id_vms=' + PACKAGE_ID_VMS + '&package_id_vtl=' + PACKAGE_ID_VTL + '&package_id_gpc=' + PACKAGE_ID_GPC
        + '&is_send_sms=' + IS_SEND_SMS + '&reward=' + REWARD_NUMBER + '&reward_number_time_in_days=' + REWARD_NUMBER_TIME_IN_DAYS + '&program_code=' + PROGRAM_CODE + '&count_vtl=' + this.packCountVTL + '&count_gpc=' + this.packCountGPC + '&count_vms=' + this.packCountVMS + '&group_ids=' + GROUP_IDS + '&total_package_data_code=' + this.countVMSDataCode + '&data_campaign_id=' + DATA_CAMPAIGN_ID + '&phoneList=' + this.phoneList + '&smscontentVTL=' + this.SMS_CONTENT_VTL
        + '&smscontentGPC=' + this.SMS_CONTENT_GPC + '&smscontentVMS=' + this.SMS_CONTENT_VMS + '&volVTL=' + this.DATA_VOL_VTL + '&volGPC=' + this.DATA_VOL_GPC + '&volVMS=' + this.DATA_VOL_VMS
        + '&amtVTL=' + this.DATA_AMT_VTL + '&amtGPC=' + this.DATA_AMT_GPC + '&amtVMS=' + this.DATA_AMT_VMS + '&packVTL=' + PACKAGE_NAME_VTL + '&packGPC=' + PACKAGE_NAME_GPC + '&packVMS=' + PACKAGE_NAME_VMS);
      if (res) {
        if (res.err_code == 0) {
          this.messageAfterSend = res.err_message;
          this.confirmAfterSuccessModal.show();
          setTimeout(() => {
            this.pageRefresh();
          }, 2000);
        } else if (res.err_code == -501) {
          let phoneexit = this.utilityService.translate('data-campaign.phone_sended_exits');
          let phoneexit1 = this.utilityService.translate('data-campaign.phone_exits_1');
          this.checkPhoneExit = true;
          this.PhoneExit = phoneexit + res.data + phoneexit1 + this.PROGRAM_NAME;
        }
        else this.notificationService.displayErrorMessage(res.err_message);
        this.viewQuyData(this.ACCOUNT_ID);
        this.viewQuyDataCode(this.ACCOUNT_ID);
        this.confirmSendDataSMSModal.hide();
        this.loading = false;
      }
    }
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
  enableSendDataCode(event) {
    if (event) {
      this.checkdatacode = true;
      this.getDataPackageVMS();
      this.totalAmt = this.totalAmt - this.totalAmtVMS;
      this.selectedPackageVMS = [];
      this.effectiveDateVMS = "";
      this.packageAmtVMS = 0;
      this.packCountVMS = 1;
      this.totalPackVMS = 0;
      this.totalAmtVMS = 0;
      this.settingsFilterPackageVMSDataCode = {
        text: this.utilityService.translate('global.choose_package'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: false
      };

      this.settingsFilterPackageVMS = {
        text: this.utilityService.translate('global.choose_package'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: true
      };
    }
    else {
      this.checkdatacode = false;
      this.getDataPackageVMS();
      this.totalAmt = this.totalAmt - this.totalAmtVMSDataCode;
      this.selectedPackageVMSDataCode = [];
      this.effectiveDateVMSDataCode = "";
      this.packageAmtVMSDataCode = 0;
      this.packCountVMSDataCode = 1;
      this.totalPackVMSDataCode = 0;
      this.totalAmtVMSDataCode = 0;
      this.settingsFilterPackageVMSDataCode = {
        text: this.utilityService.translate('global.choose_package'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: true
      };
      this.settingsFilterPackageVMS = {
        text: this.utilityService.translate('global.choose_package'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: false
      };
    }
  }

  async createDataOtp() {
    let response: any = await this.dataService.postAsync('/api/DataOtp/InsertDataOtp?phone=' + this.phoneDataOtp + '&telco=' +
      this.telcoDataOtp + '&account_id=' + this.accountDataOtp + '&sender_name=' + this.senderNameDataOtp + '&otp_sms=' + this.otpSmsDataOtp)
    if (response) {
      if (response.err_code == 0) {
        this.confirmOtp.show();
        this.startTimer();
      } else {
        this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
  }
  async confirmSendDataOtp() {
    let otp = this.numberOtp;
    if (otp == 0 && otp == null) {
      this.notificationService.displayWarnMessage(this.utilityService.translate('data_otp.inputOtp'));
      return;
    }
    let response: any = await this.dataService.getAsync('/api/DataOtp/GetDataOtpByOtp?otp=' + otp)
    if (response) {
      if (response.err_code == 0) {
        this.confirmOtp.hide();
        this.confirmSendSMS();
      }
      else if (response.err_code == -117) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-117"));
        return;
      } else if (response.err_code == -118) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-118"));
        return;
      } else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }
  }
  //send sms continue
  sendContinuous() {
    this.confirmAfterSuccessModal.hide();
    this.selectedItemComboboxAccount = [];
    this.selectedItemComboboxAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
    this.selectedItemComboboxSender = [];
    this.dataSenderName = [];
    this.selectedGroup = [];
    this.selectedPackageVTL = [];
    this.selectedPackageGPC = [];
    this.selectedPackageVMS = [];
    this.selectedPackageVMSDataCode = [];
    this.effectiveDateVTL = "";
    this.effectiveDateGPC = "";
    this.effectiveDateVMS = "";
    this.effectiveDateVMSDataCode = "";
    this.packageAmtVTL = 0;
    this.packageAmtGPC = 0;
    this.packageAmtVMS = 0;
    this.packageAmtVMSDataCode = 0;
    this.packCountVTL = 1;
    this.packCountGPC = 1;
    this.packCountVMS = 1;
    this.packCountVMSDataCode = 1;
    this.totalPackVTL = 0;
    this.totalPackGPC = 0;
    this.totalPackVMS = 0;
    this.totalPackVMSDataCode = 0;
    this.totalAmtVTL = 0;
    this.totalAmtGPC = 0;
    this.totalAmtVMS = 0;
    this.totalAmtVMSDataCode = 0;
    this.totalAmt = 0;
    this.lstChecked = [];
    this.smsContent = "";
    this.phoneList = "";
    this.programName = "";
    this.dataPhone = [];
    this.dataPhoneTamp = [];
    this.dataCodeTamp = [];
    this.numberPhone = 0;
    this.dataPhoneAddNew = [];
    this.packViettel = "0";
    this.cntVTL = 0;
    this.cntGPC = 0;
    this.cntVMS = 0;
    this.cntVMSDataCode = 0;
    this.countVTL = 0;
    this.countGPC = 0;
    this.countVMS = 0;
    this.countVMSDataCode = 0;
    this.totalAmt = 0;
    this.packGPC = "0";
    this.packVMS = "0";
    this.totalNumber = 0;
    this.totalNumberSendSms = 0;
    this.programCode = "";
    this.selectedOptionTempSms = [];
    this.listSmsSend = [];
    this.selectedOptionTempSms.push({ "id": "", "itemName": this.utilityService.translate('send_data.optionSms') });
  }

  // export template excel
  async excelTemplate() {
    let result: boolean = await this.dataService.getFileExtentionAsync('/api/FileExtention/ExportExcelTemplate', 'DataSms', 'template_phone.xlsx');
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  async getTelco(phone: any) {
    let telco = "";
    let response: any = await this.dataService.getAsync('/api/Person/GetTelco?phone=' + phone);
    if (response != null)
      telco = response;
    return telco;
  }

  async checkboxGroup() {
    this.ischeckgroup = !this.ischeckgroup;
    if (this.ischeckgroup == true) {
      this.selectedGroupUpload=[];
      this.settingsFilterGroupUpload = {
        text: this.utilityService.translate('send_data.inGroup'),
        singleSelection: true,
        enableSearchFilter: true,
        enableFilterSelectAll: true,
        searchPlaceholderText: this.utilityService.translate('global.search'),
        noDataLabel: this.utilityService.translate('global.no_data'),
        showCheckbox: false,
        disabled: true
      };
      this.createCodeGroup();
    } else {
      this.settingsFilterGroupUpload = {
        text: this.utilityService.translate('send_data.inGroup'),
        singleSelection: true,
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

  async createCodeNameCampaing() {
    let USER_NAME;
    if (this.isAdmin) {
      USER_NAME = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].itemName : this.authService.currentUserValue.USER_NAME;
    } else {
      USER_NAME = this.authService.currentUserValue.USER_NAME;
    }

    if (USER_NAME != null || USER_NAME != "") {
      let accountName = USER_NAME.substring(0, 3);
      let codeName = (accountName + this.utilityService.formatDateToString(this.date, "yyMMddHHmmss")).toUpperCase();
      this.programCode = codeName;
    }
  }

  async createCodeGroup() {
    let USER_NAME;
    if (this.isAdmin) {
      USER_NAME = this.selectedItemComboboxAccount.length > 0 && this.selectedItemComboboxAccount[0].id != "" ? this.selectedItemComboboxAccount[0].itemName : this.authService.currentUserValue.USER_NAME;
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

  public intervalId = null
  async startTimer() {
    if ((Number(this.limit_time) > 0)) {
      let smin = ((Number(this.limit_time) % 100));
      let minsec = (smin - 60) / 10;
      if (smin > 60) {
        this.countersec = 60;
      } else {
        this.countersec = smin;
      }
      if (minsec > 0) {
        this.countermin = Math.floor(Number(this.limit_time) / 100) + minsec;
      } else {
        this.countermin = Math.floor(Number(this.limit_time) / 100);
      }

    }

    this.intervalId = setInterval(() => {
      this.disable_resend_otp = false;
      if (this.countersec - 1 == -1) {
        this.countermin -= 1;
        this.countersec = 59
      }
      else {
        this.countersec -= 1
      }
      if (this.countermin === 0 && this.countersec == 0) {
        this.disable_resend_otp = true;
        clearInterval(this.intervalId)
      }
    }, 1000)

  }
  async confirmOtphide() {
    clearInterval(this.intervalId);
    this.confirmOtp.hide();
  }
  async checkOtpLength() {
    if (this.numberOtp != null && this.numberOtp.toString().length > 6) {
      this.numberOtp = Number(this.numberOtp.toString().substr(0, 5));
    }
  }
  async resendOtp() {
    this.createDataOtp();
  }
  pageRefresh() {
    location.reload();
  }
}
