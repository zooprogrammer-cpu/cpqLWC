import { LightningElement,api,wire,track } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import getQuoteLines from '@salesforce/apex/QuoteSummaryController.getQuoteLines';
import getQuote from '@salesforce/apex/QuoteSummaryController.getQuote';
export default class QuoteSummaryPage extends NavigationMixin(LightningElement) {
    @track quoteLines;
    @track columns =[
        {label:'Id', fieldName: 'Id', type: 'text'}, 
        {label:'Product Name', fieldName:'SBQQ__ProductName__c',type: 'text' },
        {label:'Qty', fieldName: 'SBQQ__Quantity__c',type: 'text'}
    ];
      //Capture quoteId
      @wire(CurrentPageReference)
      pageRef
  
      get PageReference(){
          return this.pageRef ? JSON.stringify(this.pageRef,null,2):''
      }
  
      get quoteIden(){
          return (this.pageRef.state.c__quoteId)
      }

    //Capture Quote Lines 
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


// Button to Edit Lines Page
    // handleGotoQle(){
    //     this[NavigationMixin.Navigate]({ 
    //         type:'standard__recordPage',
    //         attributes:{ 
    //             recordId:this.pageRef.state.c__quoteId,
    //             objectApiName:'SBQQ__Quote__c',
    //             actionName:'view'
    //         }
    //     })
    // }
}