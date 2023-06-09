import { api, LightningElement,track } from 'lwc';
import getBankAccounts  from '@salesforce/apex/BankStatementHandler.getBankAccounts'
import finStatement from '@salesforce/apex/FinancialSpreadHandler.getstatementDataMap'
import getAccounts from '@salesforce/apex/BankStatementHandler.getAccounts'
import GetWrapperOfFinancialStatments  from '@salesforce/apex/BankStatementHandler.GetWrapperOfFinancialStatments'
import updateBankStatement from '@salesforce/apex/FinancialSpreadHandler.updateStatementDetails'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import setIncludeInCalculation from '@salesforce/apex/BankStatementHandler.setIncludeInCalculation'
import getAccountOverviewData from '@salesforce/apex/FinancialSpreadHandler.getAccountOverviewData'

export default class NfNewBankStatement extends LightningElement {
overview = []
@track selectedBank = ''
bankLabel = ''
loader = false
dollarUSLocale = new Intl.NumberFormat('en-US',{ style: "currency",
currency: "USD",
maximumFractionDigits: 2})
chkBoxCount = 0
@track  avgDeposits = ' '
@track  avgDayDeposits = ' '
@track  beginingBalances = ' '
@track  endingBalances = ' '
@track  avgRevDeposit = ' '
@track  avgOtherDeposit = ' '
@track  avgWithdraw = ' '
@track  negativeDays = ' '
@track  nsfDays = ' '
@track avgDays1 = ' '
@track avgDays2 = ' '
@track avgDays3 = ' '
@track avgDays4 = ' '
@track avgDays5 = ' '
@track avgDays6 = ' '
@track avgDays7 = ' '
@track avgDays8 = ' '
@track avgDays9 = ' '
@track avgDays10 = ' '
@track avgDays11 = ' '
@track avgDays12 = ' '
@track avgDays13 = ' '
@track avgDays14 = ' '
@track avgDays15 = ' '
@track avgDays16 = ' '
@track avgDays17 = ' '
@track avgDays18 = ' '
@track avgDays19 = ' '
@track avgDays20 = ' '
@track avgDays21 = ' '
@track avgDays22 = ' '
@track avgDays23 = ' '
@track avgDays24 = ' '
@track avgDays25 = ' '
@track avgDays26 = ' '
@track avgDays27 = ' '
@track avgDays28 = ' '
@track avgDays29 = ' '
@track avgDays30 = ' '
@track avgDays31 = ' '
depArr = []
begBalanceArray = []
endBalanceArray = []
AvgDayDepArray = []
AvgRevDepositArray = []
AvgOtherDepositArray = []
AvgWithdrawArray = []
AvgWithdrawArray = []
negativeDaysArray = []
nsfArray = []
daysArray1 = []
daysArray2 = []
daysArray3 = []
daysArray4 = []
daysArray5 = []
daysArray6 = []
daysArray7 = []
daysArray8 = []
daysArray9 = []
daysArray10 = []
daysArray11 = []
daysArray12 = []
daysArray13 = []
daysArray14 = []
daysArray15 = []
daysArray16 = []
daysArray17 = []
daysArray18 = []
daysArray19 = []
daysArray20 = []
daysArray21 = []
daysArray22 = []
daysArray23 = []
daysArray24 = []
daysArray25 = []
daysArray26 = []
daysArray27 = []
daysArray28 = []
daysArray29 = []
daysArray30 = []
daysArray31 = []
@api recordId
@api fieldValue
@api stValue
AccId1;
@track banks = []
bankAccountId
TableTitle
@track mapData=[];
@track mapDataBeginingDeposits=[];
@track mapDataDeposits=[];
@track mapDataRevenueDeposits=[];
@track mapDataWithdrawlsDeposits=[];
@track mapDataNegetiveDeposits=[];
@track mapDataAvgDaysDeposits=[];
@track mapDataAvgDeposits=[];
@track mapDataDaysDeposits=[];
avgBeginingBalance  =0.00;
avgDeposBal= 0.00;
avgRevenueBal=0.00;
avgOtherBal= 0.00;
avgWithDrawlBal= 0.00;
showBtns = false;
columns = []
@track columnCount = 1
data
@track draftValues = []
@track checkBoxCount =[];
depst = false
count = 0
total = 0
avgAmount = [];
avgtotal = [];
@api AccId
Avgtrue = true;
avgtotal1 = [];
@track checkedIndexes = [];
bankNames = {};
arr = []
unique = []
connectedCallback() {
this.getStatement() 
}
getOverview = () =>{
    this.loader = true
    getAccountOverviewData({ appId: this.recordId }).then(res => {
        console.log("getoverview ",res);
        this.avgWithDrawlBal = res.reduce((total, obj) => Number(obj.withdrawal__c) + total, 0)
        this.avgOtherBal = res.reduce((total, obj) => Number(obj.Average_Other_Deposit__c) + total, 0)
        this.avgRevenueBal = res.reduce((total, obj) => Number(obj.Total_Deposits__c) + total, 0)
        this.avgBeginingBalance = res.reduce((total, obj) => Number(obj.Begining_Balance__c) + total, 0)
        this.avgDeposBal = res.reduce((total, obj) => Number(obj.Average_Deposit__c) + total, 0)
        this.avgWithDrawlBal = this.dollarUSLocale.format(this.avgWithDrawlBal)
        this.avgOtherBal = this.dollarUSLocale.format(this.avgOtherBal)
        this.avgRevenueBal = this.dollarUSLocale.format(this.avgRevenueBal)
        this.avgBeginingBalance = this.dollarUSLocale.format(this.avgBeginingBalance)
        this.loader = false
    }).catch(err => {
        this.loader = false
        console.log(err)
    })
}
getStatement = (bankid) => {
    getAccounts({recordId: this.recordId}).then(resAcc =>{
        this.AccId = resAcc
    })
    getBankAccounts({ recordId: this.recordId }).then(res => {
        this.banks.length = 0
        this.banks = res;
        for(let key in res) {
            this.bankNames[res[key].Bank_Account_Name__c] = [];
        }          
    }) 
}

handleBtnCancel() {
this.showBtns = false;
}

inpClickHandler(event) {
    event.target.classList.remove('slds-show');
    event.target.classList.add('slds-hide');
    var sibling = event.target.nextElementSibling;
    sibling.classList.remove('slds-hide');
    sibling.classList.add('slds-show');
    this.showBtns = true;
}
    clearAverage = () => {
        this.avgDeposits = ' '
        this.avgDayDeposits = ' '
        this.beginingBalances = ' '
        this.endingBalances = ' '
        this.avgRevDeposit = ' '
        this.avgOtherDeposit = ' '
        this.avgWithdraw = ' '
        this.negativeDays = ' '
        this.nsfDays = ' '
        this.avgDays1 = ' '
        this.avgDays2 = ' '
        this.avgDays3 = ' '
        this.avgDays4 = ' '
        this.avgDays5 = ' '
        this.avgDays6 = ' '
        this.avgDays7 = ' '
        this.avgDays8 = ' '
        this.avgDays9 = ' '
        this.avgDays10 = ' '
        this.avgDays11 = ' '
        this.avgDays12 = ' '
        this.avgDays13 = ' '
        this.avgDays14 = ' '
        this.avgDays15 = ' '
        this.avgDays16 = ' '
        this.avgDays17 = ' '
        this.avgDays18 = ' '
        this.avgDays19 = ' '
        this.avgDays20 = ' '
        this.avgDays21 = ' '
        this.avgDays22 = ' '
        this.avgDays23 = ' '
        this.avgDays24 = ' '
        this.avgDays25 = ' '
        this.avgDays26 = ' '
        this.avgDays27 = ' '
        this.avgDays28 = ' '
        this.avgDays29 = ' '
        this.avgDays30 = ' '
        this.avgDays31 = ' '    
        this.depArr.length = 0
        this.begBalanceArray.length = 0
        this.endBalanceArray.length = 0
        this.AvgDayDepArray.length = 0
        this.AvgRevDepositArray.length = 0
        this.AvgOtherDepositArray.length = 0
        this.AvgWithdrawArray.length = 0
        this.AvgWithdrawArray.length = 0
        this.negativeDaysArray.length = 0
        this.nsfArray.length = 0
        this.daysArray1.length = 0
        this.daysArray2.length = 0
        this.daysArray3.length = 0
        this.daysArray4.length = 0
        this.daysArray5.length = 0
        this.daysArray6.length = 0
        this.daysArray7.length = 0
        this.daysArray8.length = 0
        this.daysArray9.length = 0
        this.daysArray10.length = 0
        this.daysArray11.length = 0
        this.daysArray12.length = 0
        this.daysArray13.length = 0
        this.daysArray14.length = 0
        this.daysArray15.length = 0
        this.daysArray16.length = 0
        this.daysArray17.length = 0
        this.daysArray18.length = 0
        this.daysArray19.length = 0
        this.daysArray20.length = 0
        this.daysArray21.length = 0
        this.daysArray22.length = 0
        this.daysArray23.length = 0
        this.daysArray24.length = 0
        this.daysArray25.length = 0
        this.daysArray26.length = 0
        this.daysArray27.length = 0
        this.daysArray28.length = 0
        this.daysArray29.length = 0
        this.daysArray30.length = 0
        this.daysArray31.length = 0    
    }

handleActive = (e) => {
    this.selectedBank = ''
    this.checkBoxCount.length = 0
    console.log(JSON.stringify(e));
    this.loader = true
    this.selectedBank = e.target.dataset.name
    this.clearAverage()
    if (e.target != undefined) {
        this.AccId1 = e.target.dataset.name;
        this.bankLabel = e.target.label
    }
    let sc =[];
    this.mapData = sc;
    this.mapDataBeginingDeposits=[];
    this.mapDataDeposits=[];
    this.mapDataRevenueDeposits=[];
    this.mapDataWithdrawlsDeposits=[];
    this.mapDataNegetiveDeposits=[];
    this.mapDataAvgDaysDeposits=[];
    this.mapDataAvgDeposits=[];
    this.mapDataDaysDeposits=[];
    this.avgtotal1 = [];
    this.avgtotal =[];
GetWrapperOfFinancialStatments({ BankAccId: e.target.dataset.name, ApplicationUnderId: this.recordId }).then(res => {
    console.log("GetWrapper ", res.lstDataTableColumns);
    this.TableTitle = res.TableTitle
    this.columns = res.lstDataTableColumns
    if (res.lstDataTableColumns != undefined && res.lstDataTableColumns.length < 10 && res.lstDataTableColumns.length > 0) {
        this.columnCount = res.lstDataTableColumns.length
    }
    else {
        this.columnCount = 9
    }
    this.checkBoxCount = res.lstfinDataColumns;
finStatement({ BankAccId: this.selectedBank, Appunderwriting: this.recordId }).then(results => {
if (results) {
    console.log("Statement ",results);
    for (let key in results) {
        let cVal = 0;
        this.count = 0
        this.total = 0 
        if(key == 'Beginning Balance($)' || key ==  'Ending Balance($)'){
            let dataArr = [];
            for(let k in results[key]) {
            let dataVal = {};
            dataVal['value'] = results[key][k][0];
            dataVal['recId'] = results[key][k][1];
            dataVal['idVal'] = results[key][k][2]+'---'+cVal;
            dataVal['idVal2'] = dataVal['idVal']+'---X';
            dataArr.push(dataVal);
            cVal++;
            }
            this.mapDataBeginingDeposits.push({ key:key, value:dataArr});
        }else if(key == 'Deposits(#)' || key == 'Revenue Deposits($)' || key ==  'Other Deposits($)' || key == 'Withdrawals($)' ){
            let dataArr = [];
            for(let k in results[key]) {
            let dataVal = {};
            dataVal['value'] = results[key][k][0];
            dataVal['recId'] = results[key][k][1];
            dataVal['idVal'] = results[key][k][2]+'---'+cVal;
            dataVal['idVal2'] = dataVal['idVal']+'---X';
            dataArr.push(dataVal);
            cVal++;
            }
            this.mapDataRevenueDeposits.push({ key:key, value:dataArr});
        }
        else if (key == 'Negative Days (#)' || key == 'NSFs (#)') {
            let dataArr = [];
            for(let k in results[key]) {
                let dataVal = {};
                dataVal['value'] = results[key][k][0];
                dataVal['recId'] = results[key][k][1];
                dataVal['idVal'] = results[key][k][2]+'---'+cVal;
                dataVal['idVal2'] = dataVal['idVal']+'---X';
                dataArr.push(dataVal);
                cVal++;
            }
            this.mapDataNegetiveDeposits.push({ key:key, value:dataArr});
        }
        else if(key == 'Avg Daily Balance($)' || key ==  'Daily Balance (#)' ){
            if(key == 'Avg Daily Balance($)') {
                let dataArr = [];
                for(let k in results[key]) {
                    let dataVal = {};
                    dataVal['value'] = results[key][k][0];
                    dataVal['recId'] = results[key][k][1];
                    dataVal['idVal'] = results[key][k][2]+'---'+cVal;
                    dataVal['idVal2'] = dataVal['idVal']+'---X';
                    dataArr.push(dataVal);
                    cVal++;
                }
                this.mapDataAvgDaysDeposits.push({ key:key, value:dataArr});
            } 
        }
        else{
            let dataArr = [];
            for(let k in results[key]) {
                let dataVal = {};
                dataVal['value'] = results[key][k][0];
                dataVal['recId'] = results[key][k][1];
                dataVal['idVal'] = results[key][k][2]+'---'+cVal;
                dataVal['idVal2'] = dataVal['idVal']+'---X';
                dataArr.push(dataVal);
                cVal++;
            }
            if(key == 'Day 1') {
                this.mapDataDaysDeposits.splice(0, 0, { key:key, value:dataArr});
            }
            else {
                this.mapDataDaysDeposits.push({ key:key, value:dataArr});
            }
        }
        let dataArr = [];
        for(let k in results[key]) {
            let dataVal = {};
            dataVal['value'] = results[key][k][0];
            dataVal['recId'] = results[key][k][1];
            dataVal['idVal'] = results[key][k][2]+'---'+cVal;
            dataVal['idVal2'] = dataVal['idVal']+'---X';
            dataArr.push(dataVal);
            cVal++;
        }
        this.mapData.push({ key:key, value:dataArr});
        let num = results[key]
        let avgcurr
        num.forEach(element => {
            if(element[0] != undefined && element[0] != null){
                const parts = element[0].split("$");
                if(parts.length==1){
                    this.total += parseInt(parts[0].replace(/,/g, ""));
                    let ag = parseInt(parts[0]);
                    this.count++;

                    avgcurr=  this.dollarUSLocale.format(parseInt(this.total/this.count))
                }
                else{
                    this.total +=  parseFloat(parts[1].replace(/,/g, ""));
                    this.count++;
                    let ag = parseInt(parts[1]);

                    avgcurr ='$'+  this.dollarUSLocale.format((this.total/this.count).toFixed(2));        
                }
            }
        });
        this.draftValues.push(key);   
    }
    this.checkBoxCount.forEach(element => {
        if (element != undefined && element.value == true) {
            var e = {target: {checked: true,dataset:{name: element.recId,index:element.index}}}
            this.getChkBox2(e)
        }
    }); 
    this.loader = false
} 
}).catch(error=>{
    console.log(JSON.stringify(error));
    this.loader = false
})
    this.data = res.lstDataTableData
    let sObjectRelatedFieldListValues = [];
for (let row of res.lstDataTableData){
    const finalSobjectRow = {}
    let rowIndexes = Object.keys(row); 
    rowIndexes.forEach((rowIndex) => {
        const relatedFieldValue = row[rowIndex];
        if(relatedFieldValue.constructor === Object){
            this._flattenTransformation(relatedFieldValue, finalSobjectRow, rowIndex)        
        }else{
            finalSobjectRow[rowIndex] = relatedFieldValue;
        }
    });
    sObjectRelatedFieldListValues.push(finalSobjectRow);
}
    this.DataTableResponseWrappper = res;
    sObjectRelatedFieldListValues.forEach(element => {
        let tempDisSchedule = Object.assign({},element);
        if(tempDisSchedule.Name =="Deposits(#)"){
            this.depst= true;
        }
    });
    this.finalSObjectDataList = sObjectRelatedFieldListValues;
}).catch(err => {
console.log(err);
})

}
accountHandle() {
    this.avgDeposBal = 0
    this.avgWithDrawlBal = 0
    this.avgOtherBal = 0
    this.avgRevenueBal = 0
    this.avgBeginingBalance = 0
    this.overview.map(data => {
        if (data.type == 'Deposits(#)') {
        this.avgDeposBal += Number(JSON.stringify(data.amount).replace(/[^0-9.-]+/g, ""))
        }
        else if (data.type == 'Withdrawals($)') {
        this.avgWithDrawlBal += Number(JSON.stringify(data.amount).replace(/[^0-9.-]+/g, ""))

        }
        if (data.type == 'Other Deposits($)') {
        this.avgOtherBal += Number(JSON.stringify(data.amount).replace(/[^0-9.-]+/g, ""))
        }
        if (data.type == 'Revenue Deposits($)') {
        this.avgRevenueBal += Number(JSON.stringify(data.amount).replace(/[^0-9.-]+/g, ""))
        }
        if (data.type == 'Beginning Balance($)') {
        this.avgBeginingBalance += Number(JSON.stringify(data.amount).replace(/[^0-9.-]+/g, ""))
        }
    })
        this.avgWithDrawlBal = this.dollarUSLocale.format(this.avgWithDrawlBal)
        this.avgOtherBal = this.dollarUSLocale.format(this.avgOtherBal)
        this.avgRevenueBal = this.dollarUSLocale.format(this.avgRevenueBal)
        this.avgBeginingBalance = this.dollarUSLocale.format(this.avgBeginingBalance)
}
handleClick(event) {
    this.arr.push({ statementDetailId: event.currentTarget.dataset.id, fieldValue: event.target.value })
    event.target.classList.remove('slds-show');
    event.target.classList.add('slds-hide');
    var sibling = event.target.previousElementSibling;
    sibling.classList.remove('slds-hide');
    sibling.classList.add('slds-show');
    sibling.value = event.target.value
}
handleBtnSave = () => {
updateBankStatement({statementUpdate:this.arr}).then(result => {
if (result == 'Records Updated Successfully') {
this.handleActive({target:{dataset:{name:this.selectedBank}}})
const event = new ShowToastEvent({
title: 'Update',
message: 'Your statement is updated successfully',
variant: 'success',
mode: 'dismissable'
});
this.dispatchEvent(event);
this.showBtns = false
this.unique.length = 0
this.arr.length = 0
}
}).catch(error =>{
console.log(error);
});
}
getChkBox2 = (e) => {
this.Avgtrue = true
var arr1 = this.mapDataRevenueDeposits[0].value, avgDailyBalanceArray = this.mapDataAvgDaysDeposits[0].value, beginingBalance = this.mapDataBeginingDeposits[0].value, endingBalance = this.mapDataBeginingDeposits[1].value, avgRev = this.mapDataRevenueDeposits[1].value, avgOtherDep = this.mapDataRevenueDeposits[2].value, avgWithdraw = this.mapDataRevenueDeposits[3].value, negDays = this.mapDataNegetiveDeposits[0].value, nsf = this.mapDataNegetiveDeposits[1].value, days1=  this.mapDataDaysDeposits[0].value, days2=  this.mapDataDaysDeposits[1].value,days3=  this.mapDataDaysDeposits[2].value,days4=  this.mapDataDaysDeposits[3].value,days5=  this.mapDataDaysDeposits[4].value,days6=  this.mapDataDaysDeposits[5].value,days7=  this.mapDataDaysDeposits[6].value,days8=  this.mapDataDaysDeposits[7].value,days9=  this.mapDataDaysDeposits[8].value,days10=  this.mapDataDaysDeposits[9].value,days11=  this.mapDataDaysDeposits[10].value,days12=  this.mapDataDaysDeposits[11].value,days13=  this.mapDataDaysDeposits[12].value,days14=  this.mapDataDaysDeposits[13].value,days15=  this.mapDataDaysDeposits[14].value,days16=  this.mapDataDaysDeposits[15].value,days17=  this.mapDataDaysDeposits[16].value,days18=  this.mapDataDaysDeposits[17].value,days19=  this.mapDataDaysDeposits[18].value,days20=  this.mapDataDaysDeposits[19].value,days21=  this.mapDataDaysDeposits[20].value,days22=  this.mapDataDaysDeposits[21].value,days23=  this.mapDataDaysDeposits[22].value,days24=  this.mapDataDaysDeposits[23].value,days25=  this.mapDataDaysDeposits[24].value,days26=  this.mapDataDaysDeposits[25].value,days27=  this.mapDataDaysDeposits[26].value,days28=  this.mapDataDaysDeposits[27].value,days29=  this.mapDataDaysDeposits[28].value,days30=  this.mapDataDaysDeposits[29].value,days31=  this.mapDataDaysDeposits[30].value
if (e.target.checked == true) {
setIncludeInCalculation({finStatementId: e.target.dataset.name, value: true, indexValue:e.target.dataset.index, appId:this.recordId})
.then(result => console.log(result))
.catch(error => console.log(JSON.stringify(error)));
if (this.mapDataDaysDeposits[0].key == 'Day 1') {
var count = 0, total = 0, avg = 0
if (days1[e.target.dataset.index].value != ' ') {
var str1 = parseFloat(JSON.stringify(days1[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray1.push(str1)
total = this.daysArray1.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray1.length
avg = total / count
this.avgDays1 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray1.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray1.length
avg = total / count
this.avgDays1 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray1.length > 0) {
total = this.daysArray1.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray1.length
avg = total / count
this.avgDays1 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays1 = ' '
}
}
}
if (this.mapDataDaysDeposits[1].key == 'Day 2') {
var count = 0, total = 0, avg = 0
if (days2[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days2[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray2.push(str1)
total = this.daysArray2.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray2.length
avg = total / count
this.avgDays2 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray2.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray2.length
avg = total / count
this.avgDays2 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray2.length > 0) {
total = this.daysArray2.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray2.length
avg = total / count
this.avgDays2 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays2 = ' '
}
}
}
if (this.mapDataDaysDeposits[2].key == 'Day 3') {
var count = 0, total = 0, avg = 0
if (days3[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days3[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray3.push(str1)
total = this.daysArray3.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray3.length
avg = total / count
this.avgDays3 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray3.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray3.length
avg = total / count
this.avgDays3 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray3.length > 0) {
total = this.daysArray3.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray3.length
avg = total / count
this.avgDays3 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays3 = ' '
}
}
}
if (this.mapDataDaysDeposits[3].key == 'Day 4') {
var count = 0, total = 0, avg = 0
if (days4[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days4[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray4.push(str1)
total = this.daysArray4.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray4.length
avg = total / count
this.avgDays4 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray4.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray4.length
avg = total / count
this.avgDays4 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray4.length > 0) {
total = this.daysArray4.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray4.length
avg = total / count
this.avgDays4 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays4 = ' '
}
}
}
if (this.mapDataDaysDeposits[4].key == 'Day 5') {
var count = 0, total = 0, avg = 0
if (days5[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days5[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray5.push(str1)
total = this.daysArray5.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray5.length
avg = total / count
this.avgDays5 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray5.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray5.length
avg = total / count
this.avgDays5 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray5.length > 0) {
total = this.daysArray5.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray5.length
avg = total / count
this.avgDays5 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays5 = ' '
}
}
}
if (this.mapDataDaysDeposits[5].key == 'Day 6') {
var count = 0, total = 0, avg = 0
if (days6[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days6[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray6.push(str1)
total = this.daysArray6.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray6.length
avg = total / count
this.avgDays6 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray6.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray6.length
avg = total / count
this.avgDays6 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray6.length > 0) {
total = this.daysArray6.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray6.length
avg = total / count
this.avgDays6 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays6 = ' '
}
}
}
if (this.mapDataDaysDeposits[6].key == 'Day 7') {
var count = 0, total = 0, avg = 0
if (days7[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days7[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray7.push(str1)
total = this.daysArray7.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray7.length
avg = total / count
this.avgDays7 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray7.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray7.length
avg = total / count
this.avgDays7 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray7.length > 0) {
total = this.daysArray7.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray7.length
avg = total / count
this.avgDays7 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays7 = ' '
}
}
}
if (this.mapDataDaysDeposits[7].key == 'Day 8') {
var count = 0, total = 0, avg = 0
if (days8[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days8[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray8.push(str1)
total = this.daysArray8.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray8.length
avg = total / count
this.avgDays8 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray8.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray8.length
avg = total / count
this.avgDays8 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray8.length > 0) {
total = this.daysArray8.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray8.length
avg = total / count
this.avgDays8 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays8 = ' '
}
}
}
if (this.mapDataDaysDeposits[8].key == 'Day 9') {
var count = 0, total = 0, avg = 0
if (days9[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days9[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray9.push(str1)
total = this.daysArray9.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray9.length
avg = total / count
this.avgDays9 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray9.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray9.length
avg = total / count
this.avgDays9 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray9.length > 0) {
total = this.daysArray9.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray9.length
avg = total / count
this.avgDays9 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays9 = ' '
}
}
}
if (this.mapDataDaysDeposits[9].key == 'Day 10') {
var count = 0, total = 0, avg = 0
if (days10[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days10[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray10.push(str1)
total = this.daysArray10.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray10.length
avg = total / count
this.avgDays10 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray10.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray10.length
avg = total / count
this.avgDays10 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray10.length > 0) {
total = this.daysArray10.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray10.length
avg = total / count
this.avgDays10 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays10 = ' '
}
}
}
if (this.mapDataDaysDeposits[10].key == 'Day 11') {
var count = 0, total = 0, avg = 0
if (days11[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days11[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray11.push(str1)
total = this.daysArray11.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray11.length
avg = total / count
this.avgDays11 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray11.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray11.length
avg = total / count
this.avgDays11 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray11.length > 0) {
total = this.daysArray11.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray11.length
avg = total / count
this.avgDays11 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays11 = ' '
}
}
}
if (this.mapDataDaysDeposits[11].key == 'Day 12') {
var count = 0, total = 0, avg = 0
if (days12[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days12[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray12.push(str1)
total = this.daysArray12.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray12.length
avg = total / count
this.avgDays12 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray12.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray12.length
avg = total / count
this.avgDays12 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray12.length > 0) {
total = this.daysArray12.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray12.length
avg = total / count
this.avgDays12 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays12 = ' '
}
}
}
if (this.mapDataDaysDeposits[12].key == 'Day 13') {
var count = 0, total = 0, avg = 0
if (days13[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days13[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray13.push(str1)
total = this.daysArray13.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray13.length
avg = total / count
this.avgDays13 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray13.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray13.length
avg = total / count
this.avgDays13 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray13.length > 0) {
total = this.daysArray13.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray13.length
avg = total / count
this.avgDays13 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays13 = ' '
}
}
}
if (this.mapDataDaysDeposits[13].key == 'Day 14') {
var count = 0, total = 0, avg = 0
if (days14[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days14[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray14.push(str1)
total = this.daysArray14.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray14.length
avg = total / count
this.avgDays14 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray14.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray14.length
avg = total / count
this.avgDays14 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray14.length > 0) {
total = this.daysArray14.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray14.length
avg = total / count
this.avgDays14 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays14 = ' '
}
}
}
if (this.mapDataDaysDeposits[14].key == 'Day 15') {
var count = 0, total = 0, avg = 0
if (days15[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days15[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray15.push(str1)
total = this.daysArray15.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray15.length
avg = total / count
this.avgDays15 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray15.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray15.length
avg = total / count
this.avgDays15 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray15.length > 0) {
total = this.daysArray15.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray15.length
avg = total / count
this.avgDays15 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays15 = ' '
}
}
}
if (this.mapDataDaysDeposits[15].key == 'Day 16') {
var count = 0, total = 0, avg = 0
if (days16[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days16[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray16.push(str1)
total = this.daysArray16.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray16.length
avg = total / count
this.avgDays16 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray16.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray16.length
avg = total / count
this.avgDays16 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray16.length > 0) {
total = this.daysArray16.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray16.length
avg = total / count
this.avgDays16 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays16 = ' '
}
}
}
if (this.mapDataDaysDeposits[16].key == 'Day 17') {
var count = 0, total = 0, avg = 0
if (days17[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days17[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray17.push(str1)
total = this.daysArray17.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray17.length
avg = total / count
this.avgDays17 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray17.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray17.length
avg = total / count
this.avgDays17 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray17.length > 0) {
total = this.daysArray17.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray17.length
avg = total / count
this.avgDays17 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays17 = ' '
}
}
}
if (this.mapDataDaysDeposits[17].key == 'Day 18') {
var count = 0, total = 0, avg = 0
if (days18[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days18[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray18.push(str1)
total = this.daysArray18.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray18.length
avg = total / count
this.avgDays18 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray18.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray18.length
avg = total / count
this.avgDays18 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray18.length > 0) {
total = this.daysArray18.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray18.length
avg = total / count
this.avgDays18 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays18 = ' '
}
}
}
if (this.mapDataDaysDeposits[18].key == 'Day 19') {
var count = 0, total = 0, avg = 0
if (days19[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days19[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray19.push(str1)
total = this.daysArray19.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray19.length
avg = total / count
this.avgDays19 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray19.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray19.length
avg = total / count
this.avgDays19 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray19.length > 0) {
total = this.daysArray19.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray19.length
avg = total / count
this.avgDays19 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays19 = ' '
}
}
}
if (this.mapDataDaysDeposits[19].key == 'Day 20') {
var count = 0, total = 0, avg = 0
if (days20[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days20[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray20.push(str1)
total = this.daysArray20.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray20.length
avg = total / count
this.avgDays20 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray20.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray20.length
avg = total / count
this.avgDays20 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray20.length > 0) {
total = this.daysArray20.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray20.length
avg = total / count
this.avgDays20 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays20 = ' '
}
}
}
if (this.mapDataDaysDeposits[20].key == 'Day 21') {
var count = 0, total = 0, avg = 0
if (days21[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days21[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray21.push(str1)
total = this.daysArray21.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray21.length
avg = total / count
this.avgDays21 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray21.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray21.length
avg = total / count
this.avgDays21 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray21.length > 0) {
total = this.daysArray21.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray21.length
avg = total / count
this.avgDays21 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays21 = ' '
}
}
}
if (this.mapDataDaysDeposits[21].key == 'Day 22') {
var count = 0, total = 0, avg = 0
if (days22[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days22[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray22.push(str1)
total = this.daysArray22.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray22.length
avg = total / count
this.avgDays22 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray22.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray22.length
avg = total / count
this.avgDays22 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray22.length > 0) {
total = this.daysArray22.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray22.length
avg = total / count
this.avgDays22 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays22 = ' '
}
}
}
if (this.mapDataDaysDeposits[22].key == 'Day 23') {
var count = 0, total = 0, avg = 0
if (days23[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days23[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray23.push(str1)
total = this.daysArray23.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray23.length
avg = total / count
this.avgDays23 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray23.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray23.length
avg = total / count
this.avgDays23 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray23.length > 0) {
total = this.daysArray23.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray23.length
avg = total / count
this.avgDays23 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays23 = ' '
}
}
}
if (this.mapDataDaysDeposits[23].key == 'Day 24') {
var count = 0, total = 0, avg = 0
if (days24[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days24[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray24.push(str1)
total = this.daysArray24.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray24.length
avg = total / count
this.avgDays24 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray24.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray24.length
avg = total / count
this.avgDays24 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray24.length > 0) {
total = this.daysArray24.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray24.length
avg = total / count
this.avgDays24 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays24 = ' '
}
}
}
if (this.mapDataDaysDeposits[24].key == 'Day 25') {
var count = 0, total = 0, avg = 0
if (days25[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days25[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray25.push(str1)
total = this.daysArray25.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray25.length
avg = total / count
this.avgDays25 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray25.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray25.length
avg = total / count
this.avgDays25 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray25.length > 0) {
total = this.daysArray25.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray25.length
avg = total / count
this.avgDays25 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays25 = ' '
}
}
}
if (this.mapDataDaysDeposits[25].key == 'Day 26') {
var count = 0, total = 0, avg = 0
if (days26[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days26[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray26.push(str1)
total = this.daysArray26.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray26.length
avg = total / count
this.avgDays26 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray26.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray26.length
avg = total / count
this.avgDays26 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray26.length > 0) {
total = this.daysArray26.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray26.length
avg = total / count
this.avgDays26 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays26 = ' '
}
}
}
if (this.mapDataDaysDeposits[26].key == 'Day 27') {
var count = 0, total = 0, avg = 0
if (days27[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days27[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray27.push(str1)
total = this.daysArray27.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray27.length
avg = total / count
this.avgDays27 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray27.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray27.length
avg = total / count
this.avgDays27 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray27.length > 0) {
total = this.daysArray27.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray27.length
avg = total / count
this.avgDays27 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays27 = ' '
}
}
}
if (this.mapDataDaysDeposits[27].key == 'Day 28') {
var count = 0, total = 0, avg = 0
if (days28[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days28[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray28.push(str1)
total = this.daysArray28.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray28.length
avg = total / count
this.avgDays28 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray28.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray28.length
avg = total / count
this.avgDays28 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray28.length > 0) {
total = this.daysArray28.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray28.length
avg = total / count
this.avgDays28 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays28 = ' '
}
}
}
if (this.mapDataDaysDeposits[28].key == 'Day 29') {
var count = 0, total = 0, avg = 0
if (days29[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days29[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray29.push(str1)
total = this.daysArray29.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray29.length
avg = total / count
this.avgDays29 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray29.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray29.length
avg = total / count
this.avgDays29 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray29.length > 0) {
total = this.daysArray29.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray29.length
avg = total / count
this.avgDays29 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays29 = ' '
}
}
}
if (this.mapDataDaysDeposits[29].key == 'Day 30') {
var count = 0, total = 0, avg = 0
if (days30[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days30[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray30.push(str1)
total = this.daysArray30.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray30.length
avg = total / count
this.avgDays30 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray30.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray30.length
avg = total / count
this.avgDays30 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray30.length > 0) {
total = this.daysArray30.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray30.length
avg = total / count
this.avgDays30 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays30 = ' '
}
}
}
if (this.mapDataDaysDeposits[30].key == 'Day 31') {
var count = 0, total = 0, avg = 0
if (days31[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(days31[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.daysArray31.push(str1)
total = this.daysArray31.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray31.length
avg = total / count
this.avgDays31 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.daysArray31.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray31.length
avg = total / count
this.avgDays31 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.daysArray31.length > 0) {
total = this.daysArray31.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray31.length
avg = total / count
this.avgDays31 = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDays31 = ' '
}
}
}
if (this.mapDataNegetiveDeposits[0].key == 'Negative Days (#)') {
var count = 0, total = 0, avg = 0
if (negDays[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(negDays[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.negativeDaysArray.push(str1)
total = this.negativeDaysArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.negativeDaysArray.length
avg = total / count
this.negativeDays = Math.round(avg)
}
else if (count > 0) {
total = this.negativeDaysArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.negativeDaysArray.length
avg = total / count
this.negativeDays = Math.round(avg)
}
else if (this.negativeDaysArray.length > 0) {
total = this.negativeDaysArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.negativeDaysArray.length
avg = total / count
this.negativeDays = Math.round(avg)
}
else {
this.negativeDays = ' '
}
}
}
if (this.mapDataNegetiveDeposits[1].key == 'NSFs (#)') {
var count = 0, total = 0, avg = 0
if (nsf[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(nsf[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.nsfArray.push(str1)
total = this.nsfArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.nsfArray.length
avg = total / count
this.nsfDays = Math.round(avg)
}
else if (count > 0) {
total = this.nsfArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.nsfArray.length
avg = total / count
this.nsfDays = Math.round(avg)
}
else if (this.nsfArray.length > 0) {
total = this.nsfArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.nsfArray.length
avg = total / count
this.nsfDays = Math.round(avg)
}
else {
this.nsfDays = ' '
}
}
}
if (this.mapDataAvgDaysDeposits[0].key == 'Avg Daily Balance($)') {
var count = 0, total = 0, avg = 0
if (avgDailyBalanceArray[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(avgDailyBalanceArray[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.AvgDayDepArray.push(str1)
total = this.AvgDayDepArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgDayDepArray.length
avg = total / count
this.avgDayDeposits = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.AvgDayDepArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgDayDepArray.length
avg = total / count
this.avgDayDeposits = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.AvgDayDepArray.length > 0) {
total = this.AvgDayDepArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgDayDepArray.length
avg = total / count
this.avgDayDeposits = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDayDeposits = ' '
}
}
}
if (this.mapDataBeginingDeposits[0].key == 'Beginning Balance($)') {
var count = 0, total = 0, avg = 0
if (beginingBalance[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(beginingBalance[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.begBalanceArray.push(str1)
total = this.begBalanceArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.begBalanceArray.length
avg = total / count
this.beginingBalances = this.dollarUSLocale.format(avg.toFixed(2))
this.avgBeginingBalance = this.beginingBalances
}
else if (count > 0) {
total = this.begBalanceArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.begBalanceArray.length
avg = total / count
this.beginingBalances = this.dollarUSLocale.format(avg.toFixed(2))
this.avgBeginingBalance = this.beginingBalances
}
else if (this.begBalanceArray.length > 0) {
total = this.begBalanceArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.begBalanceArray.length
avg = total / count
this.beginingBalances = this.dollarUSLocale.format(avg.toFixed(2))
this.avgBeginingBalance = this.beginingBalances
}
else {
this.beginingBalances = ' '
this.avgBeginingBalance = this.beginingBalances
}
if (this.overview.length == 0) {
this.overview.push({ type: 'Beginning Balance($)', name: this.bankLabel, amount: this.avgOtherDeposit })
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({ type: 'Beginning Balance($)', name: this.bankLabel, amount: this.avgOtherDeposit })
}
else if (data.name == this.bankLabel && data.type != 'Beginning Balance($)') {
this.overview.push({ type: 'Beginning Balance($)', name: this.bankLabel, amount: this.avgOtherDeposit })
}
else if (data.name == this.bankLabel && data.amount != this.avgOtherDeposit && data.type == 'Beginning Balance($)') {
this.overview[index] = { type: 'Beginning Balance($)', name: this.bankLabel, amount: this.avgOtherDeposit }
}
else {
return
}
})
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
}
if (this.mapDataBeginingDeposits[1].key == 'Ending Balance($)') {
var count = 0, total = 0, avg = 0
if (endingBalance[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(endingBalance[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.endBalanceArray.push(str1)
total = this.endBalanceArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.endBalanceArray.length
avg = total / count
this.endingBalances = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (count > 0) {
total = this.endBalanceArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.endBalanceArray.length
avg = total / count
this.endingBalances = this.dollarUSLocale.format(avg.toFixed(2))
}
else if (this.endBalanceArray.length > 0) {
total = this.endBalanceArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.endBalanceArray.length
avg = total / count
this.endingBalances = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.endingBalances = ' '
}
}
}
if (this.mapDataRevenueDeposits[2].key == 'Other Deposits($)') {
var count = 0, total = 0, avg = 0
if (avgOtherDep[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(avgOtherDep[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.AvgOtherDepositArray.push(str1)
total = this.AvgOtherDepositArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgOtherDepositArray.length
avg = total / count
this.avgOtherDeposit = this.dollarUSLocale.format(avg.toFixed(2))
this.avgOtherBal = this.avgOtherDeposit
}
else if(count > 0){total = this.AvgOtherDepositArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgOtherDepositArray.length
avg = total / count
this.avgOtherDeposit = this.dollarUSLocale.format(avg.toFixed(2))
this.avgOtherBal = this.avgOtherDeposit
}
else if(this.AvgOtherDepositArray.length>0){
total = this.AvgOtherDepositArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgOtherDepositArray.length
avg = total / count
this.avgOtherDeposit = this.dollarUSLocale.format(avg.toFixed(2))
this.avgOtherBal = this.avgOtherDeposit 
}
else {
this.avgOtherDeposit = ' '
this.avgOtherBal = this.avgOtherDeposit
}
if (this.overview.length == 0) {
this.overview.push({ type: 'Other Deposits($)', name: this.bankLabel, amount: this.avgOtherDeposit })
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({ type: 'Other Deposits($)', name: this.bankLabel, amount: this.avgOtherDeposit })
}
else if (data.name == this.bankLabel && data.type != 'Other Deposits($)') {
this.overview.push({ type: 'Other Deposits($)', name: this.bankLabel, amount: this.avgOtherDeposit })
}
else if (data.name == this.bankLabel && data.amount != this.avgOtherDeposit && data.type == 'Other Deposits($)') {
this.overview[index] = { type: 'Other Deposits($)', name: this.bankLabel, amount: this.avgOtherDeposit }
}
else {
return
}
})
}
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
if(this.mapDataRevenueDeposits[1].key == 'Revenue Deposits($)') {
var count = 0, total = 0, avg = 0
if (avgRev[e.target.dataset.index].value != ' ') {
console.log("new if");
var str1 = Number(JSON.stringify(avgRev[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.AvgRevDepositArray.push(str1)
total = this.AvgRevDepositArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgRevDepositArray.length
avg = total / count
this.avgRevDeposit = this.dollarUSLocale.format(avg.toFixed(2))
this.avgRevenueBal = this.avgRevDeposit
}
else if(count > 0){total = this.AvgRevDepositArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgRevDepositArray.length
avg = total / count
this.avgRevDeposit = this.dollarUSLocale.format(avg.toFixed(2))
this.avgRevenueBal = this.avgRevDeposit
}
else if(this.AvgRevDepositArray.length>0){
total = this.AvgRevDepositArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgRevDepositArray.length
avg = total / count
this.avgRevDeposit = this.dollarUSLocale.format(avg.toFixed(2))
this.avgRevenueBal = this.avgRevDeposit
}
else {
this.avgRevDeposit = ' '
this.avgRevenueBal = this.avgRevDeposit
}
if (this.overview.length == 0) {
this.overview.push({type:'Revenue Deposits($)', name: this.bankLabel, amount: this.avgRevDeposit })  
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({type:'Revenue Deposits($)', name: this.bankLabel, amount: this.avgRevDeposit })   
}
else if (data.name == this.bankLabel && data.type != 'Revenue Deposits($)') {
this.overview.push({type:'Revenue Deposits($)', name: this.bankLabel, amount: this.avgRevDeposit })   
}
else if (data.name == this.bankLabel && data.amount != this.avgRevDeposit && data.type == 'Revenue Deposits($)') {
this.overview[index] = {type:'Revenue Deposits($)',name: this.bankLabel, amount : this.avgRevDeposit }
}
else {
return
}
})
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
else {
console.log("empty");
}
}
if(this.mapDataRevenueDeposits[0].key == 'Deposits(#)') {
var count = 0, total = 0, avg = 0
if (arr1[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(arr1[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.depArr.push(str1)
total = this.depArr.reduce((partialSum, a) => partialSum + a, 0)
count = this.depArr.length
console.log("if ", total, " ", count);
avg = total / count
this.avgDeposits = Math.round(avg)
this.avgDeposBal = this.avgDeposits
}
else if (count > 0) {
total = this.depArr.reduce((partialSum, a) => partialSum + a, 0)
count = this.depArr.length
avg = total / count
console.log("1. else if ", total, " ", count);
this.avgDeposits = Math.round(avg)
this.avgDeposBal = this.avgDeposits
}
else if (this.depArr.length > 0) {
total = this.depArr.reduce((partialSum, a) => partialSum + a, 0)
count = this.depArr.length
avg = total / count
console.log("2. if ", total, " ", count);
this.avgDeposits = Math.round(avg)
this.avgDeposBal = this.avgDeposits
}
else {
this.avgDeposits = ' '
this.avgDeposBal = this.avgDeposits
}
if (this.overview.length == 0) {
this.overview.push({ type: 'Deposits(#)', name: this.bankLabel, amount: this.avgDeposits })
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({ type: 'Deposits(#)', name: this.bankLabel, amount: this.avgDeposits })
}
else if (data.name == this.bankLabel && data.type != 'Deposits(#)') {
this.overview.push({ type: 'Deposits(#)', name: this.bankLabel, amount: this.avgDeposits })
}
else if (data.name == this.bankLabel && data.amount != this.avgDeposits && data.type == 'Deposits(#)') {
this.overview[index] = { type: 'Deposits(#)', name: this.bankLabel, amount: this.avgDeposits }
}
else {
return
}
})
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
}
if (this.mapDataRevenueDeposits[3].key == 'Withdrawals($)') {
var count = 0, total = 0, avg = 0
if (avgWithdraw[e.target.dataset.index].value != ' ') {
var str1 = Number(JSON.stringify(avgWithdraw[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (str1 != NaN) {
this.AvgWithdrawArray.push(str1)
total = this.AvgWithdrawArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgWithdrawArray.length
avg = total / count
this.avgWithdraw = this.dollarUSLocale.format(avg.toFixed(2))
this.avgWithDrawlBal = this.avgWithdraw
}
else if (count > 0) {
total = this.AvgWithdrawArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgWithdrawArray.length
avg = total / count
this.avgWithdraw = this.dollarUSLocale.format(avg.toFixed(2))
this.avgWithDrawlBal = this.avgWithdraw
}
else if (this.AvgWithdrawArray.length > 0) {
total = this.AvgWithdrawArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgWithdrawArray.length
avg = total / count
this.avgWithdraw = this.dollarUSLocale.format(avg.toFixed(2))
this.avgWithDrawlBal = this.avgWithdraw
}
else {
this.avgWithdraw = ' '
this.avgWithDrawlBal = this.avgWithdraw
}
if (this.overview.length == 0) {
this.overview.push({ type: 'Withdrawals($)', name: this.bankLabel, amount: this.avgWithdraw })
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({ type: 'Withdrawals($)', name: this.bankLabel, amount: this.avgWithdraw })
}
else if (data.name == this.bankLabel && data.type != 'Withdrawals($)') {
this.overview.push({ type: 'Withdrawals($)', name: this.bankLabel, amount: this.avgWithdraw })
}
else if (data.name == this.bankLabel && data.amount != this.avgWithdraw && data.type == 'Withdrawals($)') {
this.overview[index] = { type: 'Withdrawals($)', name: this.bankLabel, amount: this.avgWithdraw }
}
else {
return
}
})
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
}
}
else {
setIncludeInCalculation({finStatementId: e.target.dataset.name, value: false, indexValue:e.target.dataset.index, appId:this.recordId})
.then(result => console.log(result))
.catch(error => console.log(JSON.stringify(error)));
if (this.mapDataAvgDaysDeposits[0].key == 'Avg Daily Balance($)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(avgDailyBalanceArray[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.AvgDayDepArray.length > 0) {
var loc = this.AvgDayDepArray.indexOf(str2)
if (loc >= 0) {
this.AvgDayDepArray.splice(loc, 1);
total = this.AvgDayDepArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgDayDepArray.length
if (count != 0) {
avg = total / count
this.avgDayDeposits = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.avgDayDeposits = ' '
}
}
} 
}
if (this.mapDataBeginingDeposits[0].key == 'Beginning Balance($)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(beginingBalance[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.begBalanceArray.length > 0) {
var loc = this.begBalanceArray.indexOf(str2)
if (loc >= 0) {
this.begBalanceArray.splice(loc, 1);
total = this.begBalanceArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.begBalanceArray.length
if (count != 0) {
avg = total / count
this.beginingBalances = this.dollarUSLocale.format(avg.toFixed(2))
this.avgBeginingBalance = this.beginingBalances 
}
else {
this.beginingBalances = ' '
this.avgBeginingBalance = this.beginingBalances 
}
}
if (this.overview.length == 0) {
this.overview.push({type:'Beginning Balance($)', name: this.bankLabel, amount: this.beginingBalances })  
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({type:'Beginning Balance($)', name: this.bankLabel, amount: this.beginingBalances })   
}
else if (data.name == this.bankLabel && data.type != 'Beginning Balance($)') {
this.overview.push({type:'Beginning Balance($)', name: this.bankLabel, amount: this.beginingBalances })   
}
else if (data.name == this.bankLabel && data.amount != this.beginingBalances && data.type == 'Beginning Balance($)') {
this.overview[index] = {type:'Beginning Balance($)',name: this.bankLabel, amount : this.beginingBalances }
}
else {
return
}
})
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
} 
}
if (this.mapDataBeginingDeposits[1].key == 'Ending Balance($)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(endingBalance[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.endBalanceArray.length > 0) {
var loc = this.endBalanceArray.indexOf(str2)
if (loc >= 0) {
this.endBalanceArray.splice(loc, 1);
total = this.endBalanceArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.endBalanceArray.length
if (count != 0) {
avg = total / count
this.endingBalances = this.dollarUSLocale.format(avg.toFixed(2))
}
else {
this.endingBalances = ' '
}
}
} 
}
if (this.mapDataRevenueDeposits[1].key == 'Revenue Deposits($)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(avgRev[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.AvgRevDepositArray.length > 0) {
var loc = this.AvgRevDepositArray.indexOf(str2)
if (loc >= 0) {
this.AvgRevDepositArray.splice(loc, 1);
total = this.AvgRevDepositArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgRevDepositArray.length
if (count != 0) {
avg = total / count
this.avgRevDeposit = this.dollarUSLocale.format(avg.toFixed(2))
this.avgRevenueBal =  this.avgRevDeposit
}
else {
this.avgRevDeposit = ' '
this.avgRevenueBal = this.avgRevDeposit
}
}
if (this.overview.length == 0) {
this.overview.push({type:'Revenue Deposits($)', name: this.bankLabel, amount: this.avgRevDeposit })  
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({type:'Revenue Deposits($)', name: this.bankLabel, amount: this.avgRevDeposit })   
}
else if (data.name == this.bankLabel && data.type != 'Revenue Deposits($)') {
this.overview.push({type:'Revenue Deposits($)', name: this.bankLabel, amount: this.avgRevDeposit })   
}
else if (data.name == this.bankLabel && data.amount != this.avgRevDeposit && data.type == 'Revenue Deposits($)') {
this.overview[index] = {type:'Revenue Deposits($)',name: this.bankLabel, amount : this.avgRevDeposit }
}
else {
return
}
})
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
}
if (this.mapDataRevenueDeposits[2].key == 'Other Deposits($)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(avgOtherDep[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.AvgOtherDepositArray.length > 0) {
var loc = this.AvgOtherDepositArray.indexOf(str2)
if (loc >= 0) {
this.AvgOtherDepositArray.splice(loc, 1);
total = this.AvgOtherDepositArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgOtherDepositArray.length
if (count != 0) {
avg = total / count
this.avgOtherDeposit = this.dollarUSLocale.format(avg.toFixed(2))
this.avgOtherBal = this.avgOtherDeposit
}
else {
this.avgOtherDeposit = ' '
this.avgOtherBal = this.avgOtherDeposit
}
}
if (this.overview.length == 0) {
this.overview.push({type:'Other Deposits($)', name: this.bankLabel, amount: this.avgOtherDeposit })  
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({type:'Other Deposits($)', name: this.bankLabel, amount: this.avgOtherDeposit })   
}
else if (data.name == this.bankLabel && data.type != 'Other Deposits($)') {
this.overview.push({type:'Other Deposits($)', name: this.bankLabel, amount: this.avgOtherDeposit })   
}
else if (data.name == this.bankLabel && data.amount != this.avgOtherDeposit && data.type == 'Other Deposits($)') {
this.overview[index] = {type:'Other Deposits($)',name: this.bankLabel, amount : this.avgOtherDeposit }
}
else {
return
}
})
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
}
if (this.mapDataRevenueDeposits[3].key == 'Withdrawals($)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(avgWithdraw[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.AvgWithdrawArray.length > 0) {
var loc = this.AvgWithdrawArray.indexOf(str2)
if (loc >= 0) {
this.AvgWithdrawArray.splice(loc, 1);
total = this.AvgWithdrawArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.AvgWithdrawArray.length
if (count != 0) {
avg = total / count
this.avgWithdraw = this.dollarUSLocale.format(avg.toFixed(2))
this.avgWithDrawlBal = this.avgWithdraw
}
else {
this.avgWithdraw = ' '
this.avgWithDrawlBal = this.avgWithdraw
}
}
if (this.overview.length == 0) {
this.overview.push({type:'Withdrawals($)', name: this.bankLabel, amount: this.avgWithdraw })  
}
else {
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({type:'Withdrawals($)', name: this.bankLabel, amount: this.avgWithdraw })   
}
else if (data.name == this.bankLabel && data.type != 'Withdrawals($)') {
this.overview.push({type:'Withdrawals($)', name: this.bankLabel, amount: this.avgWithdraw })   
}
else if (data.name == this.bankLabel && data.amount != this.avgWithdraw && data.type == 'Withdrawals($)') {
this.overview[index] = {type:'Withdrawals($)',name: this.bankLabel, amount : this.avgWithdraw }
}
else {
return
}
})
}
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
}
if (this.mapDataRevenueDeposits[0].key == 'Deposits(#)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(arr1[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.depArr.length > 0) {
var loc = this.depArr.indexOf(str2)
if (loc >= 0) {
this.depArr.splice(loc, 1);
total = this.depArr.reduce((partialSum, a) => partialSum + a, 0)
count = this.depArr.length
if (count != 0) {
avg = total / count
this.avgDeposits = Math.round(avg)
this.avgDeposBal = this.avgDeposBal + this.avgDeposits
}
else if(this.depArr.length == 0) {
this.avgDeposits = ' '
this.avgDeposBal = this.avgDeposits
}
}
this.overview.map((data, index) => {
if (data.name != this.bankLabel) {
this.overview.push({type:'Deposits(#)', name: this.bankLabel, amount: this.avgDeposits })   
}
else if (data.name == this.bankLabel && data.type != 'Deposits(#)') {
this.overview.push({type:'Deposits(#)', name: this.bankLabel, amount: this.avgDeposits })   
}
else if (data.name == this.bankLabel && data.amount != this.avgDeposits && data.type == 'Deposits(#)') {
this.overview[index] = {name: this.bankLabel, amount : this.avgDeposits }
}
else {
return
}
})
this.overview = this.overview.filter((value, index, self) =>
index === self.findIndex((t) => (
t.name === value.name && t.amount === value.amount && t.type === value.type
))
)
}
}
if (this.mapDataNegetiveDeposits[0].key == 'Negative Days (#)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(negDays[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.negativeDaysArray.length > 0) {
var loc = this.negativeDaysArray.indexOf(str2)
if (loc >= 0) {
this.negativeDaysArray.splice(loc, 1);
total = this.negativeDaysArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.negativeDaysArray.length
if (count != 0) {
avg = total / count
this.negativeDays = Math.round(avg)
}
else if(this.negativeDaysArray.length == 0) {
this.negativeDays = ' '
}
}
}
}
if (this.mapDataNegetiveDeposits[1].key == 'NSFs (#)') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(nsf[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.nsfArray.length > 0) {
var loc = this.nsfArray.indexOf(str2)
if (loc >= 0) {
this.nsfArray.splice(loc, 1);
total = this.nsfArray.reduce((partialSum, a) => partialSum + a, 0)
count = this.nsfArray.length
if (count != 0) {
avg = total / count
this.nsfDays = Math.round(avg)
}
else if(this.nsfArray.length == 0) {
this.nsfDays = ' '
}
}
}
}
if (this.mapDataDaysDeposits[0].key == 'Day 1') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days1[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray1.length > 0) {
var loc = this.daysArray1.indexOf(str2)
if (loc >= 0) {
this.daysArray1.splice(loc, 1);
total = this.daysArray1.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray1.length
if (count != 0) {
avg = total / count
this.avgDays1 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray1.length == 0) {
this.avgDays1 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[1].key == 'Day 2') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days2[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray2.length > 0) {
var loc = this.daysArray2.indexOf(str2)
if (loc >= 0) {
this.daysArray2.splice(loc, 1);
total = this.daysArray2.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray2.length
if (count != 0) {
avg = total / count
this.avgDays2 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray2.length == 0) {
this.avgDays2 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[2].key == 'Day 3') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days3[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray3.length > 0) {
var loc = this.daysArray3.indexOf(str2)
if (loc >= 0) {
this.daysArray3.splice(loc, 1);
total = this.daysArray3.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray3.length
if (count != 0) {
avg = total / count
this.avgDays3 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray3.length == 0) {
this.avgDays3 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[3].key == 'Day 4') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days4[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray4.length > 0) {
var loc = this.daysArray4.indexOf(str2)
if (loc >= 0) {
this.daysArray4.splice(loc, 1);
total = this.daysArray4.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray4.length
if (count != 0) {
avg = total / count
this.avgDays4 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray4.length == 0) {
this.avgDays4 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[4].key == 'Day 5') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days5[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray5.length > 0) {
var loc = this.daysArray5.indexOf(str2)
if (loc >= 0) {
this.daysArray5.splice(loc, 1);
total = this.daysArray5.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray5.length
if (count != 0) {
avg = total / count
this.avgDays5 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray5.length == 0) {
this.avgDays5 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[5].key == 'Day 6') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days6[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray6.length > 0) {
var loc = this.daysArray6.indexOf(str2)
if (loc >= 0) {
this.daysArray6.splice(loc, 1);
total = this.daysArray6.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray6.length
if (count != 0) {
avg = total / count
this.avgDays6 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray6.length == 0) {
this.avgDays6 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[6].key == 'Day 7') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days7[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray7.length > 0) {
var loc = this.daysArray7.indexOf(str2)
if (loc >= 0) {
this.daysArray7.splice(loc, 1);
total = this.daysArray7.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray7.length
if (count != 0) {
avg = total / count
this.avgDays7 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray7.length == 0) {
this.avgDays7 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[7].key == 'Day 8') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days8[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray8.length > 0) {
var loc = this.daysArray8.indexOf(str2)
if (loc >= 0) {
this.daysArray8.splice(loc, 1);
total = this.daysArray8.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray8.length
if (count != 0) {
avg = total / count
this.avgDays8 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray8.length == 0) {
this.avgDays8 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[8].key == 'Day 9') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days9[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray9.length > 0) {
var loc = this.daysArray9.indexOf(str2)
if (loc >= 0) {
this.daysArray9.splice(loc, 1);
total = this.daysArray9.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray9.length
if (count != 0) {
avg = total / count
this.avgDays9 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray9.length == 0) {
this.avgDays9 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[9].key == 'Day 10') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days10[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray10.length > 0) {
var loc = this.daysArray10.indexOf(str2)
if (loc >= 0) {
this.daysArray10.splice(loc, 1);
total = this.daysArray10.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray10.length
if (count != 0) {
avg = total / count
this.avgDays10 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray10.length == 0) {
this.avgDays10 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[10].key == 'Day 11') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days11[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray11.length > 0) {
var loc = this.daysArray11.indexOf(str2)
if (loc >= 0) {
this.daysArray11.splice(loc, 1);
total = this.daysArray11.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray11.length
if (count != 0) {
avg = total / count
this.avgDays11 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray11.length == 0) {
this.avgDays11 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[11].key == 'Day 12') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days12[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray12.length > 0) {
var loc = this.daysArray12.indexOf(str2)
if (loc >= 0) {
this.daysArray12.splice(loc, 1);
total = this.daysArray12.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray12.length
if (count != 0) {
avg = total / count
this.avgDays12 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray12.length == 0) {
this.avgDays12 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[12].key == 'Day 13') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days13[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray13.length > 0) {
var loc = this.daysArray13.indexOf(str2)
if (loc >= 0) {
this.daysArray13.splice(loc, 1);
total = this.daysArray13.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray13.length
if (count != 0) {
avg = total / count
this.avgDays13 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray13.length == 0) {
this.avgDays13 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[13].key == 'Day 14') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days14[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray14.length > 0) {
var loc = this.daysArray14.indexOf(str2)
if (loc >= 0) {
this.daysArray14.splice(loc, 1);
total = this.daysArray14.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray14.length
if (count != 0) {
avg = total / count
this.avgDays14 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray14.length == 0) {
this.avgDays14 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[14].key == 'Day 15') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days15[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray15.length > 0) {
var loc = this.daysArray15.indexOf(str2)
if (loc >= 0) {
this.daysArray15.splice(loc, 1);
total = this.daysArray15.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray15.length
if (count != 0) {
avg = total / count
this.avgDays15 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray15.length == 0) {
this.avgDays15 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[15].key == 'Day 16') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days16[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray16.length > 0) {
var loc = this.daysArray16.indexOf(str2)
if (loc >= 0) {
this.daysArray16.splice(loc, 1);
total = this.daysArray16.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray16.length
if (count != 0) {
avg = total / count
this.avgDays16 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray16.length == 0) {
this.avgDays16 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[16].key == 'Day 17') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days17[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray17.length > 0) {
var loc = this.daysArray17.indexOf(str2)
if (loc >= 0) {
this.daysArray17.splice(loc, 1);
total = this.daysArray17.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray17.length
if (count != 0) {
avg = total / count
this.avgDays17 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray17.length == 0) {
this.avgDays17 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[17].key == 'Day 18') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days18[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray18.length > 0) {
var loc = this.daysArray18.indexOf(str2)
if (loc >= 0) {
this.daysArray18.splice(loc, 1);
total = this.daysArray18.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray18.length
if (count != 0) {
avg = total / count
this.avgDays18 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray18.length == 0) {
this.avgDays18 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[18].key == 'Day 19') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days19[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray19.length > 0) {
var loc = this.daysArray19.indexOf(str2)
if (loc >= 0) {
this.daysArray19.splice(loc, 1);
total = this.daysArray19.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray19.length
if (count != 0) {
avg = total / count
this.avgDays19 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray19.length == 0) {
this.avgDays19 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[19].key == 'Day 20') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days20[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray20.length > 0) {
var loc = this.daysArray20.indexOf(str2)
if (loc >= 0) {
this.daysArray20.splice(loc, 1);
total = this.daysArray20.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray20.length
if (count != 0) {
avg = total / count
this.avgDays20 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray20.length == 0) {
this.avgDays20 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[20].key == 'Day 21') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days21[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray21.length > 0) {
var loc = this.daysArray21.indexOf(str2)
if (loc >= 0) {
this.daysArray21.splice(loc, 1);
total = this.daysArray21.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray21.length
if (count != 0) {
avg = total / count
this.avgDays21 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray21.length == 0) {
this.avgDays21 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[21].key == 'Day 22') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days22[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray22.length > 0) {
var loc = this.daysArray22.indexOf(str2)
if (loc >= 0) {
this.daysArray22.splice(loc, 1);
total = this.daysArray22.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray22.length
if (count != 0) {
avg = total / count
this.avgDays22 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray22.length == 0) {
this.avgDays22 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[22].key == 'Day 23') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days23[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray23.length > 0) {
var loc = this.daysArray23.indexOf(str2)
if (loc >= 0) {
this.daysArray23.splice(loc, 1);
total = this.daysArray23.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray23.length
if (count != 0) {
avg = total / count
this.avgDays23 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray23.length == 0) {
this.avgDays23 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[23].key == 'Day 24') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days24[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray24.length > 0) {
var loc = this.daysArray24.indexOf(str2)
if (loc >= 0) {
this.daysArray24.splice(loc, 1);
total = this.daysArray24.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray24.length
if (count != 0) {
avg = total / count
this.avgDays24 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray24.length == 0) {
this.avgDays24 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[24].key == 'Day 25') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days25[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray25.length > 0) {
var loc = this.daysArray25.indexOf(str2)
if (loc >= 0) {
this.daysArray25.splice(loc, 1);
total = this.daysArray25.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray25.length
if (count != 0) {
avg = total / count
this.avgDays25 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray25.length == 0) {
this.avgDays25 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[25].key == 'Day 26') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days26[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray26.length > 0) {
var loc = this.daysArray26.indexOf(str2)
if (loc >= 0) {
this.daysArray26.splice(loc, 1);
total = this.daysArray26.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray26.length
if (count != 0) {
avg = total / count
this.avgDays26 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray26.length == 0) {
this.avgDays26 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[26].key == 'Day 27') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days27[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray27.length > 0) {
var loc = this.daysArray27.indexOf(str2)
if (loc >= 0) {
this.daysArray27.splice(loc, 1);
total = this.daysArray27.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray27.length
if (count != 0) {
avg = total / count
this.avgDays27 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray27.length == 0) {
this.avgDays27 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[27].key == 'Day 28') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days28[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray28.length > 0) {
var loc = this.daysArray28.indexOf(str2)
if (loc >= 0) {
this.daysArray28.splice(loc, 1);
total = this.daysArray28.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray28.length
if (count != 0) {
avg = total / count
this.avgDays29 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray28.length == 0) {
this.avgDays29 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[28].key == 'Day 29') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days29[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray29.length > 0) {
var loc = this.daysArray29.indexOf(str2)
if (loc >= 0) {
this.daysArray29.splice(loc, 1);
total = this.daysArray29.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray29.length
if (count != 0) {
avg = total / count
this.avgDays29 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray29.length == 0) {
this.avgDays29 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[29].key == 'Day 30') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days30[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray30.length > 0) {
var loc = this.daysArray30.indexOf(str2)
if (loc >= 0) {
this.daysArray30.splice(loc, 1);
total = this.daysArray30.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray30.length
if (count != 0) {
avg = total / count
this.avgDays30 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray30.length == 0) {
this.avgDays30 = ' '
}
}
}
}
if (this.mapDataDaysDeposits[30].key == 'Day 31') {
var count = 0, total = 0, avg = 0
var str2 = Number(JSON.stringify(days31[e.target.dataset.index].value).replace(/[^0-9.-]+/g, ""));
if (this.daysArray31.length > 0) {
var loc = this.daysArray31.indexOf(str2)
if (loc >= 0) {
this.daysArray31.splice(loc, 1);
total = this.daysArray31.reduce((partialSum, a) => partialSum + a, 0)
count = this.daysArray31.length
if (count != 0) {
avg = total / count
this.avgDays31 = this.dollarUSLocale.format(avg.toFixed(2))
}
else if(this.daysArray31.length == 0) {
this.avgDays31 = ' '
}
}
}
}
}
}
}