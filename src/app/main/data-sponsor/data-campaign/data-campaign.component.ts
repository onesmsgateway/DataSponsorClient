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
  @ViewChild('confirmApproveModal', { static: false }) public confirmApproveModal: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataCampaign = [];
  public dataCampaignDetail = [];
  public dataAccount = [];
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
  public formEditContent: FormGroup;

  public settingsFilterAccount = {};
  public selectedAccount = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) {
    modalService.config.backdrop = 'static';

    this.formEditContent = new FormGroup({
      id: new FormControl(),
      smsType: new FormControl(),
      contentOld: new FormControl(),
      contentNew: new FormControl(),
      timeSchedule: new FormControl()
    });

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
    let result = await this.dataService.getDataAsync('/api/account/GetInfoAccountLogin');
    this.roleAccess = result.data[0].ROLE_ACCESS;
    if (this.roleAccess == 50) {
      let response: any = await this.dataService.getDataAsync('/api/account');
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      this.isAdmin = true;
    }
    else {
      this.isAdmin = false;
      let response = await this.dataService.getDataAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
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
    let response: any = await this.dataService.getDataAsync('/api/DataCampaign/GetDataCampaignPaging?pageIndex=' + this.pagination.pageIndex +
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
    let response: any = await this.dataService.getDataAsync('/api/DataSms/GetDataSmsPaging?pageIndex=' + this.pageIndex +
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
    let response: any = await this.dataService.getDataAsync('/api/DataCampaign/GetDataCampaignDetailPaging?pageIndex=' + this.pageIndex +
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
        let respone = await this.dataService.postDataAsync('/api/DataSms/ApproveDataCampaign?campaignId=' + campaign_id);
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
    let data = await this.dataService.putDataAsync('/api/DataCampaign/DeleteDataCampaign?id=' + campaign_id +
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
}
