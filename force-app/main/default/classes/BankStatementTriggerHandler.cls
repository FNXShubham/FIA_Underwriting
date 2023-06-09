/**
 * @description: class that create repayment schedule as per terms and loan frequency.
 * @author: Pavan Waghmare, Finexus
 * @date   
 */
public class BankStatementTriggerHandler {
    
    public static void createStatementDetails(List<Bank_Statement__c>lstBankStatement){
        
        List<Statement_Details__c>listToInsertStatementDetails = new List<Statement_Details__c>();
                
        List<Statement_template__c>listOfStatementTemplate = [SELECT Id,Name,Active__c,Level__c from Statement_template__c WHERE Active__c=: True Order by Level__c ASC ];
		
       
        for( Bank_Statement__c bankstatemt : lstBankStatement){
            
            for(Statement_template__c StatemeTmp :listOfStatementTemplate){
                decimal InputAmnt = Math.round(Math.random() * 10000);  
                
                Statement_Details__c statemntdetail = new Statement_Details__c();
                statemntdetail.Bank_Statement__c = bankstatemt.id;    
                statemntdetail.Name = StatemeTmp.Name;           
                statemntdetail.Input_Amount__c = InputAmnt ;
                system.debug('input amount:'+ statemntdetail.Input_Amount__c);
                listToInsertStatementDetails.add(statemntdetail);
                system.debug('added to list');
            }   
        }   
        
        if(!listToInsertStatementDetails.isEmpty()){
            system.debug('listofstatementDetails'+ listToInsertStatementDetails);
            Insert listToInsertStatementDetails;     
        	system.debug('Inserted'); 
        }
                 
    }
    
}