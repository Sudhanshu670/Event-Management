import { LightningElement ,track} from 'lwc'
import {createRecord} from 'lightning/uiRecordApi'
import { NavigationMixin } from 'lightning/navigation'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

import Event__c from '@salesforce/schema/Event__c'

export default class CreateEvent extends NavigationMixin(LightningElement) {

   @track eventRecord = {
    
    
    }
    
    
    handleChange(event) {
       // let value = event.target.value;
       // let name = event.target.name;
       const{name,value}= event.target
      
        

        this.eventRecord[name] = value;
        console.log('inside change Handler')
        console.log(this.eventRecord.Name,'eventRecord');
        // MaxFIT Campaign
        // Name
        // this.eventRecord[Name] = 'MaxFIT Campaign'
    }
    handleLookup(event) {
        let selectedRecId = event.detail.selectedRecordId;
        let parentField = event.detail.parentfield;
        this.eventRecord[parentField] = selectedRecId;
        console.log(this.eventRecord.parentField,'eventRecordafterLookup');
        // selectedRecId = aiwue7836734834
        // Location__c
        // this.eventRecord[Location__c] = selectedRecId;
    }
    handleclick(){
        const recordInput={apiName:Event__c.objectApiName,fields:this.eventRecord}
        createRecord(recordInput).then(result=>{
           this.showToast('Record Created','Record Created Successfully','Success');
           this.navigateToRecordPage(result)
        }

        ).catch(error=>{
            console.log(error,'error');
            this.showToast('Error Occured','Error has occured','Error');
           
        }

        )
    }
    handlecancel(){
      
       this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
            actionName: "home",
            objectApiName: "Event__c"
        }
    });
       
    }
    showToast(title,message,variant){

        this.dispatchEvent(new ShowToastEvent({
            title:title,
            message:message,
            variant: variant
        }))

    }
    navigateToRecordPage(result) {
        // Navigate to the Account home page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: result.id,
                objectApiName: 'Event__c',
                actionName: 'view'
            },
        });
    }
}