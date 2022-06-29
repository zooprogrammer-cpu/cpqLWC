import { LightningElement,api,track } from 'lwc';

export default class QsQuoteLineGrouping extends LightningElement {
    @api quoteLines;
    // @api bundleId; 
    // @api showInstall;
    // @api showMonthly;
    // @api installmentValue;
    topLevelBundles = [];
    planSummaryValuesSet = new Set();
    @track planSummaryArray = [];
    headings = ["Product Name","Qty","Net Price", "Net Total"]

    
    connectedCallback(){
        console.log(`newQsTopLevelBundleProduct`);
        try{
            this.createTopLevelGroups(); 
        } catch(error){
            console.error(`Unable to create Top Level Groups`, error)
        }
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
                if(line.SBQQ__RequiredBy__c === topLevelProductId && line.Plan_Summary__c !== undefined){
                    this.planSummaryValuesSet.add(line.Plan_Summary__c);
                }
        })

// create array for each plan summary set        
        this.planSummaryValuesSet.forEach(value=>{
            console.log(`Values`,value);
            this.planSummaryArray.push({
                planSummary : value,                
                children : this.filterChildren(value,topLevelProductId),
                installSubTotal : this.installSubTotal,
                monitoringSubTotal : this.monitoringSubTotal,
                subTotalDesc : this.genSubTotalDesc(value),
                title : this.titleFromChild,
                parent : this.parentFromChild
            });
        })
        console.log(`planSummaryArray`,this.planSummaryArray);
    }

// filter children products that are required by the tope level product and for specfic plan summary    
    filterChildren(value,topLevelProductId){
        let matchingValues = [];
        this.quoteLines.forEach(line=>{
            if(line.Plan_Summary__c == value && line.SBQQ__RequiredBy__c === topLevelProductId ){
                let obj ={
                    id : line.Id,
                    qty : line.SBQQ__Quantity__c,
                    name : line.SBQQ__ProductName__c,
                    install : line.Install__c,
                    monitoring : line.Monitoring__c,
                    title : line.Plan_Summary_Title__c,
                    parent: line.RequiredBy_Text__c 
                }
                matchingValues.push(obj);
            }
        })
        console.log(`matchingValues:`)
        console.log(matchingValues)
        this.sumInstallSubTotal(matchingValues)
        this.sumMonitoringSubTotal(matchingValues)
        this.retrieveTitle(matchingValues)
        this.retrieveParent(matchingValues)

        return matchingValues;
    }

// calculate Install SubTotal    
    sumInstallSubTotal(matchingValues){
        this.installSubTotal = matchingValues.reduce((total,value)=>{
            return total = total + value.install
        },0)
        console.log(`installSubTotal:`,this.installSubTotal)
    }

// calculate Monitoring SubTotal    
    sumMonitoringSubTotal(matchingValues){
        this.monitoringSubTotal = matchingValues.reduce((total,value)=>{
            return total = total + value.monitoring
        },0)
        console.log(`monitoringSubTotal:`,this.monitoringSubTotal)
    }

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
        return value.substring(value.indexOf("-") + 1)
    }

}