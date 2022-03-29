public with sharing class QuoteSummaryController {
    @AuraEnabled(cacheable=true)
    // getQuote is the method name and it will receive some parameter quoteId, 
    //first parameter is quoteId which is a string
    public static SBQQ__Quote__c getQuote(Id quoteId){
        SBQQ__Quote__c quote= [SELECT Id, Name FROM SBQQ__Quote__c WHERE Id=:quoteId LIMIT 1];
        return quote; 

    }
    //getQuoteLines is the method name that gets all of the quote lines for this quote with quoteID
    @AuraEnabled(cacheable=true)
    
    public static List<SBQQ__QuoteLine__c> getQuoteLines(String quoteId){ 
        return [SELECT Id, SBQQ__ProductName__c,SBQQ__Quantity__c FROM SBQQ__QuoteLine__c WHERE SBQQ__Quote__c=:quoteId];
    }

    //upsertQSPQuoteLines
    // @AuraEnabled
    // public static string upsertQSPQuoteLine(String quoteId, 
    //                                         Decimal qspAmount, 
    //                                         String bundleId, 
    //                                         String bundleProductId,
    //                                         Integer quoteLineNumber,
    //                                         Boolean hasQSP){
    // Product2 qspProduct = [SELECT Id, ProductCode FROM Product2 WHERE ProductCode =:qspProductCode LIMIT 1]; 
      
    // }

}