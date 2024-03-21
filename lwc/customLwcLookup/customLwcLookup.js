import { LightningElement,api } from 'lwc';
import fetchRecordsforlookup from '@salesforce/apex/CustomRecordController.fetchRecordsforlookup';
export default class CustomLwcLookup extends LightningElement {
    @api searchLabel
    @api objectName
    @api fieldName
    @api iconName='standard:account'
    @api parentIdfield
    searchedResults
    searchkeyword
    error
    selectedRecord
    searchHandler(event){
        
        let keyword=event.detail.value;
        this.searchkeyword=keyword;
        console.log(keyword,'event listened')
        if(keyword && keyword.length>2){
            this.searchRecords(keyword);
        }
    }
    handleSelect(event){
        this.selectedRecord=event.detail.selectedrecord;
        let finalRecEvent = new CustomEvent('select', {
            detail: { selectedRecordId: this.selectedRecord.Id, parentfield: this.parentIdfield }
        });
        this.dispatchEvent(finalRecEvent);
    }
    @api handleRemove() {
        this.selectedRecord = undefined;
        this.searchedResults = undefined;
        let finalRecEvent = new CustomEvent('select', {
            detail: { selectedRecordId: undefined, parentfield: this.parentidfield }
        });
        this.dispatchEvent(finalRecEvent);
    }
    searchRecords(keyword){
        console.log('Inside key');
        fetchRecordsforlookup({
            fieldName:this.fieldName,
            objectName:this.objectName,
            searchKey:keyword
        }).then(result=>{
            console.log(result,'results')
            if(result.success){
                let res=result.sobjectList[0];
                console.log(res,'before');
                //res.forEach(item=> item.Name=item[this.fieldName])
                for(let i=0; i<res.length;i++){
                    let record=res[i];
                    record.Name=record[this.fieldName];
                }
                console.log(res,'after');
                this.searchedResults=res;
                console.log(res[0],'data')
                this.error=undefined;
            }
            else{
                console.log('error',result.message);
                console.log(result.success)
            }

        }).catch(error=>{
            console.log('Inside keyerror',error);
            this.error=error;
           // this.searchedResults=undefined;

        })

     }
}