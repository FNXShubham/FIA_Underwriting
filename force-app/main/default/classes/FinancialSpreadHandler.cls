public class FinancialSpreadHandler {
    @Auraenabled
    public static Map<string, List<List<string>>> getstatementDataMap(Id BankAccId, Id Appunderwriting){
        
        set<id> finstateIdset = new set<id>(); 
        list<Bank_Statement__c> financialList = [SELECT Id, Name, Account__c, Application__c,Year__c, Month__c,Month_Year__c,Bank_Account__c,CreatedDate,Name_Date__c
                                                 FROM Bank_Statement__c where  Bank_Account__c =: BankAccId ORDER BY Name_Date__c ASC];
        System.debug('@@@::::'+financialList.size());
        for(Bank_Statement__c finState : financialList){
            
            finstateIdset.add(finState.id);
        }
        
        List<Statement_Details__c> statementDetailList = [SELECT Id, Bank_Statement__c, Bank_Statement__r.Name, Name,Bank_Statement__r.Account__c,Bank_Statement__r.Application__c,Bank_Statement__r.Bank_Account__c FROM Statement_Details__c WHERE Bank_Statement__c ='a4DDn0000013vgXMAQ' ORDER BY Transaction_Date__c ASC];
        System.debug('@@@~~~~~~::::'+statementDetailList.size());
        Map<String, List<List<string>>> InputAmountMap = new Map<String, List<List<string>>>(); 
        List<String> dataList;
        for (Bank_Statement__c financialStatement : financialList) {
            for (Statement_Details__c statementDetail : statementDetailList) {
                dataList = new List<String>();
                if(statementDetail.Bank_Statement__c == financialStatement.Id){
                    
                    String type='Bank_Statement__c';
                    List<String> fieldLabelList = new List<String>();
                    Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
                    Schema.SObjectType leadSchema = schemaMap.get(type);
                    Map<String, Schema.SObjectField> fieldMap = leadSchema.getDescribe().fields.getMap();
                    
                    for (String fieldName: fieldMap.keySet()) {
                        dataList = new List<String>();
                        if(fieldMap.get(fieldName).getDescribe().getLabel() != 'Record ID' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Owner ID' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Deleted' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Name' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Created Date' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Created By ID' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Last Modified Date' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Last Modified By ID' && fieldMap.get(fieldName).getDescribe().getLabel() != 'System Modstamp' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Bank Statement' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Account' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Amount' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Application' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Audit Method' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Avg Daily Balance' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Bank Account' && fieldMap.get(fieldName).getDescribe().getLabel() != 'BSA Category' && fieldMap.get(fieldName).getDescribe().getLabel() != 'BSA Sub Category' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Include in Business Debit/Deposit' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Index Value' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Month' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Month Year' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Name Date' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Statement Date' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Statement Month' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Statement Type' && fieldMap.get(fieldName).getDescribe().getLabel() != 'Year' && fieldMap.get(fieldName).getDescribe().getLabel() != 'LastViewedDate'){
                            //fieldMap.get(fieldName).getDescribe().getLabel() == 'Avg Daily Balance($)' && 
                            if(statementDetail.get(fieldName) != null && statementDetail.get(fieldName) != 'lastvieweddate'){
                                System.debug('!!!!:::'+Double.valueOf(statementDetail.get(fieldName)));
                                String label = fieldMap.get(fieldName).getDescribe().getLabel();
                                if(InputAmountMap.containsKey(label)){
                                    if(Double.valueof(statementDetail.get(fieldName)).format() == null || Double.valueof(statementDetail.get(fieldName)).format() == null){
                                        dataList.add(' ');
                                    }else{
                                        if(Double.valueOf(statementDetail.get(fieldName)) < 0){
                                            System.debug('!@!@!@::'+Double.valueOf(statementDetail.get(fieldName)));
                                            Decimal dec = Double.valueOf(statementDetail.get(fieldName)) * -1;
                                            dataList.add(!label.contains('#') ? '-$' +dec.format() : dec.format());
                                        }else{
                                            dataList.add(!label.contains('#') ? '$' +Double.valueof(statementDetail.get(fieldName)).format() : Double.valueof(statementDetail.get(fieldName)).format());
                                        }
                                    }
                                    dataList.add(statementDetail.Id);
                                    dataList.add(statementDetail.Id+'---'+fieldMap.get(fieldName).getDescribe().getLabel());
                                    dataList.sort();
                                    InputAmountMap.get(label).add(0,dataList);
                                    
                                }else if(!InputAmountMap.containsKey(label)){
                                    if(Double.valueof(statementDetail.get(fieldName)).format() == null || Double.valueof(statementDetail.get(fieldName)).format() == null){
                                        dataList.add(' ');
                                    }else{
                                        if(Double.valueOf(statementDetail.get(fieldName)) < 0){
                                            System.debug('!!!@@@!!!:::'+Double.valueOf(statementDetail.get(fieldName)));
                                            Decimal decs = Double.valueOf(statementDetail.get(fieldName)) * -1;
                                            dataList.add(!label.contains('#') ? '-$' +decs.format() : decs.format());
                                        }else{
                                            dataList.add(!label.contains('#') ? '$' +Double.valueof(statementDetail.get(fieldName)).format() : Double.valueof(statementDetail.get(fieldName)).format());
                                        }
                                    }
                                    dataList.add(statementDetail.Id);
                                    dataList.add(statementDetail.Id+'---'+fieldMap.get(fieldName).getDescribe().getLabel());
                                    dataList.sort();
                                    InputAmountMap.put(label, new List<List<String>>{dataList});
                                    
                                }    
                            }
                            else {
                                String label = fieldMap.get(fieldName).getDescribe().getLabel();
                                if(InputAmountMap.containsKey(label)){
                                    
                                    dataList.add(' ');
                                    dataList.add(statementDetail.Id);
                                    dataList.add(statementDetail.Id+'---'+fieldMap.get(fieldName).getDescribe().getLabel());
                                    dataList.sort();
                                    InputAmountMap.get(label).add(0,dataList);
                                    
                                }else if(!InputAmountMap.containsKey(label)){
                                    
                                    dataList.add(' ');
                                    dataList.add(statementDetail.Id);
                                    dataList.add(statementDetail.Id+'---'+fieldMap.get(fieldName).getDescribe().getLabel());
                                    dataList.sort();
                                    InputAmountMap.put(label, new List<List<String>>{dataList});
                                    
                                }   
                            }
                        }
                    }
                    
                }
            }
            
        }
        System.debug('^^^^'+dataList);
        System.debug('Finshdgh.get keys: ' + InputAmountMap.keySet());
        System.debug('Finshdgh.get' + InputAmountMap);
        return InputAmountMap;  
    }
    
    @Auraenabled
    public static String updateStatementDetails(List<Object> statementUpdate){
        // System.debug('inside method'+statementUpdate);
        // String jsonString = json.serialize(statementUpdate);
        // System.debug('jsonString:::'+jsonString);
        // Map<String, String> valuesMap = new Map<String, String>();
        // Map<Id,String> mapOfFieldLabelByRecordId = new Map<Id,String>();
        // Map<Id,String> mapOfValueByRecordid = new Map<Id,String>();
        // Set<Id> setOfRecordId = new Set<Id>();
        // Map<Id,Statement_Details__c> mapOfBankStatementByIdUpdate = new Map<Id,Statement_Details__c>();
        // List<Statement_Details__c> updatebankStatementDetailsList = new List<Statement_Details__c>();
        // for(Object obj : (List<Object>)JSON.deserializeUntyped(jsonString)){
        //     Map<String, Object> data = (Map<String, Object>)obj;
        //     valuesMap.put(String.valueOf(data.get('statementDetailId')),String.valueOf(data.get('fieldValue')));
        // }
        
        // for(String mapkey : valuesMap.keySet()){
        //     List<String> res = mapkey.split('---');
        //     setOfRecordId.add(res[0]);
        // }
        // List<Statement_Details__c> statementDetailList = [SELECT Id, Bank_Statement__c, Bank_Statement__r.Name, Name ,Bank_Statement__r.Account__c,Bank_Statement__r.Application__c,Bank_Statement__r.Bank_Account__c,Name_Date__c,
        //                                                        Bank_Statement__r.Bank_Account__r.Bank_Name__c,Input_Amount__c
        //                                                        FROM Statement_Details__c WHERE Id =: setOfRecordId ORDER BY Transaction_Date__c DESC]; 
        
        
        // for(Statement_Details__c bStRec : statementDetailList){
        //     for(String mapkey : valuesMap.keySet()){
        //         Decimal val = 0;
        //         String removeChar;
        //         System.debug(':::Key::::'+mapkey+'::valuesMap.get(mapkey)::'+valuesMap.get(mapkey));
        //         if(valuesMap.get(mapkey) == null || valuesMap.get(mapkey) == '' || valuesMap.get(mapkey) == ' '){
        //             system.debug('inside null');
        //             val = null;
        //         }else{
        //             system.debug('inside value');
        //             if(valuesMap.get(mapkey).contains('$'))
        //             {
        //                 removeChar = valuesMap.get(mapkey).remove('$');  
        //             }else{
        //                 removeChar = valuesMap.get(mapkey);  
        //             }
        //             removeChar= removeChar.replaceAll( '\\s+', '');
        //             System.debug('removeChar::'+removeChar);
        //             if(removeChar == null || removeChar == '' || removeChar == ' '){
        //                 val = null;
        //             }else if(removeChar.contains(',')){
        //                 removeChar = removeChar.remove(',');
        //                 val = Decimal.valueOf(removeChar);
        //             }else{
        //                 val = Decimal.valueOf(removeChar);
        //             }
        //         }
                
        //         Statement_Details__c bsStRecord = new Statement_Details__c();
        //         List<String> splitres = mapkey.split('---');
                
        //         if(bStRec.Id == splitres[0] && splitres[1] == 'Beginimg Balance'){
        //             if(mapOfBankStatementByIdUpdate.containsKey(bStRec.Id)){
        //                 mapOfBankStatementByIdUpdate.get(bStRec.Id).Beginimg_Balance__c = val;
        //             }else{
        //                 bsStRecord.Id = bStRec.Id;
        //                 bsStRecord.Beginimg_Balance__c = val;
        //                 mapOfBankStatementByIdUpdate.put(bStRec.Id,bsStRecord);
        //             }
        //         }else if(bStRec.Id == splitres[0] && splitres[1] == 'Ending_Balanace__c'){ 
        //             if(mapOfBankStatementByIdUpdate.containsKey(bStRec.Id)){
        //                 mapOfBankStatementByIdUpdate.get(bStRec.Id).Ending_Balanace__c = val;
        //             }else{
        //                 bsStRecord.Id = bStRec.Id;
        //                 bsStRecord.Ending_Balanace__c = val;
        //                 mapOfBankStatementByIdUpdate.put(bStRec.Id,bsStRecord);
        //             }
        //         }else if(bStRec.Id == splitres[0] && splitres[1] == 'Total Monthly Business Debit'){
        //             if(mapOfBankStatementByIdUpdate.containsKey(bStRec.Id)){
        //                 mapOfBankStatementByIdUpdate.get(bStRec.Id).Total_Monthly_Business_Debit__c = val;
        //             }else{
        //                 bsStRecord.Id = bStRec.Id;
        //                 bsStRecord.Total_Monthly_Business_Debit__c = val;
        //                 mapOfBankStatementByIdUpdate.put(bStRec.Id,bsStRecord);
        //             }
        //         }else if(bStRec.Id == splitres[0] && splitres[1] == 'Total Monthly Business Deposits'){
        //             if(mapOfBankStatementByIdUpdate.containsKey(bStRec.Id)){
        //                 mapOfBankStatementByIdUpdate.get(bStRec.Id).Total_Monthly_Business_Deposits__c = val;
        //             }else{
        //                 bsStRecord.Id = bStRec.Id;
        //                 bsStRecord.Total_Monthly_Business_Deposits__c = val;
        //                 mapOfBankStatementByIdUpdate.put(bStRec.Id,bsStRecord);
        //             }
        //         }else if(bStRec.Id == splitres[0] && splitres[1] == 'Total Monthly Non-Buisness Deposits'){
        //             if(mapOfBankStatementByIdUpdate.containsKey(bStRec.Id)){
        //                 mapOfBankStatementByIdUpdate.get(bStRec.Id).Total_Monthly_Non_Buisness_Deposits__c = val;
        //             }else{
        //                 bsStRecord.Id = bStRec.Id;
        //                 bsStRecord.Total_Monthly_Non_Buisness_Deposits__c = val;
        //                 mapOfBankStatementByIdUpdate.put(bStRec.Id,bsStRecord);
        //             }
        //         }else if(bStRec.Id == splitres[0] && splitres[1] == 'Total Monthly Non-Business Debits'){
        //             if(mapOfBankStatementByIdUpdate.containsKey(bStRec.Id)){
        //                 mapOfBankStatementByIdUpdate.get(bStRec.Id).Total_Monthly_Non_Business_Debits__c = val;
        //             }else{
        //                 bsStRecord.Id = bStRec.Id;
        //                 bsStRecord.Total_Monthly_Non_Business_Debits__c = val;
        //                 mapOfBankStatementByIdUpdate.put(bStRec.Id,bsStRecord);
        //             }
        //         }else if(bStRec.Id == splitres[0] && splitres[1] == 'NSF'){
        //             if(mapOfBankStatementByIdUpdate.containsKey(bStRec.Id)){
        //                 mapOfBankStatementByIdUpdate.get(bStRec.Id).NSF_s__c = val;
        //             }else{
        //                 bsStRecord.Id = bStRec.Id;
        //                 bsStRecord.NSF_s__c = val;
        //                 mapOfBankStatementByIdUpdate.put(bStRec.Id,bsStRecord);
        //             }
        //         }else if(bStRec.Id == splitres[0] && splitres[1] == 'Average Daily Balanace'){
        //             if(mapOfBankStatementByIdUpdate.containsKey(bStRec.Id)){
        //                 mapOfBankStatementByIdUpdate.get(bStRec.Id).Average_Daily_Balanace__c = val;
        //             }else{
        //                 bsStRecord.Id = bStRec.Id;
        //                 bsStRecord.Average_Daily_Balanace__c = val;
        //                 mapOfBankStatementByIdUpdate.put(bStRec.Id,bsStRecord);
        //             }
        //         }
        //         //updatebankStatementDetailsList.add(bsStRecord);
        //     }
        // }
        // UPDATE mapOfBankStatementByIdUpdate.values();
        return 'Records Updated Successfully';
    }
    
    @Auraenabled
    public static List<Bank_Account__c> getAccountOverviewData(Id appId){
        Set<Id> setOfBankAccId = new Set<Id>();
        Set<Id> setOfBankStmtId = new Set<Id>();
        Set<Id> setOfBankAccIdByStmt = new Set<Id>();
        List<Bank_Account__c> bankAccUpdateList = new List<Bank_Account__c>();
        Applications__c appRecord = [SELECT Id,Name,Account__c FROM Applications__c WHERE Id =: appId];
        List<Bank_Account__c> listOfBankAccounts = [SELECT Id,Name,Account__c,Begining_Balance__c,Total_Deposits__c,Average_Other_Deposit__c,Average_Deposit__c,withdrawal__c FROM Bank_Account__c WHERE Account__c =: appRecord.Account__c];
        for(Bank_Account__c bnkrec : listOfBankAccounts){
            setOfBankAccId.add(bnkrec.Id);
        }
        Map<Id,Bank_Statement__c> mapOfBankStatementsById = new Map<Id,Bank_Statement__c>([SELECT Id,Name,Account__c,Application__c,Bank_Account__c,Month__c,Year__c,Month_Year__c,Name_Date__c FROM Bank_Statement__c WHERE Bank_Account__c =: setOfBankAccId]);
        List<Application_Bank_Statement__c> listOfAppBankStmt = [SELECT Id,Name,Application__c,Bank_Statement__c,Include_in_Calculation__c,Index_Value__c,Year_Month__c FROM Application_Bank_Statement__c WHERE Application__c = :appId];
        List<Application_Bank_Statement__c> listOfAppbankStmtToInsert = new List<Application_Bank_Statement__c>();
        Map<Id,Application_Bank_Statement__c> mapOfAppbankStatementsByStmtId = new Map<Id,Application_Bank_Statement__c>();
        if(listOfAppBankStmt.size() > 0){
            for(Application_Bank_Statement__c absrecord : listOfAppBankStmt){
                mapOfAppbankStatementsByStmtId.put(absrecord.Bank_Statement__c,absrecord);
            }
        }else{
            for(Id stkey : mapOfBankStatementsById.keySet()){
                Application_Bank_Statement__c absrecord = new Application_Bank_Statement__c();
                absrecord.Application__c = appId;
                absrecord.Bank_Statement__c = stkey;
                
                listOfAppbankStmtToInsert.add(absrecord);
            }
        }
        if(listOfAppbankStmtToInsert.size() > 0){
           INSERT listOfAppbankStmtToInsert; 
        }
        for(Id bnkstmtkey : mapOfBankStatementsById.keySet()){
            setOfBankStmtId.add(bnkstmtkey);
            setOfBankAccIdByStmt.add(mapOfBankStatementsById.get(bnkstmtkey).Bank_Account__c);
        }
        List<Bank_Account__c> listOfBankAccountsByStmt = [SELECT Id,Name,Account__c,Begining_Balance__c,Total_Deposits__c,Average_Other_Deposit__c,Average_Deposit__c,withdrawal__c FROM Bank_Account__c WHERE Id =: setOfBankAccIdByStmt];
        Map<Id,Bank_statement_detail__c> mapOfBankStatementsDetailsById = new Map<Id,Bank_statement_detail__c>();
        List<Bank_statement_detail__c> listOfBankStmtDetails = [SELECT Id,Name,Bank_Statement__c,Begining_Balance__c,Deposites__c,Revenue_Deposits__c,Other_Deposits__c,Withdrawals__c FROM Bank_statement_detail__c WHERE Bank_Statement__c =: setOfBankStmtId AND Bank_Statement__c != null];
        for(Bank_statement_detail__c stdetail : listOfBankStmtDetails){
            mapOfBankStatementsDetailsById.put(stdetail.Bank_Statement__c,stdetail);
            //setOfBankAccIdByStmt.add(stdetail.);
        }
        System.debug('Bank Accounts::'+listOfBankAccounts);
        System.debug('Bank Statements:::'+mapOfBankStatementsById);
        for(Bank_Account__c bnAccRec : listOfBankAccountsByStmt){
            Bank_Account__c bnkRec = new Bank_Account__c();
            Integer begcount = 0;
            Integer depcount = 0;
            Integer revdepcount = 0;
            Integer othdepcount = 0;
            Integer wthrwlcount = 0;
            Decimal begbal = 0;
            Decimal deposit = 0;
            Decimal revdeposit = 0;
            Decimal otherdeposit = 0;
            Decimal withdrawls = 0;
            //if(!mapOfBankStatementsById.isEmpty()){
                for(Id bnkst : mapOfBankStatementsById.keySet()){
                    if(mapOfAppbankStatementsByStmtId.get(bnkst) != null){
                    	if(mapOfAppbankStatementsByStmtId.get(bnkst).Include_in_Calculation__c && mapOfBankStatementsById.get(bnkst).Bank_Account__c == bnAccRec.Id){
                        if(mapOfBankStatementsDetailsById.get(bnkst).Begining_Balance__c != null){
                            begcount++;
                            begbal += mapOfBankStatementsDetailsById.get(bnkst).Begining_Balance__c; 
                        }
                        if(mapOfBankStatementsDetailsById.get(bnkst).Deposites__c != null){
                            depcount++;
                            deposit += Integer.valueOf(mapOfBankStatementsDetailsById.get(bnkst).Deposites__c);
                        }
                        if(mapOfBankStatementsDetailsById.get(bnkst).Revenue_Deposits__c != null){
                            revdepcount++;
                            revdeposit += mapOfBankStatementsDetailsById.get(bnkst).Revenue_Deposits__c;
                        }
                        if(mapOfBankStatementsDetailsById.get(bnkst).Other_Deposits__c != null){
                            othdepcount++;
                            otherdeposit += mapOfBankStatementsDetailsById.get(bnkst).Other_Deposits__c;
                        }
                        if(mapOfBankStatementsDetailsById.get(bnkst).Withdrawals__c != null){
                            wthrwlcount++;
                            withdrawls += mapOfBankStatementsDetailsById.get(bnkst).Withdrawals__c;
                        }
                        
                    }  
                    }
                }
           // }
            
            /*bnkRec.Id = bnAccRec.Id;
bnkRec.Average_Deposit__c =   bnAccRec.Average_Deposit__c;//deposit/depcount;
bnkRec.Average_Other_Deposit__c = bnAccRec.Average_Other_Deposit__c;//otherdeposit/othdepcount;
bnkRec.Begining_Balance__c = bnAccRec.Begining_Balance__c;//begbal/begcount;
bnkRec.Total_Deposits__c = bnAccRec.Total_Deposits__c;//revdeposit/revdepcount;
bnkRec.withdrawal__c = bnAccRec.withdrawal__c;//withdrawls/wthrwlcount;*/
            System.debug('::Count1::'+depcount+'::Count2::'+othdepcount+'::Count3::'+begcount+'::Count4::'+revdepcount+'Count5::'+wthrwlcount);
            //if(depcount != 0 && othdepcount != 0 && begcount != 0 && revdepcount != 0 && wthrwlcount != 0){
            bnkRec.Id = bnAccRec.Id;
            //System.debug('~~~>'+deposit/depcount);
            //System.debug('!!!!::'+Math.round(deposit/depcount));
            if(depcount != 0){
                bnkRec.Average_Deposit__c =   Math.round(deposit/depcount);
            }else{
                bnkRec.Average_Deposit__c = 0;
            }
            if(othdepcount != 0){
                bnkRec.Average_Other_Deposit__c = otherdeposit/othdepcount;
            }else{
                bnkRec.Average_Other_Deposit__c = 0;
            }
            if(begcount != 0){
                bnkRec.Begining_Balance__c = begbal/begcount;
            }else{
                bnkRec.Begining_Balance__c = 0;
            }
            if(revdepcount != 0){
                bnkRec.Total_Deposits__c = revdeposit/revdepcount;
            }else{
                bnkRec.Total_Deposits__c = 0;
            }
            if(wthrwlcount != 0){
                bnkRec.withdrawal__c = withdrawls/wthrwlcount; 
            }else{
                bnkRec.withdrawal__c = 0;
            }
            // }
            
            bankAccUpdateList.add(bnkRec);
        }
        UPDATE bankAccUpdateList;
        System.debug('!!!~~~~~~>>'+bankAccUpdateList);
        return bankAccUpdateList;
    }
    
}