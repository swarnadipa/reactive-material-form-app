import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../user-info.service';
import { UserInfo } from '../user-info';

@Component({
  selector: 'app-update-user-info',
  templateUrl: './update-user-info.component.html',
  styleUrls: ['./update-user-info.component.scss']
})
export class UpdateUserInfoComponent implements OnInit {
  public contactForm: FormGroup;
  public userUuid: string;
  public contactName = "Father's Name";
  public genders = ['Male', 'Female', 'Other'];
  public statusValues = [true, false];
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userInfoService: UserInfoService) { }

  ngOnInit(): void {
    if (!this.contactForm) {
      this.createUserInfoForm();
    }
    this.route.params.subscribe(params => {
      this.userUuid = params && params.uuid;
      if (this.userUuid) {
        this.autoFillForm();
      }
    });

    this.contactForm.get('gender').valueChanges.subscribe(val => {
      const maritalStatus = this.contactForm.get('married').value;
      this.contactName = maritalStatus && val.toLowerCase() === 'female' ? "Husband's Name" : "Father's Name";
    });

    this.contactForm.get('married').valueChanges.subscribe(val => {
      const gender = this.contactForm.get('gender').value;
      this.contactName = gender.toLowerCase() === 'female' && val ? "Husband's Name" : "Father's Name";
    });
  }

  private autoFillForm() {
    const user = this.userInfoService.getUserInfo(this.userUuid);
    this.contactForm.setValue({
      name: user.name,
      gender: user.gender,
      married: user.married,
      contactName: user.contactName,
      dob: user.dob,
      phoneNo: user.phoneNo,
      aadharNo: user.aadharNo,
      panNo: user.panNo,
      uuid: user.uuid
    })
  }

  private createUserInfoForm() {
    const phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    const dobPattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    const alphaNumeric = /[^a-z\d]/i;
    this.contactForm = this.formBuilder.group({
      'name': [null, [Validators.required, Validators.maxLength(20)]],
      'gender': [null, [Validators.required]],
      'married': [null, [Validators.required]],
      'contactName': [null, [Validators.required, Validators.maxLength(20)]],
      'dob': [null, [Validators.required, Validators.pattern(dobPattern)]],
      'phoneNo': [null, [Validators.required, Validators.pattern(phoneNumberPattern)]],
      'aadharNo': [null, [Validators.required, this.checkAadharNo]],
      'panNo': [null, [Validators.required, this.checkPanNo]],
      'uuid': [null, []]
    });
  }

  private checkAadharNo(control) {
    const aadharValue = control.value;
    return aadharValue && aadharValue.length !== 10 ? { 'requirements': true } : null;
  }

  public getAadharNoError() {
    return this.contactForm.get('aadharNo').hasError('required') ? 'Required Field' :
      this.contactForm.get('aadharNo').hasError('pattern') ? 'Aadhar No. should contain only alphanumeric' :
        'Aadhar no. should be of 10 digits';
  }

  public getPanNoError() {
    return this.contactForm.get('aadharNo').hasError('required') ? 'Required Field' :
      this.contactForm.get('panNo').hasError('pattern') ? 'Pan no. should only contain alphanumeric value' :
        'PAN no. should be of 10 digits';
  }

  private checkPanNo(control) {
    const panValue = control.value;
    return panValue && panValue.length !== 10 ? { 'requirements': true } : null;
  }

  public saveUserInfo(value: any) {
    debugger;
    if (!value.uuid) {
      value.uuid = this.generateUUID();
      this.userInfoService.storeUserInfo(value);
    } else {
      this.userInfoService.storeUserInfo(value, true);
    }
    this.router.navigate(['/user-info']);
  }

  public resetForm() {
    this.contactForm.reset();
  }

  private generateUUID() {
    return Math.random().toString(36).slice(2);
  }
}
