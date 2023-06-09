/* eslint-disable no-console */
// Import LightningElement and api classes from lwc module
import { LightningElement, api, wire, track } from 'lwc';
// import getPicklistValues method from lightning/uiObjectInfoApi
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
// import getObjectInfo method from lightning/uiObjectInfoApi
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
// Import lead object APi from schema
import LEAD_OBJECT from '@salesforce/schema/Application_Underwriting__c';
// import Lead status field from schema
import PICKLIST_FIELD from '@salesforce/schema/Application_Underwriting__c.Stages__c';
import RECORDTYPEID from '@salesforce/schema/Application_Underwriting__c.recordTypeId';
// import record ui service to use crud services
import { getRecord } from 'lightning/uiRecordApi';
// import show toast
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import update record api
import { updateRecord } from 'lightning/uiRecordApi';
import STIP_OBJECT from '@salesforce/schema/Stipulations__c';
import NAME_FIELD from '@salesforce/schema/Stipulations__c.Stipulations_Definition__c';
import APP_UN_FIELD from '@salesforce/schema/Stipulations__c.Application_Underwriting__c';
import STATUS_FIELD from '@salesforce/schema/Stipulations__c.Status__c';
import MODULE_FIELD from '@salesforce/schema/Stipulations__c.Module__c';
import CATEGORY_FIELD from '@salesforce/schema/Stipulations__c.Category__c';
import STIPTYPE_FIELD from '@salesforce/schema/Stipulations__c.Stipulation_Type__c';
import COMMENT_FIELD from '@salesforce/schema/Stipulations__c.Comments__c';
import stipulationRecMethod from '@salesforce/apex/StipulationRecHelper.stipulationRecMethod';
import pathprogressormethod from '@salesforce/apex/UpdateApplicationUnderwritingStage.UpdateApplicationUnderwritingStage';
import getcurrentstage from '@salesforce/apex/UpdateApplicationUnderwritingStage.getApplicationUnderwritingStages';
import getstipulationsparentid from '@salesforce/apex/StipulationRecHelper.getParentValuesForStipCreation';
import getstipulationdefinitions from '@salesforce/apex/UpdateApplicationUnderwritingStage.getStipulationDefinition';
import stipulationDefinitionRecMethod from '@salesforce/apex/StipulationRecHelper.createStipulationDefinition';
import getrecordtypeid from '@salesforce/apex/StipulationRecHelper.getRecordTypeId';


const FIELDS = [
    'Application_Underwriting__c.Id',
    'Application_Underwriting__c.Stages__c'
];

export default class CustomPathProgressor extends LightningElement {
    @api objName;
    @api iconName;
    @track selectedValue;
    @api recordId;
    @track isApproved = false;
    @track showSpinner = false;
    @track stipdef = NAME_FIELD;
    @track appunderwriting = APP_UN_FIELD;
    @track status = STATUS_FIELD;
    @track module = MODULE_FIELD;
    @track category = CATEGORY_FIELD;
    @track stipTypes = STIPTYPE_FIELD;
    @track comment = COMMENT_FIELD;
    @wire(getObjectInfo, { objectApiName: LEAD_OBJECT })
    objectInfo;
    @track itemsList = [];
    @track stageList = [];
    @track modulename;
    @track categoryname;
    @track applicationId;
    @track approved = false;
    @track themeInfo;
    searchKey;
    @track definitions;
    @track createstip = false;
    @api searchPlaceholder='Search';
    @track selectedName;
    @track selectedid;
    @track records;
    @track isValueSelected;
    @track blurTimeout;
    @track recordTypeId;
    searchTerm;
    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: PICKLIST_FIELD })//
    picklistFieldValues;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    record;
    selectedStipDef;
    @track application;
    @track selectedAppunderwriting;
    @track comments;
    @track stipType;
    @track stipDefName;
    recStipulations = {

        Stipulations_Definition__c : this.selectedStipDef,
        Application_Underwriting__c : this.selectedAppunderwriting,
        //Stages__c : this.status,
    }

    get recordTypeId() {
        // Returns a map of record type Ids 
        getrecordtypeid({
            recordid : this.recordId
        })
        .then(result => {
            console.log('result.recordTypeId::'+result.RecordTypeId);
            return result.RecordTypeId;
        })
        .catch(error => {
          console.log('!!!'+error);
        });
        //const rtis = this.objectInfo.data.recordTypeInfos;
        return result.RecordTypeId;//Object.keys(rtis).find(rti => rtis[rti].name === 'Asia');
    }
   
    handelAppchange(event){
        this.application = event.target.value;
        //console.log("name",this.recAccount.Name);
    }
    handelPhonechange(event){
        this.recStipulations.Application_Underwriting__c = event.target.value;
       // console.log("phone",this.recAccount.Phone);
    }

    handelRatingchange(event){
        this.recStipulations.Stages__c = event.target.value;
       // console.log("email",this.recAccount.Rating);
    }

    handleStipTypeSelection(event){
        this.stipType = event.target.value;
    }

    handleCommentSelection(event){
        this.comments = event.target.value;
    }

    handleAppUnderSelection(event){
        this.selectedAppunderwriting = event.target.value;
    }

    handleStipDefName(event){
        this.stipDefName = event.target.value;
    }

    createStipRec() {
        stipulationRecMethod({ 
            modulename : this.modulename,
            category : this.category,
            selectedstipdef : this.selectedid,
            appid : this.applicationId,
            appunderwriting : this.recordId,
            stipcomment : this.comments,
            stiptype : this.stipType 
        })
            .then(result => {
                console.log('RESULT VALUE:::'+JSON.stringify(result));
                if(result !== undefined) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Stipulation created',
                            variant: 'success',
                        }),
                    );
                }
                this.isShowModal = false;
                
                //this.picklistValues();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
            window.location.reload();
    }

    createStipDefRec() {
        stipulationDefinitionRecMethod({ 
            modulename : this.modulename,
            category : this.category,
            name : this.stipDefName
        })
            .then(result => {
                // console.log('RESULT VALUE:::'+JSON.stringify(result));
                 if(result !== undefined) {
                    
                     this.dispatchEvent(
                         new ShowToastEvent({
                             title: 'Success',
                             message: 'Record created',
                             variant: 'success',
                         }),
                     );
                 }
                 this.createstip = false;
                 this.isShowModal = true;
                //this.picklistValues();
            })
            .catch(error => {
                console.log(error);
                 this.dispatchEvent(
                     new ShowToastEvent({
                         title: 'Error creating record',
                         message: error.body.message,
                         variant: 'error',
                     }),
                 );
            });
    }

connectedCallback(){
    this.picklistValues()
}
    picklistValues() {
        this.itemsList = [];
        this.stageList = [];
        getcurrentstage({ 
            recordid : this.recordId
        })
        .then(result => {
            console.log('Result:123:'+JSON.stringify(result));
                if (result.Stages__c != null) {
                    if(result.Stages__c != 'Approved'){
                        this.isApproved = true;
                    }
                    this.selectedValue = result.Stages__c;
                    //this.selectedValue = this.record.data.fields.Stages__c.value + '';
                    console.log('!~~~>'+result.Stages__c);
                    if (this.picklistFieldValues.data.values != undefined) {//this.picklistFieldValues && this.picklistFieldValues.data && 
                        console.log('got picklist field data'+this.picklistFieldValues.data.values);
                        let selectedUpTo = 0;
                        for (let item in this.picklistFieldValues.data.values) {
                            this.stageList.push(this.picklistFieldValues.data.values[item].value);
                            if (Object.prototype.hasOwnProperty.call(this.picklistFieldValues.data.values, item)) {
                                let classList;
                                if (this.picklistFieldValues.data.values[item].value === this.selectedValue) {
                                    if( this.selectedValue === 'Approved'){
                                        classList = 'slds-path__item slds-is-complete';
                                    }else{
                                        classList = 'slds-path__item slds-is-current slds-is-active';
                                    }
                                    selectedUpTo = this.stageList.indexOf(this.selectedValue) - 1;
                                } else{
                                    
                                    classList = 'slds-path__item slds-is-incomplete';
                                }
        
                                console.log('--->'+classList);
                                
                                this.itemsList.push({
                                    pItem: this.picklistFieldValues.data.values[item],
                                    classList: classList
                                })
                                //this.stageList.push(this.picklistFieldValues.data.values[item].value);
                            }
                        }
                        console.log('!!@@'+selectedUpTo);
                        console.log('!!!!!'+this.stageList.length);
                        if (selectedUpTo >= 0) {
                            for (let item = 0; item <= selectedUpTo; item++) {
                                this.itemsList[item].classList = 'slds-path__item slds-is-complete';
                            }
                        }
                        console.log('im here = ' + JSON.stringify(this.itemsList));
                        return this.itemsList;
                    }
                }
                return null;
        })
        .catch(error => {
            console.log('ERRor!!'+error);
        });
    }

    handleSelect(event) {
        console.log('in the function', event.currentTarget.datasets.value);
        this.selectedValue = event.currentTarget.dataset.value;
    }

   /* handleMarkAsSelected() {
        this.showSpinner = true;
        const fields = {};
        fields.Id = this.recordId;
        fields.Stages__c = 'Loan Docs Review';//this.selectedValue;

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Status Updated!',
                        variant: 'success'
                    })
                );
                console.log('success!');
            })
            .catch(
                error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error updating status!',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                    console.log('failure => ' + error.body.message);
                }
            );
        this.showSpinner = false;
    }*/

    handleMarkAsSelected(event) {
        this.showSpinner = true;
        const fields = {};
        fields.Id = this.recordId;
        fields.Stages__c = this.selectedValue;
        console.log('Record id'+fields.Id);
        console.log('Stage'+fields.Stages__c);
        console.log('console'+this.itemsList);
        const recordInput = { fields };
        if(fields.Stages__c == 'Approved'){
            this.approved = true;
        }
        pathprogressormethod({ 
            recordid : this.recordId, 
            stagename : this.selectedValue, 
            stageslist : this.stageList
        })
        .then(result => {
            this.message = result;
            this.error = undefined;
            if(this.message == 'Success') {
            const event = new ShowToastEvent({
                title: 'Record Updated Successfully',
                message: 'Record Updated Successfully!',
                variant: 'success'
            });
            this.dispatchEvent(event);
           
            this.picklistValues();
          
        }else{
            const event = new ShowToastEvent({
                title: 'You can not Approve this record!',
                message: 'All the Stipulations are not yet Approved!',
                variant: 'warning'
            });
            this.dispatchEvent(event);

            this.picklistValues();
        }
            console.log(JSON.stringify(result));
            console.log("result", this.message);
        })
        .catch(error => {
            const event = new ShowToastEvent({
                title : 'Error',
                message : 'Error while Updating Record. Please Contact System Admin',
                variant : 'error'
            });
            this.dispatchEvent(event);
        });
        this.showSpinner = false;
    }

    singleAccount;
    get inputVariables() {
       
    }

    handleStatusChange(event) {
        console.log('handleStatusChange', event.detail);
    }

    @track isShowModal = false;
    @track display = false;
    @track isShowStipModel = false;
    @track jsValue;
    showModalBox() {  
        this.isShowModal = true;
        getstipulationsparentid({ 
            recordid : this.recordId
        })
        .then(result => {
            console.log('~~~~>'+JSON.stringify(result));
            this.modulename = 'Underwriting';
            this.category = result.Stages__c;
            this.applicationId = result.Application__c;
           
        })
        .catch(error => {
            console.log('ERROR::'+error);
        });

    }

    //This Funcation will get the value from Text Input.
    /*handelSearchKey(event){
        this.searchKey = event.target.value;
    }*/
    //This funcation will fetch the Account Name on basis of searchkey
    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
        getstipulationdefinitions({
            searchTerm: this.searchTerm,
            moduleValue: this.modulename,
            categoryValue: this.category
        })
        .then(result => {
                this.records = result;
        })
        .catch( error=>{
            this.accounts = null;
            console.log('ERROR::'+error);
        });
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    onSelect(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;
        const valueSelectedEvent = new CustomEvent('lookupselected', {detail:  selectedId });
        this.dispatchEvent(valueSelectedEvent);
        this.isValueSelected = true;
        this.selectedName = selectedName;
        this.selectedid = selectedId;
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    handleRemovePill() {
        this.isValueSelected = false;
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }
    SearchStipDefHandler(){
        //call Apex method.
        getstipulationdefinitions({
            moduleValue: this.modulename,
            categoryValue: this.category
        })
        .then(result => {
                this.definitions = result;
        })
        .catch( error=>{
            this.accounts = null;
            console.log('ERROR::'+error);
        });

    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    showStipulationCheck(){
        if(this.display){
            this.display = false;
        }else{
            this.display = true;
        }
    } 
    handleChange(){
        this.isShowStipModel = true;
    }
    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.apiName + ' created.',
                variant: 'success',
            })
        );
    }
    createStipulations(){
        this.createstip = true;
        this.isShowModal = false;
    }
    createStipulationDone(){
        this.createstip = false;
    }
    closeDetails(){
        this.createstip = false;
        this.isShowModal = true;
    }

    handleChanges(event) {
        console.log('You selected an account: ' + event.detail.value[0]);
    }
}