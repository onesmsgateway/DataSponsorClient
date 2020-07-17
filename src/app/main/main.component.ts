import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { UtilityService } from '../core/services/utility.service';
import { User } from '../core/models/user';
import { AccountInfoComponent } from './home/account-info/account-info.component';
import { ChangePassComponent } from './home/change-pass/change-pass.component';
import { DataService } from '../core/services/data.service';
import { AppConst } from '../core/common/app.constants';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent {
  @ViewChild("componentAccountInfo", { static: false }) public componentAccountInfo: AccountInfoComponent;
  @ViewChild("componentChangePass", { static: false }) public componentChangePass: ChangePassComponent;

  public user: User = this.authService.currentUserValue;
  public dataMenu: any = [];
  public viewQuyTinCSKH = 0;
  public viewQuyTien = 0;
  public viewQuyViettel = 0;
  public viewQuyVina = 0;
  public viewQuyMobi = 0;
  public isAdmin: boolean = false;

  constructor(private authService: AuthService, private utilityService: UtilityService, private dataService: DataService) {
    this.loadMenuIndex();
    this.getAccountLogin();
  }

  logout(): void {
    this.authService.logout();
  }

  changeLanguage(lang) {
    this.utilityService.changeLanguageCurrent(lang);
    this.loadMenuIndex();
  }

  showModalAccountInfo() {
    this.componentAccountInfo.loadDataLog();
    this.componentAccountInfo.modalAccountInfo.show();
  }

  showModalChangePass() {
    this.componentChangePass.modalChangePass.show();
  }

  async loadMenuIndex(isChanged?: boolean) {
    let response: any = await this.dataService.getAsync("/api/menu/LoadMenuByUserAsync?language=" + localStorage.getItem(AppConst.CURRENT_LANG) || AppConst.LANGUAGE_VI);
    if (response && response.err_code == 0) {
      let menuParent: any = [];
      let menuChild: any = [];
      for (let index in response.data) {
        if (response.data[index].PARENT_ID == null) {
          menuParent.push(response.data[index]);
        }
      }
      this.dataMenu = menuParent;
      for (let index in menuParent) {
        menuChild = [];
        for (let i in response.data) {
          if (response.data[i].PARENT_ID == menuParent[index].ID)
            menuChild.push(response.data[i]);
        }
        this.dataMenu[index].menuChild = menuChild;
      }
    }
  }

  async getAccountLogin() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let roleAccess = result.data[0].ROLE_ACCESS;
    if (roleAccess != null && roleAccess == 50) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.viewQuyTin(false);
    setTimeout(() => {
      this.getBalance();
    }, 1000);
    
  }

  //#region view quy tin
  public async viewQuyTin(isSend: boolean) {
    if (!isSend) {
      let accountID = this.authService.currentUserValue.ACCOUNT_ID;
      if (accountID != undefined && accountID != "") {

        let getDataAccount: any = await this.dataService.getAsync('/api/DataCimast/GetDataAccount?isAdmin=false&account_id=' +
          accountID);
        if (getDataAccount != null && getDataAccount.data.length > 0) {
          this.viewQuyTien = getDataAccount.data[0].TOTAL_REMAIN;
        }
        else {
          this.viewQuyTien = 0;
        }
      }
      else {
        this.viewQuyTinCSKH = this.authService.viewQuyTinCSKH = 0;
        this.viewQuyTien = this.authService.viewQuyTinQC = 0;
      }
    }
    else {
      this.viewQuyTinCSKH = this.authService.viewQuyTinCSKH;
      this.viewQuyTien = this.authService.viewQuyTinQC
    }
  }
  //#endregion
  
  // get total data
  async getBalance() {
    // viettel
    let resultVTL: any = await this.dataService.getAsync('/api/DataSponsor/GetDataSponsorBalanceViettel');
    if (resultVTL != null && resultVTL.data.length > 0) {
      this.viewQuyViettel = Math.round(resultVTL.data[0].TOTAL_REMAIN);
    }

    // vina
    let resultVina: any = await this.dataService.getAsync('/api/DataSponsor/GetDataSponsorBalanceVina');
    if (resultVina != null && resultVina.data.length > 0) {
      this.viewQuyVina = Math.round(resultVina.data[0].TOTAL_REMAIN);
    }

    // mobi
    let resultMobi: any = await this.dataService.getAsync('/api/DataSponsor/GetDataSponsorBalanceMobi');
    if (resultMobi != null && resultMobi.data.length > 0) {
      this.viewQuyMobi = Math.round(resultMobi.data[0].TOTAL_REMAIN);
    }
  }
}
