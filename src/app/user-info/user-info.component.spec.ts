import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoComponent } from './user-info.component';
import { Router } from '@angular/router';
import { UserInfoService } from '../user-info.service';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  let user = {
    name: 'Chandler Bing',
    gender: 'f',
    dob: '09-05-1989',
    aadharNo: '99282736362',
    panNo: '27777200',
    contactName: 'Monica Geller',
    married: true,
    phoneNo: '801-715-8273'
  };
  let mockUserInfoService = {
    getAllUsers : jasmine.createSpy('getAllUsers').and.returnValue([user])
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoComponent],
      providers: [
        { 
          provide: Router, 
          useValue: mockRouter 
        },
        {
          provide: UserInfoService,
          useValue: mockUserInfoService
        }

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all users to display in table', () => {
    expect(mockUserInfoService.getAllUsers).toHaveBeenCalled();
    expect(component.userInfo).toEqual([user]);
  });

  it('should navigate to add/edit view', () => {
    component.addUser();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-edit']);
  })
});
