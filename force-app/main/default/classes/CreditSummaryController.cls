public with sharing class CreditSummaryController {
    @AuraEnabled(cacheable=true)
    public Static List<Credit_Summary__c> getCreditSummaryRecords(String recordid) {
        Set<Id> setOfConIds = new Set<Id>();
        Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordid];
        Applications__c appRecord = [select id, Account__c, Account__r.Email__c from Applications__C where Id =: appUnderwritingRecord.Application__c];
        List<Contact> conList = [SELECT Id,accountid FROM contact WHERE accountid =:appRecord.Account__c];
        for(Contact conn : conList){
            setOfConIds.add(conn.Id);
        }
        List<Credit_Summary__c> listOfCreditSummary = [SELECT Id,Name,Contact__c,Contact__r.Name,Credit_Score__c,Credit_Score_Override_Other_Reason__c,Credit_Score_Override_Reason__c,Override_Min_Credit_Score_Requirement__c FROM Credit_Summary__c WHERE Contact__c =: setOfConIds];
        System.debug('#####'+listOfCreditSummary);
        return listOfCreditSummary;
    }
}