import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})

export class PopupComponent implements OnInit {

  public ipAddress = '';
  public city = '';
  public ngForm: FormGroup;
  public dataPerson = [];
  public scenarioCode: string = '';
  public account_Id = 0;
  public linkinput: string = '';
  public dataAccount = {};
  public contentsc: string = '';
  public avartaName: string = '';
  public posterImage: string = '';
  public ids: string = '';
  public isActive = true;
  public issuccess = false;
  public scenario_id: number;
  mobNumberPattern = "^((\\84-?)|0)?[0-9]{9}$";
  isValidFormSubmitted = false;

  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private http: HttpClient
  ) {
  }
  ngOnInit() {
     this.subaccountID();
     this.getIpLocation();
 
  }

// lay gia tri ip click vao link tang data
  async getIpLocation() {

    let response: any = await this.dataService.getAsync('/api/Popup/GetIPAddress');
    if (response) {
      this.ipAddress = response.query;
      this.city = response.city;
      if (this.ipAddress != null && this.ipAddress != "") {
        this.createChartPopupView();
      }
    }
  }

  async subaccountID() {

    this.linkinput = window.location.href;
    var rlink = this.linkinput.split(/[=\-&]/);
    for (var i = 0; i < rlink.length; i++) {
      this.scenarioCode = (rlink[1]);
      this.account_Id = parseInt(rlink[3]);
    }
    if (this.scenarioCode != null && this.scenarioCode != "") {
      this.loadAcount();
      this.loadscenario();
    }
  }

  async loadscenario() {
    var scenario_code = this.scenarioCode;
    var account_id = this.account_Id;
    if (scenario_code != null && account_id != null) {
      let response: any = await this.dataService.getAsync('/api/Popup/GetScenariosByCode?code=' + scenario_code +
        '&account_id=' + account_id);
      if (response) {
        if (response.data[0] == null || response.data[0] == "") {
          alert('Kịch bản không tồn tại!');
          this.posterImage = this.avartaName;
          this.contentsc = 'Chào mừng bạn đến với chương trình tặng Data';
          this.ngForm.disable();
          return;
        } else {
          this.posterImage = response.data[0].URL_POSTER;
          this.contentsc = response.data[0].DESC_CONTENT;
          this.scenario_id = response.data[0].ID;
          if (this.posterImage == null || this.posterImage == '') {
            this.posterImage = this.avartaName;
            this.contentsc = 'Chào mừng bạn đến với chương trình tặng Data';
          }
        
        }
      }
    }

  }
  //#region create new
  async loadAcount() {
    var accountid = this.account_Id;
    let response: any = await this.dataService.getAsync('/api/Popup/' + accountid);
    if (response) {
      if (response.data[0] == null) {
        alert('Tài khoàn chưa tạo kịch bản');
        this.avartaName = '../../assets/img/user-icon.jpg';
        this.ngForm.disable();
        return;
      } else {
        this.avartaName = response.data[0].AVATAR;
        if (this.avartaName == null || this.avartaName == '') {
          this.avartaName = '../../assets/img/logo-login.png';
        }
      }
    }

  }
  //#region create new
  async createMember(item) {
    let member = item.value;
    let ACCOUNT_ID = this.account_Id;
    let SCENARIO_CODE = this.scenarioCode;
    let PERSON_FULLNAME = member.fullName;
    if (PERSON_FULLNAME == "" || PERSON_FULLNAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-97"));
      return;
    }
    let PHONE_NUMBER = member.phoneNumber;
    if (PHONE_NUMBER == "" || PHONE_NUMBER == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-62"));
      return;
    }
    this.isValidFormSubmitted = false;
    if (item.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    let response: any = await this.dataService.postAsync('/api/Popup/PostPersonAccount?SCENARIO_CODE=' + SCENARIO_CODE + '&scenario_id=' + this.scenario_id, {
      ACCOUNT_ID, PERSON_FULLNAME, PHONE_NUMBER
    })
    if (response.err_code == 0 || response.err_code == -103) {
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("400"));
      this.issuccess = true;
    } else if (response.err_code == -116) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-116"));
      this.issuccess = false;
      return
    }
    else if (response.err_code == -119) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-119"));
      this.issuccess = false;
      return
    }
    else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      this.issuccess = false;
      return
    }
  }

  //#endregion

  //region create chart popup view

  async createChartPopupView() {
    let ACCOUNT_ID = this.account_Id;
    let SCENARIO_ID = this.scenario_id;
    let IP_VIEW = this.ipAddress;
    let LOCATION = this.city;
    let response: any = await this.dataService.postAsync('/api/ChartPopupView', { ACCOUNT_ID, SCENARIO_ID, IP_VIEW, LOCATION }
    )
    if (response) {
      if (response.err_code == 0) {
        let resSummaryDay: any = await this.dataService.postAsync('/api/ChartPopupViewSummaryDay', { ACCOUNT_ID, SCENARIO_ID })
        if (resSummaryDay.err_code != 0) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
          return;
        }
        let resSummaryHour: any = await this.dataService.postAsync('/api/ChartPopupViewSummaryHour', { ACCOUNT_ID, SCENARIO_ID })
        if (resSummaryHour.err_code != 0) {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
          return;
        }


      } else {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        return;
      }
    }

  }
  //#endregion

}