import { LightningElement,api,wire,track } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import getQuoteLines from '@salesforce/apex/QuoteSummaryController.getQuoteLines';
import getQuote from '@salesforce/apex/QuoteSummaryController.getQuote';
export default class QuoteSummaryPage extends NavigationMixin(LightningElement) {
    quoteNumber;
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

    @wire (getQuote,{quoteId:'$quoteIden'})
    quoteHandler({data,error}){
        if(data){
            console.log(data)
            
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

  


/* Button to Quote Detail Page */
    handleReturntoQuoteDetail(){
        this[NavigationMixin.Navigate]({ 
            type:'standard__recordPage',
            attributes:{ 
                recordId:this.pageRef.state.c__quoteId,
                objectApiName:'SBQQ__Quote__c',
                actionName:'view'
            }
        })
    }
}