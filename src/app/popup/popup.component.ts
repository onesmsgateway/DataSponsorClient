import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
//import { registerpersoncomponent }   from './register-person.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})

export class PopupComponent implements OnInit {

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
    private route: ActivatedRoute, private router: Router
  ) {
  }


  ngOnInit() {
    this.subaccountID();
    this.loadAcount();
    this.loadscenario();

  }
  async subaccountID() {
    this.linkinput = window.location.href;
    var rlink = this.linkinput.split(/[=\-&]/);
    for (var i = 0; i < rlink.length; i++) {
      this.scenarioCode = (rlink[1]);
      this.account_Id = parseInt(rlink[3]);
    }
  }

  async loadscenario() {
    debugger
    var scenario_code = this.scenarioCode;
    let response: any = await this.dataService.getAsync('/api/Popup/GetScenariosByCode?code=' + scenario_code);
    if (response != null) {
      if (response.data[0] == null) {
        alert('Kịch bản không tồn tại!');
        this.posterImage = this.avartaName;
        this.contentsc = 'Chào mừng bạn đến với chương trình tặng Data';
        this.ngForm.disable();
        return false;
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
  //#region create new
  async loadAcount() {
    var accountid = this.account_Id;
    let response: any = await this.dataService.getAsync('/api/Popup/' + accountid);
    if (response != null) {
      if (response.data[0] == null) {
        alert('Tài khoàn chưa tạo kịch bản');
        this.avartaName = '../../assets/img/user-icon.jpg';
        this.ngForm.disable();
        return false;
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
    debugger
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
    item.resetForm();
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

}