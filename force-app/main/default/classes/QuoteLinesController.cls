public with sharing class QuoteLinesController {
    @AuraEnabled(cacheable=true)
    public static List<SBQQ__QuoteLine__c> getQuoteLines(String quoteId){
        return [SELECT Id, SBQQ__ProductName__c,SBQQ__Description__c,SBQQ__Quantity__c FROM SBQQ__QuoteLine__c WHERE SBQQ__Quote__c=:quoteId];
    }

}