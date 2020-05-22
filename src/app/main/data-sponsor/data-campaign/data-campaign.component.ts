import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-data-campaign',
  templateUrl: './data-campaign.component.html',
  styleUrls: ['./data-campaign.component.css']
})
export class DataCampaignComponent implements OnInit {

  @ViewChild('viewDataCampaignDetailModal', { static: false }) public viewDataCampaignDetailModal: ModalDirective;
  @ViewChild('editCampaignModel', { static: false }) public editCampaignModel: ModalDirective;
  @ViewChild('confirmApproveModal', { static: false }) public confirmApproveModal: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('choosePackageModal', { static: false }) public choosePackageModal: ModalDirective;

  public dataCampaign = [];
  public dataCampaignDetail = [];
  public dataAccount = [];
  public dataPackageVTL = [];
  public dataPackageGPC = [];
  public dataPackageVMS = [];
  public id;
  public notification;
  public data_campaign_id;
  public slAccount: string = '';
  public fromDate: string = '';
  public toDate: string = '';
  public roleAccess = 0;
  public checkShowDetail: boolean = false;
  public pagination: Pagination = new Pagination();
  public pageIndex: number;
  public pageSize;
  public totalRow: number;
  public totalPage: number;
  public isAdmin: boolean = false;
  public loading: boolean = false;
  public reasonContent = "";
  public formEditCampaign: FormGroup;
  public numberChar = 0;
  public numberSMS = 0;
  public effectiveDateVTL;
  public effectiveDateGPC;
  public effectiveDateVMS;
  public packageAmtVTL = 0;
  public packageAmtGPC = 0;
  public packageAmtVMS = 0;
  public packCountVTL = 1;
  public packCountGPC = 1;
  public packCountVMS = 1;
  public totalPackVTL = 0;
  public totalPackGPC = 0;
  public totalPackVMS = 0;
  public totalPhoneVTL = 0;
  public totalPhoneGPC = 0;
  public totalPhoneVMS = 0;
  public totalAmtVTL = 0;
  public totalAmtGPC = 0;
  public totalAmtVMS = 0;
  public totalAmt = 0;
  public dataViettel = 0;
  public packViettel: string = "0";
  public packGPC: string = "0";
  public packVMS: string = "0";

  public settingsFilterAccount = {};
  public selectedAccount = [];
  public settingsFilterPackageVTL = {};
  public settingsFilterPackageGPC = {};
  public settingsFilterPackageVMS = {};
  public selectedPackageVTL = [];
  public selectedPackageGPC = [];
  public selectedPackageVMS = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.formEditCampaign = new FormGroup({
      id: new FormControl(),
      smsType: new FormControl(),
      contentOld: new FormControl(),
      contentNew: new FormControl(),
      timeSchedule: new FormControl()
    });

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

    this.settingsFilterAccount = {
      text: "Chọn tài khoản",
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: "Tìm kiếm",
      noDataLabel: "Không có dữ liệu"
    };

    this.pageIndex = 1;
    this.pageSize = 5;
    this.totalRow = 0;
    this.totalPage = 0;
  }

  async ngOnInit() {
    await this.bindDataAccount();
    await this.getData();
  }

  // bind data account
  //#region account
  async bindDataAccount() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    this.roleAccess = result.data[0].ROLE_ACCESS;
    if (this.roleAccess == 50) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      this.isAdmin = true;
    }
    else {
      this.isAdmin = false;
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataAccount.length == 1) {
        this.selectedAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedAccount.push({ "id": "", "itemName": "Chọn tài khoản" });
    }
  }

  // bind data to grid
  async getData() {
    let account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&account_id=" + account + "&from_date=" + this.fromDate + "&to_date=" + this.toDate +
      "&isAdmin=" + this.isAdmin)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataCampaign = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  async getDataDetail() {
    let account = this.selectedAccount.length != 0 && this.selectedAccount[0].id != "" ? this.selectedAccount[0].id : "";
    let response: any = await this.dataService.getAsync('/api/DataSms/GetDataSmsPaging?pageIndex=' + this.pageIndex +
      "&pageSize=" + this.pageSize + "&account_id=" + account + "&data_campaign_id=" + this.data_campaign_id + "&from_date=" + this.fromDate + "&to_date=" + this.toDate
      + "&phone=&sms_content=");
    this.loadDataDetail(response);
  }

  loadDataDetail(response?: any) {
    if (response) {
      this.dataCampaignDetail = response.data;
      if ('pagination' in response) {
        this.pageSize = response.pagination.PageSize;
        this.totalRow = response.pagination.TotalRows;
      }
    }
  }

  onChangeFromDate(event) {
    this.fromDate = this.utilityService.formatDateToString(event, "yyyyMMddHHmmss");
    this.getData();
  }

  onChangeToDate(event) {
    this.toDate = this.utilityService.formatDateToString(event, "yyyyMMddHHmmss");
    this.getData();
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

  setPageIndexDetail(pageNo: number): void {
    this.pageIndex = pageNo;
    this.getDataDetail();
  }

  pageChangedDetail(event: any): void {
    this.setPageIndexDetail(event.page);
  }

  changePageSizeDetail(size) {
    this.pageSize = size;
    this.pageIndex = 1;
    this.getDataDetail();
  }

  //#region view lich su cap tin
  async showConfirmViewDetail(id) {
    this.data_campaign_id = id;
    let response: any = await this.dataService.getAsync('/api/DataCampaign/GetDataCampaignDetailPaging?pageIndex=' + this.pageIndex +
      "&pageSize=" + this.pageSize + "&data_campaign_id=" + this.data_campaign_id);
    if (response.err_code == 0) {
      if (response.data != null && response.data.length > 0) {
        this.checkShowDetail = true;
        this.dataCampaignDetail = response.data;
        this.loadDataDetail(response);
      }
      else {
        this.notification = "Không có số điện thoại nào";
        this.checkShowDetail = false;
      }
    }
    this.viewDataCampaignDetailModal.show();
  }
  //#endregion

  //#region duyet tin
  showConfirmApproveSms(id) {
    this.data_campaign_id = id;
    this.confirmApproveModal.show();
  }

  public async approveSms(campaign_id) {
    this.loading = true;
    if (campaign_id != undefined && campaign_id > 0) {
      let respone = await this.dataService.postAsync('/api/DataSms/ApproveDataCampaign?campaignId=' + campaign_id);
      if (respone.err_code == 0) this.notificationService.displaySuccessMessage(respone.err_message);
      else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
    else this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-52"));
    this.loading = false;
    this.confirmApproveModal.hide();
    this.getData();
  }
  //#endregion

  //#region xoa đơn hàng chi tiết
  showConfirmDelete(id) {
    this.data_campaign_id = id;
    this.reasonContent = "";
    this.confirmDeleteModal.show();
  }

  public async deleteCampaign(campaign_id) {
    if (this.reasonContent == "") {
      this.notificationService.displayWarnMessage("Bạn phải nhập lý do hủy đơn");
      return;
    }
    let data = await this.dataService.putAsync('/api/DataCampaign/DeleteDataCampaign?id=' + campaign_id +
      '&description=' + this.reasonContent);
    if (data.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("-88"));
      this.confirmDeleteModal.hide();
      this.getData();
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
  }
  //#endregion

  async exportExcel() {
    let result: boolean = await this.dataService.getFileExtentionDataCampaignDetailAsync("/api/FileExtention/ExportDataCampaignDetail",
      this.data_campaign_id, "DataCampaignDetail");
    if (result) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("120"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("125"));
    }
  }

  //#region edit content template
  public async showFormEditCampaign(campaign_id) {
    let response: any = await this.dataService.getAsync('/api/DataCampaign/' + campaign_id)
    if (response.err_code == 0) {
      let dataCampaign = response.data[0];
      this.formEditCampaign = new FormGroup({
        id: new FormControl(campaign_id),
        contentOld: new FormControl(dataCampaign.SMS_CONTENT),
        contentNew: new FormControl(""),
        timeSchedule: new FormControl(dataCampaign.TIME_SEND)
      });
      this.packViettel = "0";
      this.packGPC = "0";
      this.packVMS = "0";
      this.totalAmtVTL = 0;
      this.totalAmtGPC = 0;
      this.totalAmtVMS = 0;
      this.totalAmt = 0;
      this.selectedPackageVTL = [];
      this.effectiveDateVTL = "";
      this.packageAmtVTL = 0;
      this.packCountVTL = 1;
      this.selectedPackageGPC = [];
      this.effectiveDateGPC = "";
      this.packageAmtGPC = 0;
      this.packCountGPC = 1;
      this.selectedPackageVMS = [];
      this.effectiveDateVMS = "";
      this.packageAmtVMS = 0;
      this.packCountVMS = 1;
      //get pakacge
      let resPack: any = await this.dataService.getAsync('/api/PackageTelco/GetPackageByDataCampaignId?data_campaign_id=' + campaign_id)
      if (resPack.err_code == 0) {
        for (let i in resPack.data) {
          this.totalPhoneVTL = resPack.data[0].COUNT_VTL;
          this.totalPhoneGPC = resPack.data[0].COUNT_GPC;
          this.totalPhoneVMS = resPack.data[0].COUNT_VMS;
          if (resPack.data[i].TELCO == 'VIETTEL') {
            this.selectedPackageVTL.push({ "id": resPack.data[i].ID, "itemName": resPack.data[i].PACKAGE_NAME_DISPLAY });
            this.effectiveDateVTL = resPack.data[i].DATE_USE + " ngày";
            this.packageAmtVTL = resPack.data[i].AMT;
            this.packCountVTL = resPack.data[i].PACKAGE_QUANTITY;
            this.totalPackVTL = resPack.data[i].TOTAL_PACKAGES;
            this.packViettel = resPack.data[i].PACKAGE_NAME_DISPLAY + " x " + this.totalPackVTL;
            this.totalAmtVTL = this.totalPackVTL * resPack.data[i].AMT;
          }
          else if (resPack.data[i].TELCO == 'GPC') {
            this.selectedPackageGPC.push({ "id": resPack.data[i].ID, "itemName": resPack.data[i].PACKAGE_NAME_DISPLAY });
            this.effectiveDateGPC = resPack.data[i].DATE_USE + " ngày";
            this.packageAmtGPC = resPack.data[i].AMT;
            this.packCountGPC = resPack.data[i].PACKAGE_QUANTITY;
            this.totalPackGPC = resPack.data[i].TOTAL_PACKAGES;
            this.packGPC = resPack.data[i].PACKAGE_NAME_DISPLAY + " x " + this.totalPackGPC;
            this.totalAmtGPC = this.totalPackGPC * resPack.data[i].AMT;
          }
          else if (resPack.data[i].TELCO == 'VMS') {
            this.selectedPackageVMS.push({ "id": resPack.data[i].ID, "itemName": resPack.data[i].PACKAGE_NAME_DISPLAY });
            this.effectiveDateVMS = resPack.data[i].DATE_USE + " ngày";
            this.packageAmtVMS = resPack.data[i].AMT;
            this.packCountVMS = resPack.data[i].PACKAGE_QUANTITY;
            this.totalPackVMS = resPack.data[i].TOTAL_PACKAGES;
            this.packVMS = resPack.data[i].PACKAGE_NAME_DISPLAY + " x " + this.totalPackVMS;
            this.totalAmtVMS = this.totalPackVMS * resPack.data[i].AMT;
          }
        }
        this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
        this.editCampaignModel.show();
      }
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  //#region change count sms
  countSMS(sms) {
    let smsContent = this.utilityService.removeDiacritics(sms);
    smsContent = this.utilityService.removeSign4VietnameseString(sms);
    let result = "";

    for (var i = 0, len = smsContent.length; i < len; i++) {
      if (smsContent.charCodeAt(i) == 160) {
        result += " ";
      }
      else if (smsContent.charCodeAt(i) <= 127) {
        result += smsContent[i];
      }
    }
    smsContent = result;
    var lengthsms = 0
    for (var k = 0; k < smsContent.length; k++) {
      if (smsContent.charAt(k) == '\\' || smsContent.charAt(k) == '^'
        || smsContent.charAt(k) == '{' || smsContent.charAt(k) == '}' || smsContent.charAt(k) == '['
        || smsContent.charAt(k) == ']' || smsContent.charAt(k) == '|') {
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
    else {
      this.numberSMS = 3;
    }
  }
  //#endregion

  showModalPackage() {
    this.getDataPackageVTL();
    this.getDataPackageGPC();
    this.getDataPackageVMS();
    this.choosePackageModal.show();
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
        this.packageAmtVTL = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
        if (this.packCountVTL != null && this.packCountVTL > 0 && this.packageAmtVTL > 0) {
          this.totalPackVTL = this.packCountVTL * this.totalPhoneVTL;
          this.totalAmtVTL = this.packageAmtVTL * this.totalPackVTL;
          this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
          this.packViettel = this.selectedPackageVTL[0].itemName + " x " + this.totalPackVTL;
          this.dataViettel = response.data[0].DATA;
        }
      }
    }
    else{
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
      this.totalPackVTL = this.packCountVTL * this.totalPhoneVTL;
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
        this.packageAmtGPC = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
        if (this.packCountGPC != null && this.packCountGPC > 0 && this.packageAmtGPC > 0) {
          this.totalPackGPC = this.packCountGPC * this.totalPhoneGPC;
          this.totalAmtGPC = this.packageAmtGPC * this.totalPackGPC;
          this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
          this.packGPC = this.selectedPackageGPC[0].itemName + " x " + this.totalPackGPC;
        }
      }
    }
    else{
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
      this.totalPackGPC = this.packCountGPC * this.totalPhoneGPC;
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
        this.packageAmtVMS = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
        if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS > 0) {
          this.totalPackVMS = this.packCountVMS * this.totalPhoneVMS;
          this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
          this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
          this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
        }
      }
    }
    else{
      this.effectiveDateVMS = "0";
      this.packCountVMS = 1;
      this.packageAmtVMS = 0;
      this.totalPackVMS = 0;
      this.totalAmt = this.totalAmt - this.totalAmtVMS;
      this.totalAmtVMS = 0;
    }
  }

  changeCountVMS() {
    this.packVMS = "0";
    if (this.packCountVMS != null && this.packCountVMS > 0 && this.packageAmtVMS > 0) {
      this.totalPackVMS = this.packCountVMS * this.totalPhoneVMS;
      this.totalAmtVMS = this.packageAmtVMS * this.totalPackVMS;
      this.totalAmt = this.totalAmtVTL + this.totalAmtGPC + this.totalAmtVMS;
      this.packVMS = this.selectedPackageVMS[0].itemName + " x " + this.totalPackVMS;
    }
  }

  //chọn gói cước
  submitPackage() {
    this.choosePackageModal.hide();
  }

  public async editCampaign() {
    let formData = this.formEditCampaign.controls;
    let ID = formData.id.value;
    let smsContentOld = formData.contentOld.value;
    let SMS_TEMPLATE = formData.contentNew.value;
    let time = new Date(); // test cập nhật thời gian gửi, value đang = ""
    time = formData.timeSchedule.value;
    let TIME_SCHEDULE = this.utilityService.formatDateToString(time, "yyyyMMddHHmmss");

    if (SMS_TEMPLATE != undefined && SMS_TEMPLATE != "") {
      SMS_TEMPLATE = this.utilityService.removeDiacritics(SMS_TEMPLATE);
      SMS_TEMPLATE = this.utilityService.removeSign4VietnameseString(SMS_TEMPLATE);
    }
    else SMS_TEMPLATE = smsContentOld;

    if (TIME_SCHEDULE == "" || TIME_SCHEDULE == undefined) {
      this.notificationService.displayWarnMessage("Thời gian gửi tin không được để trống!");
      return;
    }
    // check package
    if (this.selectedPackageVTL.length == 0 && this.selectedPackageGPC.length == 0 && this.selectedPackageVMS.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let packageIdVTL = this.selectedPackageVTL.length > 0 && this.selectedPackageVTL[0].id != null ? this.selectedPackageVTL[0].id : null;
    let packageIdGPC = this.selectedPackageGPC.length > 0 && this.selectedPackageGPC[0].id != null ? this.selectedPackageGPC[0].id : null;
    let packageIdVMS = this.selectedPackageVMS.length > 0 && this.selectedPackageVMS[0].id != null ? this.selectedPackageVMS[0].id : null;
    let listSmsSend = [];
    listSmsSend.push({ ID, SMS_CONTENT: SMS_TEMPLATE, TIME_SCHEDULE, TELCO: "VIETTEL", DATA_AMT: this.totalAmt, PACKAGE_ID: packageIdVTL, PACKAGE_QUANTITY: this.packCountVTL, TOTAL_PACKAGES: this.totalPackVTL });
    listSmsSend.push({ ID, SMS_CONTENT: SMS_TEMPLATE, TIME_SCHEDULE, TELCO: "GPC", DATA_AMT: this.totalAmt, PACKAGE_ID: packageIdGPC, PACKAGE_QUANTITY: this.packCountGPC, TOTAL_PACKAGES: this.totalPackGPC });
    listSmsSend.push({ ID, SMS_CONTENT: SMS_TEMPLATE, TIME_SCHEDULE, TELCO: "VMS", DATA_AMT: this.totalAmt, PACKAGE_ID: packageIdVMS, PACKAGE_QUANTITY: this.packCountVMS, TOTAL_PACKAGES: this.totalPackVMS });

    // if(this.selectedPackageVTL.length > 0 && this.selectedPackageVTL[0].id != ""){
    //   listSmsSend.push({ ID, SMS_CONTENT: SMS_TEMPLATE, TIME_SCHEDULE, TELCO: "VIETTEL", DATA_AMT: this.totalAmt, PACKAGE_ID: this.selectedPackageVTL[0].id, PACKAGE_QUANTITY: this.packCountVTL, TOTAL_PACKAGES: this.totalPackVTL });
    // }
    // if(this.selectedPackageGPC.length > 0 && this.selectedPackageGPC[0].id != ""){
    //   listSmsSend.push({ ID, SMS_CONTENT: SMS_TEMPLATE, TIME_SCHEDULE, TELCO: "GPC", DATA_AMT: this.totalAmt, PACKAGE_ID: this.selectedPackageGPC[0].id, PACKAGE_QUANTITY: this.packCountGPC, TOTAL_PACKAGES: this.totalPackGPC });
    // }
    // if(this.selectedPackageVMS.length > 0 && this.selectedPackageVMS[0].id != ""){
    //   listSmsSend.push({ ID, SMS_CONTENT: SMS_TEMPLATE, TIME_SCHEDULE, TELCO: "VMS", DATA_AMT: this.totalAmt, PACKAGE_ID: this.selectedPackageVMS[0].id, PACKAGE_QUANTITY: this.packCountVMS, TOTAL_PACKAGES: this.totalPackVMS });
    // }

    let editCampaign = await this.dataService.putAsync('/api/DataCampaign/UpdateDataCampaign', listSmsSend);
    if (editCampaign.err_code == 0) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.editCampaignModel.hide();
      this.getData();
    }
    else this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
  }
  //#endregion
}
