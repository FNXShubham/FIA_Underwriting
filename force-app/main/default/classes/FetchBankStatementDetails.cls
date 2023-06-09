public with sharing class FetchBankStatementDetails {
    @AuraEnabled(cacheable=true)
    public static Map<String,List<Statement_Details__c>> getBankStatements(Id recordId){
        System.debug('####'+recordId);
        Map<String,List<Statement_Details__c>> mapOfStatementDetailsByDateCategory = new Map<String,List<Statement_Details__c>>();
        Map<Date,List<Statement_Details__c>> mapOfStatementDetailsByTxnDate = new Map<Date,List<Statement_Details__c>>();
        Map<String,List<Statement_Details__c>> mapOfStatementDetailsByCategory = new Map<String,List<Statement_Details__c>>();
        List<Statement_Details__c> listOfStatementDetails = new List<Statement_Details__c>();
        List<Statement_Details__c> bankstatemenmtdetailsList = [SELECT Id,Name,Bank_Statement__c,Include_in_Business_Debits_Deposits__c,Category__c,Include_in_Business_Debit_Deposit__c,Input_Amount__c,Sub_Category__c,Transaction_Date__c,Transaction_Name__c,Grouping__c FROM Statement_Details__c WHERE Bank_Statement__c =: recordId ORDER BY Transaction_Date__c ASC];
        System.debug('Statement Details::'+bankstatemenmtdetailsList);
        for(Statement_Details__c stdt : bankstatemenmtdetailsList){
            mapOfStatementDetailsByTxnDate.put(stdt.Transaction_Date__c,bankstatemenmtdetailsList);
            System.debug(':::'+mapOfStatementDetailsByTxnDate);
            String customKey = String.valueOf(stdt.Transaction_Date__c)+'_'+stdt.Category__c+'_'+stdt.Grouping__c;
            if(mapOfStatementDetailsByDateCategory.containsKey(customKey)){
                mapOfStatementDetailsByDateCategory.get(customKey).add(stdt);
            } else {
                mapOfStatementDetailsByDateCategory.put(customKey, new List<Statement_Details__c>{stdt});
            }
        }
        system.debug('@@@@@@@@'+mapOfStatementDetailsByDateCategory);
        return mapOfStatementDetailsByDateCategory;
    }

    @AuraEnabled
    public static List<Statement_Details__c> getCalculatedValues(Id recordId){
        try {
            List<Statement_Details__c> bankstatemenmtdetailsList = [SELECT Id,Name,Bank_Statement__c,Include_in_Business_Debits_Deposits__c,Category__c,Include_in_Business_Debit_Deposit__c,Input_Amount__c,Sub_Category__c,Grouping__c,Transaction_Date__c,Transaction_Name__c FROM Statement_Details__c WHERE Bank_Statement__c =: recordId ORDER BY Transaction_Date__c ASC];
            return bankstatemenmtdetailsList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String,List<Statement_Details__c>> getFilteredBankStatements(Id recordId, String searchkey){
        Map<String,List<Statement_Details__c>> mapOfStatementDetailsByDateCategory = new Map<String,List<Statement_Details__c>>();
        Map<Date,List<Statement_Details__c>> mapOfStatementDetailsByTxnDate = new Map<Date,List<Statement_Details__c>>();
        Map<String,List<Statement_Details__c>> mapOfStatementDetailsByCategory = new Map<String,List<Statement_Details__c>>();
        List<Statement_Details__c> listOfStatementDetails = new List<Statement_Details__c>();
        List<Statement_Details__c> bankstatemenmtdetailsList = [SELECT Id,Name,Bank_Statement__c,Include_in_Business_Debits_Deposits__c,Category__c,Include_in_Business_Debit_Deposit__c,Input_Amount__c,Sub_Category__c,Transaction_Date__c,Transaction_Name__c,Grouping__c FROM Statement_Details__c WHERE Bank_Statement__c =: recordId  AND Transaction_Name__c like : searchkey+'%' ORDER BY Transaction_Date__c ASC];
        for(Statement_Details__c stdt : bankstatemenmtdetailsList){
            mapOfStatementDetailsByTxnDate.put(stdt.Transaction_Date__c,bankstatemenmtdetailsList);
            System.debug(':::'+mapOfStatementDetailsByTxnDate);
            String customKey = String.valueOf(stdt.Transaction_Date__c)+'_'+stdt.Category__c+'_'+stdt.Grouping__c;
            if(mapOfStatementDetailsByDateCategory.containsKey(customKey)){
                mapOfStatementDetailsByDateCategory.get(customKey).add(stdt);
            } else {
                mapOfStatementDetailsByDateCategory.put(customKey, new List<Statement_Details__c>{stdt});
            }
        }
        system.debug('@@@@@@@@'+mapOfStatementDetailsByDateCategory);
        return mapOfStatementDetailsByDateCategory;
    }

    @AuraEnabled
    public static Map<String,List<Statement_Details__c>> getAllFilteredBankStatements(Id recordId, String searchkey, List<String> groups, List<String> category, List<String> subcategory, Date strtDate, Date endDate){
        
        Map<String,List<Statement_Details__c>> mapOfStatementDetailsByDateCategory = new Map<String,List<Statement_Details__c>>();
        Map<Date,List<Statement_Details__c>> mapOfStatementDetailsByTxnDate = new Map<Date,List<Statement_Details__c>>();
        Map<String,List<Statement_Details__c>> mapOfStatementDetailsByCategory = new Map<String,List<Statement_Details__c>>();
        List<Statement_Details__c> listOfStatementDetails = new List<Statement_Details__c>();
        List<Statement_Details__c> bankstatemenmtdetailsList = new List<Statement_Details__c>();
        if(recordId != null && searchkey != null && groups != null && category != null && subcategory != null){
            bankstatemenmtdetailsList = [SELECT Id,Name,Bank_Statement__c,Include_in_Business_Debits_Deposits__c,Category__c,Include_in_Business_Debit_Deposit__c,Input_Amount__c,Sub_Category__c,Transaction_Date__c,Transaction_Name__c,Grouping__c FROM Statement_Details__c WHERE Bank_Statement__c =: recordId  AND Transaction_Name__c like : searchkey+'%' AND Grouping__c =: groups AND Category__c =: category AND Sub_Category__c =: subcategory ORDER BY Transaction_Date__c ASC];
        }else if(recordId != null && searchkey == null && groups != null && category != null && subcategory != null){
            bankstatemenmtdetailsList = [SELECT Id,Name,Bank_Statement__c,Include_in_Business_Debits_Deposits__c,Category__c,Include_in_Business_Debit_Deposit__c,Input_Amount__c,Sub_Category__c,Transaction_Date__c,Transaction_Name__c,Grouping__c FROM Statement_Details__c WHERE Bank_Statement__c =: recordId  AND Grouping__c =: groups AND Category__c =: category AND Sub_Category__c =: subcategory ORDER BY Transaction_Date__c ASC];
        }else if(recordId != null && searchkey == null && groups == null && category != null && subcategory != null){

        }
        System.debug('!!!!@@@@'+bankstatemenmtdetailsList);
        for(Statement_Details__c stdt : bankstatemenmtdetailsList){
            mapOfStatementDetailsByTxnDate.put(stdt.Transaction_Date__c,bankstatemenmtdetailsList);
            System.debug(':::'+mapOfStatementDetailsByTxnDate);
            String customKey = String.valueOf(stdt.Transaction_Date__c)+'_'+stdt.Category__c+'_'+stdt.Grouping__c;
            if(mapOfStatementDetailsByDateCategory.containsKey(customKey)){
                mapOfStatementDetailsByDateCategory.get(customKey).add(stdt);
            } else {
                mapOfStatementDetailsByDateCategory.put(customKey, new List<Statement_Details__c>{stdt});
            }
        }
        system.debug('@@@@@@@@'+mapOfStatementDetailsByDateCategory);
        return mapOfStatementDetailsByDateCategory;
    }

    @AuraEnabled
    public static List<String> getAllCategoriesList(Id recordId){
        List<String> listOfStatementDetailsCategory = new List<String>();
        List<Statement_Details__c> bankstatemenmtdetailsList = [SELECT Id,Name,Bank_Statement__c,Include_in_Business_Debits_Deposits__c,Category__c,Include_in_Business_Debit_Deposit__c,Input_Amount__c,Sub_Category__c,Transaction_Date__c,Transaction_Name__c,Grouping__c FROM Statement_Details__c WHERE Bank_Statement__c =: recordId ORDER BY Transaction_Date__c ASC];
        for(Statement_Details__c stdt : bankstatemenmtdetailsList){
            if(!listOfStatementDetailsCategory.contains(stdt.Category__c)){
                listOfStatementDetailsCategory.add(stdt.Category__c);
            }
        }
        system.debug('@@@@@@@@'+listOfStatementDetailsCategory);
        return listOfStatementDetailsCategory;
    }

    @AuraEnabled
    public static List<String> getAllSubCategoriesList(Id recordId){
        List<String> listOfStatementDetailsCategory = new List<String>();
        List<Statement_Details__c> bankstatemenmtdetailsList = [SELECT Id,Name,Bank_Statement__c,Include_in_Business_Debits_Deposits__c,Category__c,Include_in_Business_Debit_Deposit__c,Input_Amount__c,Sub_Category__c,Transaction_Date__c,Transaction_Name__c,Grouping__c FROM Statement_Details__c WHERE Bank_Statement__c =: recordId ORDER BY Transaction_Date__c ASC];
        for(Statement_Details__c stdt : bankstatemenmtdetailsList){
            if(!listOfStatementDetailsCategory.contains(stdt.Sub_Category__c)){
                listOfStatementDetailsCategory.add(stdt.Sub_Category__c);
            }
        }
        system.debug('@@@@@@@@'+listOfStatementDetailsCategory);
        return listOfStatementDetailsCategory;
    }

    @AuraEnabled(cacheable=true)
    public Static List<Bank_Statement__c> getBankAccounts(Id recordId) {

        List<Bank_Statement__c> bankStatementDataData = [SELECT Id, Name, Bank_Account__c, Account__c FROM Bank_Statement__c WHERE Bank_Account__c =: recordId];
        return bankStatementDataData;
    }

    @AuraEnabled
    public static List<String> getStatements(Id bankId){
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

    @AuraEnabled(cacheable=true)
    public Static List<String> getBankStatementId(Id bankId) {                                     
        try{
            List<String> statementName = new List<String>();
            List<Bank_Statement__c> bankStatementDataData = [SELECT Id, Name, Bank_Account__c, Account__c FROM Bank_Statement__c WHERE Id =: bankId];
            for(Bank_Statement__c bst : bankStatementDataData){
                statementName.add(bst.Name);
            }
            return statementName;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String updateBusinessStatements(List<object> mapOfBusinessTxnById){
        try {
            System.debug('mapOfBusinessTxnById::'+mapOfBusinessTxnById);
            Map<String, Boolean> mapOfBusinessValueByStId = new Map<String, Boolean>();
            List<Statement_Details__c> bankstatemenmtdetailsList = new List<Statement_Details__c>();
            for(object obj : mapOfBusinessTxnById){
                Map<Object,Object> val = (Map<Object,Object>)obj;
                mapOfBusinessValueByStId.put((String)val.get('id'),(Boolean)val.get('value'));
            }
            System.debug('mapOfBusinessValueByStId::'+mapOfBusinessValueByStId);
            for(String stId : mapOfBusinessValueByStId.keySet()){
                Statement_Details__c stDetails = new Statement_Details__c();
                stDetails.Id = stId;
                stDetails.Include_in_Business_Debits_Deposits__c = mapOfBusinessValueByStId.get(stId);

                bankstatemenmtdetailsList.add(stDetails);
            }
            UPDATE bankstatemenmtdetailsList;
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}