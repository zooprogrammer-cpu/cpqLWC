public with sharing class PromotionSearchController {
  
    @AuraEnabled(cacheable=true)
    public static List<Promotion__c> getAllActivePromotions(string searchkey){
        String key = '%' + searchKey + '%';
        return [
            SELECT Id,Name,Status__c,Description__c,Comment__c,Start_Date__c, End_Date__c
            FROM Promotion__c 
            WHERE (Description__c LIKE :key OR Comment__c LIKE :key) AND Status__c = 'ACTIVE' AND End_Date__c>TODAY ];
    }
}
