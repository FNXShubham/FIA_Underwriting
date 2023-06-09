public with sharing class StipulationRecHelper {
    @AuraEnabled
    public static Stipulations__c stipulationRecMethod(String modulename, String category, String selectedstipdef, String appid, String appunderwriting, String stipcomment, String stiptype) {
        try {
            Document_Category_Attachment__c appdoccat = new Document_Category_Attachment__c();
            appdoccat.Application__c = appid;
            appdoccat.Stipulation_Name__c = category;
            insert appdoccat;

            Stipulations__c siprecord = new Stipulations__c();
            siprecord.Module__c = modulename;
            siprecord.Category__c = category;
            siprecord.Stipulations_Definition__c = selectedstipdef;
            siprecord.Application__c = appid;
            siprecord.Application_Underwriting__c = appunderwriting;
            siprecord.Comments__c = stipcomment;
            siprecord.Document_Category_Attachment__c = appdoccat.Id;
            if(stiptype == 'Customer Stipulation'){
                siprecord.Status__c = 'New';
            }else if(stiptype == 'Internal Stipulation'){
                siprecord.Status__c = 'Internal Review';
            }
            siprecord.Stipulation_Type__c = stiptype;
            insert siprecord;

            /*Stipulations__c stipStipName = [SELECT Id,Stipulations_Definition__c,Stipulations_Definition__r.Name FROM Stipulations__c WHERE Id =: siprecord.Id];
            Document_Category_Attachment__c appdoccat = new Document_Category_Attachment__c();
            appdoccat.Application__c = appid;
            appdoccat.Stipulation_Name__c = stipStipName.Stipulations_Definition__r.Name;
            insert appdoccat;

            siprecord.Document_Category_Attachment__c = appdoccat.Id;
            update siprecord;*/
            return siprecord;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Application_Underwriting__c getParentValuesForStipCreation(Id recordid){
        try {
            Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordid];
            return appUnderwritingRecord;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void sendStipulationViaEmail(String recordId){
        try {
            Set<Id> appIdSet = new Set<Id>();
            Set<Id> accIdSet = new Set<Id>();
            Map<Id,List<Contact>> mapOfListOfContactsByAccId = new Map<Id,List<Contact>>();
            List<Stipulations__c> stipListUpdate = new List<Stipulations__c>();
            Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordId];
            Applications__c appRecord = [select id, Account__c, Account__r.Email__c from Applications__C where Id =: appUnderwritingRecord.Application__c];
            List<Contact> conList = [SELECT Id,accountid FROM contact WHERE accountid =:appRecord.Account__c];
            for(Contact conn : conList){
                mapOfListOfContactsByAccId.put(conn.accountid,conList);
            }
            List<Stipulations__c> listofStipulations = [SELECT Id,Name,Module__c,Category__c,Stipulations_Definition__c,Application__c,Application_Underwriting__c,Comments__c,Document_Category_Attachment__c,Status__c FROM Stipulations__c WHERE Application_Underwriting__c =: recordId AND Status__c = 'New'];
            EmailTemplate emailTemp = [Select id, Subject, Body From EmailTemplate Where DeveloperName = 'Underwriting_Stipulations'];
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            if(listofStipulations.size()>0){
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setTemplateId(emailTemp.Id);
                mail.setTargetObjectId(conList[0].Id);
                mail.setWhatId(appUnderwritingRecord.Id);
                emailList.add(mail);
                Messaging.SendEmailResult[] results = Messaging.sendEmail(emailList);
            }
            
            for(Stipulations__c stp : listofStipulations){
                Stipulations__c stpRec = new Stipulations__c();
                stpRec.Id = stp.Id;
                stpRec.Status__c = 'Sent To Customer';
                stipListUpdate.add(stpRec);
            }
            update stipListUpdate;
        } catch (Exception e) {
            system.debug('ERROR::'+e);
        }
    }

    @AuraEnabled
    public static void sendStipulationFollowupEmail(String recordId){
        try {
            System.debug('@@###::'+recordId);
            Set<Id> appIdSet = new Set<Id>();
            Set<Id> accIdSet = new Set<Id>();
            Application_Underwriting__c appUnderwritingUpdate = new Application_Underwriting__c();
            Map<Id,List<Contact>> mapOfListOfContactsByAccId = new Map<Id,List<Contact>>();
            List<Stipulations__c> stipListUpdate = new List<Stipulations__c>();
            Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,Comments__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordId];
            
            Applications__c appRecord = [select id, Account__c, Account__r.Email__c from Applications__C where Id =: appUnderwritingRecord.Application__c];
            List<Contact> conList = [SELECT Id,accountid FROM contact WHERE accountid =:appRecord.Account__c];
            for(Contact conn : conList){
                mapOfListOfContactsByAccId.put(conn.accountid,conList);
            }
            List<Stipulations__c> listofStipulations = [SELECT Id,Name,Module__c,Category__c,Stipulations_Definition__c,Application__c,Application_Underwriting__c,Comments__c,Document_Category_Attachment__c,Status__c FROM Stipulations__c WHERE Application_Underwriting__c =: recordId AND Status__c = 'Document Uploaded'];
            EmailTemplate emailTemp = [Select id, Subject, Body From EmailTemplate Where DeveloperName = 'Underwriting_Followup_Email'];
            // appUnderwritingUpdate.Id = appUnderwritingRecord.Id;
            // appUnderwritingUpdate.Comments__c = comment;
            // update appUnderwritingUpdate;
            List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
            if(listofStipulations.size()>0){
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setTemplateId(emailTemp.Id);
                mail.setTargetObjectId(conList[0].Id);
                mail.setWhatId(appUnderwritingRecord.Id);
                emailList.add(mail);
                Messaging.SendEmailResult[] results = Messaging.sendEmail(emailList);
            }
            for(Stipulations__c stp : listofStipulations){
                Stipulations__c stpRec = new Stipulations__c();
                stpRec.Id = stp.Id;
                stpRec.Status__c = 'Following Up with Customer';
                stipListUpdate.add(stpRec);
            }
            update stipListUpdate;
        } catch (Exception e) {
            system.debug('ERROR::'+e);
        }
    }

    @AuraEnabled
    public static Stipulations_Definition__c createStipulationDefinition(String modulename, String category, String name){
        try {
            Stipulations_Definition__c sipdefrecord = new Stipulations_Definition__c();
            sipdefrecord.Name = name;
            sipdefrecord.Module__c = modulename;
            sipdefrecord.Category__c = category;

            INSERT sipdefrecord;
            return sipdefrecord;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Application_Underwriting__c getRecordTypeId(String recordid){
        try {
            Application_Underwriting__c appUrecord = [SELECT Id,Name,RecordTypeId FROM Application_Underwriting__c WHERE Id =: recordid];
            return appUrecord;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public static void updateOpenStip(Map<Id,Stipulations__c> sipNewMap,Map<Id,Stipulations__c> sipOldMap){
        Set<Id> docCatIdSet = new Set<Id>();
        List<Document_Category_Attachment__c> listOfDocCatAttUpdate = new List<Document_Category_Attachment__c>();
        for(Id idkey : sipNewMap.keySet()){
            if(sipNewMap.get(idkey).Status__c != sipOldMap.get(idkey).Status__c && sipNewMap.get(idkey).Status__c == 'Following Up with Customer'){
                docCatIdSet.add(sipNewMap.get(idkey).Document_Category_Attachment__c);
            }
        }
        List<Document_Category_Attachment__c> docCatAttList = [SELECT Id,Name,Is_File_Uploaded__c FROM Document_Category_Attachment__c WHERE Id =: docCatIdSet];
        for(Document_Category_Attachment__c dcaRec : docCatAttList){
            Document_Category_Attachment__c doccatrec = new Document_Category_Attachment__c();
            doccatrec.Id = dcaRec.Id;
            doccatrec.Is_File_Uploaded__c = false;
            listOfDocCatAttUpdate.add(doccatrec);
        }
        Update listOfDocCatAttUpdate;
    }

    @AuraEnabled
    public static String approveStipulations(String stipId){
        try {
            Integer count = 0;
            List<ContentVersion> contentVersionList = [SELECT Id, FileType, Title, FileExtension,Is_File_Approved__c,Stipulation_Name__c,Status__c,Comments__c,Stipulations__c,
                                                    ContentDocument.CreatedBy.Name, ContentDocument.ContentSize,
                                                    CreatedDate, ContentDocumentId, ContentDocument.FileType
                                                    FROM   ContentVersion 
                                                    WHERE  Stipulations__c =: stipId];
            Stipulations__c stipulationsRecords = [SELECT Id,Name,Module__c,Category__c,Stipulations_Definition__c,Application__c,Application_Underwriting__c,Comments__c,Document_Category_Attachment__c,Status__c FROM Stipulations__c WHERE Id =: stipId];
            for(ContentVersion cv : contentVersionList){
                if(cv != null && cv.Status__c == 'Approved'){
                    count++;
                    stipulationsRecords.Status__c = 'Approved';
                    Update stipulationsRecords; 
                }
            }
            if(count > 0){
                return 'Success';
            }else{
                return 'Failed';
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}