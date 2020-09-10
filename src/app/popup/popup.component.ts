import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { HttpClient } from '@angular/common/http';

import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlConst } from '../core/common/url.constants';
import { AuthService } from '../core/services/auth.service';
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})

export class PopupComponent implements OnInit {
  public user: SocialUser;

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
  public isImg = true;
  public scenario_id: number;

  mobNumberPattern = "^((\\84-?)|0)?[0-9]{9}$";
  isValidFormSubmitted = false;

  constructor(private dataService: DataService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private utilityService: UtilityService
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
        setTimeout(() => {
          this.createChartPopupView();
        }, 2000);
      }
    }
  }

  async subaccountID() {
    if (this.linkinput == null || this.linkinput == "") {
      this.linkinput = window.location.href;
      var rlink = this.linkinput.split(/[=\-&]/);
        this.scenarioCode = (rlink[1]);
        this.account_Id = parseInt(rlink[3]);
        console.log( this.scenarioCode);
        console.log( this.account_Id);
    } else {
      return;
    }
    if (this.scenarioCode != null && this.scenarioCode != "") {
      this.loadAcount();
      setTimeout(() => {
        this.loadscenario();
      }, 1000);
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
          alert('Kịch bản không tồn tại hoặc đã hết hạn!');
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
    setTimeout(() => {
      this.getAccountLink();
    }, 3000);

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
          this.isImg = false;
        }
      }
    }

  }
  //#region create new
  async createMember(item) {
    let member = item.value;
    let ACCOUNT_ID = this.account_Id;
    let SCENARIO_ID = this.scenario_id;
    let SCENARIO_CODE = this.scenarioCode;
    let PERSON_FULLNAME = member.fullName;
    let REGISTER_FULL_NAME = member.fullName;
    if (PERSON_FULLNAME == "" || PERSON_FULLNAME == null) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-97"));
      return;
    }
    let PHONE_NUMBER = member.phoneNumber;
    let REGISTER_PHONE= member.phoneNumber;
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
    }
    else if (response.err_code == -119) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-119"));
      this.issuccess = false;
    } else if (response.err_code == -500) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-205"));
      this.issuccess = false;
    } else if (response.err_code == -207) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-207"));
      this.issuccess = false;
    } else if (response.err_code == -208) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-208"));
      this.issuccess = false;
    }else {
      this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      this.issuccess = false;
      return;
    }
    let res: any = await await this.dataService.postAsync('/api/Popup/AddChartPopupRegister', { REGISTER_PHONE, REGISTER_FULL_NAME, ACCOUNT_ID, SCENARIO_ID })
    if(res){
      if (res.err_code != 0) {
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
        this.issuccess = false;
        return;
      }
      else{
        
      }
    }
  }
  //#endregion
  //region create chart popup view
  async createChartPopupView() {
    let ACCOUNT_ID = this.account_Id;
    let SCENARIO_ID = this.scenario_id;
    let IP_VIEW = this.ipAddress;
    let LOCATION = this.city;
    let response: any = await this.dataService.postAsync('/api/ChartPopupView/AddChartPopupView', { ACCOUNT_ID, SCENARIO_ID, IP_VIEW, LOCATION }
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
  async getAccountLink() {
    let ACCOUNT_ID = this.account_Id;
    let response: any = await this.authService.getAccountLink(ACCOUNT_ID);
  }

}