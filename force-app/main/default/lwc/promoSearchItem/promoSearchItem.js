import { LightningElement,api } from 'lwc';

export default class PromoSearchItem extends LightningElement {
    @api promo;

    handleClick(event){
        event.preventDefault();
        const selectEvent = new CustomEvent('select',{
            detail: this.promo.Id
        });
        this.dispatchEvent(selectEvent);
    }
}