public with sharing class QuoteSummaryController {
    @AuraEnabled
    public static SBQQ__Quote__c getQuote(Id quoteID){
        SBQQ__Quote__c quote = [SELECT Id, Name FROM SBQQ__Quote__c WHERE Id=:quoteId LIMIT 1];
        return quote; 

    }

    @AuraEnabled
    public static List<SBQQ__QuoteLine__c> getQuoteLines(Id quoteId){
        return [SELECT Id, SBQQ__ProductName__c,SBQQ__Description__c,SBQQ__Quantity__c FROM SBQQ__QuoteLine__c WHERE SBQQ__Quote__c=:quoteId]
    }

}

