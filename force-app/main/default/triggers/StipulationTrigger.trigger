trigger StipulationTrigger on Stipulations__c (before insert,after insert,before update, after update) {
    // if(trigger.isAfter && trigger.isInsert){
    //     StipulationRecHelper.sendStipulationViaEmail(trigger.new);
    // }
    if(trigger.isAfter && trigger.isUpdate){
        StipulationRecHelper.updateOpenStip(trigger.newMap,trigger.oldMap);
    }
}