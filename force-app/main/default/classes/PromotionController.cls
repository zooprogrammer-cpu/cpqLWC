public with sharing class PromotionController {
    @AuraEnabled(cacheable=true)
    public static List<Promotion__c> getPromotions(string searchkey){
        return [SELECT Id,Name,Qualifying_Product__c,Active__c,Start_Date__c, End_Date__c FROM Promotion__c WHERE Name LIKE : '%' + searchkey + '%'];
    }

    @AuraEnabled(cacheable=true)
    public static List<Promotion__c> findPromotions(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Qualifying_Product__c
            FROM Promotion__c
            WHERE Name LIKE :key
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }
    
}

