import { LightningElement, api, track } from 'lwc';
import getBankAccountDetails from '@salesforce/apex/MCABankStatementController.getBankAccounts';
import getStatements from '@salesforce/apex/MCABankStatementController.getBankStatements';
import calculateGrandTotal from '@salesforce/apex/CalculateTotalAndAverage.calculateGrandTotal';

export default class McaStatementView extends LightningElement {
    @track banks = []
    @api bankId
    @track months = []
    @track monthSelected = []
    @track selectedIndex
    @track grandTotal = []
    @track average = []
    showDollar = true
    data = [{
		grouping: 'Business Deposit',
		category: [{
			name: "Transfer",
			subCategory: [{ name: 'All Others', value: [100.00, 200.00, 300.00, 400.00, 500.00] },
				{ name: 'Credit', value: [159.67, 123.98, 654.88, 573.50, 786.00] },
				{ name: 'Deposit', value: [654.35, 159.87, 357.12, 654.22, 987.35] },
                { name: 'Check', value: [159.76, 123.80, 654.95, 573.00, 987.34] },
                
            ],
            
        },{
            name: "Transfer Total",
            subCategory: [{name:'-',value: [1073.78, 607.65, 1966.95, 2200.72, 3260.69]}]   
        }]  
},{
		grouping: 'Business Deposit Total',
		category: [{
			name: "",
			subCategory: [{ name:'-', value: [1073.78, 607.65, 1966.95, 2200.72, 3260.69] }],
            
        }]  
},{
		grouping: 'Deposit Total',
		category: [{
			name: "",
			subCategory: [{ name:'-', value: [1073.78, 607.65, 1966.95, 2200.72, 3260.69] }],
            
        }]  
},
{
		grouping: 'Business Debits',
		 category: [{
			name: "Service",
			subCategory: [{ name: 'All Others', value: ['(100.09)', '(200.06)', '(300.67)', '(400.95)', '(287.45)'] },
				{ name: 'Insurance', value: ['(955.56)', '(251.77)', '(487.88)', '(525.35)', '(985.65)'] },
                { name: 'Utilities', value: ['(159.00)', '(123.50)', '(654.00)', '(573.00)', '(984.09)'] },
                
			] 
         },
         {
            name: "Service Total",
            subCategory: [{name:'-',value: ['(1214.65)', '(575.33)', '(1442.55)', '(1499.30)', '(2257.19)']}]   
        },
		 {
			name: "Shops",
			subCategory: [{ name: 'All Others', value: ['(105.00)', '(250.98)', '(300.00)', '(400.55)', '(856.75)'] },
                { name: 'Computers and Electronics', value: ['(250.55)', '(463.20)', '(986.45)', '(477.50)','(100.00)'] },
                 
				 
			] 
			 },{
            name: "Shops Total",
            subCategory: [{name:'-',value: ['(355.55)', '(714.18)', '(1286.45)', '(878.05)', '(956.75)']}]   
        },
			 {
			name: "Payment",
			subCategory: [{ name: 'All Others', value: ['(100.55)', '(200.65)', '(300.50)', '(400.75)', '(800.20)'] },
				{ name: 'Credit Card', value: ['(265.00)','(464.55)','(980.67)','(470.50)','(100.00)'] },
				  
			] 
			 },{
            name: "Payment Total",
            subCategory: [{name:'-',value: ['(365.55)', '(665.2)', '(1281.17)', '(871.25)', '(900.20)']}]   
        },
			 {
			name: "Transfer",
			subCategory: [{ name: 'Debit', value: ['(100.50)', '(200.80)', '(300.75)', '(400.80)', '(550.85)'] },
				{ name: 'Payroll', value: ['(250.00)', '(460.75)', '(980.95)', '(470.25)', '(755.00)'] },
				 { name: 'Check', value: ['(250.00)','(460.55)','(980.00)','(470.75)', '(650.75)'] },
				  { name: 'Withdrawal', value: ['(255.00)', '(460.65)', '(985.30)', '(477.98)', '(576.00)'] },
                { name: 'Wire', value: ['(255.09)', '(466.95)', '(978.35)', '(487.00)', '(965.78)'] },
                   
			] 
			 },{
            name: "Transfer Total",
            subCategory: [{name:'-',value: ['(1110.59)', '(1844.05)', '(4225.35)', '(2306.78)', '(3498.38)']}]   
        },
			 {
			name: "Food and Drink",
                 subCategory: [{ name: 'All Others', value: ['(100.12)', '(200.23)', '(300.34)', '(400.35)', '(587.25)'] },
                
			] 
             },
             {
            name: "Food and Drink Total",
            subCategory: [{name:'-',value: ['(100.12)', '(200.23)', '(300.34)', '(400.35)', '(587.25)']}]   
        },
			 {
			name: "Bank Fees",
                 subCategory: [{ name: 'Overdraft', value: ['(100.25)', '(200.00)', '(300.45)', '(400.95)', '(740.00)'] },
                 
			] 
			 },{
            name: "Bank Total",
            subCategory: [{name:'-',value: ['(100.25)', '(200.00)', '(300.45)', '(400.95)', '(740.00)']}]   
        },
			 {
			name: "Community",
                 subCategory: [{ name: 'All Others', value: ['(100.00)', '(200.04)', '(300.86)', '(400.34)', '(878.98)'] },
                 
			] 
			 },{
            name: "Community Total",
            subCategory: [{name:'-',value: ['(100.00)', '(200.04)', '(300.86)', '(400.34)', '(878.98)']}]   
        }
		 ]  
	},{
		grouping: 'Business Debits Total',
		category: [{
            name: "",
            subCategory: [{name:'-',value: ['(2981.04)', '(4398.8)', '(9136.83)', '(6757.02)', '(9818.5)']}]   
        }]  
},{
		grouping: 'Debits Total',
		category: [{
            name: "",
            subCategory: [{name:'-',value: ['(2981.04)', '(4398.8)', '(9136.83)', '(6757.02)', '(9818.5)']}]   
        }]  
},{
		grouping: 'Business Grand Total',
		category: [{
            name: "",
            subCategory: [{name:'-',value: ['(1907.26)', '(3791.15)', '(7169.88)', '(4556.30)', '(6557.81)']}]   
        }]  
},{
		grouping: 'Grand Total',
		category: [{
            name: "",
            subCategory: [{name:'-',value: ['(1907.26)', '(3791.15)', '(7169.88)', '(4556.30)', '(6557.81)']}]   
        }]  
}]
    show=true
    title = this.data[0].category[0]
    bankNames = {};
    TableTitle
    @api recordId
    connectedCallback() {
        
        // this.getBankAccount()
        this.handleActive()
       
    }
    
    getBankAccount = () => {
        getBankAccountDetails({ recordId: this.recordId }).then(res => {
            console.log("Res ", res);
             this.banks.length = 0
        this.banks = res;
        for(let key in res) {
            this.bankNames[res[key].Bank_Account_Name__c] = [];
        }
        }).catch(err => {
        console.log("getBankAccountDetails err ",err);   
    })
         
    }
    handleActive = (e) => {
        getStatements({ bankId: this.bankId }).then(res => {
            console.log("res ", res);
            this.months = res
        }).then(() => {
            this.showDollar = false
          var table = this.template.querySelectorAll('.noBorder');
        console.log("table ", table.length);
         for (var i = 0; i < table.length; i++){
            this.grandTotal.push(i)
            this.average.push(i)
        }  
        }).catch(err => {
          console.log("getStatements err ",err);
      })  
    }
    getGrandTotal = () => {
       this.showDollar = true
        this.average = []
        var table = this.template.querySelectorAll('.noBorder');
        var rowSums = [];
        var pattern = /[()]/
        var cellValue = ''
        console.log("table length ",table.length);
        for (var i = 0; i < table.length; i++) {
            var rowSum = 0;
            cellValue = this.template.querySelectorAll(`[data-name='${this.selectedIndex}']`)[i].innerHTML
            if (pattern.test(cellValue)) {
                cellValue = cellValue.replace(/[()]/g, '');
            }
            else if (cellValue.length == 0) {
                cellValue = 0
            }
            var cellNumber = parseFloat(cellValue);
             
            if (!isNaN(cellNumber)) {    
                rowSum += cellNumber;
            } 
            rowSums.push(rowSum);
        }
        console.log("rowsum length ", rowSums.length);
        
        if (this.monthSelected.length == 1) {
            this.grandTotal = rowSums
        }
        else {
            this.grandTotal = this.grandTotal.map(function (num, idx) {          
            console.log(parseFloat(num) ," ", rowSums[idx], " index ",idx);
            return parseFloat(parseFloat(num) + rowSums[idx]).toFixed(2);
            }); 
        }
        console.log('grand total ', JSON.stringify(this.grandTotal));
        this.average = this.grandTotal.map((value, i) => {
            return parseFloat(value/this.monthSelected.length).toFixed(2)
        })
        console.log('average ', JSON.stringify(this.average));
       
    }
    getGrandTotalDeselect = () => {
        this.showDollar = true
        console.log("selected Index ",this.selectedIndex);
        this.average = []
        var table = this.template.querySelectorAll('.noBorder');
        var rowSums = [];
        var pattern = /[()]/
        var cellValue = ''
        for (var i = 0; i < table.length; i++) {
            var rowSum = 0;
            cellValue = this.template.querySelectorAll(`[data-name='${this.selectedIndex}']`)[i].innerHTML
            if (pattern.test(cellValue)) {
                cellValue = cellValue.replace(/[()]/g, '');
            }
            else if (cellValue.length == 0) {
                cellValue = 0
            }
            var cellNumber = parseFloat(cellValue);
            console.log("cell number ",cellNumber);
             
            if (!isNaN(cellNumber)) {    
                rowSum += cellNumber;
            } 
            rowSums.push(rowSum);
        }
        console.log("this.monthSelected.length ",this.monthSelected.length);
        if (this.monthSelected.length == 0) {
            this.grandTotal = []
            this.showDollar = false
            for (i = 0; i < table.length; i++){
                this.grandTotal.push('')
            }
        }
        else {
            this.showDollar = true
            console.log("into else");
            this.grandTotal = this.grandTotal.map(function (num, idx) {          
              
            return parseFloat(num - rowSums[idx]).toFixed(2);
            }); 
        }
        console.log('grand total ', JSON.stringify(this.grandTotal));
        this.average = this.grandTotal.map((value, i) => {
            if (this.monthSelected.length != 0) {
                
                return parseFloat(value/this.monthSelected.length).toFixed(2)
            }
            else return ''
        })
        console.log('average ', JSON.stringify(this.average));
    }
    handleCheckBoxChange = (e) => {
        if (e.target.checked) {
            this.monthSelected.push(e.target.dataset.name);
            this.selectedIndex = this.months.indexOf(e.target.dataset.name)
            this.getGrandTotal()
        }
        else {
            var index = this.monthSelected.indexOf(e.target.dataset.name);
            if (index > -1) {
            this.monthSelected.splice(index, 1); // Remove array element
            }   
            this.selectedIndex = this.months.indexOf(e.target.dataset.name)
             this.getGrandTotalDeselect()
        }
     
}
}