import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Contact } from 'src/app/contact';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent implements OnInit {
  isEditModeOn = false;
  contactDetailsForm: FormGroup;
  showSelectedContactDetails: any;
  innerWidth!: number;
  showBackButton: boolean = false;
  
  constructor(private sharedService: SharedService, private fb: FormBuilder) {
    this.contactDetailsForm = this.fb.group({
      name: [''],
      email: [''],
      gender: [''],
      profile_pic: [''],
      dob: [''],
      address: [''],
      phone_no: [''],
      occupation: [''],
      company_name: [''],
      department: [''],
    });
  }

  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1000) {
      this.showBackButton = true;
    } else {
      this.showBackButton = false;
    }
  }

  ngOnInit(): void {
    this.onResize();
    this.sharedService.selectedContact.subscribe((selectedContact: Contact) => {
      this.isEditModeOn = false;
      this.showSelectedContactDetails = JSON.parse(
        JSON.stringify(selectedContact)
      );
      this.contactDetailsForm.patchValue(selectedContact);
    });
  }

  get gf() {
    return this.contactDetailsForm.controls;
  }

  changeState() {
    this.isEditModeOn = !this.isEditModeOn;

    if (!this.isEditModeOn) {
      this.saveChanges();
    }
  }

  saveChanges() {
    this.showSelectedContactDetails = {
      ...this.showSelectedContactDetails,
      ...this.contactDetailsForm.value,
    };
    this.sharedService.modifiedSelectedContact.next(
      this.showSelectedContactDetails
    );
  }

  goBack() {
    this.sharedService.showActiveComponent.next(true)
  }
}
