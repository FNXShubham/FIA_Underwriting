public with sharing class FilePreviewController {
    @AuraEnabled
    public static String getAllRelatedDocuments(String recordId) {
        system.debug('!!!::'+recordId);
        Set<Id> docCatAttIdsSet = new Set<Id>();
        Set<Id> contentDocEntityIdSet = new Set<Id>();
        Map<Id,String> mapOfStipulationsNameByDocCatAttId = new Map<Id,String>();
        Map<Id,Id> mapOfStipulationsNameByDocCatAttId2 = new Map<Id,Id>();
        Map<Id,ContentDocumentLink> mapOfContentDocLinkById = new Map<Id,ContentDocumentLink>();
        List<ContentDistribution> listOfContentDistribution = new List<ContentDistribution>();
        List<ContentVersion> listOfContentVersionToUpdate = new List<ContentVersion>();
        Application_Underwriting__c appunderRec = [SELECT Id,Name,Application__c FROM Application_Underwriting__c WHERE Id =: recordId];
        System.debug('@@@:::'+appunderRec);
        String appId = appunderRec.Application__c;
        List<Document_Category_Attachment__c> listOfDocCatAtt = [SELECT Id,Name,Application__c,Is_File_Uploaded__c,Stipulation_Name__c FROM Document_Category_Attachment__c WHERE Application__c =: appId];
        for(Document_Category_Attachment__c doccatrec : listOfDocCatAtt){
            docCatAttIdsSet.add(doccatrec.Id);
        }
        List<ContentDocumentLink> contentDocumentList = [SELECT ContentDocumentId, LinkedEntityId, LinkedEntity.Type  FROM ContentDocumentLink where LinkedEntityId in ( SELECT Id FROM Document_Category_Attachment__c WHERE Id =: docCatAttIdsSet) and LinkedEntity.Type='Document_Category_Attachment__c'];//SELECT ContentDocumentId, LinkedEntityId FROM   ContentDocumentLink WHERE  LinkedEntityId IN : docCatAttIdsSet
                                                            

        Set<Id> contentDocumentId = new Set<Id>();
            
        for(ContentDocumentLink cdl : contentDocumentList){
            contentDocumentId.add(cdl.ContentDocumentId);
            contentDocEntityIdSet.add(cdl.LinkedEntityId);
            mapOfContentDocLinkById.put(cdl.ContentDocumentId,cdl);
        }
        List<Stipulations__c> stipsList = [SELECT Id,Name,Stipulation_Name__c,Module__c,Category__c,Stipulations_Definition__c,Application__c,Application_Underwriting__c,Comments__c,Document_Category_Attachment__c,Status__c FROM Stipulations__c WHERE Document_Category_Attachment__c =: contentDocEntityIdSet];

        for(Stipulations__c stp : stipsList){
            mapOfStipulationsNameByDocCatAttId.put(stp.Document_Category_Attachment__c,stp.Stipulation_Name__c);
            mapOfStipulationsNameByDocCatAttId2.put(stp.Document_Category_Attachment__c,stp.Id);
        }

        List<ContentVersion> contentVersionList = [SELECT Id, VersionData, FileType, Title, FileExtension,Is_File_Approved__c,Stipulation_Name__c,Status__c,Comments__c,
                                                    ContentDocument.CreatedBy.Name, ContentDocument.ContentSize,
                                                    CreatedDate, ContentDocumentId, ContentDocument.FileType
                                                    FROM   ContentVersion 
                                                    WHERE  ContentDocumentId IN: contentDocumentId];
        
        for(ContentVersion cv : contentVersionList){
            ContentVersion contVersionRecord = new ContentVersion();
            ContentDistribution contentVersionDistribution = new ContentDistribution();
            Id entityId = mapOfContentDocLinkById.get(cv.ContentDocumentId).LinkedEntityId;
            String stipname = mapOfStipulationsNameByDocCatAttId.get(entityId);
            contVersionRecord.Id = cv.Id;
            contVersionRecord.Stipulation_Name__c = stipname;// mapOfStipulationsNameByDocCatAttId.get(entityId).Stipulation_Name__c;
            contVersionRecord.Stipulations__c = mapOfStipulationsNameByDocCatAttId2.get(entityId);
            contentVersionDistribution.Name = cv.Title;
            contentVersionDistribution.ContentVersionId = cv.Id;
            contentVersionDistribution.PreferencesAllowViewInBrowser = true;
            listOfContentDistribution.add(contentVersionDistribution);
            listOfContentVersionToUpdate.add(contVersionRecord);
        }
        INSERT listOfContentDistribution;
        UPDATE listOfContentVersionToUpdate;
        return JSON.serialize(contentVersionList);
    }

    @AuraEnabled(cacheable=true)
    public static String getLoginURL(){
        String baseURL = System.URL.getSalesforceBaseUrl().toExternalForm();
        User userRecord = [Select Id, AccountId, ContactId FROM User Where Id = :UserInfo.getUserId()];
        if(userRecord.ContactId != null){
            baseUrl = getExperienceURL();
        }
        return baseUrl;
    }

    public static String getExperienceURL(){
        String baseUrl = Network.getLoginUrl(Network.getNetworkId());
        baseURL =  baseURL.replace('/s/login', '');
        baseURL =  baseURL.replace('/s/Login', '');
        baseURL =  baseURL.replace('/login', '');
        baseURL =  baseURL.replace('/Login', '');
        return baseURL;
    }

    @AuraEnabled
    public static ContentDistribution getFilePublicURL(String documentId){
        //URL publicURL;
        System.debug('!!!!!'+documentId);
        ContentDistribution distContent = [Select Id, ContentDocumentId, ContentVersionId, ContentDownloadUrl, DistributionPublicUrl from ContentDistribution where ContentDocumentId=:documentId LIMIT 1]; 
        System.debug('distContent::'+distContent);
        return distContent;
    }

    @AuraEnabled
    public static void getFileApproved(String documentId){
        try {
            ContentVersion contentVersionList = [SELECT Id, FileType, Title, FileExtension,Is_File_Approved__c,Stipulation_Name__c,Status__c,Comments__c,Stipulations__c,
                                                    ContentDocument.CreatedBy.Name, ContentDocument.ContentSize,
                                                    CreatedDate, ContentDocumentId, ContentDocument.FileType
                                                    FROM   ContentVersion 
                                                    WHERE  Id =: documentId];
            Stipulations__c stipsrecords = [SELECT Id,Name,Stipulation_Name__c,Module__c,Category__c,Stipulations_Definition__c,Application__c,Application_Underwriting__c,Comments__c,Document_Category_Attachment__c,Status__c FROM Stipulations__c WHERE Id =: contentVersionList.Stipulations__c];
            contentVersionList.Status__c = 'Approved';
            stipsrecords.Status__c = 'Approved';
            Update stipsrecords;
            Update contentVersionList;                          
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static void getFileRejected(String documentId, String comments){
        try {
            System.debug('!!!!@@@'+documentId);
            ContentVersion contentVersionList = [SELECT Id, FileType, Title, FileExtension,Is_File_Approved__c,Stipulation_Name__c,Status__c,Comments__c,Stipulations__c,
                                                    ContentDocument.CreatedBy.Name, ContentDocument.ContentSize,
                                                    CreatedDate, ContentDocumentId, ContentDocument.FileType
                                                    FROM   ContentVersion 
                                                    WHERE  Id =: documentId];
            System.debug('#$#$#$#$::'+contentVersionList.Stipulations__c);
            Stipulations__c stipsrecord = [SELECT Id,Name,Stipulation_Name__c,Module__c,Category__c,Stipulations_Definition__c,Application__c,Application_Underwriting__c,Comments__c,Document_Category_Attachment__c,Status__c FROM Stipulations__c WHERE Id =: contentVersionList.Stipulations__c];
            System.debug('######'+contentVersionList);
            contentVersionList.Status__c = 'Rejected';
            contentVersionList.Comments__c = comments;
            stipsrecord.Comments__c += comments;
               
            Update contentVersionList;  
            Update stipsrecord;                       
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}