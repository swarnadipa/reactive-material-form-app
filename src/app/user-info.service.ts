import { Injectable } from '@angular/core';
import { UserInfo } from './user-info';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private uuid: any;
  public allUsers: UserInfo[];
  constructor() { }

  public storeUserInfo(userData: UserInfo, updateUser: boolean = false) {
    if (window.localStorage) {
      if (!updateUser && !window.localStorage.getItem('userInfo')) {
        window.localStorage.setItem('userInfo', JSON.stringify([userData]));
      } else if(!updateUser && window.localStorage.getItem('userInfo')) {
        window.localStorage.setItem('userInfo', JSON.stringify([...this.getAllUsers(), userData]));
      } else {
        const allUsers = this.getAllUsers();
        const userToUpdate = allUsers.find(user => {
          return user.uuid === userData.uuid;
        });
        Object.assign(userToUpdate, userData);
        window.localStorage.setItem('userInfo', JSON.stringify(allUsers));
      }
    }
  }

  public getAllUsers() {
    return window.localStorage && JSON.parse(window.localStorage.getItem('userInfo'));
  }

  public getUserInfo(uuid: string) {
    this.allUsers = this.getAllUsers();
    return this.allUsers.find(user => {
      return user.uuid === uuid;
    });
  }
}
