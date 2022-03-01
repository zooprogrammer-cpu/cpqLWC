public with sharing class FirstCPQController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        return [ SELECT Name, AnnualRevenue, Industry 
                FROM Account 
                ORDER BY Name 
                LIMIT 5];
    }

    
    @AuraEnabled(cacheable=true)
    public static SBQQ__Quote__c getQuote(Id quoteId) {
        SBQQ__Quote__c quote = [SELECT Id,
                                        Name,
                                        SBQQ__Account__r.Name
                                        FROM 
                                        SBQQ__Quote__c
                                        WHERE Id =:quoteId
                                        LIMIT 1];
        return quote; 
    }

    @AuraEnabled(cacheable=true)
    public static List<SBQQ__QuoteLine__c> getQuoteLines(Id quoteId){

        List<SBQQ__QuoteLine__c> quoteLines = [SELECT Id,
                                                        SBQQ__ProductName__c,
                                                        SBQQ__Description__c,
                                                        SBQQ__Quantity__c
                                                        FROM SBQQ__QuoteLine__c
                                                        WHERE SBQQ__Quote__c=:quoteId];
        return quoteLines;
    }
}