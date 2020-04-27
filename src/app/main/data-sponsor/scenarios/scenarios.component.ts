import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Pagination } from 'src/app/core/models/pagination';
import { FormGroup, FormControl } from '@angular/forms';
import { Role } from 'src/app/core/models/role';
import { DataService } from 'src/app/core/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilityService } from 'src/app/core/services/utility.service';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit {

  @ViewChild('showModalCreate', { static: false }) public showModalCreate: ModalDirective;
  @ViewChild('showModalUpdate', { static: false }) public showModalUpdate: ModalDirective;
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;

  public dataScenarios = [];
  public pagination: Pagination = new Pagination();
  public id;
  public name;
  public inCodeScenar: string = '';
  public inNameScenar: string = '';
  public formEditScenarios: FormGroup;
  public role: Role = new Role();
  public isAdmin: boolean = false;
  public checkActive = true;
  public dataStatus = [];

  public settingsFilterStatus = {};
  public selectedStatus = [];

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

    this.settingsFilterStatus = {
      text: this.utilityService.translate('global.choose_status'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };

    this.formEditScenarios = new FormGroup({
      id: new FormControl(),
      code: new FormControl(),
      name: new FormControl(),
      valueScenar: new FormControl(),
      dataScenar: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      isActive: new FormControl()
    });
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
    this.bindDataStatus();
    this.getData();
  }

  //#region load data
  async getData() {
    let active = this.selectedStatus.length > 0 ? this.selectedStatus[0].id : "";
    let response: any = await this.dataService.getAsync('/api/Scenarios/GetScenariosPaging?pageIndex=' + this.pagination.pageIndex +
      "&pageSize=" + this.pagination.pageSize + "&code=" + this.inCodeScenar +
      "&name=" + this.inNameScenar + "&active=" + active)
    this.loadData(response);
  }

  loadData(response?: any) {
    if (response) {
      this.dataScenarios = response.data;
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

  //#region smsType
  public async bindDataStatus() {
    this.dataStatus = [];
    this.dataStatus.push({ "id": "1", "itemName": this.utilityService.translate('scenarios.active') });
    this.dataStatus.push({ "id": "0", "itemName": this.utilityService.translate('scenarios.inActive') });
  }
  //#endregion

  //#region create new
  async createScenarios(item) {
    let scenar = item.value;
    let CODE = scenar.code;
    if (CODE == "" || CODE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-92"));
      return;
    }
    let NAME = scenar.name;
    if (NAME == "" || NAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-93"));
      return;
    }
    let VALUE = scenar.name;
    if (VALUE == "" || VALUE == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-94"));
      return;
    }
    let DATA = scenar.name;
    if (DATA == "" || DATA == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-82"));
      return;
    }
    let START_DATE = scenar.startDate;
    let END_DATE = scenar.endDate;
    if (START_DATE != '' && START_DATE != null && END_DATE != '' && END_DATE != null) {
      let fromDate = this.utilityService.formatDateTempalte(START_DATE.toString());
      let toDate = this.utilityService.formatDateTempalte(END_DATE.toString());
      if (fromDate > toDate) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
        return;
      }
    }
    let IS_ACTIVE = this.checkActive == true ? 1 : 0;

    let response: any = await this.dataService.postAsync('/api/Scenarios', {
      CODE, NAME, VALUE, DATA, START_DATE, END_DATE, IS_ACTIVE
    })
    if (response.err_code == 0) {
      item.reset();
      this.getData();
      this.showModalCreate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("100"));
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
    }
  }
  //#endregion

  // show update modal
  async confirmUpdateModal(id) {
    let response: any = await this.dataService.getAsync('/api/Scenarios/' + id)
    if (response.err_code == 0) {
      let dataDetail = response.data[0];
      this.formEditScenarios = new FormGroup({
        id: new FormControl(id),
        code: new FormControl(dataDetail.CODE),
        name: new FormControl(dataDetail.NAME),
        valueScenar: new FormControl(dataDetail.VALUE),
        dataScenar: new FormControl(dataDetail.DATA),
        startDate: new FormControl(dataDetail.START_DATE),
        endDate: new FormControl(dataDetail.END_DATE),
        isActive: new FormControl(dataDetail.IS_ACTIVE)
      });
      this.showModalUpdate.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  // update tin mẫu
  async editScenarios() {
    let formData = this.formEditScenarios.controls;
    let ID = formData.id.value;
    let CODE = formData.code.value;
    if (CODE == "" || CODE == null) {
      this.notificationService.displayWarnMessage("Tên mẫu không được để trống!");
      return;
    }
    let NAME = formData.name.value;
    if (NAME == "" || NAME == null) {
      this.notificationService.displayWarnMessage("Tên mẫu không được để trống!");
      return;
    }
    let VALUE = formData.valueScenar.value;
    if (VALUE == "" || VALUE == null) {
      this.notificationService.displayWarnMessage("Tên mẫu không được để trống!");
      return;
    }
    let DATA = formData.dataScenar.value;
    if (DATA == "" || DATA == null) {
      this.notificationService.displayWarnMessage("Tên mẫu không được để trống!");
      return;
    }
    let START_DATE = formData.startDate.value;
    let END_DATE = formData.endDate.value;
    if (START_DATE != '' && START_DATE != null && END_DATE != '' && END_DATE != null) {
      let fromDate = this.utilityService.formatDateTempalte(START_DATE.toString());
      let toDate = this.utilityService.formatDateTempalte(END_DATE.toString());
      if (fromDate > toDate) {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-35"));
        return;
      }
    }
    let IS_ACTIVE = formData.isActive.value;

    let response: any = await this.dataService.putAsync('/api/Scenarios/' + ID, {
      CODE, NAME, VALUE, DATA, START_DATE, END_DATE, IS_ACTIVE
    })
    if (response.err_code == 0) {
      this.selectedStatus = [];
      this.showModalUpdate.hide();
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.getData();
    } else {
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
    let response: any = await this.dataService.deleteAsync('/api/Scenarios/' + id)
    if (response.err_code == 0) {
      this.loadData(response);
      this.confirmDeleteModal.hide();
      this.notificationService.displaySuccessMessage(response.err_message);
    }
    else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
}
