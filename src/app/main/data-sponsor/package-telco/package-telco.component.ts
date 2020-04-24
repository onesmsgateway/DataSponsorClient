import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-package-telco',
  templateUrl: './package-telco.component.html',
  styleUrls: ['./package-telco.component.css']
})
export class PackageTelcoComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataPackage = [];
  public dataTelco = [];
  public pagination: Pagination = new Pagination();
  public id;
  public packageName;
  public inTelco: string = '';
  public inPackageName: string = '';
  public inDataNum: string = '';
  public inAmt: string = '';
  public inDateUse: string = '';
  public dataNum: string = '';
  public amt: string = '';
  public dateUse: string = '';

  public formEditPackage: FormGroup;
  public settingsFilterTelco = {};
  public selectedTelco = [];

  constructor(
    private dataService: DataService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) {
    modalService.config.backdrop = 'static';

    this.settingsFilterTelco = {
      text: this.utilityService.translate('package_telco.inTelco'),
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
      telco: new FormControl(),
      dataNum: new FormControl(),
      amt: new FormControl(),
      dateUse: new FormControl()
    });

    this.dataTelco.push({ "id": "VIETTEL", "itemName": "VIETTEL" });
    this.dataTelco.push({ "id": "GPC", "itemName": "GPC" });
    this.dataTelco.push({ "id": "VMS", "itemName": "VMS" });
  }

  async ngOnInit() {
    await this.getData();
  }

  // bind data to grid
  async getData() {
    let telco = this.selectedTelco != null && this.selectedTelco.length > 0 ? this.selectedTelco[0].itemName : "";
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageTelcoPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&package_name=" + this.inPackageName.trim() + "&telco=" + telco + "&data=" + this.inDataNum + "&date_use=" + this.inDateUse)
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
    let TELCO = "";
    let pkCr = item.value;
    let data = item.controls;
    let PACKAGE_NAME = pkCr.packageName;
    if (PACKAGE_NAME == "" || PACKAGE_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    if (data.telco.value == null || data.telco.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-40"));
      return;
    }
    TELCO = data.telco.value[0].id;
    let DATA = pkCr.dataNum;
    if (DATA == "" || DATA == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-82"));
      return;
    }
    let DATE_USE = pkCr.dateUse;
    if (DATE_USE == "" || DATE_USE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-86"));
      return;
    }
    let AMT = pkCr.amt.toString();
    if (AMT == "" || AMT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-80"));
      return;
    }

    let response: any = await this.dataService.postAsync('/api/PackageTelco', {
      PACKAGE_NAME, TELCO, DATA, AMT, DATE_USE
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
    let response: any = await this.dataService.getAsync('/api/PackageTelco/' + id)
    if (response.err_code == 0) {
      let dataSmsTemp = response.data[0];
      this.formEditPackage = new FormGroup({
        id: new FormControl(id),
        packageName: new FormControl(dataSmsTemp.PACKAGE_NAME),
        telco: new FormControl([{ "id": dataSmsTemp.TELCO, "itemName": dataSmsTemp.TELCO }]),
        dataNum: new FormControl(dataSmsTemp.DATA),
        amt: new FormControl(dataSmsTemp.AMT),
        dateUse: new FormControl(dataSmsTemp.DATE_USE)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  // update gói cước
  async editPackage() {
    let TELCO = "";
    let formData = this.formEditPackage.controls;
    let ID = formData.id.value;
    let PACKAGE_NAME = formData.packageName.value;
    if (PACKAGE_NAME == "" || PACKAGE_NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    if (formData.telco.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    TELCO = formData.telco.value[0].id;
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
    let AMT = formData.amt.value;
    if (AMT == "" || AMT == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-80"));
      return;
    }

    let response: any = await this.dataService.putAsync('/api/PackageTelco/' + ID, {
      PACKAGE_NAME, TELCO, DATA, AMT, DATE_USE
    })
    if (response.err_code == 0) {
      this.getData();
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("103"));
    }
    else if (response.err_code == -10) {
      this.notificationService.displayErrorMessage(response.err_message);
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
    let response: any = await this.dataService.deleteAsync('/api/PackageTelco/' + id)
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
