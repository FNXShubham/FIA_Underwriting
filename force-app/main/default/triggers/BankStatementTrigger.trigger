trigger BankStatementTrigger on Bank_Statement__c (before insert,After insert) {
	
    if(trigger.IsAfter && trigger.Isinsert){
       BankStatementTriggerHandler.createStatementDetails(Trigger.new);     
    }
}