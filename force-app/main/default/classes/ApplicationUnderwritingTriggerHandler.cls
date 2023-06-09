public class ApplicationUnderwritingTriggerHandler {
    public static void createTasksForUnderwriting(Map<Id,Application_Underwriting__c> oldMap, Map<Id,Application_Underwriting__c> newMap){
        Set<Id> setOfIDs = new Set<Id>();
        List<Task_Definition__c> taskDefList = [SELECT Id,Name,Task_Name__c,Related_Object__c,Order__c,Assigned_To__c FROM Task_Definition__c WHERE Related_Object__c = 'Application Underwriting'];
        for(Id keyIds : newMap.keySet()){
            setOfIDs.add(keyIds);
        }
        
        for(Id keyVal : oldMap.keySet()){
            for(Task_Definition__c tskDef : taskDefList){
                if(newMap.get(keyVal).Stages__c == 'In Review' && (tskDef.Assigned_To__c == 'Business Division' || tskDef.Assigned_To__c == 'Credit Division' || tskDef.Assigned_To__c == 'Legal Division') && tskDef.Order__c == 1){
                    Task tk = new Task();
                    tk.WhatId = keyVal; 
                    tk.WhoId =newMap.get(keyVal).OwnerId;
                    tk.Subject = tskDef.Task_Name__c;
                    tk.Status = 'In Progress';
                }
            }
            
        }
    }
    public static void assignApprovedApplicationsToFunding(List<Application_Underwriting__c> appUnderList){
        Set<Id> appId = new Set<Id>();
        Integer count = 0;
        List<Applications__c> listOfApplicationsToUpdate = new List<Applications__c>();
        Group groupQueue = [select Id,Name from Group where Type = 'Queue' AND Name = 'Application Funding' LIMIT 1];
        for(Application_Underwriting__c appUnderRec: appUnderList){
            appId.add(appUnderRec.Application__c);
        }
        List<Applications__c> applicationList = [SELECT Id,Name,Status__c,OwnerId FROM Applications__c WHERE Id =: appId];
        List<Application_Underwriting__c> appunderwritingList = [SELECT Id,Name,Stages__c,Application__c FROM Application_Underwriting__c WHERE Application__c =: appId];
        for(Application_Underwriting__c appUnderwritingRec : appunderwritingList){
            if(appUnderwritingRec.Stages__c == 'Approved'){
                count++;
            }
        }
        for(Applications__c apprec : applicationList){
            Applications__c apprecord = new Applications__c();
            if(appunderwritingList.size() == count){
                apprecord.Id = apprec.Id;
                apprecord.Status__c = 'Funding';
                apprecord.OwnerId = groupQueue.Id;

                listOfApplicationsToUpdate.add(apprecord);
            }
        }
        UPDATE listOfApplicationsToUpdate;
    }
    public static void approvalValidationOnStipulation(List<Application_Underwriting__c> newList, List<Application_Underwriting__c> oldList){
        Boolean stipcheck = false;
        Set<Id> recIdSet = new Set<Id>();
        Set<Id> underwritingrecIdSet = new Set<Id>();
        Map<Id,List<Stipulations__c>> mapOfstiplistByappunderid = new Map<Id,List<Stipulations__c>>();
        for(Application_Underwriting__c appURec : newList){
            if(appURec.Stages__c == 'Approved'){
                recIdSet.add(appURec.Id);
            }
        }
        List<Stipulations__c> listOfStips = [SELECT Id,Name,Application__c,Application_Underwriting__c,Comments__c,Module__c,Status__c,Stipulation_Name__c FROM Stipulations__c WHERE Application_Underwriting__c =: recIdSet];
        System.debug('listOfStips::'+listOfStips);
        if(listOfStips.size() > 0){
            for(Stipulations__c stiprecord : listOfStips){
                mapOfstiplistByappunderid.put(stiprecord.Application_Underwriting__c,listOfStips);
            }
            System.debug('!!!@@@'+mapOfstiplistByappunderid);
        }
        if(!mapOfstiplistByappunderid.isEmpty()){
            for(Application_Underwriting__c appURec : newList){
                List<Stipulations__c> stipsRecList = mapOfstiplistByappunderid.get(appURec.Id);
                System.debug('####::'+stipsRecList);
               for(Stipulations__c recStips : stipsRecList){
                System.debug('@#@#::'+recStips.Status__c);
                    if(recStips.Status__c != 'Approved' && recStips.Status__c != 'Rejected'){
                        appURec.addError('You can not Approve this Record, All Stipulations are not approved yet!');
                    }
               }
            }
        }
    }
}