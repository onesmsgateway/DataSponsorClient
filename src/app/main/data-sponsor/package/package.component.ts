import { Component, OnInit, ViewChild, DebugNode } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataPackage = [];
  public dataPackVTL = [];
  public dataPackGPC = [];
  public dataPackVMS = [];
  public pagination: Pagination = new Pagination();
  public id;
  public packageName;
  //public slAccount: string = '';
  public inPackageName: string = '';
  public dataFrom: string = '';
  public dataNum: string = '';
  public amt: string = '';
  public dateUse;
  public role: Role = new Role();

  public formEditPackage: FormGroup;
  public settingsFilterpackVTL = {};
  public selectedpackVTL = [];
  public settingsFilterpackGPC = {};
  public selectedpackGPC = [];
  public settingsFilterpackVMS = {};
  public selectedpackVMS = [];

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) {
    modalService.config.backdrop = 'static';

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterpackVTL = {
      text: this.utilityService.translate('package.inPackVTL'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterpackGPC = {
      text: this.utilityService.translate('package.inPackGPC'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.settingsFilterpackVMS = {
      text: this.utilityService.translate('package.inPackVMS'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.formEditPackage = new FormGroup({
      id: new FormControl(),
      packageName: new FormControl(),
      dataNum: new FormControl(),
      amt: new FormControl(),
      dateUse: new FormControl(),
      packVTL: new FormControl(),
      packGPC: new FormControl(),
      packVMS: new FormControl()
    });
  }

  async ngOnInit() {
    this.getPackageViettel();
    this.getPackageGPC();
    this.getPackageVMS();
    await this.getData();
  }

  async getPackageViettel(){
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageViettel')
      for (let index in response.data) {
        this.dataPackVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].DATA + "MB" + " - Giá: " + response.data[index].AMT + " VNĐ - "  + response.data[index].DATE_USE + " ngày"});
      }
  }

  async getPackageGPC(){
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageGPC ')
      for (let index in response.data) {
        this.dataPackGPC.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].DATA + "MB" + " - Giá: " + response.data[index].AMT + " VNĐ - "  + response.data[index].DATE_USE + " ngày" });
      }
  }

  async getPackageVMS(){
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageVMS')
      for (let index in response.data) {
        this.dataPackVMS.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME + " - " + response.data[index].DATA + "MB" + " - Giá: " + response.data[index].AMT + " VNĐ - "  + response.data[index].DATE_USE + " ngày" });
      }
  }

  // bind data to grid
  async getData() {
    let response: any = await this.dataService.getAsync('/api/packageDomain/GetPackageDomainPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&package_name=" + this.inPackageName.trim())
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataPackage = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  onItemSelect() {
    this.getData();
  }

  OnItemDeSelect() {
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

  // create gói cước
  async createPackage(item) {
    let ID_PACKAGE_VTL = "";
    let ID_PACKAGE_GPC = "";
    let ID_PACKAGE_VMS = "";
    let pkCr = item.value;
    let data = item.controls;

    let PACKAGE_NAME = pkCr.packageName;
    if (PACKAGE_NAME == "" || PACKAGE_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let DATA = pkCr.dataNum;
    if (DATA == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-82"));
      return;
    }
    let DATE_USE = pkCr.dateUse;
    if (DATE_USE == "" || DATE_USE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-86"));
      return;
    }
    let TOTAL_AMT = pkCr.amt;
    if (TOTAL_AMT == "" || TOTAL_AMT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-80"));
      return;
    }
    if ((data.packVTL.value == null || data.packVTL.value.length == 0) && (data.packGPC.value == null || data.packGPC.value.length == 0) && (data.packVMS.value == null || data.packVMS.value.length == 0)) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    if (data.packVTL.value != null && data.packVTL.value.length > 0)
      ID_PACKAGE_VTL = data.packVTL.value[0].id.toString();
    if (data.packGPC.value != null && data.packGPC.value.length > 0)
      ID_PACKAGE_GPC = data.packGPC.value[0].id.toString();
    if (data.packVMS.value != null && data.packVMS.value.length > 0)
      ID_PACKAGE_VMS = data.packVMS.value[0].id.toString();

    let response: any = await this.dataService.postAsync('/api/PackageDomain', {
      PACKAGE_NAME, DATA, TOTAL_AMT, DATE_USE, ID_PACKAGE_VTL, ID_PACKAGE_GPC, ID_PACKAGE_VMS
    })
    if (response.err_code == 0) {
      this.getData();
      item.reset();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
      return;
    }
    else if (response.err_code == -10) {
      this.notificationService.displayErrorMessage(response.err_message);
      return;
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      return;
    }
  }

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/PackageDomain/' + id)
    if (response.err_code == 0) {
      let dataSmsTemp = response.data[0];
      this.formEditPackage = new FormGroup({
        id: new FormControl(id),
        packageName: new FormControl(dataSmsTemp.PACKAGE_NAME),
        dataNum: new FormControl(dataSmsTemp.DATA),
        amt: new FormControl(dataSmsTemp.TOTAL_AMT),
        dateUse: new FormControl(dataSmsTemp.DATE_USE),
        packVTL: new FormControl(dataSmsTemp.ID_PACKAGE_VTL != null && dataSmsTemp.ID_PACKAGE_VTL != '' ? [{ "id": dataSmsTemp.ID_PACKAGE_VTL, "itemName": dataSmsTemp.PACKAGE_NAME_VTL }] : [{ "id": "", "itemName": this.utilityService.translate('package.inPackVTL') }]),
        packGPC: new FormControl(dataSmsTemp.ID_PACKAGE_GPC != null && dataSmsTemp.ID_PACKAGE_GPC != '' ? [{ "id": dataSmsTemp.ID_PACKAGE_GPC, "itemName": dataSmsTemp.PACKAGE_NAME_GPC }] : [{ "id": "", "itemName": this.utilityService.translate('package.inPackGPC') }]),
        packVMS: new FormControl(dataSmsTemp.ID_PACKAGE_VMS != null && dataSmsTemp.ID_PACKAGE_VMS != '' ? [{ "id": dataSmsTemp.ID_PACKAGE_VMS, "itemName": dataSmsTemp.PACKAGE_NAME_VMS }] : [{ "id": "", "itemName": this.utilityService.translate('package.inPackVMS') }]),
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update gói cước
  async editPackage() {
    let formData = this.formEditPackage.controls;
    let ID = formData.id.value;
    let PACKAGE_NAME = formData.packageName.value;
    if (PACKAGE_NAME == "" || PACKAGE_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let DATA = formData.dataNum.value;
    if (DATA == "" || DATA == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-82"));
      return;
    }
    let DATE_USE = formData.dateUse.value;
    if (DATE_USE == "" || DATE_USE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-86"));
      return;
    }
    let TOTAL_AMT = formData.amt.value;
    if (TOTAL_AMT == "" || TOTAL_AMT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-80"));
      return;
    }
    if (formData.packVTL.value.length == 0 && formData.packGPC.value.length == 0 && formData.packVMS.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }

    let ID_PACKAGE_VTL = formData.packVTL.value.length > 0 ? formData.packVTL.value[0].id.toString() : null;
    let ID_PACKAGE_GPC = formData.packGPC.value.length > 0 ? formData.packGPC.value[0].id.toString() : null;
    let ID_PACKAGE_VMS = formData.packVMS.value.length > 0 ? formData.packVMS.value[0].id.toString() : null;

    let response: any = await this.dataService.putAsync('/api/PackageDomain/' + ID, {
      PACKAGE_NAME, DATA, TOTAL_AMT, DATE_USE, ID_PACKAGE_VTL, ID_PACKAGE_GPC, ID_PACKAGE_VMS
    })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-19"));
      return;
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  showConfirmDelete(id, packageName) {
    this.id = id;
    this.packageName = packageName;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/PackageDomain/' + id + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
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
