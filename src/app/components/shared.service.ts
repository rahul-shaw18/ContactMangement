import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import contacts from '../../app/contacts.json';
import { Contact } from '../contact';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  selectedContact: any = new BehaviorSubject<Contact>(contacts[0]);
  modifiedSelectedContact: any = new BehaviorSubject<any>(null);
  showActiveComponent: any = new BehaviorSubject<any>(null);
  constructor() {}
}
