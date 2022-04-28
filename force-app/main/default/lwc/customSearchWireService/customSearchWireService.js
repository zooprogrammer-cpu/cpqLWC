import { LightningElement, track, wire } from 'lwc';
import getPromotions from '@salesforce/apex/PromotionController.getPromotions';
export default class CustomSearchWireService extends LightningElement {
    key;
    @track promos; 
    updateKey(event){
        this.key = event.target.value; 
    }
    /*
    handleSearch(){
        //call apex method
        getPromotions({searchkey: this.key})
        .then(result=>{
            this.promos = result; 
        })
        .catch(error=>{
            this.accounts = null; 
        });
    }
    */

    cols= [
        {label:'Name', fieldName:'Name' , type: 'text' },
        {label:'Qualifying Products', fieldName:'Qualifying_Product__c' , type: 'text' }

    ]
    @wire(getPromotions,{searchkey:'$key'}) promos; 

}
