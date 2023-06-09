public with sharing class LiabilitiesSummary{
    @AuraEnabled(cacheable=true)
    public Static List<Liability_Summary__c> getLiabilitySummaryRecords(String recordid) {
        Set<Id> setOfConIds = new Set<Id>();
        Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordid];
        Applications__c appRecord = [select id, Account__c, Account__r.Email__c from Applications__C where Id =: appUnderwritingRecord.Application__c];
        // List<Contact> conList = [SELECT Id,accountid FROM contact WHERE accountid =:appRecord.Account__c];
        // for(Contact conn : conList){
        //     setOfConIds.add(conn.Id);
        // }
        List<Liability_Summary__c> listOfAssetSummary = [SELECT Id,Name,Account__c,Liability_Name__c,Liability_Type__c,Original_Amount__c,Payment_Amount__c,Stated_Net_Worth__c,Total_Liabilities_Amount__c,Amount_Owing__c FROM Liability_Summary__c WHERE Account__c =: appRecord.Account__c];
        System.debug('#####'+listOfAssetSummary);
        return listOfAssetSummary;
    }
}