import { LightningElement } from 'lwc';
import findPromotions from '@salesforce/apex/PromotionController.findPromotions';
export default class Promotion3 extends LightningElement {
    searchKey = '';
    promotions;
    error;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        findPromotions({ searchKey: this.searchKey })
            .then((result) => {
                this.promotions = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.promotions = undefined;
            });
    }

}