public without sharing class QuoteSummaryController {
    private static String qspProductCode = 'AddQSP'; 
    @AuraEnabled(cacheable=true)
    // getQuote is the method name and it will receive some parameter quoteId, 
    //first parameter is quoteId which is a string
    public static SBQQ__Quote__c getQuote(Id quoteId){
        SBQQ__Quote__c quote= [SELECT Id, 
        Name,
        SBQQ__Account__c,
        SBQQ__Account__r.Name,
        Intro_Period__c	
        FROM SBQQ__Quote__c WHERE Id=:quoteId LIMIT 1];
        return quote; 

    }
    //getQuoteLines is the method name that gets all of the quote lines for this quote with quoteID
    @AuraEnabled(cacheable=true)
    
    public static List<SBQQ__QuoteLine__c> getQuoteLines(String quoteId){ 
        return [SELECT Id, 
        SBQQ__ProductCode__c,
        SBQQ__ProductName__c,
        SBQQ__Description__c,
        SBQQ__Quantity__c,
        SBQQ__NetPrice__c,
        SBQQ__NetTotal__c,
        SBQQ__ProductFamily__c,
        Plan_Summary__c,
        Plan_Summary_Title__c,
        RequiredBy_Text__c,
        SBQQ__RequiredBy__c,
        SBQQ__ProductOption__c 
        FROM SBQQ__QuoteLine__c WHERE SBQQ__Quote__c=:quoteId
        ORDER BY Plan_Summary__c, SBQQ__Number__c ASC NULLS FIRST
        ];
    }

    //Start: Get all active Promotions
    @AuraEnabled(cacheable=true)
    public static List<Promotion__c> getAllActivePromotions(string searchkey){
        return [SELECT Id,Name,Status__c,Description__c,Start_Date__c, End_Date__c FROM Promotion__c WHERE Name LIKE : '%' + searchkey + '%' AND Status__c = 'ACTIVE'];
    }
    //End: Get all active Promotions

    // upsertQSPQuoteLines
    @AuraEnabled
    public static Boolean upsertQSPQuoteLine(String quoteId, 
                                            //Decimal qspAmount, 
                                            String requiredById, 
                                            //String bundleProductId,
                                            Integer quoteLineNumber,
                                            Boolean hasQSP){
    Product2 qspProduct = [SELECT Id, ProductCode FROM Product2 WHERE ProductCode =:qspProductCode LIMIT 1];
    List<SBQQ__ProductOption__c> qspProductOptions = [SELECT Id, SBQQ__ConfiguredSKU__c, SBQQ__OptionalSKU__c 
                                                            FROM SBQQ__ProductOption__c 
                                                            WHERE SBQQ__OptionalSKU__c = :qspProduct.Id LIMIT 1];
    if (qspProductOptions.size() == 0){
        return true;
    }
    SBQQ__ProductOption__c qspProductOption = qspProductOptions[0];
    Set<Id> upsertQuoteLinesIds = new Set<Id>();
    System.debug('quoteId from Supplemntal QSP:' + quoteId); 
    System.debug('quoteLineNumber:' + quoteLineNumber);
    System.debug('qspProdcut:' + qspProduct);
    System.debug('qspProductOption: ' + qspProductOption);
    
    if(hasQSP){
        List<SBQQ__QuoteLine__c> existingSupplementalQuoteLine = [SELECT Id, SBQQ__ProductCode__c 
                                                                    FROM SBQQ__QuoteLine__c 
                                                                    WHERE SBQQ__Quote__c =:quoteId AND SBQQ__ProductCode__c =:qspProductCode];
    }
    // System.debug('existingSupplementalQSPQuoteLine.size():' + existingSupplementalQSPQuoteLine.size());
    // for(SBQQ__QuoteLines__c quoteLineToUpdate : existingSupplementalQSPQuoteLine){
    //     upsertQuoteLinesIds.add(quoteLine.Id); 
    // }
    
    
    return false; 
    }

}