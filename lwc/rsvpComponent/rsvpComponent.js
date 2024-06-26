import { api, LightningElement, track, wire } from 'lwc';

import doRSVP from '@salesforce/apex/RsvpLWCService.doRSVP';


export default class RsvpComponent extends LightningElement {
    
    @track __rsvpData = {};
    __isSpinner = false;

    @api eventId;

   

    handleChange(event) {
        const fieldName  = event.target.name; // Name of the input field
        const fieldValue = event.target.value; // value of the input field - Amit Singh
        this.__rsvpData[fieldName] = fieldValue;
        // this.__rsvpData[Name] = Amit Singh;
        // this.__rsvpData[Email__c] =someemail;
    }

    validateInput(){
        const inputFields = this.template.querySelectorAll('lightning-input');
        let isValid = true;
        inputFields.forEach(field => {
            if(field.reportValidity() === false){
                isValid = false;
            }
        });
        return isValid;
    }

    handleClick(event) {
        event.preventDefault();
        if(this.validateInput()){
            // make the call to apex class
            this.__isSpinner = true;

            doRSVP({ 
                params : JSON.stringify(this.__rsvpData),
                eventId: this.eventId 
            })
            .then(result => {
                this.dispatchEvent(new CustomEvent('success'));
            })
            .catch(error => {
                console.error('Error: \n ', error);
            })
            .finally(()=>{
                this.__isSpinner = false;
            });
        }
    }

    handleCancel(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('cancel'));
    }

}