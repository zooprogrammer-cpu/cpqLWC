import { LightningElement,api,wire,track } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import getQuoteLines from '@salesforce/apex/QuoteSummaryController.getQuoteLines';
import getQuote from '@salesforce/apex/QuoteSummaryController.getQuote';
//import upsertQSPQuoteLine from '@salesforce/apex/QuoteSummaryController.upsertQSPQuoteLine';
export default class QuoteSummaryPage extends NavigationMixin(LightningElement) {
    @track quoteLines;
    @track columns =[
        {label:'Product Name', fieldName:'SBQQ__ProductName__c',type: 'text' },
        {label:'Qty', fieldName: 'SBQQ__Quantity__c',type: 'text'},
        {label:'Net Unit Price', fieldName: 'SBQQ__NetPrice__c',type: 'currency'},
        {label:'Net Total Price', fieldName: 'SBQQ__NetTotal__c',type: 'currency'},


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
            console.log(`quoteLinesHandler data:`,data)
            this.quoteLines = data; 
            
        }
        if(error){
            console.error(error)
        }
    }

    //Quote Lines Table
    headings = ["Product Name", "Quantity", "Net Unit Price","Net Total Price"]

    get totalAmount(){
        return this.quoteLines.reduce((total,value)=>{
            return total = total + value.SBQQ__NetTotal__c
        },0)
        
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


// Button to QLE/Configurator
    gotoQLE(){
        console.log(`starting QLE`)
        this[NavigationMixin.Navigate]({ 
            type:'standard__webPage',
            attributes:{ 
                //recordId:this.pageRef.state.c__quoteId,
                //objectApiName:'SBQQ__Quote__c',
                //actionName:'view',
                recordId:this.pageRef.state.c__quoteId,
                url:'/apex/sbqq__sb?scontrolCaching=1&id='+ this.pageRef.state.c__quoteId + '#quote/le?qId=' + this.pageRef.state.c__quoteId
            }
        }).then(generatedUrl=>{
            console.log(generatedUrl)
            window.open(generatedUrl)
        })
    }

    // insertQSPQuoteLine(){
    //     console.log('Adding QSP Quote Line')
    //     upsertQSPQuoteLine({quoteId:this.quoteId,

    //     })
    // }


    
}