import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  @Input('users') userInfo;
  @Output() addUser = new EventEmitter<any>();
  @Output() editUser = new EventEmitter<any>();
  public displayedColumns: string[] = ['name', 'gender', 'married', 'fatherName', 'husbandName', 'dob',
    'phoneNo', 'aadharNo', 'panNo', 'state', 'action'];
  constructor() { }

  ngOnInit(): void {}
}
