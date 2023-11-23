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
  isContactListEnded:boolean = false

  constructor(private sharedService: SharedService) { }
  pageSize!:number
  selectedID!: number;
  innerWidth!: number;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.pageSize = Math.floor((window.innerHeight - 200) / 68);
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= 1000) {
      let temp = this.contactsListData.filter(
        (item) => item.isSelected == true
      );
      if (temp.length == 0 && !this.selectedID) {
        this.contactsListData[0].isSelected = true;
        this.contactsList[0].isSelected = true;
      } else if (this.selectedID) {
        for (let item of this.contactsListData) {
          if (item.id == this.selectedID) {
            item.isSelected = true;
          }
        }
      }
    } else {
      this.contactsListData.forEach((item) => {
        item.isSelected = false;
      });

      this.onPageChange({
        previousPageIndex: 0,
        pageIndex: 0,
        pageSize: this.pageSize,
        length: this.contactsListData.length,
      });
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll($event: Event): void {
  let scrollTop = ($event.target as Element).scrollTop;
  let scrollHeight = ($event.target as Element).scrollHeight;
  let offsetHeight = ($event.target as HTMLElement).offsetHeight;
  let scrollPosition = scrollTop + offsetHeight;
  let scrollTreshold = scrollHeight - 1;
  
  if(scrollPosition >= scrollTreshold) {
    // User has scrolled to the bottom of the page, load more contacts
    this.loadMoreContacts();
  }
  }
  
  loadMoreContacts() {
    const startIndex = this.contactsList.length;
    const endIndex = startIndex + 10; // Load 10 contacts at a time
    const moreContacts = this.contactsListData.slice(startIndex, endIndex);
  
    if(moreContacts.length > 0) {
      // There are more contacts to load
      this.contactsList = [...this.contactsList, ...moreContacts];
      this.pageSize = this.contactsList.length
    } else {
      this.isContactListEnded = true
    }
  }

  ngOnInit(): void {
    this.onResize()
    this.onPageChange({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.contactsListData.length,
    });

    this.sharedService.modifiedSelectedContact.subscribe(
      (modifiedContact: Contact) => {
        if (modifiedContact) {
          for (let item of this.contactsListData) {
            if (item.id == modifiedContact.id) {
              this.selectedID = item.id;
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
            } else {
              item.isSelected = false;
            }
          }

          this.contactsList = JSON.parse(JSON.stringify(this.contactsListData));
          this.onPageChange({
            previousPageIndex: 0,
            pageIndex: 0,
            pageSize: this.pageSize,
            length: this.contactsListData.length,
          });
        }
      }
    );
  }

  onClickContact(item: Contact) {
    this.selectedID = item.id;
    for (let list of this.contactsList) {
      if (list.id == item.id) {
        list.isSelected = true;
      } else {
        list.isSelected = false;
      }
    }
    this.sharedService.selectedContact.next(item);
    if (window.innerWidth < 1000) {
      this.sharedService.showActiveComponent.next(false);
    }
  }

  onSearch(e: any) {
    let searchValue = e.target.value.toLowerCase()
    let temp = [];
    
    if (searchValue == '') {
      this.onPageChange({
        previousPageIndex: 0,
        pageIndex: 0,
        pageSize: this.pageSize,
        length: this.contactsListData.length,
       
      });
      return
    }
    for (let item of this.contactsListData) {
      if (
        item.name.toLowerCase().includes(searchValue) ||
        item.email.toLowerCase().includes(searchValue) ||
        item.gender.toLowerCase().includes(searchValue) ||
        item.dob.toLowerCase().includes(searchValue) ||
        item.address.toLowerCase().includes(searchValue) ||
        item.phone_no.toLowerCase().includes(searchValue) ||
        item.occupation.toLowerCase().includes(searchValue) ||
        item.company_name
          .toLowerCase()
          .includes(searchValue) ||
        item.department.toLowerCase().includes(searchValue)
      ) {
        temp.push(item);
      }
    }
    this.contactsList = temp;
  }

  onPageChange(e: any) {
    const pageIndex = e.pageIndex;
    const pageSize = e.pageSize;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.contactsList = this.contactsListData.slice(startIndex, endIndex);
  }
}
