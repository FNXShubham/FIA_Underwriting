public with sharing class CollateralReviewController {
    @AuraEnabled(cacheable=true)
    public Static List<Collateral__c> getCollateralSummaryRecords(String recordid) {
        Set<Id> setOfConIds = new Set<Id>();
        Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordid];
        Applications__c appRecord = [select id, Account__c, Account__r.Email__c from Applications__C where Id =: appUnderwritingRecord.Application__c];
        // List<Contact> conList = [SELECT Id,accountid FROM contact WHERE accountid =:appRecord.Account__c];
        // for(Contact conn : conList){
        //     setOfConIds.add(conn.Id);
        // }
        List<Collateral__c> listOfAssetSummary = [SELECT Id,Name,Account__c,Account__r.Name,Active_Collateral__c,Collateral_Category__c,Collateral_Description__c,Collateral_Effective_Date__c,Collateral_Expiry_Date__c,Collateral_Insurance_Company__c,Collateral_Owner__c,Collateral_Type__c,Collateral_Value__c,Insurance_Policy_Date__c,Insurance_Policy_Number__c,Insurance_Policy_Type__c,Policy_Premium_Value__c FROM Collateral__c WHERE Account__c =: appRecord.Account__c];
        System.debug('#####'+listOfAssetSummary);
        return listOfAssetSummary;
    }
}