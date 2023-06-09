import { api, LightningElement, track, wire } from 'lwc';
import getAllRelatedStipulations from '@salesforce/apex/CustomRelatedListController.getStipulationListByApplicationUnderwritingRecord';
import sendStipCreationEmail from '@salesforce/apex/StipulationRecHelper.sendStipulationViaEmail';
import sendStipFollowupEmail from '@salesforce/apex/StipulationRecHelper.sendStipulationFollowupEmail';
import approveStips from '@salesforce/apex/StipulationRecHelper.approveStipulations';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import STIP_OBJECT from '@salesforce/schema/Stipulations__c';
import NAME_FIELD from '@salesforce/schema/Stipulations__c.Stipulations_Definition__c';
import APP_UN_FIELD from '@salesforce/schema/Stipulations__c.Application_Underwriting__c';
import STATUS_FIELD from '@salesforce/schema/Stipulations__c.Status__c';
import MODULE_FIELD from '@salesforce/schema/Stipulations__c.Module__c';
import CATEGORY_FIELD from '@salesforce/schema/Stipulations__c.Category__c';
import STIPTYPE_FIELD from '@salesforce/schema/Stipulations__c.Stipulation_Type__c';
import COMMENT_FIELD from '@salesforce/schema/Stipulations__c.Comments__c';

const columns = [
    {
        label: 'Stipulation Name', fieldName: 'Stipulation_Name__c'
    },

    { label: 'Category', fieldName: 'Category__c'},

    { label: 'Status', fieldName: 'Status__c'},

    { label: 'Approval', type:  'button', typeAttributes: { 
        label: 'Approve',  name: 'Approve',  variant: 'brand-outline', disabled: { fieldName: 'disablebutton' }
    } 
}
];

export default class CustomRelatedList extends LightningElement {
    @api recordId;
    @track dataList = [];
    @track columns = columns;
    @track showframe = false;
    @track stipid;
    @track stipComment;
    @track showEmailButton = false;
    @track showFollowupEmailButton = false;
    @track disablebutton = true;

    handleRowAction(event){

        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'Followup':
                this.sendFollowupEmailToCustomer(row);
                break;
            case 'Approve':
                this.approveStipulations(row);
                break;
            default:
        }

    }
    sendFollowupEmailToCustomer(){
        this.showframe = true;
    }

    approveStipulations(stip){
        approveStips({
            stipId : stip.Id
        })
        .then(result => {
            if(result !== undefined && result == 'Success') {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Stipulation Approved successfully',
                        variant: 'success',
                    }),
                );
            }else if(result !== undefined && result == 'Failed'){
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'You can not approve this stipulation as document under current stipulation is not yet approved!',
                        variant: 'error',
                    }),
                );
            }
            this.disablebutton = true;
        }).catch(error =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Stipulation Approval Failed',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        })
    }

    connectedCallback(){
        this.getStipulations()
    }

    getStipulations() {
        getAllRelatedStipulations({ 
            recordId : this.recordId
        })
        .then(result => {
            this.dataList = result;
            for(let i = 0;i<this.dataList.length;i++){
                if(this.dataList[i].Status__c == 'New'){
                    this.showEmailButton = true;
                    break;
                }else if(this.dataList[i].Status__c == 'Document Uploaded'){
                    this.showFollowupEmailButton = true;
                    break;
                }
                
            }
        }).catch(error => {
            console.log('Error::'+error);
        });
    }

    handleStipComment(event){
        this.stipComment = event.target.value;
    }
    closeDetails(){
        this.showframe = false;
    }
    sendEmail(){
        console.log('!~~~>'+this.recordId);
        sendStipFollowupEmail({
            recordId : this.recordId,
            comment : this.stipComment
        })
        .then(result => {
            if(result !== undefined) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Followup Email Sent To Customer successfully',
                        variant: 'success',
                    }),
                );
            }
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Email Sent Failed',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });
        //this.showframe = false;
        console.log('$$$$::'+this.stipComment);    
    }
    sendStipCreationEmailToCustomer(){
        sendStipCreationEmail({
            recordId : this.recordId
        })
        .then(result => {
            if(result !== undefined) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Email Sent To Customer successfully',
                        variant: 'success',
                    }),
                );
            }
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Email Send Failed',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });
    }
}