import { Component, HostListener, OnInit } from '@angular/core';
import contacts from '../../contacts.json';
import { SharedService } from '../shared.service';
import { Contact } from 'src/app/contact';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contactsListData: Contact[] = JSON.parse(JSON.stringify(contacts));
  contactsList: Contact[] = JSON.parse(JSON.stringify(contacts));

  constructor(private sharedService: SharedService) {}
  innerWidth!: number;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 1000) {
      this.contactsListData[0].isSelected = true;
      this.contactsList[0].isSelected = true;
    } else {
      this.contactsListData[0].isSelected = false;
      this.contactsList[0].isSelected = false;
    }
  }

  ngOnInit(): void {
    this.onResize()
    this.sharedService.modifiedSelectedContact.subscribe(
      (modifiedContact: Contact) => {
        if (modifiedContact) {
          for (let item of this.contactsListData) {
            if (item.id == modifiedContact.id) {
              item.name = modifiedContact.name;
              item.email = modifiedContact.email;
              item.gender = modifiedContact.gender;
              item.profile_pic = modifiedContact.profile_pic;
              item.dob = modifiedContact.dob;
              item.address = modifiedContact.address;
              item.phone_no = modifiedContact.phone_no;
              item.occupation = modifiedContact.occupation;
              item.company_name = modifiedContact.company_name;
              item.department = modifiedContact.department;
              item.isSelected = modifiedContact.isSelected;
            }
          }
          this.contactsList = JSON.parse(JSON.stringify(this.contactsListData));
        }
      }
    );
  }

  onClickContact(item: Contact) {
    for (let list of this.contactsList) {
      if (list.id == item.id) {
        list.isSelected = true;
      } else {
        list.isSelected = false;
      }
    }
    this.sharedService.selectedContact.next(item);
    if (this.innerWidth < 1000) {
      this.sharedService.showActiveComponent.next(false)
    }
  }

  onSearch(e: any) {
    let temp = [];
    for (let item of this.contactsListData) {
      if (
        item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.gender.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.dob.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.address.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.phone_no.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.occupation.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.company_name
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item.department.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        temp.push(item);
      }
    }
    this.contactsList = temp;
  }
}
