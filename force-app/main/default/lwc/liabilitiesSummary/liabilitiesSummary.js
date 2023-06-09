import { api, LightningElement, track, wire } from 'lwc';
import getAssetSummaries from '@salesforce/apex/AssetSummaryController.getAssetSummaryRecords';

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
    { label: 'Liability Name', fieldName: 'Liability_Name__c'},  
    { label: 'Liability Type', fieldName: 'Liability_Type__c'},
    { label: 'Original Amount', fieldName: 'Original_Amount__c'},
    { label: 'Amount Owning', fieldName: 'Amount_Owing__c'},
    { label: 'Payment Amount', fieldName: 'Payment_Amount__c'} 
];

export default class LiabilitiesSummary extends LightningElement {
    @api recordId;
    @track columnsList = columns;
    @track dataList = [];


    @track data;
    @wire(getAssetSummaries, {recordid:'$recordId'})
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