public with sharing class AccountListController {
    public AccountListController() {
        
    }
    @AuraEnabled (cacheable=true)
    public static List<Account> getAccounts(){
       return [SELECT Id, Name, Type, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, BillingAddress, Industry, Description FROM Account];
    }
}
