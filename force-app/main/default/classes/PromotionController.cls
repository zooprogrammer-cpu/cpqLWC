public with sharing class PromotionController {
    public PromotionController() {
        
    }
        @AuraEnabled(cacheable=true)
        public static List<Promotion__c> getPromotionList(){
            return [SELECT Id,Name FROM Promotion__c];
        }
}

