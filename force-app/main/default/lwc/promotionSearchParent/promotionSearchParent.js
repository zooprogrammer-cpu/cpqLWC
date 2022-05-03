import { LightningElement } from 'lwc';

export default class PromotionSearchParent extends LightningElement {
    showModal = false
    //msg 
    clickHandler(){ 
        this.showModal = true
    }
    closeHandler(event){ 
        //this.msg=event.detail.msg
        this.showModal = false
    }
}