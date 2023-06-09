public with sharing class CustomRelatedListController {
    @AuraEnabled
    public static List<Stipulations__c> getStipulationListByApplicationUnderwritingRecord(String recordId) {
        System.debug('DATA ID::'+recordId);
        return [SELECT Id,Name,Application__c,Application_Underwriting__c,Category__c,Comments__c,Module__c,Status__c,Stipulation_Name__c FROM Stipulations__c WHERE Application_Underwriting__c =: recordId];
    }
}