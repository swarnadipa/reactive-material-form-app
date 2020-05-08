import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserInfoService } from '../user-info.service';
import { UserInfo } from '../user-info';

@Component({
  selector: 'app-update-user-info',
  templateUrl: './update-user-info.component.html',
  styleUrls: ['./update-user-info.component.scss']
})
export class UpdateUserInfoComponent implements OnInit {
  @Input() user: UserInfo;
  @Output() saveUser = new EventEmitter<any>();

  public contactForm: FormGroup;
  public userUuid: string;
  public genders = ['Male', 'Female', 'Other'];
  public statusValues = ['married', 'not married'];
  public showHusbandName = false;
  public statesList = [];
  public showPanel = false;
  constructor(private formBuilder: FormBuilder) { 
      this.createUserInfoForm();
    }

  ngOnInit(): void {
    this.statesList = ['Kerala', 'West Bengal', 'Tamil Nadu', 'Haryana', 'Andhra Pradesh', 'Uttar Pradesh'];
    this.autoFillForm();

    /* Listen to changes in gender field and check if it is F and married is true, then
    show contact name as husband's name else Father's name */
    this.contactForm.get('gender').valueChanges.subscribe(val => {
      if (val) {
        const maritalStatus = this.contactForm.get('married').value;
        if (maritalStatus.toLowerCase() === 'married' && val.toLowerCase() === 'female') {
          this.showHusbandName = true;
          this.contactForm.get('fatherName').setValue('NA');          
        } else {
          this.showHusbandName = false;
          this.contactForm.get('fatherName').setValue('');
        }
      }
    });

    /* Listen to changes in married field and check if it is true and gender is F, then
    show contact name as husband's name else Father's name */
    this.contactForm.get('married').valueChanges.subscribe(val => {
      if (val) {
        const gender = this.contactForm.get('gender').value;
        if (gender.toLowerCase() === 'female' && val.toLowerCase() === 'married') {
          this.showHusbandName = true;
          this.contactForm.get('fatherName').setValue('NA');
        } else {
          this.showHusbandName = false;
          this.contactForm.get('fatherName').setValue('');
        }
      }
    });
  }

  /* pre populate form fields while editing based on user info */
  private autoFillForm(): void {
    debugger;
    this.contactForm.setValue({
      name: this.user.name,
      gender: this.user.gender,
      married: this.user.married,
      dob: this.user.dob,
      phoneNo: this.user.phoneNo,
      aadharNo: this.user.aadharNo,
      panNo: this.user.panNo,
      uuid: this.user.uuid,
      husbandName: this.user.husbandName,
      fatherName: this.user.fatherName,
      state: this.user.state
    })
  }

  /* Create user info form and initialse with default values and validators */

  private createUserInfoForm(): void {
    const phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    const dobPattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    this.contactForm = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.maxLength(20)]],
      'gender': ['', [Validators.required]],
      'married': ['', [Validators.required]],
      'dob': ['', [Validators.required, Validators.pattern(dobPattern)]],
      'phoneNo': ['', [Validators.required, Validators.pattern(phoneNumberPattern)]],
      'aadharNo': ['', [Validators.required, this.checkAadharNo]],
      'panNo': ['', [Validators.required, this.checkPanNo]],
      'uuid': ['', []],
      'fatherName': ['', [Validators.maxLength(20)]],
      'husbandName': ['', [Validators.maxLength(20)]],
      'state': ['', [Validators.required]]
    });
  }

  /* Custom validation for Aadhar No. checks if field contains only alphanumeric values and is of length 12 */

  private checkAadharNo(control) {
    const alphaNumeric = /[^a-z\d]/i;
    const aadharValue = control.value;
    return aadharValue && aadharValue.length !== 10 ? { 'requirements': true } :
      aadharValue && aadharValue.match(alphaNumeric) ? { 'alphanumeric': true } : null;
  }

  /* Custom validation for PAN No. checks if field contains only alphanumeric values and is of length 10 */

  private checkPanNo(control) {
    const alphaNumeric = /[^a-z\d]/i;
    const panValue = control.value;
    return panValue && panValue.length !== 10 ? { 'requirements': true } :
      panValue && panValue.match(alphaNumeric) ? { 'alphanumeric': true } : null;
  }

  /* Sets specific error attributes based on the type of validation error */

  public getAadharNoError() {
    return this.contactForm.get('aadharNo').hasError('required') ? 'Required Field' :
      this.contactForm.get('aadharNo').hasError('alphanumeric') ? 'Aadhar no. should only contain alphanumeric value' :
        'Aadhar no. should be of 12 characters';
  }

  /* Sets specific error attributes based on the type of validation error */

  public getPanNoError() {
    return this.contactForm.get('panNo').hasError('required') ? 'Required Field' :
      this.contactForm.get('panNo').hasError('alphanumeric') ? 'Pan no. should only contain alphanumeric value' :
        'PAN no. should be of 10 characters';
  }

  public togglePanel(): void {   
      this.showPanel = !this.showPanel;
  }
}
