import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { UtilityService } from 'src/app/core/services/utility.service';
import { DataService } from 'src/app/core/services/data.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-point-data',
  templateUrl: './point-data.component.html',
  styleUrls: ['./point-data.component.css']
})
export class PointDataComponent implements OnInit {
  @ViewChild('createDataCimastModalDetail2', { static: false }) public createDataCimastModalDetail2: ModalDirective;
  public dataBank = [];
  public settingsFilterItemBank = {};
  public selectedItemBank = [];
  public dataAccount = [];
  public settingsFilterAccount = {};
  public selectedItemAccount = [];
  public isAdmin = false;
  constructor(private utilityService: UtilityService, private dataService: DataService, private authService: AuthService) {

    this.settingsFilterItemBank = {
      text: this.utilityService.translate('point.select_bank'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
    this.settingsFilterAccount = {
      text: this.utilityService.translate('global.choose_account'),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate('global.search'),
      noDataLabel: this.utilityService.translate('global.no_data'),
      showCheckbox: false
    };
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
    this.GetAccountByBank();
    this.GetBankDataByAccount();
  }

  async getDataAccount() {
    if (this.isAdmin) {
      this.selectedItemAccount = [{ "id": "", "itemName": this.utilityService.translate('global.choose_account') }];
      let response: any = await this.dataService.getAsync('/api/account')
      if (response) {
        for (let index in response.data) {
          this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
        }
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetAccountByBank?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      if (response) {
        for (let index in response.data) {
          this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
        }
      }
      if (this.dataAccount.length == 1) {
        this.selectedItemAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
      }
      else
        this.selectedItemAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
    }
  }
  async GetBankDataByAccount() {
    debugger
    let account_id;
    if (this.authService.currentUserValue.USER_NAME == 'admin')
      account_id = "";
    else
      account_id = this.authService.currentUserValue.ACCOUNT_ID;
    let response = await this.dataService.getAsync('/api/BankData/GetBankDataByAccount?account_id=' + account_id);
    if (response) {
      if (response.err_code == 0) {
        for (let index in response.data) {
          this.dataBank.push({ "id": response.data[index].BANK_ID, "itemName": response.data[index].BANK_NAME });
        }
        if (this.dataBank.length == 1)
          this.selectedItemBank.push({ "id": this.dataBank[0].BANK_ID, "itemName": this.dataBank[0].itemName });
      }
    }
  }

  async GetAccountByBank() {
    debugger
    this.dataAccount=[];
    this.selectedItemAccount=[];
    let bank_id = this.selectedItemBank.length != 0 && this.selectedItemBank[0].id != "" ? this.selectedItemBank[0].id : "";
    let response = await this.dataService.getAsync('/api/account/GetAccountByBank?bank_id=' + bank_id);
    if (response) {
      for (let index in response.data) {
        this.dataAccount.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    if (this.dataAccount.length == 1) {
      this.selectedItemAccount.push({ "id": this.dataAccount[0].id, "itemName": this.dataAccount[0].itemName });
    }
    else
      this.selectedItemAccount.push({ "id": "", "itemName": this.utilityService.translate('global.choose_account') });
  }
}
