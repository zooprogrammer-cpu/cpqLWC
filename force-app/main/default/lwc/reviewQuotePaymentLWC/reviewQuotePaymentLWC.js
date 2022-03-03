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
    //formFields ={} //this is where the input value for Additional Payment goes

    //we want recordId to be dynamic
    @api recordId

    // call the wire service. Adapter configuration is for which record we have to pass data(recordId). 
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
    //Code for capturing typed numbers in Additional Payment
    additionalPayment = 100;
    changeHandler(event){
       this.additionalPayment =event.target.value;
       console.log(this.additionalPayment)
    }

    //Code for writing Additional Payment to the Quote Record
    submitDetails(){
        console.log(`Updating Records`)
        // const recordInput = {apiName:SBQQ__Quote__c.objectApiName, fields:this.formFields}
        // createRecord(recordInput).then(result=>{
        //     this.showToast('Success!!', `contact created with is ${result.id}`)
        //     this.template.querySelector('form.createForm').reset()
        //     this.formFields={}
        //     console.log(`Successfully update record`)
        // }).catch(error=>{
        //     this.showToast('Error Creating record', error.body.message, 'error')
        // })
        const fields ={}//empty object
        fields[ID_FIELD.fieldApiName] =this.recordId //pass the recordId to Id field
        fields[ADDITIONAL_PAYMENT_FIELD.fieldApiName] = this.additionalPayment //pass user typed additinalPayment value to Additional Payment Field
        const recordInput ={fields} //pass these fields to recordInput
        updateRecord(recordInput) //call update method to update the field. recordInput returns a promise
        .then(()=>{
            this.showToast("Success!!","Quote has been Updated", "success")
        }).catch(error=>{
            this.showToast("Error!!",error.message, "error")
        })    
    }
    
    //Code to ShowToast when the record is updated
    showToast(title,message,variant){
        this.dispatchEvent(new ShowToastEvent({
            title,message,variant
        }))
    }
}