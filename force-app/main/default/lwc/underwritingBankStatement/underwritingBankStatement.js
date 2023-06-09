import { LightningElement,wire,api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import LEAD_OBJECT from '@salesforce/schema/Application_Underwriting__c';
import { getRecord } from 'lightning/uiRecordApi';
import fetchBankStatements from '@salesforce/apex/FetchBankStatementDetails.getBankStatements';
import getcalculatedvalues from '@salesforce/apex/FetchBankStatementDetails.getCalculatedValues';
import getfilteredbankstatements from '@salesforce/apex/FetchBankStatementDetails.getFilteredBankStatements';
import getAllCategoriesList from '@salesforce/apex/FetchBankStatementDetails.getAllCategoriesList';
import getAllSubCategoriesList from '@salesforce/apex/FetchBankStatementDetails.getAllSubCategoriesList';
import getBankAccountDetails from '@salesforce/apex/FetchBankStatementDetails.getBankAccounts';
import getStatements from '@salesforce/apex/FetchBankStatementDetails.getBankStatementId';
import updatestatements from '@salesforce/apex/FetchBankStatementDetails.updateBusinessStatements';
import getAllFilteredBankStatements from '@salesforce/apex/FetchBankStatementDetails.getAllFilteredBankStatements';

export default class UnderwritingBankStatement extends LightningElement {
@api recordId;
@api bankId
@track datalist = [];
@track calc = [];
@track records = [];
@track categoryList = [];
@track subcategorylist = [];
@track categoryGroupSelection = [];
@track categorySelection = [];
@track subCategorySelection = [];
@track statements = []
@track months = []
@track grouping = ['Deposit','Debit']
@track strtdate;
@track enddate;
@track searchKey;
@track filter = false;
@track totalmonthlybusinessdebit = 0.00;
@track totalmonthlybusinessdeposit = 0.00;
@track totalmonthlynonbusinessdebit = 0.00;
@track totalmonthlynonbusinessdeposit = 0.00;
@track value = [];
@track statementId;


    handleRowAction(event){
        console.log('IDS::'+event.target.dataset.name);
        if(this.value.length >= 1){
            let obj = this.value.find((o, i) => {
                console.log('O'+o.id);
                if (o.id == event.target.dataset.name) {
                    this.value[i] = {id :event.target.dataset.name,value :event.target.checked};
                }else{
                    this.value.push({id :event.target.dataset.name,value :event.target.checked});     
                }
            });
        }else{
            this.value.push({id :event.target.dataset.name,value :event.target.checked});     
        }
        
        console.log("Todo: " + JSON.stringify(this.value));
    }

    updateStatements(){
        const ids = this.value.map(({ id }) => id);
        const filtered = this.value.filter(({ id }, index) => !ids.includes(id, index + 1));
        console.log('FILTERED::'+JSON.stringify(filtered));
        updatestatements({
            mapOfBusinessTxnById : filtered
        }).then(result => {
            if(result == 'Success') {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Updated Successfully',
                        variant: 'success',
                    }),
                );
            }
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error While Updating Record',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });
    }

    showFilter(){
        this.filter = true;
    }   	


    handleKeyChange( event ) {  
        let searchchar = event.target.value;//.toLowerCase();  
        this.searchKey = searchchar;
        console.log( 'Search Key is ' + this.searchKey + ' Record id ' + this.statementId);
        /*getfilteredbankstatements({
            recordId : this.statementId,
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
        });*/
    }

    handleGroupingSelection(event){
        console.log('!::'+event.target.checked);
        if(event.target.checked){
            this.categoryGroupSelection.push(event.target.label);
        }else if(!event.target.checked){
            const index = this.categoryGroupSelection.indexOf(event.target.label);
            if (index > -1) { // only splice array when item is found
                this.categoryGroupSelection.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        console.log('!!!GROUP::'+this.categoryGroupSelection);
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

    applyFilter(){
        console.log('!!!::'+this.statementId+'!!!::'+this.searchKey+'!!!::'+this.categoryGroupSelection+'!!!::'+this.categorySelection+'!!!::'+this.subCategorySelection);
        getAllFilteredBankStatements({
            recordId : this.statementId,
            searchkey : this.searchKey,
            groups : this.categoryGroupSelection,
            category : this.categorySelection,
            subcategory : this.subCategorySelection,
            strtDate : this.strtdate,
            endDate : this.enddate
        }).then(result => {
            this.datalist = [];
            var conts = result;
            console.log('!!!'+conts);
                for(var key in conts){
                    var d1 = key.split('_');
                    console.log('!!!'+d1);
                    this.datalist.push({value:conts[key], key:d1[0],type:d1[1], grp:d1[2]});
                    this.calc.push({value:conts[key]});
                }
            this.filter = false;  
        }).catch(error => {
            console.log('Error:::'+JSON.stringify(error));
        });
    }

    statementNames = {};
    connectedCallback() {
        this.getBankAccount()
    }
    getBankAccount = () => {
        getBankAccountDetails({ recordId: this.bankId }).then(res => {
            console.log("Res ", res);
            this.statements.length = 0
        this.statements = res;
        for(let key in res) {
            this.statementNames[res[key].Name] = [];
        }  
        }).catch(err => {
        console.log("getBankAccountDetails err ",err);
        })
    }

    handleActive = (e) => {
        console.log('!!!:::!!!'+e.target.dataset.name);
        this.datalist = [];
        this.statementId = e.target.dataset.name;
        getStatements({ 
            bankId: e.target.dataset.name 
        }).then(res => {
            console.log("res:::::::::::=>", res);
            console.log('THIS::'+this.statementId);
            this.months = res;
        }).catch(err => {
          console.log("getStatements err ",err);
      });  

      fetchBankStatements({
        recordId : this.statementId
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

    getAllCategoriesList({
        recordId : this.statementId
    })
    .then(result => {
        this.categoryList = result; 
        
    }).catch(error => {
        console.log('ERRor!!'+error);
    });

    getAllSubCategoriesList({
        recordId : this.statementId
    })
    .then(result => {
        this.subcategorylist = result; 
        
    }).catch(error => {
        console.log('ERRor!!'+error);
    });
    }
}