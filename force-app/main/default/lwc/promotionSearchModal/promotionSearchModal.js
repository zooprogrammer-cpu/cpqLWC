import { LightningElement, track, wire } from 'lwc';
import getPromotions from '@salesforce/apex/QuoteSummaryController.getAllActivePromotions';
const DELAY = 300; 
export default class PromotionSearchModal extends LightningElement {
    closeHandler(){ 
        const myEvent = new CustomEvent('close',{
            bubbles:true,
            detail:{
                msg:"Modal closed succesfully"
            } 
        })
        this.dispatchEvent(myEvent)
    }

    footerHandler(){
        console.log("Footer Event Called")
    }

    
    searchKey = '';
    
    

    // cols= [
    //     {label:'Description', fieldName:'Description__c' , type: 'text' },
    //     {label:'Start Date', fieldName:'Start_Date__c' , type: 'date' },
    //     {label:'End Date', fieldName:'End_Date__c' , type: 'date' }
    // ]

    @wire(getPromotions,{searchkey:'$searchKey'})
    wiredPromos;

    handleKeyChange(event){
        window.clearTimeout(this.delayTimeout)
        this.searchKey = event.target.value; 
        this.delayTimeout = setTimeout(() =>{
            this.searchKey = searchKey; 
        },DELAY);
    }
    


}