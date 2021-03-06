import { LightningElement, track, wire } from 'lwc';
import getAllActivePromotions from '@salesforce/apex/PromotionSearchController.getAllActivePromotions';

const DELAY = 300;

export default class PromotionSearchModal extends LightningElement {

    searchKey='';
    selectedPromo;
    visiblePromos 
    
    @wire(getAllActivePromotions,{searchkey:'$searchKey'}) 
    wiredPromos;

    handleClick(){
        this.selectedPromo = false;
    }

    handleKeyChange(event){
        window.clearTimeout(this.delayTimeout)
        const searchKey = event.target.value; 
        this.delayTimeout = setTimeout(()=>{
            this.searchKey = searchKey; 
        },DELAY);
    }

    handleSelect(event){
        console.log('Promo selected');
        
        const promoId = event.detail;
        console.log('promoId selected',promoId); 
        this.selectedPromo = this.wiredPromos.data.find(
            (promo) => promo.Id === promoId
        )
    }

    closeHandler(){ 
        const myEvent = new CustomEvent('close',{
            bubbles:true,
            detail:{
                msg:"Modal closed succesfully"
            } 
        })
        this.dispatchEvent(myEvent)
    }
    
    updatePromoHandler(event){
        this.visiblePromos=[...event.detail.records]
        console.log(event.detail.records)
    }

    handleClearSelection(){
        selectedPromo =[]
    }
   
}