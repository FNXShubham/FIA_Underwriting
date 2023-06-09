import { api, LightningElement, track, wire } from 'lwc';
import getCreditSummaries from '@salesforce/apex/CreditSummaryController.getCreditSummaryRecords';

const columns = [
    {  
        label: "Name",  
        fieldName: "recordLink",  
        type: "url",  
        typeAttributes: { label: { fieldName: "Name" }, tooltip:"Name", target: "_blank" }  
    },
    // {  
    //     label: "Contact",  
    //     fieldName: "contactrecordLink",  
    //     type: "url",  
    //     typeAttributes: { label: { fieldName: "Contact__c" }, tooltip:"Contact", target: "_blank" }  
    // },
    //{ label: 'Credit Summary Name', fieldName: 'Name'},
    //{ label: 'Contact', fieldName: 'Contact_r.Name'},
    { label: 'Credit Score', fieldName: 'Credit_Score__c'},  
    { label: 'Credit Score Override Reason', fieldName: 'Credit_Score_Override_Reason__c'},
    { label: 'Credit Score Override Other Reason', fieldName: 'Credit_Score_Override_Other_Reason__c'},
    { label: 'Override Min Credit Score Requirement', fieldName: 'Override_Min_Credit_Score_Requirement__c'} 
];

export default class CreditSummary extends LightningElement {
    @api recordId;
    @track columnsList = columns;
    @track dataList = [];


    @track data;
    @wire(getCreditSummaries, {recordid:'$recordId'})
    getCreditSummaryList({ error, data }) {  
        console.log('!!!!!!'+data);
        if(data) {  
            var tempCreditList = [];  
            for (var i = 0; i < data.length; i++) {  
                let tempRecord = Object.assign({}, data[i]); //cloning object  
                tempRecord.recordLink = "/" + tempRecord.Id; 
                tempRecord.contactrecordLink = "/" + tempRecord.Contact__r.Name;
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