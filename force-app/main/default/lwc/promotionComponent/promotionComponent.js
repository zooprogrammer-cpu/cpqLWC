import { LightningElement,api,wire} from 'lwc';
import getPromotionList from '@salesforce/apex/PromotionController.getPromotionList';

export default class PromotionComponent extends LightningElement {
    headings=["Id","Name"]
    fullTableData=[]
    filteredTableData=[]
    timer
    filterBy = "All"
    @api quotedata;
    @wire(getPromotionList)
    promoHandler({data,error}){
        if(data){
            console.log(data)
            this.fullTableDate = data
            this.filteredTableData = data
        }
        if(error){
            console.log(error)
        }
    }


    get FilterByOptions(){
        return [
            {label:"All", value:'All'},
            {label:"Id", value:'Id'},
            {label:'Name', value:'Name'}
        ]
    }

    filterbyHandler(event){
        this.filterBy = event.target.value
    }

    filterHandler(event){
        const {value} = event.target
        window.clearTimeout(this.timer)
        if(value){
            this.timer = window.setTimeout(()=>{
                console.log(value)
                this.filteredData = this.fullTableData.filter(eachObj=>{
                    if(this.filterBy === 'All'){
                        /**Below logic will filter each and every property of object */
                        return Object.keys(eachObj).some(key=>{
                            return eachObj[key].toLowerCase().includes(value)
                        })
                    } else {
                         /**Below logic will filter only selected fields */
                        const val = eachObj[this.filterBy] ? eachObj[this.filterBy]:''
                        return val.toLowerCase().includes(value)
                    }
                })
            }, 500)
            
        } else {
            this.filteredData = [...this.fullTableData]
        }
        
    }


}