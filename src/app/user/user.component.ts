import { UserInfoService } from './../user-info.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { UserInfo } from '../user-info';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('userEdit') editUserTemplate;
  @ViewChild(TabsComponent) tabsComponent;

  public users: UserInfo[];
  constructor(private userInfoService: UserInfoService) { }

  ngOnInit(): void {
    this.users = this.userInfoService.getAllUsers();
  }

  public onEditUser(user): void {
    this.tabsComponent.openTab(
      `Editing ${user.name}`,
      this.editUserTemplate,
      user,
      true
    );
  }

  public onAddUser(): void {
    this.tabsComponent.openTab('New User', this.editUserTemplate, {}, true);
  }

  public onUserFormSubmit(dataModel): void {
    if (!dataModel.uuid) {
      dataModel.uuid = this.generateUUID();
      this.userInfoService.storeUserInfo(dataModel);
      this.users = this.userInfoService.getAllUsers();
    } else {
      this.users = this.users.map(user => {
        if (user.uuid === dataModel.uuid) {
          return dataModel;
        } else {
          return user;
        }
      });
      this.userInfoService.storeUserInfo(dataModel, true);
    }
    this.tabsComponent.closeActiveTab();
  }

  /* Generate random alphanumeric string to create unique UUID */

  private generateUUID(): string {
    return Math.random().toString(36).slice(2);
  }

}
