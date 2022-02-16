import { LightningElement,track,wire,api } from 'lwc';
import getQuoteLines from '@salesforce/apex/QuoteLinesController.getQuoteLines';
export default class SimpleListQuoteLines extends LightningElement {
    @api recordId;
    @track quoteLines;
    @track columns =[
        {label:'Id', fieldName: 'Id', type: 'text'}, 
        {label:'Product Name', fieldName:'SBQQ__ProductName__c',type: 'text' },
        {label:'Description', fieldName: 'SBQQ__Description__c',type: 'text'},
        {label:'Qty', fieldName: 'SBQQ__Quantity__c',type: 'text'}
    ];

    @wire(getQuoteLines,{quoteId:'$recordId'})
    quoteLinesHandler({data,error}){
        if(data){
            console.log(data)
            this.quoteLines = data; 
            
        }
        if(error){
            console.error(error)
        }
    }

}