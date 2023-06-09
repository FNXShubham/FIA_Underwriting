public class DocumentCategoryAttachmentTriggerHandler {
    public static void verifyApplicationStatus(map<id,Document_Category_Attachment__c> newmap,map<id,Document_Category_Attachment__c> oldmap){
        list<id> lstappids=new list<id>();
        list<id> lstappfundids=new list<id>();
        list<Applications__C> lstappsToUpdate=new list<Applications__C>();
        list<queuesobject> queueId = [SELECT Queue.Id FROM queuesobject WHERE queue.name='Application Underwriting'];

        for(Document_Category_Attachment__c doc:newmap.values()){
            Document_Category_Attachment__c olddoc=oldmap.get(doc.id);
            if(doc.Is_File_Uploaded__c!=olddoc.Is_File_Uploaded__c && doc.Is_File_Uploaded__c==true && doc.Stipulation_Name__c!=null){
                lstappids.add(doc.Application__c);
            }else if(doc.Is_File_Uploaded__c!=olddoc.Is_File_Uploaded__c && doc.Is_File_Uploaded__c==true && doc.Application_Funding__c!=null){
                lstappfundids.add(doc.Application_Funding__c);
            }
        }
        system.debug('lstappids are '+lstappids);
        map<id,Applications__c> mapapps=new map<id,Applications__c>([select id,
                                       (select id,Is_File_Uploaded__c from Document_Category_Attachment__r where Is_File_Uploaded__c=false)
                                       from Applications__c where id in :lstappids]);
        system.debug('mapapps are '+mapapps);
        //update app status to underwriting and assign to underwriting queue.
        for(id appid:lstappids){
            system.debug('mapapps.get(appid) is '+mapapps.get(appid).Document_Category_Attachment__r.isEmpty());
            list<Document_Category_Attachment__c> lstdoc=mapapps.get(appid).Document_Category_Attachment__r;
            system.debug('lstdoc are '+lstdoc);
            system.debug('lstdoc are '+lstdoc.isEmpty());
            system.debug('lstdoc are '+lstdoc.size());
            if(mapapps.get(appid)!=null){
                if(mapapps.get(appid).Document_Category_Attachment__r.isEmpty()){
                Applications__c app=new Applications__c();
                app.id=appid;
                app.Status__c=System.Label.Document_Upload_Complete;
                app.OwnerId = queueId[0].Queue.Id;
            lstappsToUpdate.add(app);
                }
        }
    }
        if(!lstappsToUpdate.isempty()){
        update lstappsToUpdate;
        }
            if(!lstappfundids.isEmpty()){
                updateapplicationfundingstatus(lstappfundids);
            }
    }
    public static void updateapplicationfundingstatus(list<id> lstappfundids){
        list<queuesobject> queueId = [SELECT Queue.Id FROM queuesobject WHERE queue.name='Application Funding'];
     list<Application_Funding__c> lstfundapps=[select id,status__c 
                                               from Application_Funding__c 
                                               where id in :lstappfundids];
        for(Application_Funding__c appfund:lstfundapps){
            appfund.status__c='Received Signed Docs';
            appfund.OwnerId=queueId[0].Queue.Id;
            CreatePaymentDistributions.createTask('Received Signed Docs','Completed','Normal',appfund.id,userinfo.getUserId());
        }
        update lstfundapps;        
    }
    public static void createContentDistributionRecord(Map<Id,Document_Category_Attachment__c> docCategoryAttMapNew,Map<Id,Document_Category_Attachment__c> docCategoryAttMapOld){
        Set<Id> docCatAttIdSet = new Set<Id>();
        List<ContentDistribution> newDistList = new List<ContentDistribution>();
        for(Document_Category_Attachment__c doc:docCategoryAttMapNew.values()){
            Document_Category_Attachment__c olddoc=docCategoryAttMapOld.get(doc.id);
            if(doc.Is_File_Uploaded__c!=olddoc.Is_File_Uploaded__c && doc.Is_File_Uploaded__c==true){
                docCatAttIdSet.add(doc.Id);
            }
        }
        
        List<ContentDocumentLink> contentDocumentList = [SELECT ContentDocumentId, LinkedEntityId  FROM ContentDocumentLink where LinkedEntityId in ( SELECT Id FROM Document_Category_Attachment__c WHERE Id =: docCatAttIdSet) and LinkedEntity.Type='Document_Category_Attachment__c'];//SELECT ContentDocumentId, LinkedEntityId FROM   ContentDocumentLink WHERE  LinkedEntityId IN : docCatAttIdsSet
                                                            

        Set<Id> contentDocumentId = new Set<Id>();
            
        for(ContentDocumentLink cdl : contentDocumentList){
            contentDocumentId.add(cdl.ContentDocumentId);
        }
            
        List<ContentVersion> contentVersionList = [SELECT Id, VersionData, FileType, Title, FileExtension,
                                                    ContentDocument.CreatedBy.Name, ContentDocument.ContentSize,
                                                    CreatedDate, ContentDocumentId, ContentDocument.FileType
                                                    FROM   ContentVersion 
                                                    WHERE  ContentDocumentId IN: contentDocumentId];
        
        for(ContentVersion cvRec : contentVersionList){
            ContentDistribution newDist = new ContentDistribution();
        	newDist.ContentVersionId = cvRec.Id;
        	newDist.Name = 'External Link';
        	newDist.PreferencesNotifyOnVisit = false;
        	newDist.PreferencesAllowViewInBrowser = true;
        	newDist.PreferencesAllowOriginalDownload=true;
			newDistList.add(newDist);
        }
        if(newDistList.size() > 0){
            INSERT newDistList;
        }
    }
}