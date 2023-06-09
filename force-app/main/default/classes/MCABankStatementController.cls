public with sharing class MCABankStatementController {

    @AuraEnabled(cacheable=true)
    public Static List<Bank_Account__c> getBankAccounts(Id recordId) {

        Application_Underwriting__c appunderRec = [SELECT Id,Name,Application__c,Application__r.Account__c FROM Application_Underwriting__c WHERE Id =: recordId];
        String appId = appunderRec.Application__c;
        Applications__c appRecord = [SELECT Id, Account__c FROM Applications__c WHERE Id =: appId];
        string accId = appRecord.Account__c;                                     
        
        List<Bank_Account__c> bankData = [SELECT Id, Name, Bank_Account_Name__c, Account__c FROM Bank_Account__c WHERE Account__c =: accId];
        
        return bankData;
    }

    @AuraEnabled(cacheable=true)
    public Static List<String> getBankStatements(Id bankId) {                                     
        try{
            List<String> statementName = new List<String>();
            List<Bank_Statement__c> bankStatementDataData = [SELECT Id, Name, Bank_Account__c, Account__c FROM Bank_Statement__c WHERE Bank_Account__c =: bankId];
            for(Bank_Statement__c bst : bankStatementDataData){
                statementName.add(bst.Name);
            }
            return statementName;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void getStatementDetails(Id bankId){
        try {
            Map<Id,List<Statement_Details__c>> mapOfStatementDetailsListBybankstmtId = new Map<Id,List<Statement_Details__c>>();
            Set<Id> bankstmtidSet = new Set<Id>();
            Map<String,List<Statement_Details__c>> mapOfStatementDetailsListByBnkStmtId = new Map<String,List<Statement_Details__c>>();
            Map<String,List<Statement_Details__c>> mapOfStatementDetailsByGrouping = new Map<String,List<Statement_Details__c>>();
            Map<String,List<Statement_Details__c>> mapOfStatementDetailsByCategory = new Map<String,List<Statement_Details__c>>();
            Map<String,Map<String,List<Statement_Details__c>>> mapOfstdetailsListbyCategoryFrps = new Map<String,Map<String,List<Statement_Details__c>>>();
            List<Bank_Statement__c> bankStatementData = [SELECT Id, Name, Bank_Account__c, Account__c FROM Bank_Statement__c WHERE Bank_Account__c =: bankId ORDER BY CreatedDate ASC];
            for(Bank_Statement__c bstmt : bankStatementData){
                bankstmtidSet.add(bstmt.Id);
            }
            List<Statement_Details__c> listOfStatement = [SELECT Id,Name,Bank_Statement__c,Bank_Statement__r.Name,Category__c,Grouping__c,Input_Amount__c,Sub_Category__c,Transaction_Date__c,Transaction_Name__c FROM Statement_Details__c WHERE Bank_Statement__c =: bankstmtidSet];
            for(Statement_Details__c stDtls : listOfStatement){
                if(mapOfStatementDetailsListByBnkStmtId.containsKey(stDtls.Bank_Statement__r.Name)){
                    mapOfStatementDetailsListByBnkStmtId.get(stDtls.Bank_Statement__r.Name).add(stDtls);
                } else {
                    mapOfStatementDetailsListByBnkStmtId.put(stDtls.Bank_Statement__r.Name, new List<Statement_Details__c>{stDtls});
                }
            }
            for(String keySetVal : mapOfStatementDetailsListByBnkStmtId.keySet()){
                for(Statement_Details__c stDetails : mapOfStatementDetailsListByBnkStmtId.get(keySetVal)){
                    if(mapOfStatementDetailsByGrouping.containsKey(stDetails.Grouping__c)){
                        mapOfStatementDetailsByGrouping.get(stDetails.Grouping__c).add(stDetails);
                    } else {
                        mapOfStatementDetailsByGrouping.put(stDetails.Grouping__c, new List<Statement_Details__c>{stDetails});
                    }
                }
            }
            for(String catkeysetVal : mapOfStatementDetailsByGrouping.keySet()){
                for(Statement_Details__c stDetailrec : mapOfStatementDetailsByGrouping.get(catkeysetVal)){
                    if(mapOfStatementDetailsByCategory.containsKey(stDetailrec.Category__c)){
                        mapOfStatementDetailsByCategory.get(stDetailrec.Category__c).add(stDetailrec);
                    } else {
                        mapOfStatementDetailsByCategory.put(stDetailrec.Category__c, new List<Statement_Details__c>{stDetailrec});
                    }
                }
                mapOfstdetailsListbyCategoryFrps.put(catkeysetVal,mapOfStatementDetailsByCategory);
            }
            
            for(Statement_Details__c stdtls : listOfStatement){
                
            }
            System.debug('####'+mapOfStatementDetailsListByBnkStmtId);
            System.debug('##!!!!##'+mapOfstdetailsListbyCategoryFrps);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}