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
  public contactName = "Father's Name";
  public genders = ['Male', 'Female', 'Other'];
  public statusValues = [true, false];
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
        this.contactName = maritalStatus && val.toLowerCase() === 'female' ? "Husband's Name" : "Father's Name";
      }
    });

    /* Listen to changes in married field and check if it is true and gender is F, then
    show contact name as husband's name else Father's name */
    this.contactForm.get('married').valueChanges.subscribe(val => {
      if (val) {
        const gender = this.contactForm.get('gender').value;
        this.contactName = gender.toLowerCase() === 'female' && val ? "Husband's Name" : "Father's Name";
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
      contactName: user.contactName,
      dob: user.dob,
      phoneNo: user.phoneNo,
      aadharNo: user.aadharNo,
      panNo: user.panNo,
      uuid: user.uuid
    })
  }

  /* Create user info form and initialse with default values and validators */

  private createUserInfoForm(): void {
    const phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    const dobPattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
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

  /* Custom validation for Aadhar No. 
  checks if field contains only alphanumeric values and is of length 12 */

  private checkAadharNo(control) {
    const alphaNumeric = /[^a-z\d]/i;
    const aadharValue = control.value;
    return aadharValue && aadharValue.length !== 10 ? { 'requirements': true } :
      aadharValue && aadharValue.match(alphaNumeric) ? { 'alphanumeric': true } : null;
  }

  /* Custom validation for PAN No. 
  checks if field contains only alphanumeric values and is of length 10 */

  private checkPanNo(control) {
    const alphaNumeric = /[^a-z\d]/i;
    const panValue = control.value;
    return panValue && panValue.length !== 10 ? { 'requirements': true } :
      panValue && panValue.match(alphaNumeric) ? { 'alphanumeric': true } : null;
  }

  /* Sets specific error attributes based on the type of validation error */

  public getAadharNoError() {
    return this.contactForm.get('aadharNo').hasError('required') ? 'Required Field' :
      this.contactForm.get('aadharNo').hasError('alphanumeric') ? 'Aadhar No. should contain only alphanumeric' :
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
