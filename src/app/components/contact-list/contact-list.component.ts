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
  preSearchContactsList: Contact[] = [];
  isContactListEnded: boolean = false;
  searchValue!: string;

  constructor(private sharedService: SharedService) {}
  pageSize!: number;
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

    if (scrollPosition >= scrollTreshold) {
      // User has scrolled to the bottom of the page, load more contacts
      this.loadMoreContacts();
    }
  }

  ngOnInit(): void {
    this.onResize();
    this.onPageChange({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.contactsListData.length,
    });

    this.sharedService.modifiedSelectedContact.subscribe(
      (modifiedContact: Contact) => {
        if (modifiedContact) {
          this.contactsListData = this.contactsListData.map((item) => {
            if (item.id === modifiedContact.id) {
              this.selectedID = item.id;
              return {
                ...item,
                ...modifiedContact,
                isSelected: modifiedContact.isSelected,
              };
            } else {
              return { ...item, isSelected: false };
            }
          });

          this.contactsList = [...this.contactsListData];
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

  loadMoreContacts() {
    const startIndex = this.contactsList.length;
    const endIndex = startIndex + 10; // Load 10 contacts at a time
    const moreContacts = this.contactsListData.slice(startIndex, endIndex);

    if (moreContacts.length > 0) {
      // There are more contacts to load
      this.contactsList = [...this.contactsList, ...moreContacts];
      this.pageSize = this.contactsList.length;
    } else {
      this.isContactListEnded = true;
    }
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

    if (window.innerWidth < 1000) {
      this.sharedService.showActiveComponent.next(false);
    }
    this.sharedService.selectedContact.next(item);
  }

  onFocus(e: any) {
    if (e.target.value == '')
      this.preSearchContactsList = [...this.contactsList];
  }

  onSearch(e: any) {
    this.searchValue = e.target.value.toLowerCase();
    const fields = [
      'name',
      'email',
      'gender',
      'dob',
      'address',
      'phone_no',
      'occupation',
      'company_name',
      'department',
    ];

    this.contactsList = this.preSearchContactsList.filter((item: any) =>
      fields.some((field) =>
        item[field].toLowerCase().replace('-', '').includes(this.searchValue)
      )
    );
  }

  onPageChange(e: any) {
    const pageIndex = e.pageIndex;
    const pageSize = e.pageSize;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.contactsList = this.contactsListData.slice(startIndex, endIndex);
  }
}
