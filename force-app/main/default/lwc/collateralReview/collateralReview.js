import { api, LightningElement, track, wire } from 'lwc';
import getCollateralSummaries from '@salesforce/apex/CollateralReviewController.getCollateralSummaryRecords';

const columns = [
    {  
        label: "Name",  
        fieldName: "recordLink",  
        type: "url",  
        typeAttributes: { label: { fieldName: "Name" }, tooltip:"Name", target: "_blank" }  
    },
    // {  
    //     label: "Account",  
    //     fieldName: "contactrecordLink",  
    //     type: "url",  
    //     typeAttributes: { label: { fieldName: "Account__c" }, target: "_blank" }  
    // },
    { label: 'Collateral Category', fieldName: 'Collateral_Category__c'},  
    { label: 'Collateral Description', fieldName: 'Collateral_Description__c'},
    { label: 'Collateral Effective Date', fieldName: 'Collateral_Effective_Date__c'},
    { label: 'Collateral Expiry Date', fieldName: 'Collateral_Expiry_Date__c'},
    { label: 'Collateral Insurance Company', fieldName: 'Collateral_Insurance_Company__c'},
    { label: 'Collateral Owner', fieldName: 'Collateral_Owner__c'},
    { label: 'Active Collateral', fieldName: 'Active_Collateral__c'}
];

export default class CollateralReview extends LightningElement {
    @api recordId;
    @track columnsList = columns;
    @track dataList = [];


    @track data;
    @wire(getCollateralSummaries, {recordid:'$recordId'})
    getAssetSummaryList({ error, data }) {  
        console.log('!!!!!!'+data);
        if(data) {  
            var tempCreditList = [];  
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]); //cloning object  
                tempRecord.recordLink = "/" + tempRecord.Id; 
                tempRecord.contactrecordLink = "/" + tempRecord.Account__r.Name;
                tempCreditList.push(tempRecord);  
            }  
            this.dataList = tempCreditList;  
            this.error = undefined;  
        }else if (error) {  
            this.error = error;  
            this.dataList = undefined;  
        }
        console.log('@#@#@#::'+this.dataList);  
    } 
}