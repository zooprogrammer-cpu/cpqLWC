import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountListController.getAccounts'
export default class AccountList extends LightningElement {
    @wire(getAccounts)
    accounts; 

}