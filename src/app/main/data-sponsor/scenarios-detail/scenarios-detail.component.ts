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
  selector: 'app-scenarios-detail',
  templateUrl: './scenarios-detail.component.html',
  styleUrls: ['./scenarios-detail.component.css']
})
export class ScenariosDetailComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataScenarioDetail = [];
  public pagination: Pagination = new Pagination();
  public id;
  public name;
  public scenarioId = "";
  public quantityVTL = 1;
  public quantityGPC = 1;
  public quantityVMS = 1;
  public formEditScenarios: FormGroup;
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public loading: boolean = true;
  public packageAmtVTL = 0;
  public packageAmtGPC = 0;
  public packageAmtVMS = 0;
  public checkDataCode = 0;
  public dataPackageVTL = [];
  public settingsFilterPackageVTL = {};
  public selectedPackageVTL = [];
  public dataPackageGPC = [];
  public settingsFilterPackageGPC = {};
  public selectedPackageGPC = [];
  public dataPackageVMS = [];
  public settingsFilterPackageVMS = {};
  public selectedPackageVMS = [];
  public scenario_type: string = "";
  public isScenarioType: boolean = false;
  public isScPopup: boolean = false;


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

    this.formEditScenarios = new FormGroup({
      id: new FormControl(),
      valueScenar: new FormControl(),
      packageVTL: new FormControl(),
      packageGPC: new FormControl(),
      packageVMS: new FormControl(),
      quantityVTL: new FormControl(),
      quantityGPC: new FormControl(),
      quantityVMS: new FormControl(),
      packageAmtVTL: new FormControl(),
      packageAmtGPC: new FormControl(),
      packageAmtVMS: new FormControl()
    });
  }

  ngOnInit() {
    this.getDataPackageVTL();
    this.getDataPackageGPC();
    this.getDataPackageVMS();

    //this.getData();
  }

  // get data package viettel
  async getDataPackageVTL() {
    this.dataPackageVTL = [];
    this.selectedPackageVTL = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VIETTEL' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageVTL.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVTL.length == 1)
      this.selectedPackageVTL.push({ "id": this.dataPackageVTL[0].id, "itemName": this.dataPackageVTL[0].itemName });
  }

  // get data package vina
  async getDataPackageGPC() {
    this.dataPackageGPC = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=GPC' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageGPC.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageGPC.length == 1)
      this.selectedPackageGPC.push({ "id": this.dataPackageGPC[0].id, "itemName": this.dataPackageGPC[0].itemName });
  }

  // get data package mobi
  async getDataPackageVMS() {
    this.dataPackageVMS = [];
    let response: any = await this.dataService.getAsync('/api/packageTelco/GetPackageByTelco?telco=VMS' + '&ismoneydatacode=' + this.checkDataCode)
    for (let index in response.data) {
      this.dataPackageVMS.push({ "id": response.data[index].ID, "itemName": response.data[index].PACKAGE_NAME_DISPLAY });
    }
    if (this.dataPackageVMS.length == 1)
      this.selectedPackageVMS.push({ "id": this.dataPackageVMS[0].id, "itemName": this.dataPackageVMS[0].itemName });
  }

  //#region load data
  async getData() {
    let response: any = await this.dataService.getAsync('/api/ScenariosDetail/GetScenariosDetailPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&scenario_id=" + this.scenarioId)
    this.loadData(response);
    this.getDataScenario();

  }
  //loaddataScenario
  async getDataScenario() {
    let response: any = await this.dataService.getAsync('/api/Scenarios/' + this.scenarioId)
    this.scenario_type = response.data[0].SCENARIO_TYPE;
    if (this.scenario_type != this.utilityService.translate('scenarios.scenariosDetailTwo')) {
      this.isScenarioType = true;
      this.isScPopup = false;
    }
    else {
      this.isScenarioType = false;
      this.isScPopup = true;
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataScenarioDetail = response.data;
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

  //#region create new
  async createScenariosDetail(item) {

    let scenar = item.value;
    let combobox = item.controls;
    let SCENARIO_ID = this.scenarioId;
    let VALUE = scenar.valueScenar;
    if (this.scenario_type != this.utilityService.translate('scenarios.scenariosDetailTwo')) {
      if (VALUE == "" || VALUE == null) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
        return;
      }
    }
    if (combobox.packageVTL.value.length == 0 && combobox.packageGPC.value.length == 0 && combobox.packageVMS.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let PACKAGE_ID_VIETTEL = combobox.packageVTL.value.length > 0 && combobox.packageVTL.value[0].id != "" ? combobox.packageVTL.value[0].id : null;
    let PACKAGE_ID_VINAPHONE = combobox.packageGPC.value.length > 0 && combobox.packageGPC.value[0].id != "" ? combobox.packageGPC.value[0].id : null;
    let PACKAGE_ID_MOBIFONE = combobox.packageVMS.value.length > 0 && combobox.packageVMS.value[0].id != "" ? combobox.packageVMS.value[0].id : null;
    let PACKAGE_QUANTITY_VIETTEL = scenar.quantityVTL != "" && scenar.quantityVTL != "" ? scenar.quantityVTL : 1;
    let PACKAGE_QUANTITY_VINAPHONE = scenar.quantityGPC != "" && scenar.quantityGPC != "" ? scenar.quantityGPC : 1;
    let PACKAGE_QUANTITY_MOBIFONE = scenar.quantityVMS != "" && scenar.quantityVMS != "" ? scenar.quantityVMS : 1;

    let response: any = await this.dataService.postAsync('/api/ScenariosDetail', {
      SCENARIO_ID, VALUE, PACKAGE_ID_VIETTEL, PACKAGE_ID_VINAPHONE, PACKAGE_ID_MOBIFONE, PACKAGE_QUANTITY_VIETTEL, PACKAGE_QUANTITY_VINAPHONE, PACKAGE_QUANTITY_MOBIFONE
    })

    if (response.err_code == 0) {
      item.reset();
      this.getData();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else if (response.err_code == 138) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("138"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-19"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/ScenariosDetail/' + id)
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      this.formEditScenarios = new FormGroup({
        id: new FormControl(id),
        valueScenar: new FormControl(dataDetail.VALUE),
        packageVTL: new FormControl(dataDetail.PACKAGE_ID_VIETTEL != "" && dataDetail.PACKAGE_ID_VIETTEL != null ? [{ "id": dataDetail.PACKAGE_ID_VIETTEL, "itemName": dataDetail.PACKAGE_NAME_VIETTEL }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        packageGPC: new FormControl(dataDetail.PACKAGE_ID_VINAPHONE != "" && dataDetail.PACKAGE_ID_VINAPHONE != null ? [{ "id": dataDetail.PACKAGE_ID_VINAPHONE, "itemName": dataDetail.PACKAGE_NAME_VINAPHONE }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        packageVMS: new FormControl(dataDetail.PACKAGE_ID_MOBIFONE != "" && dataDetail.PACKAGE_ID_MOBIFONE != null ? [{ "id": dataDetail.PACKAGE_ID_MOBIFONE, "itemName": dataDetail.PACKAGE_NAME_MOBIFONE }]
          : [{ "id": "", "itemName": this.utilityService.translate('global.choose_package') }]),
        quantityVTL: new FormControl(dataDetail.PACKAGE_QUANTITY_VIETTEL),
        quantityGPC: new FormControl(dataDetail.PACKAGE_QUANTITY_VINAPHONE),
        quantityVMS: new FormControl(dataDetail.PACKAGE_QUANTITY_MOBIFONE),
        packageAmtVTL: new FormControl(dataDetail.AMT_VIETTEL),
        packageAmtGPC: new FormControl(dataDetail.AMT_VINAPHONE),
        packageAmtVMS: new FormControl(dataDetail.AMT_MOBIFONE)
      });

      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }


  }

  // update chi tiet kich ban
  async editScenariosDetail() {
    let formData = this.formEditScenarios.controls;
    let ID = formData.id.value;
    let SCENARIO_ID = this.scenarioId;
    let VALUE = formData.valueScenar.value.toString();
    if (this.scenario_type != this.utilityService.translate('scenarios.scenariosDetailTwo')) {
      if (VALUE == "" || VALUE == null) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
        return;
      }
    }

    if (formData.packageVTL.value.length == 0 && formData.packageGPC.value.length == 0 && formData.packageVMS.value.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-34"));
      return;
    }
    let PACKAGE_ID_VIETTEL = formData.packageVTL.value.length > 0 && formData.packageVTL.value[0].id != "" ? formData.packageVTL.value[0].id : null;
    let PACKAGE_ID_VINAPHONE = formData.packageGPC.value.length > 0 && formData.packageGPC.value[0].id != "" ? formData.packageGPC.value[0].id : null;
    let PACKAGE_ID_MOBIFONE = formData.packageVMS.value.length > 0 && formData.packageVMS.value[0].id != "" ? formData.packageVMS.value[0].id : null;
    let PACKAGE_QUANTITY_VIETTEL = formData.quantityVTL.value != "" && formData.quantityVTL.value != null ? formData.quantityVTL.value : 1;
    let PACKAGE_QUANTITY_VINAPHONE = formData.quantityGPC.value != "" && formData.quantityGPC.value != null ? formData.quantityGPC.value : 1;
    let PACKAGE_QUANTITY_MOBIFONE = formData.quantityVMS.value != "" && formData.quantityVMS.value != null ? formData.quantityVMS.value : 1;

    let response: any = await this.dataService.putAsync('/api/ScenariosDetail/' + ID, {
      SCENARIO_ID, VALUE, PACKAGE_ID_VIETTEL, PACKAGE_ID_VINAPHONE, PACKAGE_ID_MOBIFONE, PACKAGE_QUANTITY_VIETTEL, PACKAGE_QUANTITY_VINAPHONE, PACKAGE_QUANTITY_MOBIFONE
    })
    if (response.err_code == 0) {
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getData();
    }
    else if (response.err_code == 103) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-103"));
    }
    else if (response.err_code == -19) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-19"));
    }

    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }

  showConfirmDelete(id, name) {
    this.id = id;
    this.name = name;
    this.confirmDeleteModal.show();
  }

  // delete
  async confirmDelete(id) {
    let response: any = await this.dataService.deleteAsync('/api/ScenariosDetail/' + id)
    if (response.err_code == 0) {
      this.getData();
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
  async changePackageVTL() {
    if (this.selectedPackageVTL.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/' + this.selectedPackageVTL[0].id);
      if (response != null && response.err_code == 0) {
        this.packageAmtVTL = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
      }
    }
    else
      this.packageAmtVTL = 0;
  }
  async changePackageGPC() {
    if (this.selectedPackageGPC.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/' + this.selectedPackageGPC[0].id);
      if (response != null && response.err_code == 0) {
        this.packageAmtGPC = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
      }
    }
    else
      this.packageAmtGPC = 0;
  }
  async changePackageVMS() {
    if (this.selectedPackageVMS.length > 0) {
      let response: any = await this.dataService.getAsync('/api/packageTelco/' + this.selectedPackageVMS[0].id);
      if (response != null && response.err_code == 0) {
        this.packageAmtVMS = response.data[0].AMT != null ? Number(response.data[0].AMT) : 0;
      }
    }
    else
      this.packageAmtVMS = 0;
  }
}
