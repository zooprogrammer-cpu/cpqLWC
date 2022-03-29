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
    additionalPayment // can set to additionalPayment = 100 for intial default value
    minimumPayment = 100
    //formFields ={} //this is where the input value for Additional Payment goes

    //we want recordId to be dynamic
    @api recordId

    // call the wire service to get the values from quote record. Adapter configuration is for which record we have to pass data(recordId). 
    //We need the recordId to be reactive so that whenever recordId is available, it triggers the wire service
    @wire(getRecord,{recordId:'$recordId', 
        fields:[NAME_FIELD,LIST_AMOUNT_FIELD,ADDITIONAL_PAYMENT_FIELD]})  //Pass these fields    
        quoteHandler({data,error}){
            if(data){
                console.log(data)
                this.name=data.fields.Name.value
                //repeat process for List Amount.If displayValue is there, show displayValue otherwise show value
                this.listAmount=data.fields.SBQQ__ListAmount__c.displayValue ? data.fields.SBQQ__ListAmount__c.displayValue:
                data.fields.SBQQ__ListAmount__c.value
                //repeat process for Additional Payment
                this.additionalPayment =data.fields.Additional_Payment__c.displayValue ? data.fields.Additional_Payment__c.displayValue:
                data.fields.Additional_Payment__c.value
            } else if(error){
                console.error(error)
            }
        }

    // Code for the Cancel Button in the Modal
    closeHandler(){
        const myEvent = new CustomEvent('close')
        this.dispatchEvent(myEvent)
    }
    //Code for capturing typed numbers in Additional Payment
    changeHandler(event){
       this.additionalPayment =event.target.value;
       console.log(this.additionalPayment)
    }

    //Code for writing Additional Payment to the Quote Record
    submitDetails(){
        console.log(`Updating Records`)
        const fields ={}//empty object
        fields[ID_FIELD.fieldApiName] =this.recordId //pass the recordId to Id field
        fields[ADDITIONAL_PAYMENT_FIELD.fieldApiName] = this.additionalPayment //pass user typed additionalPayment value to Additional Payment Field
        const recordInput ={fields} //pass these fields to recordInput
        updateRecord(recordInput) //call update method to update the field. recordInput returns a promise
        .then(()=>{
            this.showToast("Success!!","Quote has been Updated", "success")
            this.closeHandler()
        }).catch(error=>{
            this.showToast("Error!!","Quote could not be updated", "error")
        })
    }
    
    //Code to ShowToast when the record is updated
    showToast(title,message,variant){
        this.dispatchEvent(new ShowToastEvent({
            title,message,variant
        }))
    }

    
}