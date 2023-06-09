public class finStatement {
	@Auraenabled(cacheable=true)
    public static Map<string,list<string>> getstatementDataMap(id BankAccId){


        set<id> finstateIdset = new set<id>();
        
        list<Bank_Statement__c>financialList = [SELECT Id,Name,Bank_Account__c,Bank_Account__r.Name,Application__c,Bank_Account__r.Bank_Account_Name__c,
                                               Bank_Account__r.Bank_Account_Number__c,Total_deposit__c,Avg_Daily_Balance__c
                                               FROM Bank_Statement__c WHERE Bank_Account__c =: BankAccId ORDER BY CreatedDate ASC];
        
        for(Bank_Statement__c finState : financialList){
            
            finstateIdset.add(finState.id);
        }
        
        List<Statement_Details__c>statementDetailList = [SELECT Id,Name,Bank_Statement__c,Input_Amount__c,Level__c 
                                                            FROM Statement_Details__c WHERE Bank_Statement__c IN:finstateIdset ORDER BY Level__c ASC];
        
        Map<string, list<String>> InputAmountMap = new  Map<string,list<String>>();

        for(Bank_Statement__c bankstatement : financialList){
            for(Statement_Details__c statementDetail: statementDetailList){
                String statementName = statementDetail.Name;
                if(InputAmountMap.containsKey(statementName)&& statementDetail.Bank_Statement__c == bankstatement.id){
                    switch on statementName {
                        when 'Deposits(#)', 'Negative Days (#)', 'NSFs (#)', 'Daily Balance (#)'
                        {
                            InputAmountMap.get(statementName).add(Integer.valueof(statementDetail.Input_Amount__c).format()); 
                        }  
                        when else{
                            InputAmountMap.get(statementName).add( '$' +Double.valueof(statementDetail.Input_Amount__c).format()); 
                        }  
                    }

                }else if(!InputAmountMap.containsKey(statementName)&& statementDetail.Bank_Statement__c == bankstatement.id){
                switch on statementName {
                    when 'Deposits(#)', 'Negative Days (#)', 'NSFs (#)', 'Daily Balance (#)'
                    {
                        InputAmountMap.put(statementName, new List<string>{Integer.valueof(statementDetail.Input_Amount__c).format()});
                    }
                    when else{
                        InputAmountMap.put(statementName, new List<string>{'$' + Double.valueof(statementDetail.Input_Amount__c).format()});
                    }
                }
              }  
            }
        }
        return InputAmountMap;
    }
}