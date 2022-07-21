import { LightningElement,api,wire,track } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import getQuoteLines from '@salesforce/apex/QuoteSummaryController.getQuoteLines';
import getQuote from '@salesforce/apex/QuoteSummaryController.getQuote';
export default class NewQuoteSummaryPage extends NavigationMixin(LightningElement) {
    @track quoteLines;
    @track error;
    topLevelBundles =[];
    planSummaryValuesSet = new Set();
    @track planSummaryArray = [];
    parsedQuoteLines =[];
    installmentsValue = '';
    
    @track columns =[
        {label:'Product Name', fieldName:'SBQQ__ProductName__c',type: 'text' },
        {label:'Product Family', fieldName:'SBQQ__ProductFamily__c',type: 'text' },
        {label:'Qty', fieldName: 'SBQQ__Quantity__c',type: 'text'},
        {label:'Net Unit Price', fieldName: 'SBQQ__NetPrice__c',type: 'currency'},
        {label:'Net Total Price', fieldName: 'SBQQ__NetTotal__c',type: 'currency'},
    ];
    
    //Capture quoteId
    @wire(CurrentPageReference)
    pageRef
  
    get quoteIden(){
        return (this.pageRef.state.c__quoteId)
    }
       //Capture Quote Name
       @wire (getQuote,{quoteId:'$quoteIden'})
       quoteHandler({data,error}){
           if(data){
               console.log(data)
               console.log(data.Name)
               this.quoteNames = data;
           }
           if(error){
               console.error(error)
           }
       }

    //Capture Quote Lines 
    @wire(getQuoteLines,{quoteId:'$quoteIden'})
    quoteLinesHandler(result){
        this.quoteLinesResult = result; 
        if(result.data){
            console.log(`quoteLinesHandler data:`,result.data)
            this.quoteLines = result.data; 
            refreshApex(this.quoteLinesResult);
            this.parsedQuoteLines = JSON.parse(JSON.stringify(this.quoteLines))
            console.table(`parsedQuoteLines:`,this.parsedQuoteLines)

        }
        if(result.error){
            console.error(result.error)
        }

    }


    //Quote Lines Table
    headings = ["Product Name", "Product Family", "Quantity", "Net Unit Price","Net Total Price"]


 
  
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
    /* Button to Make Payment Modal */

    showModal= false
    clickHandler(event){
       this.showModal = true;
    }
    closeHandler(event){
       this.showModal =false;
    }


// Button to QLE/Configurator
    gotoQLE(){
        console.log(`starting QLE`)
        this[NavigationMixin.Navigate]({ 
            type:'standard__webPage',
            attributes:{ 
                recordId:this.pageRef.state.c__quoteId,
                url:'/apex/sbqq__sb?scontrolCaching=1&id='+ this.pageRef.state.c__quoteId + '#quote/le?qId=' + this.pageRef.state.c__quoteId
            }
        }).then(generatedUrl=>{
            console.log(generatedUrl)
            window.open(generatedUrl)
        })
    }

    get paymentTermsOptions() {
        return [
            { label: 'Pay In Full', value: 'Pay In Full' },
            { label: '3Pay', value: '3Pay' },
            { label: '12 Months', value: '12 Months' },
            { label: '24 Months', value: '24 Months' },
            { label: '36 Months', value: '36 Months' },
            { label: '60 Months', value: '60 Months' }
        ]
       
    }

    updateMonthlyPayment(event){
        console.log(`updateMonthlyPayment`)
        this.installmentsValue = event.detail.value;        
        console.log(`Selected Installment is:`, this.installmentsValue)
        let childProducts = this.template.querySelectorAll('c-qs-quote-line-grouping')
        childProducts.forEach(child=>{
            child.refreshChildLines(event.detail.value)
        })
    }


}