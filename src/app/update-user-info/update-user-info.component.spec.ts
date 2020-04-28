import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UpdateUserInfoComponent } from './update-user-info.component';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { of, Subject } from 'rxjs';
import { UserInfoService } from '../user-info.service';

describe('UpdateUserInfoComponent', () => {
  let component: UpdateUserInfoComponent;
  let fixture: ComponentFixture<UpdateUserInfoComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  let params = of({});
  let mockUserInfoService = {
    storeUserInfo: jasmine.createSpy('storeUserInfo'),
    getUserInfo: jasmine.createSpy('getUserInfo')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateUserInfoComponent],
      providers: [FormBuilder,
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: ActivatedRoute,
          useValue: { params: params }
        },
        {
          provide: UserInfoService,
          useValue: mockUserInfoService
        }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserInfoComponent);
    component = fixture.componentInstance;
    spyOn<any>(component, 'autoFillForm');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form and inititalise with default values', () => {
    expect(component.contactForm.get('name').value).toEqual(null);
  });

  it('should reset all form fields to empty values', () => {
    spyOn(component.contactForm, 'reset');
    component.ngOnInit();
    component.resetForm();
    expect(component.contactForm.reset).toHaveBeenCalled();
  });

  it('should validate aadhar no. field and throw error', () => {
    component.contactForm.get('aadharNo').setValue('');
    expect(component.getAadharNoError()).toEqual('Required Field');
    component.contactForm.get('aadharNo').setValue('@#67189971');
    expect(component.getAadharNoError()).toEqual('Aadhar no. should only contain alphanumeric value');
    component.contactForm.get('aadharNo').setValue('67189971');
    expect(component.getAadharNoError()).toEqual('Aadhar no. should be of 12 characters');
  });

  it('should validate PAN no. field and throw error', () => {
    component.contactForm.get('panNo').setValue('');
    expect(component.getPanNoError()).toEqual('Required Field');
    component.contactForm.get('panNo').setValue('@#67189971');
    expect(component.getPanNoError()).toEqual('Pan no. should only contain alphanumeric value');
    component.contactForm.get('panNo').setValue('67189971');
    expect(component.getPanNoError()).toEqual('PAN no. should be of 10 characters');
  });

  it('should detect change in gender field and display contact name as husband name if gender = "f" and married = true and father name otherwise', () => {
    component.contactForm.get('gender').setValue('female');
    component.contactForm.get('married').setValue(true);
    fixture.detectChanges();
    expect(component.contactName).toEqual("Husband's Name");
    component.contactForm.get('gender').setValue('male');
    fixture.detectChanges();
    expect(component.contactName).toEqual("Father's Name");
  });

});
