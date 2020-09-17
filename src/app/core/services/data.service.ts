import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AppConst } from '../common/app.constants';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { UtilityService } from './utility.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DataService {
  public token: string;
  constructor(private http: HttpClient,
    private utilityService: UtilityService) { }
  public get(uri: string): any {
    return this.http.get(AppConst.DATA_SPONSOR_API + uri)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public post(uri: string, data?: any): any {
    return this.http.post(AppConst.DATA_SPONSOR_API + uri, data)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public getData(url: string): Observable<any> {
    try {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
      return this.http.get(AppConst.DATA_SPONSOR_API + url, { headers: headers })
    }
    catch (error) {
      return null;
    }
  }

  public put(uri: string, data?: any): any {
    return this.http.put(AppConst.DATA_SPONSOR_API + uri, data)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public delete(uri: string): any {
    return this.http.delete(AppConst.DATA_SPONSOR_API + uri)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public async getAsync(uri: string): Promise<any> {
    try {
      const response = await this.http.get(AppConst.DATA_SPONSOR_API + uri).toPromise();
      return response;
    }
    catch (error) {
      return null;
    }
  }

  public async postAsync(uri: string, data?: any): Promise<any> {
    try {
      const response = await this.http.post(AppConst.DATA_SPONSOR_API + uri, data).toPromise();
      return response;
    }
    catch (error) {
      return null;
    }
  }

  public async putAsync(uri: string, data?: any): Promise<any> {
    try {
      const response = await this.http.put(AppConst.DATA_SPONSOR_API + uri, data).toPromise();
      return response;
    }
    catch (error) {
      return null;
    }
  }

  public async deleteAsync(uri: string): Promise<any> {
    try {
      const response = await this.http.delete(AppConst.DATA_SPONSOR_API + uri).toPromise();
      return response;
    }
    catch (error) {
      return null;
    }
  }

  public async postFileAsync(postData: any, files: File[]) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/UploadImage", formData);
      return response;
    }
    catch (error) {
      return null;
    }
  }

  public async importExcelAsync(postData: any, files: File[]) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcel", formData);
      return response;
    }
    catch (error) {
      return null;
    }
  }

  public async importExcelBirthdaySmsAsync(postData: any, files: File[], accountId: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelBirthdaySms?accountID=" + accountId, formData);
      return response;
    }
    catch (error) {

      return null;
    }
  }

  public async importExcelAndSavePhoneListAsync(postData: any, files: File[], listType: any, lstName: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelAndSavePhoneList?listType=" + listType + "&lstName=" + lstName, formData);
      return response;
    }
    catch (error) {

      return null;
    }
  }

  public async importExcelAndSavePhoneListDataAsync(postData: any, files: File[], groupId: any, groupCode: any, groupName: any, accountID: any) {
    try {
      debugger
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelAndSavePhoneList?groupId=" + groupId + "&groupCode=" + groupCode + "&groupName=" + groupName + "&accountID=" + accountID, formData);
      debugger
      return response;
    }
    catch (error) {
      return null;
    }
  }
  public async importExcelAndSaveMemberListDataAsync(postData: any, files: File[], accountId: any, groupId: any, groupCode: any, groupName: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelAndSaveMemberList?accountId=" + accountId + "&groupId=" + groupId + "&groupCode=" + groupCode + "&groupName=" + groupName, formData);
      return response;
    }
    catch (error) {

      return null;
    }
  }

  //upload data code
  public async importExcelDataCodeVMSAsync(postData: any, files: File[], accountId: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelDataCodeVMS?accountId=" + accountId, formData);
      return response;
    }
    catch (error) {

      return null;
    }
  }

  public async importExcelAndSaveAsync(postData: any, files: File[], listType: any, lstName: any, accountID: any, accountName: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelAndSave?listType=" + listType + "&lstName=" +
        lstName + "&accountID=" + accountID + "&accountName=" + accountName, formData);
      return response;
    }
    catch (error) {

      return null;
    }
  }

  public async getDataFromExcelAsync(postData: any, files: File[]) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/GetDataFromExcel", formData);
      return response;
    }
    catch (error) {

      return null;
    }
  }

  public async getFileExtentionAsync(uri: string, objectName: string, fileName?: string): Promise<boolean> {
    let result: boolean = false;
    if (!fileName) {
      fileName = objectName + '_' + this.utilityService.formatDateToString(new Date(), 'yyyyMMddhhmmsss');
    }
    let url = AppConst.DATA_SPONSOR_API + uri + '?objectName=' + objectName + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionSmsCustomizeAsync(uri: string, listID: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?listID=' + listID + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionCampaignApproveAsync(uri: string, campaignID: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?campaignID=' + campaignID + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionCustomerAsync(uri: string, accountId: any, fullName: string, ngaySinh: any,
    phone: any, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?accountId=' + accountId + '&fullName=' + fullName +
      '&ngaySinh=' + ngaySinh + '&phone=' + phone + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionDataCampaignDetailAsync(uri: string, data_campaign_id: any
    , fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?&data_campaign_id=' + data_campaign_id;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionSmsErrorAsync(uri: string, accountId: any, sender_name: string, sms_content: string, phone: string,
    sms_type: any, viettel: string, vina: string, mobi: string, vnMobile: string, gtel: string, sfone: string, tu_ngay: string,
    den_ngay: string, partner_code: string, receive_result: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?accountId=' + accountId + '&sender_name=' + sender_name + '&sms_content=' + sms_content
      + '&phone=' + phone + '&sms_type=' + sms_type + '&viettel=' + viettel + '&vina=' + vina + '&mobi=' + mobi + '&vnMobile=' + vnMobile
      + '&gtel=' + gtel + '&sfone=' + sfone + '&tu_ngay=' + tu_ngay + '&den_ngay=' + den_ngay + '&partner_code=' + partner_code
      + '&receive_result=' + receive_result;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async ExportStatisticGeneral(uri: string, accountId: any, senserName: string, partnerName: string, fromDate: string, toDate: string, type: string,
    telco: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?accountId=' + accountId + '&senserName=' + senserName + '&partnerName=' + partnerName + '&fromDate=' + fromDate
      + '&toDate=' + toDate + '&type=' + type + '&telco=' + telco;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionPhoneListAsync(uri: string, phoneList: any, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?phoneList=' + phoneList + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionSmsByBrandnameAsync(uri: string, listSms: any, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?listSms=' + listSms + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getAllFileExtentionAsync(uri: string, objectName: string): Promise<boolean> {
    let result: boolean = false;
    let user = JSON.parse(localStorage.getItem(AppConst.CURRENT_USER));
    let fileName = objectName + '_' + this.utilityService.formatDateToString(new Date(), 'yyyyMMddhhmmsss');
    let url = AppConst.DATA_SPONSOR_API + uri + '?objectName=' + objectName + '&fileName=' + fileName;
    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.TOKEN}`
      }
    }).then(response => response.blob())
      .then(blob => {
        if (blob) {
          saveAs(blob, fileName);
          result = true;
        }
        else {

          result = false;
        }
      })
      .catch((err) => {

        result = false;
      });
    return result;
  }

  public async getFileExtentionDataSmsStatisticAsync(uri: string, accountId: any, pack: string, status: string, fromDate: string, toDate: string, content: string
    , phone: string, viettel: string, vina: string, mobi: string, ismoney_datacode: number, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?account_id=' + accountId + '&package=' + pack + '&status=' + status +
      '&from_date=' + fromDate + '&to_date=' + toDate + '&content=' + content + '&phone=' + phone +
      "&viettel=" + viettel + '&vina=' + vina + '&mobi=' + mobi + '&ismoney_datacode=' + ismoney_datacode + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionAccountAsync(uri: string, accountId: any, user_name: string, email: string, phone: string,company_name: string, payment_type: any, fromDate: string, toDate: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?account_id=' + accountId + '&user_name=' + user_name + '&email=' + email + '&phone=' + phone +  '&company_name=' + company_name + '&payment_type=' + payment_type +
      '&from_date=' + fromDate + '&to_date=' + toDate + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }
  public async getFileExtentionAccountHistoryAsync(uri: string, accountId: any, campaignId: string, content: string
    , ip: string, fromDate: string, toDate: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?account_id=' + accountId + '&campaign_id=' + campaignId + '&content=' + content + '&ip=' + ip +
      '&from_date=' + fromDate + + '&to_date=' + toDate + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionParameterAsync(uri: string, objectName: string, listParameter: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?objectName=' + objectName + '&listParameter=' + listParameter + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionSenderNameAsync(uri: string, name: string, sender_group: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.DATA_SPONSOR_API + uri + '?name=' + name + '&sender_group=' + sender_group + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }
  
  public async getAccountDetail(): Promise<any> {
    try {
      const response = await this.http.get(AppConst.DATA_SPONSOR_API + '/api/account/GetInfoAccountLogin').toPromise();
      return response;
    }
    catch (error) {

      return null;
    }
  }

  public async importExcelCustomer(postData: any, files: File[], accountID: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelCustomer?accountID=" + accountID, formData);
      return response;
    }
    catch (error) {

      return null;
    }
  }

  public async importExcelCustomerInGroup(postData: any, files: File[], accountID: any, groupID: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelCustomerInGroup?accountID=" + accountID + '&groupID=' + groupID, formData);
      return response;
    }
    catch (error) {

      return null;
    }
  }
}
