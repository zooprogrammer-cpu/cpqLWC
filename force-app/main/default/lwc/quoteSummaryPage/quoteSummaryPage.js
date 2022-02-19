import { LightningElement,api,wire,track } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation'
import getQuoteLines from '@salesforce/apex/QuoteLinesController.getQuoteLines';

export default class QuoteSummaryPage extends LightningElement {
    @track quoteLines;
    @track columns =[
        {label:'Id', fieldName: 'Id', type: 'text'}, 
        {label:'Product Name', fieldName:'SBQQ__ProductName__c',type: 'text' },
        {label:'Description', fieldName: 'SBQQ__Description__c',type: 'text'},
        {label:'Qty', fieldName: 'SBQQ__Quantity__c',type: 'text'}
    ];

    @wire(getQuoteLines,{quoteId:'$quoteIden'})
    quoteLinesHandler({data,error}){
        if(data){
            console.log(data)
            this.quoteLines = data; 
            
        }
        if(error){
            console.error(error)
        }
    }

    @wire(CurrentPageReference)
    pageRef

    get PageReference(){
        return this.pageRef ? JSON.stringify(this.pageRef,null,2):''
    }

    get quoteIden(){
        return (this.pageRef.state.c__quoteId)
    }
}