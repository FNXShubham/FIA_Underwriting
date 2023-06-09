public with sharing class BankStatementHandler {
    @AuraEnabled(cacheable=true)
    public static List<Bank_Statement__c> getFinancialStatementList(String accountID,String appID) {
        return [SELECT Id, Name, Account__c, Application__c,Year__c, Month__c,Month_Year__c,Bank_Account__c,Name_Date__c
                FROM Bank_Statement__c ORDER BY Name_Date__c DESC];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Bank_Statement_Detail__c> getFinanceDetails(String accountID,String appID) {
        return [SELECT Id, Bank_Statement__r.Name, Name ,Bank_Statement__r.Account__c,Bank_Statement__r.Application__c,Bank_Statement__r.Bank_Account__c,
                Bank_Statement__r.Bank_Account__r.Bank_Name__c,Begining_Balance__c,Name_Date__c
                FROM Bank_Statement_Detail__c WHERE Bank_Statement__r.Account__c =: accountID AND Bank_Statement__r.Application__c =: appID ORDER BY Name_Date__c DESC];
    }
    
    @AuraEnabled
    public static string setIncludeInCalculation(String finStatementId, Boolean value, Integer indexValue, Id appId) {
        System.debug('!!!!'+IndexValue);
        Application_Bank_Statement__c appbankstmt = new Application_Bank_Statement__c();
        System.debug('!!@@!!'+finStatementId+'!#@!#@'+appId);
        List<Application_Bank_Statement__c> bankstatementbyapp = [SELECT Id,Name,Application__c,Bank_Statement__c,Include_in_Calculation__c,Index_Value__c,Year_Month__c FROM Application_Bank_Statement__c WHERE Bank_Statement__c = :finStatementId AND Application__c = :appId];
        Bank_Statement__c finStatement = [Select id, name, Name_Date__c,Index_Value__c from Bank_Statement__c where id = :finStatementId ORDER BY Name_Date__c DESC];
        if(bankstatementbyapp.size() > 0){
            bankstatementbyapp[0].Include_in_Calculation__c = value;
            bankstatementbyapp[0].Index_Value__c = indexValue;
        }else{
            appbankstmt.Application__c = appId;
            appbankstmt.Bank_Statement__c = finStatementId;
            appbankstmt.Include_in_Calculation__c = value;
            appbankstmt.Index_Value__c = indexValue;
        }
        if(appbankstmt != null){
            INSERT appbankstmt;  
        }
        if(bankstatementbyapp.size() > 0){
            UPDATE bankstatementbyapp;
        }
        
        return finStatement.Id;
    }
    
    
    @AuraEnabled
    public static DataTableResponse GetWrapperOfFinancialStatments(Id BankAccId, Id ApplicationUnderId){
        integer countQry=0;
        integer datanum =0;
        List<DataTableColumns> lstDataColumns            = new List<DataTableColumns>();
        List<DataTableColumns> lstfiDataColumns        = new List<DataTableColumns>();
        List<SObject> lstDataTableData                   = new List<SObject>();
        List<List<String>> columnList                          = new List<List<String>>();
        List<string> fieldAPINameList                    = new List<string>();
        Set<List<String>> monthlists                           = new set<List<string>>();
        list<string> querymnthList = new list<String>();
        
        set<id> finstateIdset = new set<id>();
        Application_Underwriting__c appunderRec = [SELECT Id,Name,Application__c FROM Application_Underwriting__c WHERE Id =: ApplicationUnderId];
        Applications__c appRecord = [SELECT Id, Account__c
                                                  FROM Applications__c WHERE Id =: appunderRec.Application__c];
        
        list<Bank_Statement__c> financialList = [SELECT Id, Name, Account__c, Application__c,Year__c, Month__c,Month_Year__c,Statement_Date__c,Bank_Account__c,Name_Date__c,Index_Value__c
                                                 FROM Bank_Statement__c WHERE  Bank_Account__c =: BankAccId ORDER BY Statement_Date__c DESC]; //and Application__c = :ApplicationId
        
        
        for(Bank_Statement__c finState : financialList){
            finstateIdset.add(finState.id);
        }
        
        List<Statement_Details__c> TableComponentMetadata = [SELECT Id, Bank_Statement__c, Bank_Statement__r.Name, Name ,Bank_Statement__r.Account__c,Bank_Statement__r.Bank_Account__c,Transaction_Date__c,
                                                                  Bank_Statement__r.Bank_Account__r.Bank_Name__c,Input_Amount__c
                                                                  FROM Statement_Details__c WHERE Bank_Statement__c IN :finstateIdset ORDER BY Transaction_Date__c DESC];
        
        List<Application_Bank_Statement__c> bankstatementbyapp = [SELECT Id,Name,Application__c,Bank_Statement__c,Include_in_Calculation__c,Index_Value__c,Year_Month__c,Name_Date__c FROM Application_Bank_Statement__c WHERE Bank_Statement__c = :finstateIdset AND Application__c = :appRecord.Id ORDER BY Name_Date__c DESC];
        Map<Id,Application_Bank_Statement__c> mapOfBankStatementsByUniqueId = new Map<Id,Application_Bank_Statement__c>();
        
        if(bankstatementbyapp.size() > 0){
            for(Application_Bank_Statement__c appbnkstmtrec : bankstatementbyapp){
                querymnthList.add(appbnkstmtrec.Year_Month__c);
                mapOfBankStatementsByUniqueId.put(appbnkstmtrec.Bank_Statement__c,appbnkstmtrec);
            }
        }else{
            for(Bank_Statement__c finState : financialList){
                querymnthList.add(finState.Month_Year__c);
            }
        }
        
        List<Application_Bank_Statement__c> listToInsertAbs = new List<Application_Bank_Statement__c>();
        for(Bank_Statement__c bnk : financialList){
            Application_Bank_Statement__c abs = new Application_Bank_Statement__c();
            if(!mapOfBankStatementsByUniqueId.containsKey(bnk.Id)){
                abs.Application__c = appRecord.Id;
                abs.Bank_Statement__c = bnk.Id;
                
            }
            listToInsertAbs.add(abs);
        }
        if(listToInsertAbs.size() > 0){
            INSERT listToInsertAbs;
        }
        
        for(Application_Bank_Statement__c absrecord : listToInsertAbs){
            mapOfBankStatementsByUniqueId.put(absrecord.Bank_Statement__c,absrecord);
        }
        String monthName = 'June';
        String APINameString = 'Begining_Balance__c:currency';
        
        list<string> statementNames = new list<string>();
        
        Map<string,list<Statement_Details__c>> FinstatementMap = new Map<String, list<Statement_Details__c>>();
        Map<string,list<Decimal>> InputAmountMap = new  Map<string,list<Decimal>>();
        
        list<Decimal> inputamt  = new list<Decimal>();
        list<Statement_Details__c> statementList = new list<Statement_Details__c>();
        
        list<Statement_Details__c> statementListfinal = new list<Statement_Details__c>();
        
        List<string> temp;
        System.debug('!!!!!!!!!!!~~~~>'+bankstatementbyapp);
        for(Bank_Statement__c finState : financialList){
            temp = new List<string>();
            
            if(bankstatementbyapp.size() > 0){
                
                System.debug('inside if for bank statements');
                String monthNameForFin = finState.Month_Year__c;
                temp.add(finState.Id);
                temp.add(finState.Month_Year__c);
                if(mapOfBankStatementsByUniqueId.get(finState.Id).Include_in_Calculation__c == null){
                    temp.add('false');
                }else{
                    temp.add(String.valueOf(mapOfBankStatementsByUniqueId.get(finState.Id).Include_in_Calculation__c));
                }
                
                if(mapOfBankStatementsByUniqueId.get(finState.Id).Index_Value__c != null){
                    temp.add(String.valueOf(mapOfBankStatementsByUniqueId.get(finState.Id).Index_Value__c));
                }else{
                    temp.add(String.valueOf(''));
                }
                monthlists.add(temp);
                
                system.debug('finState>>>>'+finState.Month_Year__c);
                
                for(Statement_Details__c stmntdtl: TableComponentMetadata){
                    inputamt.add(stmntdtl.Input_Amount__c);
                    statementNames.add(stmntdtl.Name);
                    statementList.add(stmntdtl);
                }
                FinstatementMap.put(monthNameForFin,statementList);
            }
        }
        
        if(monthlists.size() > 0)
        {
            
            columnList.addAll(monthlists); 
        }
        
        if(APINameString != null)
        {
            fieldAPINameList = APINameString.split(',');
        }
        
        for(integer i = 0; i < columnList.size(); i++)
        {
            
            if(columnList[i][3] == null || columnList[i][3] == ' ' || columnList[i][3] == ''){
                DataTableColumns datacolumns = new DataTableColumns(columnList[i][0], columnList[i][1].trim(),'Year_Month__c','text',true, Boolean.valueOf(columnList[i][2]), 0);
                lstfiDataColumns.add(datacolumns);
                lstDataColumns.add(datacolumns);
            }else{
                DataTableColumns datacolumns = new DataTableColumns(columnList[i][0], columnList[i][1].trim(),'Year_Month__c','text',true, Boolean.valueOf(columnList[i][2]), Integer.valueOf(columnList[i][3]));
                lstfiDataColumns.add(datacolumns);
                lstDataColumns.add(datacolumns);
            }
        }
        list<string> qrystrn = new list<string>();
        for(string st :    querymnthList){
            
            String queryString = 'SELECT Id,Bank_Statement__c, Bank_Statement__r.Name, Name ,Bank_Statement__r.Account__c,Bank_Statement__r.Application__c,Bank_Statement__r.Bank_Account__c,Bank_Statement__r.Bank_Account__r.Bank_Name__c,Input_Amount__c,Transaction_Date__c FROM Statement_Details__c WHERE Bank_Statement__r.Name = \''+st+'\' AND Bank_Statement__r.Bank_Account__c = \''+BankAccId+'\' ORDER BY Transaction_Date__c ASC';
            qrystrn.add(queryString);
        }
        
        DataTableResponse finalWrapper1   = new DataTableResponse();
        for(string st1 : qrystrn ){
            for(SObject SObjectItem : Database.query(st1))
            {
                lstDataTableData.add(SObjectItem);  
            }
            countQry++;
        }
        DataTableResponse finalWrapper   = new DataTableResponse();
        finalWrapper.TableTitle          = 'Statement Details';
        finalWrapper.lstfinDataColumns = lstfiDataColumns;
        finalWrapper.lstDataTableColumns = lstDataColumns;
        finalWrapper.lstDataTableData = lstDataTableData;
        
        return finalWrapper;
        
    }
    
    public class DataTableColumns {
        @AuraEnabled
        public String recId;
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled
        public Boolean value {get;set;}
        @AuraEnabled
        public Boolean editable {get;set;}
        @AuraEnabled       
        public String fieldName {get;set;}
        @AuraEnabled
        public String type {get;set;}
        @AuraEnabled
        public Integer index {get;set;}
        
        public DataTableColumns(String recId, String label, String fieldName, String type, boolean editable, Boolean value, Integer index)
        {
            this.recId 	   = recId;
            this.label     = label;
            this.fieldName = fieldName;
            this.type      = type;  
            this.editable  = editable;
            this.value = value;
            this.index = index;
            
        }
    }
    
    public class DataTableResponse {
        @AuraEnabled
        public List<DataTableColumns> lstDataTableColumns {get;set;}
        @AuraEnabled
        public List<DataTableColumns> lstfinDataColumns {get;set;}
        @AuraEnabled
        public List<sObject> lstDataTableData {get;set;}
        @AuraEnabled
        public String TableTitle {get;set;}       
    }
    @AuraEnabled(cacheable=true)
    public static string getAccounts(Id recordId){
        string accId = '';
        Application_Underwriting__c appunderRec = [SELECT Id,Name,Application__c FROM Application_Underwriting__c WHERE Id =: recordId];
        Applications__c appRecord = [SELECT Id, Account__c
                                                  FROM Applications__c WHERE Id =: appunderRec.Application__c];                                   
        accId = appRecord.Account__c;
        
        return accId;
        
    }
    
    
    @AuraEnabled(cacheable=true)
    public static list<Bank_Account__c> getBankAccounts(Id recordId){
        string accId = '';
        Application_Underwriting__c appunderRec = [SELECT Id,Name,Application__c FROM Application_Underwriting__c WHERE Id =: recordId];
        Applications__c appRecord = [SELECT Id, Account__c
                                                  FROM Applications__c WHERE Id =: appunderRec.Application__c];                                   
        
        list<Bank_Account__c> bankData=[SELECT Id, Name, Bank_Account_Name__c, Account__c 
                                                  FROM Bank_Account__c WHERE Account__c =: appRecord.Account__c];
        
        return bankData;
        
    }
    
    @AuraEnabled
    public static list<Statement_Details__c> updateStatements(List<Statement_Details__c> statementId){
        system.debug('Values'+statementId);
        list<Statement_Details__c> updatedStatements = new list<Statement_Details__c>();
        
        if(statementId.size()>0){
            
            
            for(Statement_Details__c sd : statementId){
                Statement_Details__c csd = new Statement_Details__c();
                csd.Id = sd.Id;
                csd.Input_Amount__c = sd.Input_Amount__c;
                updatedStatements.add(csd);
                system.debug('SIZE of CSD'+updatedStatements);
            }
            
            update updatedStatements;
        }
        return updatedStatements;
    }  

    @AuraEnabled(cacheable=true)
    public static String getbnkAccounts(Id BnkId){
        string accId = '';
        
        list<Bank_Account__c> bankData=[SELECT Id, Name, Bank_Account_Name__c, Account__c, Primary__c 
                                                  FROM Bank_Account__c WHERE Id =: BnkId Limit 1];
        for(Bank_Account__c bankIsPrimary : bankData){
            if(bankIsPrimary.Primary__c == true){
                accId = 'Primary';
            }
            
        }
        return accId;
        
    }
}