import { LightningElement, wire } from 'lwc';
//import { getRecord, createRecord, getRecordCreateDefaults, updateRecord } from 'lightning/uiRecordApi';
//import { refreshApex } from '@salesforce/apex';
import getQuoteLines from '@salesforce/apex/FirstCPQController.getQuoteLines';
import getQuote from '@salesforce/apex/FirstCPQController.getQuote';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import PRODUCTNAME_FIELD from '@salesforce/schema/SBQQ__QuoteLine__c.SBQQ__ProductName__c';
import DESCRIPTION_FIELD from '@salesforce/schema/SBQQ__QuoteLine__c.SBQQ__Description__c';
import QUANTITY_FIELD from '@salesforce/schema/SBQQ__QuoteLine__c.SBQQ__Quantity__c';


import getAccounts from '@salesforce/apex/FirstCPQController.getAccounts';
const COLUMNS =[
    {label: 'Account Name', fieldName: NAME_FIELD.fieldApiName,type:'text'},
    {label: 'Annual Revenue', fieldName: REVENUE_FIELD.fieldApiName,type:'currency'},
    {label: 'Industry', fieldName: INDUSTRY_FIELD.fieldApiName,type:'text'},

];

const COLUMNS2 =[
    {label: 'Product Name', fieldName: PRODUCTNAME_FIELD.fieldApiName,type:'text'},
    {label: 'Description', fieldName: DESCRIPTION_FIELD.fieldApiName,type:'text'},
    {label: 'Quantity', fieldName: QUANTITY_FIELD.fieldApiName,type:'number'},
];

import ID_FIELD from '@salesforce/schema/SBQQ__Quote__c.Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class FirstCPQLWC extends LightningElement {
    columns = COLUMNS;
    @wire(getAccounts)
    accounts;
    columns2 = COLUMNS2;
    @wire(getQuoteLines)
    quoteLines;
    @wire(getQuote)
    quote;
}