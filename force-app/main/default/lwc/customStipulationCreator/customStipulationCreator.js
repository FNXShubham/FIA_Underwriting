import { LightningElement, api, wire, track} from 'lwc';
import NAME_FIELD from '@salesforce/schema/Stipulations__c.Stipulations_Definition__c';
import APP_UN_FIELD from '@salesforce/schema/Stipulations__c.Application_Underwriting__c';
import STATUS_FIELD from '@salesforce/schema/Stipulations__c.Status__c';
import stipulationRecMethod from '@salesforce/apex/StipulationRecHelper.stipulationRecMethod';
export default class CustomStipulationCreator extends LightningElement {
    @track stipdef = NAME_FIELD;
    @track appunderwriting = APP_UN_FIELD;
    @track status = STATUS_FIELD;


    selectedStipDef;
    selectedAppunderwriting;
    recStipulations = {

        Stipulations_Definition__c : this.selectedStipDef,
        Application_Underwriting__c : this.selectedAppunderwriting,
        //Status__c : this.status,
    }

    handelNamechange(event){
        this.recStipulations.Stipulations_Definition__c = event.target.value;
        //console.log("name",this.recAccount.Name);
    }
    handelPhonechange(event){
        this.recStipulations.Application_Underwriting__c = event.target.value;
       // console.log("phone",this.recAccount.Phone);
    }

    handelRatingchange(event){
        this.recStipulations.Status__c = event.target.value;
       // console.log("email",this.recAccount.Rating);
    }

    handleAccountSelection(event){
        this.selectedStipDef = event.target.value;
    }

    handleAppUnderSelection(event){
        this.selectedAppunderwriting = event.target.value;
    }

    createStipRec() {
        debugger;
        stipulationRecMethod({ stipRec : this.recStipulations })
            .then(result => {
                this.message = result;
                this.error = undefined;
                if(this.message !== undefined) {
                    this.recStipulations.Stipulations_Definition__c = '';
                    this.recStipulations.Application_Underwriting__c = '';
                    //this.recStipulations.Status__c = '';
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Stipulation created',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
    }
}