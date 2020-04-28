import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../user-info.service';
import { UserInfo } from '../user-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public userInfo: UserInfo[];
  public displayedColumns: string[] = ['name', 'gender', 'married', 'contactName', 'dob',
    'phoneNo', 'aadharNo', 'panNo', 'action'];
  constructor(private userInfoService: UserInfoService,
    private router: Router) { }

  ngOnInit(): void {
    /* Fetch all user info from localstorage to display in table */
      this.userInfo = this.userInfoService.getAllUsers();
  }

  /* Navigate to add/edit user view */

  public addUser() {
    this.router.navigate(['/add-edit']);
  }
}
