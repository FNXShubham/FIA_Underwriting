/**
 * @description: class that create repayment schedule as per terms and loan frequency.
 * @author: Pavan Waghmare, Finexus
 * @date   
 */
public class DocumentViewer {
   
    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentLink> getDocuments(String recordId){  
     
        List<ContentDocumentLink>lstDoc =  [SELECT LinkedEntityId, ContentDocument.CreatedDate, ContentDocument.Title, ContentDocument.ContentSize, ContentDocument.FileType 
                							FROM ContentDocumentLink 
               							    WHERE LinkedEntityId =:recordId];  
        system.debug('list of doc:'+lstDoc );

        return lstDoc; 
    }
}