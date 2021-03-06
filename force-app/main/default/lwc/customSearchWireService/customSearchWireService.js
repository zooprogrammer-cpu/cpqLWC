import { LightningElement, track, wire } from 'lwc';
import getPromotions from '@salesforce/apex/PromotionController.getPromotions';
export default class CustomSearchWireService extends LightningElement {
    key;
    selection; 
    @track promos; 
    updateKey(event){
        this.key = event.target.value; 
    }

    cols= [
        {label:'Name', fieldName:'Name' , type: 'text' },
        {label:'Start Date', fieldName:'Start_Date__c' , type: 'date' },
        {label:'End Date', fieldName:'End_Date__c' , type: 'date' }
    ]

    @wire(getPromotions,{searchkey:'$key'}) 
    wiredPromo({data,error}){
        if (data) {
            this.promos = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.promos = undefined;
        }
    };
    
    handleCheckboxChange(){
        //Query the DOM 
        const checked = Array.from(
            this.template.querySlectorAll('lightning-input')
        )

        //Filter only checked items
            .filter((element) => element.chcked)
            //Map to their labels
            .map((element) => element.label);
        this.selection = checked.join(',');         
    }

}
