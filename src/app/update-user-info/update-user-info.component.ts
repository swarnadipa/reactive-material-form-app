import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-update-user-info',
  templateUrl: './update-user-info.component.html',
  styleUrls: ['./update-user-info.component.scss']
})
export class UpdateUserInfoComponent implements OnInit {
  public contactForm: FormGroup;
  public userUuid: string;
  public genders = ['Male', 'Female', 'Other'];
  public statusValues = ['married', 'not married'];
  public showHusbandName = false;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userInfoService: UserInfoService) { }

  ngOnInit(): void {
    /* Create and initialise form for the first time */
    if (!this.contactForm) {
      this.createUserInfoForm();
    }

    /* Retreive user unique identification uuid from route param for updating info */
    this.route.params.subscribe(params => {
      this.userUuid = params && params.uuid;
      if (this.userUuid) {
        this.autoFillForm(); // pre populate form fields for user
      }
    });

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
        if (gender && val.toLowerCase() === 'married') {
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
    const user = this.userInfoService.getUserInfo(this.userUuid);
    this.contactForm.setValue({
      name: user.name,
      gender: user.gender,
      married: user.married,
      dob: user.dob,
      phoneNo: user.phoneNo,
      aadharNo: user.aadharNo,
      panNo: user.panNo,
      uuid: user.uuid,
      husbandName: user.husbandName,
      fatherName: user.fatherName
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
      'husbandName': ['', [Validators.maxLength(20)]]
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


  /* Saves user info in localstorage */

  public saveUserInfo(value: any): void {
    if (!value.uuid) {
      value.uuid = this.generateUUID();
      this.userInfoService.storeUserInfo(value);
    } else {
      this.userInfoService.storeUserInfo(value, true);
    }
    this.router.navigate(['/user-info']);
  }

  /* reset form to empty */

  public resetForm(): void {
    this.contactForm.reset();
  }

  /* Generate random alphanumeric string to create unique UUID */

  private generateUUID(): string {
    return Math.random().toString(36).slice(2);
  }
}
