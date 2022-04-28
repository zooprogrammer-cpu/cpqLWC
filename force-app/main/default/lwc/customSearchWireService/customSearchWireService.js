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
            this.promos = null; 
        });
    }
    */

    cols= [
        {label:'Name', fieldName:'Name' , type: 'text' },
        //{label:'Qualifying Products', fieldName:'Qualifying_Product__c' , type: 'text' }

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

}
