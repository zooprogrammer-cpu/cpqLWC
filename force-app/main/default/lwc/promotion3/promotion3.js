import { LightningElement } from 'lwc';
import getPromotionList from '@salesforce/apex/PromotionController.getPromotionList';
export default class Promotion3 extends LightningElement {
    searchKey = '';
    promotions;
    error;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        getPromotionList({ searchKey: this.searchKey })
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