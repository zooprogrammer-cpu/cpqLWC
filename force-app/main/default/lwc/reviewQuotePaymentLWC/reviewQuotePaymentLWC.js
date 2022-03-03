import { LightningElement,wire,api } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/SBQQ__Quote__c.Id';
import LIST_AMOUNT from '@salesforce/schema/SBQQ__Quote__c.SBQQ__ListAmount__c';


export default class ReviewQuotePaymentLWC extends LightningElement {
@api recordId
// Code for the Cancel Button in the Modal
closeHandler(){
    const myEvent = new CustomEvent('close')
    this.dispatchEvent(myEvent)
}

submitDetails(){
    
}
}