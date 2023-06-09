/**
 * @description: class that create repayment schedule as per terms and loan frequency.
 * @author: Pavan Waghmare, Finexus
 * @date   
 */
public with sharing class BankStatementHelper {
    
    @AuraEnabled(cacheable=true)
    public static DataTableResponse GetWrapperOfFinancialStatments(Id BankAccId){
        
        integer countQry=0;
        integer datanum =0;
        List<DataTableColumns> lstDataColumns            = new List<DataTableColumns>();
        List<DataTableColumns> lstfiDataColumns          = new List<DataTableColumns>();
        List<SObject> lstDataTableData                   = new List<SObject>();
        List<string> columnList                          = new List<string>();
        List<string> fieldAPINameList                    = new List<string>();
        Set<String> monthlists                           = new set<string>();
        list<string> querymnthList = new list<String>();
        set<id> finstateIdset = new set<id>();
        
        list<Bank_Statement__c> financialList = [SELECT Id,Name,Bank_Account__c,Bank_Account__r.Name,Application__c,Bank_Account__r.Bank_Account_Name__c,
                                               	 Bank_Account__r.Bank_Account_Number__c,Total_deposit__c,Avg_Daily_Balance__c
                                               	 FROM Bank_Statement__c WHERE  Bank_Account__c =: BankAccId ORDER BY CreatedDate ASC];
        
        for(Bank_Statement__c finState : financialList){
            querymnthList.add(finState.Name);
            finstateIdset.add(finState.id);
        }
        System.debug('querymnthList>>>'+ querymnthList);
        
        system.debug('financialList>>>'+ financialList);
        
        system.debug('TableComponentMetadata111>>>'+ finstateIdset);
        
        
        List<Statement_Details__c>TableComponentMetadata = [SELECT Id,Name,Bank_Statement__c,Input_Amount__c,Level__c 
                                                            FROM Statement_Details__c WHERE Bank_Statement__c IN:finstateIdset];
        
        system.debug('TableComponentMetadata>>>'+ TableComponentMetadata);
        String monthName = 'January';
        String APINameString = 'Input_Amount__c:currency';
        
        list<string> statementNames = new list<string>();
		
        Map<string,list<Statement_Details__c>> FinstatementMap = new Map<String, list<Statement_Details__c>>();
        Map<string,list<Decimal>> InputAmountMap = new  Map<string,list<Decimal>>();
        
        list<decimal> inputamt  = new list<decimal>();
        list<Statement_Details__c> statementList = new list<Statement_Details__c>();
        
        list<Statement_Details__c> statementListfinal = new list<Statement_Details__c>();
        
        for(Bank_Statement__c finState : financialList ){
            String monthNameForFin = finState.Name;
            monthlists.add(finState.Name);
            system.debug('finState>>>>'+finState.Name);
            for(Statement_Details__c stmntdtl: TableComponentMetadata){
                inputamt.add(stmntdtl.Input_Amount__c);
                statementNames.add(stmntdtl.Name);
                statementList.add(stmntdtl);
            }
            system.debug('finState>>>>'+monthNameForFin);
            FinstatementMap.put(monthNameForFin,statementList);
            System.debug('FinstatementMap>>>>>'+ FinstatementMap) ;
        }
        
        if(monthlists.size() > 0)
        {
            
            columnList.addAll(monthlists);
        }
        if(APINameString != null)
        {
            fieldAPINameList = APINameString.split(',');
        }
        
        for(integer i = 0; i < columnList.size(); i++){
            DataTableColumns datacolumns = new DataTableColumns(columnList[i].trim(),'Input_Amount__c','currency',true);
            lstfiDataColumns.add(datacolumns);
            lstDataColumns.add(datacolumns);
        }
        
        list<string> qrystrn = new list<string>();
        for(string st :    querymnthList){
            
            String queryString = 'SELECT Name,Input_Amount__c FROM Statement_Details__c WHERE Bank_Statement__r.Name = \''+st+'\' AND Bank_Statement__r.Bank_Account__c = \''+BankAccId+'\' Order By Level__c ASC';
            qrystrn.add(queryString);
        }
        
        DataTableResponse finalWrapper1   = new DataTableResponse();
        for(string st1 : qrystrn ){
            for(SObject SObjectItem : Database.query(st1))
            {
                lstDataTableData.add(SObjectItem);
                
            }
            System.debug('Listofdatatable>>>>>>'+ lstDataTableData);
            System.debug('Listofdatatable>>>>>>'+ st1);
            countQry++;
        }
        DataTableResponse finalWrapper   = new DataTableResponse();
        finalWrapper.TableTitle          = 'Statement Details';
        finalWrapper.lstfinDataColumns = lstfiDataColumns;
        finalWrapper.lstDataTableColumns = lstDataColumns;
        finalWrapper.lstDataTableData = lstDataTableData;
        
        System.debug('finalWrapper>>>>>'+ finalWrapper.lstDataTableColumns);
        System.debug('finalWrapper33333>>>>>'+ finalWrapper.lstDataTableData);
        return finalWrapper;
         
    }
    
     public class DataTableColumns {
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled
        public Boolean editable {get;set;}
        @AuraEnabled       
        public String fieldName {get;set;}
        @AuraEnabled
        public String type {get;set;}
        
        public DataTableColumns(String label, String fieldName, String type, boolean editable)
        {
            this.label     = label;
            this.fieldName = fieldName;
            this.type      = type;  
            this.editable  = editable;
            
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
        Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordid];
        Applications__c appRecord = [select id, Account__c, Account__r.Email__c from Applications__C where Id =: appUnderwritingRecord.Application__c];                               
        
        accId = appRecord.Account__c;
        return accId;
        
    }
    
     //get bank accounts
    @AuraEnabled(cacheable=true)
    public static list<Bank_Account__c> getBankAccounts(Id recordid){
        //string accId = '';
        Application_Underwriting__c appUnderwritingRecord = [SELECT Id,Stages__c,Application__c,RecordTypeId,RecordType.Name FROM Application_Underwriting__c WHERE Id =: recordid];
        Applications__c appRecord = [select id, Account__c, Account__r.Email__c from Applications__C where Id =: appUnderwritingRecord.Application__c];                               
        
        list<Bank_Account__c> bankData=[SELECT Id, Name, Bank_Account_Name__c, Account__c 
                                                  FROM Bank_Account__c WHERE Account__c =: appRecord.Account__c];
        
        return bankData;  
    }  
    
    // @AuraEnabled
    // public static list<Statement_Details__c> updateStatements(List<Statement_Details__c> statementId){
    //     system.debug('Values'+statementId);
    //     list<Statement_Details__c> updatedStatements = new list<Statement_Details__c>();
        
        
    //     for(Statement_Details__c sd : statementId){
    //         Statement_Details__c csd = new Statement_Details__c();
    //         csd.Id = sd.Id;
    //         csd.Input_Amount__c = sd.Input_Amount__c;
    //         updatedStatements.add(csd);
    //         system.debug('SIZE of CSD'+updatedStatements);
    //     }
        
    //     update updatedStatements;    
        
    //     return updatedStatements;
    // }  
}