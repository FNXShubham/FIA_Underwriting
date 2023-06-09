trigger ApplicationUnderwritingTrigger on Application_Underwriting__c (after insert,after update, before insert, before update) {
    if(trigger.isAfter && trigger.isUpdate){
        ApplicationUnderwritingTriggerHandler.assignApprovedApplicationsToFunding(trigger.new);
        ApplicationUnderwritingTriggerHandler.approvalValidationOnStipulation(trigger.new,trigger.old);
    }
}