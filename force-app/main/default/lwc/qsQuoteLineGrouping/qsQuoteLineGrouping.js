import { LightningElement,api,track } from 'lwc';

export default class QsQuoteLineGrouping extends LightningElement {
    @api quoteLines;
    // @api bundleId; 
    // @api showInstall;
    // @api showMonthly;
    // @api installmentValue;
    @track topLevelBundles = [];
    @track planSummaryValuesSet = new Set();
    @track planSummaryArray = [];
    headings = ["Product Name & Qty", "Net Total"]
    @api installmentsValue

    
    connectedCallback(){
        console.log(`newQsTopLevelBundleProduct`);
        try{
            this.createTopLevelGroups(); 
        } catch(error){
            console.error(`Unable to create Top Level Groups`, error)
        }
    }

    @api refreshTable(){
        this.topLevelBundles=[]
        this.planSummaryValuesSet = new Set()
        this.planSummaryArray = []
        this.createTopLevelGroups()
    }


// create top most level groups to be displayed 

    createTopLevelGroups(){
        this.topLevelBundles = this.quoteLines.filter(line=>{
            return !line.SBQQ__RequiredBy__c && !line.SBQQ__ProductOption__c
        })

        this.quoteLines.forEach(line=>{
            if(line.SBQQ__RequiredBy__c === this.topLevelBundles.id){
                this.createGroups(line.Id)
            }
        })
    }


// create a unique set of plan summary values quote lines required by each top level product
    createGroups(topLevelProductId){
        this.quoteLines.forEach(line=>{
                // if(line.SBQQ__RequiredBy__c === topLevelProductId && line.Plan_Summary__c !== undefined){
                if(line.SBQQ__RequiredBy__c === topLevelProductId || line.Id === topLevelProductId ){
                    this.planSummaryValuesSet.add(line.Plan_Summary__c);
                }
        })

// create array for each plan summary set        
        this.planSummaryValuesSet.forEach(value=>{
            console.log(`Values`,value);
            this.planSummaryArray.push({
                planSummary : value,                
                children : this.filterChildren(value,topLevelProductId),
                //grandChildren : this.filterGrandChildren(children.id),
                //installSubTotal : this.installSubTotal,
                //monitoringSubTotal : this.monitoringSubTotal,
                netSubTotal : this.netSubTotal,
                subTotalDesc : value === "0-None" ? null : this.genSubTotalDesc(value) + " Subtotal",
                title : value === "0-None" ? null : this.titleFromChild,
                parent : this.parentFromChild
            });
        })
        console.log(`planSummaryArray`,this.planSummaryArray);
        console.table(JSON.parse(JSON.stringify(this.planSummaryArray)))
    }

// filter children products that are required by the top level product and for specfic plan summary    
    filterChildren(value,topLevelProductId){
        let matchingValues = [];
        this.quoteLines.forEach(line=>{
            if(line.Plan_Summary__c == value && (line.SBQQ__RequiredBy__c === topLevelProductId || line.Id === topLevelProductId)){
                let obj ={
                    id : line.Id,
                    qty : line.Id === topLevelProductId ? null : line.SBQQ__Quantity__c,
                    name : line.SBQQ__ProductName__c,
                    netTotal  : line.SBQQ__NetTotal__c,
                    //install : line.Install__c,
                    //monitoring : line.Monitoring__c,
                    monthly : this.calculateMonthly(line.SBQQ__NetTotal__c, this.installmentValue),
                    title : line.Plan_Summary_Title__c,
                    parent : line.RequiredBy_Text__c,
                    customStyle : line.Id === topLevelProductId ? "slds-theme_shade slds-text-heading_small slds-var-p-around_x-small": "slds-text-color_default slds-var-p-around_x-small",
                    grandChildren : this.filterGrandChildren(line.Id,topLevelProductId) 
                }
                matchingValues.push(obj);
            }
        })
        console.log(`matchingValues:`, matchingValues)
        //console.log(matchingValues)
        //this.sumInstallSubTotal(matchingValues)
        //this.sumMonitoringSubTotal(matchingValues)
        this.sumNetSubTotal(matchingValues)
        this.retrieveTitle(matchingValues)
        this.retrieveParent(matchingValues)

        return matchingValues;
    }

    // filter grandchildren products that are required by the children product    
    filterGrandChildren(childProductId,topLevelProductId){
        let matchingValues = [];
        this.quoteLines.forEach(line=>{
            if(line.SBQQ__RequiredBy__c === childProductId && line.SBQQ__RequiredBy__c !== topLevelProductId){
                let obj ={
                    id : line.Id,
                    qty : line.SBQQ__Quantity__c,
                    name : line.SBQQ__ProductName__c,
                    netTotal  : line.SBQQ__NetTotal__c,
                    //install : line.Install__c,
                    //monitoring : line.Monitoring__c,
                    monthly : this.calculateMonthly(line.SBQQ__NetTotal__c, this.installmentValue),
                    title : line.Plan_Summary_Title__c,
                    parent: line.RequiredBy_Text__c
                }
                matchingValues.push(obj);
            }
        })
        console.log(`matchingValues:`)
        console.log(matchingValues)
        //this.sumInstallSubTotal(matchingValues)
        //this.sumMonitoringSubTotal(matchingValues)
        // this.sumNetSubTotal(matchingValues)
        // this.retrieveTitle(matchingValues)
        // this.retrieveParent(matchingValues)

        return matchingValues;
    }

//calculate Monitoring SubTotal    
    sumNetSubTotal(matchingValues){
        this.netSubTotal = matchingValues.reduce((total,value)=>{
            return total = total + value.netTotal
        },0)
        console.log(`netSubTotal:`,this.netSubTotal)
    }
// calculate Install SubTotal    
    // sumInstallSubTotal(matchingValues){
    //     this.installSubTotal = matchingValues.reduce((total,value)=>{
    //         return total = total + value.install
    //     },0)
    //     console.log(`installSubTotal:`,this.installSubTotal)
    // }

// calculate Monitoring SubTotal    
    // sumMonitoringSubTotal(matchingValues){
    //     this.monitoringSubTotal = matchingValues.reduce((total,value)=>{
    //         return total = total + value.monitoring
    //     },0)
    //     console.log(`monitoringSubTotal:`,this.monitoringSubTotal)
    // }

// retreive the plan summary title from child products to be displayed per group    
    retrieveTitle(matchingValues){
        this.titleFromChild = matchingValues.reduce((reval,each,i)=>{
            return each.title; 
        },{})
        console.log(`titleFromChild:`, this.titleFromChild)
    }

// retreive the parent product from child products
    retrieveParent(matchingValues){
        this.parentFromChild = matchingValues.reduce((reval,each,i)=>{
            return each.parent; 
        },{})
        console.log(`parentFromChild:`, this.parentFromChild)
    }    

// generate Sub-Total description based on the plan summary value per group    

    genSubTotalDesc(value){
        return (value.substring(value.indexOf("-") + 1))
    }

       //Logic to display and divide values in the Monthly Column

   calculateMonthly(install, installmentValue){  
    if(installmentValue === 'Pay In Full'){
        this.showInstall = true;
        this.showMonthly = false;
        return 0;
    } else {
        switch(installmentValue){
            case '3Pay':{
                this.showInstall = false;
                this.showMonthly = true;
                return (install / 3);
            }
            case '12 Months':{
                this.showInstall = false;
                this.showMonthly = true;
                return (install / 12);
            }
            case '24 Months':{
                this.showInstall = false;
                this.showMonthly = true;
                return (install / 24);
            }
            case '36 Months':{
                this.showInstall = false;
                this.showMonthly = true;
                return (install / 36);
            }
            case '60 Months':{
                this.showInstall = false;
                this.showMonthly = true;
                return (install / 60);
            }
        }
    }        
}

//Installments value selection refresh Table

    @api refreshChildLines(installmentValue){
        console.log('>>>refreshChildLines()');
        console.log('installmentValue after refreshChildLines: ' + installmentValue);
        this.installmentValue = installmentValue;
        this.refreshTable(); 
    }

}