import { LightningElement,wire,api,track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import LEAD_OBJECT from '@salesforce/schema/Application_Underwriting__c';
import { getRecord } from 'lightning/uiRecordApi';
import fetchBankStatements from '@salesforce/apex/FetchBankStatementDetails.getBankStatements';
import getcalculatedvalues from '@salesforce/apex/FetchBankStatementDetails.getCalculatedValues';
import getfilteredbankstatements from '@salesforce/apex/FetchBankStatementDetails.getFilteredBankStatements';
import getAllCategoriesList from '@salesforce/apex/FetchBankStatementDetails.getAllCategoriesList';
import getAllSubCategoriesList from '@salesforce/apex/FetchBankStatementDetails.getAllSubCategoriesList';
export default class BankStatementDetails extends LightningElement {
@api recordId;
@track datalist = [];
@track calc = [];
@track records = [];
@track categoryList = [];
@track subcategorylist = [];
@track categorySelection = [];
@track subCategorySelection = [];
@track strtdate;
@track enddate;
@track filter = false;
@track totalmonthlybusinessdebit = 0.00;
@track totalmonthlybusinessdeposit = 0.00;
@track totalmonthlynonbusinessdebit = 0.00;
@track totalmonthlynonbusinessdeposit = 0.00;
@track value;

connectedCallback(){
    this.getbankstatementdetails()
}

getbankstatementdetails(){
    fetchBankStatements({
        recordId : this.recordId
    })
    .then(result => {
        var conts = result;
        console.log('!!!'+conts);
            for(var key in conts){
                var d1 = key.split('_');
                console.log('!!!'+d1);
                this.datalist.push({value:conts[key], key:d1[0],type:d1[1], grp:d1[2]});
                this.calc.push({value:conts[key]});
            }
        //this.datalist = result;
     
        
    }).catch(error => {
        console.log('ERRor!!'+error);
    });

    getcalculatedvalues({
        recordId : this.recordId
    })
    .then(result => {
        let USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        this.calc = result;
        for (let item in this.calc) {
            console.log('@@##::'+this.calc[item].Input_Amount__c);
            if(this.calc[item].Grouping__c == 'Debit' && this.calc[item].Include_in_Business_Debits_Deposits__c == true){
                this.totalmonthlybusinessdebit += this.calc[item].Input_Amount__c;
            }else if(this.calc[item].Grouping__c == 'Deposit' && this.calc[item].Include_in_Business_Debits_Deposits__c == true){
                this.totalmonthlybusinessdeposit += this.calc[item].Input_Amount__c;
            }else if(this.calc[item].Grouping__c == 'Debit' && this.calc[item].Include_in_Business_Debits_Deposits__c == false){
                this.totalmonthlynonbusinessdebit += this.calc[item].Input_Amount__c;
            }else if(this.calc[item].Grouping__c == 'Deposit' && this.calc[item].Include_in_Business_Debits_Deposits__c == false){
                this.totalmonthlynonbusinessdeposit += this.calc[item].Input_Amount__c;
            }
        }

    }).catch(error => {
        console.log('ERRor!!'+error);
    });

    getAllCategoriesList({
        recordId : this.recordId
    })
    .then(result => {
        this.categoryList = result; 
        
    }).catch(error => {
        console.log('ERRor!!'+error);
    });

    getAllSubCategoriesList({
        recordId : this.recordId
    })
    .then(result => {
        this.subcategorylist = result; 
        
    }).catch(error => {
        console.log('ERRor!!'+error);
    });
}

    handleRowAction(event){
        this.value = event.target.checked;        
        console.log("Todo: " + event.target.recordId);
    }

    handleSelection(event){
        console.log('!::'+event.target.checked);
        if(event.target.checked){
            this.categorySelection.push(event.target.label);
        }else if(!event.target.checked){
            const index = this.categorySelection.indexOf(event.target.label);
            if (index > -1) { // only splice array when item is found
                this.categorySelection.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        console.log('!!!CATEGORY::'+this.categorySelection);
    }

    handleSubCatSelection(event){
        console.log('!::'+event.target.checked);
        if(event.target.checked){
            this.subCategorySelection.push(event.target.label);
        }else if(!event.target.checked){
            const index = this.subCategorySelection.indexOf(event.target.label);
            if (index > -1) { // only splice array when item is found
                this.subCategorySelection.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        console.log('!!!SUB CATEGORY::'+this.subCategorySelection);
    }

    handleStDateCahngeEvent(event){
       
        this.strtdate = event.target.value;
       
        console.log('!!!STRT DATE::'+this.strtdate);
    }

    handleEndDateCahngeEvent(event){
       
        this.enddate = event.target.value;
       
        console.log('!!!END DATE::'+this.enddate);
    }

    showFilter(){
        this.filter = true;
    }

    applyFilter(){
        this.filter = false;
    }

    handleKeyChange( event ) {  
          
        const searchKey = event.target.value;//.toLowerCase();  
        console.log( 'Search Key is ' + searchKey );
        getfilteredbankstatements({
            recordId : this.recordId,
            searchkey : searchKey
        })
        .then(result => {
            this.datalist = [];
            var conts = result;
            console.log('!!!'+conts);
                for(var key in conts){
                    var d1 = key.split('_');
                    console.log('!!!'+d1);
                    this.datalist.push({value:conts[key], key:d1[0],type:d1[1], grp:d1[2]});
                    this.calc.push({value:conts[key]});
                }
            //this.datalist = result;
         
            
        }).catch(error => {
            console.log('ERRor!!'+error);
        });
    
        // if ( searchKey ) {  
 
        //      if ( this.datalist ) {

        //         let recs = [];
        //         for ( let rec of this.datalist ) {

        //             console.log( 'Rec is ' +JSON.stringify(rec) );
        //             let valuesArray = Object.values( rec );
        //             console.log( 'valuesArray is ' + valuesArray );
 
        //             for ( let val of valuesArray ) {
        //                 if ( val ) {

        //                     if ( val.includes( searchKey ) ) {

        //                         recs.push( rec );
        //                         break;
                        
        //                     }

        //                 }

        //             }
                    
        //         }

        //         console.log( 'Recs are ' + JSON.stringify( recs ) );
        //         this.datalist = recs;

        //      }

        // }

    }
}