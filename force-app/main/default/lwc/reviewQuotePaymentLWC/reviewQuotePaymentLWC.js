import { LightningElement } from 'lwc';

export default class ReviewQuotePaymentLWC extends LightningElement {
// Code for the Cancel Button in the Modal
closeHandler(){
        const myEvent = new CustomEvent('close')
        this.dispatchEvent(myEvent)
    }
}