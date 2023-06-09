public with sharing class AssetSummaryController {
    @AuraEnabled(cacheable=true)
    public Static List<Asset_Summary__c> getAssetSummaryRecords(String recordid) {
        Set<Id> setOfConIds = new Set<Id>();
        Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordid];
        Applications__c appRecord = [select id, Account__c, Account__r.Email__c from Applications__C where Id =: appUnderwritingRecord.Application__c];
        // List<Contact> conList = [SELECT Id,accountid FROM contact WHERE accountid =:appRecord.Account__c];
        // for(Contact conn : conList){
        //     setOfConIds.add(conn.Id);
        // }
        List<Asset_Summary__c> listOfAssetSummary = [SELECT Id,Name,Account__c,Account__r.Name,Account_Number__c,Asset_Description__c,Asset_Type__c,Institution_Name__c,Market_Value__c,Market_Value_Date__c,Original_Amount__c FROM Asset_Summary__c WHERE Account__c =: appRecord.Account__c];
        System.debug('#####'+listOfAssetSummary);
        return listOfAssetSummary;
    }
}