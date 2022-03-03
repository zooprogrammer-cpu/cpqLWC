import { LightningElement,wire,api } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/SBQQ__Quote__c.Id';
import NAME_FIELD from '@salesforce/schema/SBQQ__Quote__c.Name';
import LIST_AMOUNT_FIELD from '@salesforce/schema/SBQQ__Quote__c.SBQQ__ListAmount__c';
import ADDITIONAL_PAYMENT_FIELD from '@salesforce/schema/SBQQ__Quote__c.Additional_Payment__c';

export default class ReviewQuotePaymentLWC extends LightningElement {
    //store the data into these properties
    name
    listAmount
    //we want recordId to be dynamic
    @api recordId

    // call the wire service. Adapter configuration is for whi record we have to pass data(recordId). 
    //We need the recordId to be reactive so that whenever recordId is available, it triggers the wire service
    @wire(getRecord,{recordId:'$recordId', 
        fields:[NAME_FIELD,LIST_AMOUNT_FIELD]})  //Pass these fields    
        quoteHandler({data,error}){
            if(data){
                console.log(data)
                this.name=data.fields.Name.value
                //repeat process for List Amount.If displayValue is there, show displayValue otherwise show value
                this.listAmount=data.fields.SBQQ__ListAmount__c.displayValue ? data.fields.SBQQ__ListAmount__c.displayValue:
                data.fields.SBQQ__ListAmount__c.value
            } else if(error){
                console.error(error)
            }
        }

    // Code for the Cancel Button in the Modal
    closeHandler(){
        const myEvent = new CustomEvent('close')
        this.dispatchEvent(myEvent)
    }

    submitDetails(){
        
    }

    
}