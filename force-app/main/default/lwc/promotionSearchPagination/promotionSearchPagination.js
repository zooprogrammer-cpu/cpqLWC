import { LightningElement,api } from 'lwc';

export default class PromotionSearchPagination extends LightningElement {
    currentPage =1
    totalRecords
    @api recordSize = 5
    totalPage = 0
    get records(){
        return this.visibleRecords
    }
    @api 
    set records(data){
        if(data){ 
            this.totalRecords = data
            this.recordSize = Number(this.recordSize)
            this.totalPage = Math.ceil(data.length/this.recordSize) //How many total pages are required
            this.updateRecords()
        }
    }

    get disablePrevious(){ 
        return this.currentPage<=1
    }
    get disableNext(){ 
        return this.currentPage>=this.totalPage
    }
    //Clicking the Previous Button will call this method
    previousHandler(){ 
        if(this.currentPage>1){
            this.currentPage = this.currentPage-1 // decreases the page by 1
            this.updateRecords()
        }
    }
    //Clicking the Next Button will call this method
    nextHandler(){
        if(this.currentPage < this.totalPage){
            this.currentPage = this.currentPage+1 // increases the page by 1
            this.updateRecords()
        }
    }
    //This method displays records page by page
    updateRecords(){ 
        const start = (this.currentPage-1)*this.recordSize
        const end = this.recordSize*this.currentPage
        this.visibleRecords = this.totalRecords.slice(start, end)
        this.dispatchEvent(new CustomEvent('update',{ 
            detail:{ 
                records:this.visibleRecords
            }
        }))
    }
}