import { LightningElement,api } from 'lwc';

export default class QuoteSummaryPage extends LightningElement {
    @api recordId;
    @api quoteId; 
    @api title; 
}