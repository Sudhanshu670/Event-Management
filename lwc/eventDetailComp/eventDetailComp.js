import { api, LightningElement, track, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';

import fetchEventDetails from '@salesforce/apex/EventDetailLwcService.fetchEventDetails';
import fetchSpeakerDetails from '@salesforce/apex/EventDetailLwcService.fetchSpeakerDetails';

import SPEAKER_IMAGE from '@salesforce/resourceUrl/Speaker';
import ORGANIZER_IMAGE from '@salesforce/resourceUrl/organizer';
import isguest from '@salesforce/user/isGuest';


import fethRsvpList from '@salesforce/apex/EventDetailLwcService.fethRsvpList';
import deleteRsvpRec from '@salesforce/apex/EventDetailLwcService.deleteRsvpRec';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class EventDetailComponent extends NavigationMixin(LightningElement) {

    /* store the default speaker image */
    images = {
        speaker : SPEAKER_IMAGE,
        organizer : ORGANIZER_IMAGE
    }

    /* variable to get the url parameters */
    @api eventId;
    @api source;
    __currentPageReference;

    /* variable to show the spinner */
    isSpinner = false;

    /* variable to store the event details */
    __speakers;
    __eventDetails;
    __errors;
    __rsvpCompleted ;

    /* variable to display the location map */
    @track __mapMarkers = [];

    /* Variable to show/hide RSVP Button */
    __showRsvpButton      = !isguest;

    /* vatiable to show rsvp modal */ 
    __showModal = false;
   __showContactModal = false;

   /* @wire(fetchUserName)
    wiredGuestData({ error, data }) {
        if (data) {
            if(data.includes('Site Guest User')){
                this.__showRsvpButton = false;
            }else{
                this.__showRsvpButton = true;
            }
        } else if (error) {
            console.error('Error:', error);
        }
    }*/

    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
        this.__currentPageReference = pageReference;
        this.eventId = this.__currentPageReference.state.eventId;
        this.source  = this.__currentPageReference.state.source;
        this.fetchEventDetailsJS();
        this.fetchSpeakerDetailsJS();
        this.fethRsvpListJS();
       
     
    }
    connectedCallback() {
        this.fethRsvpListJS();
    }

    fethRsvpListJS(){
        fethRsvpList({ 
            eventId : this.eventId 
        })
        .then(result => {
            
            if(result && result.length > 0 ){
                this.__rsvpCompleted = true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    fetchEventDetailsJS(){
        let today=new Date();
        let todayInISO=today.toISOString();
        console.log(this.eventId,'evtId')
        this.isSpinner = true;
        fetchEventDetails({ 
            recordId : this.eventId 
        })
        .then(result => {
         
          console.log(result,'evtData')
          if(todayInISO>result.End_Date_Time__c){
            result.EventCompleted__c=true
          }
         
                
          
            
            this.__eventDetails = result;
            console.log(result,'result');
            this.isSpinner = false;
            if(this.__eventDetails.Location__c){
                this.__mapMarkers.push({
                    location: {
                        City: this.__eventDetails.Location__r.City__c,
                        Country: this.__eventDetails.Location__r.Country__c ,
                        PostalCode: this.__eventDetails.Location__r.Postal_Code__c,
                        State: this.__eventDetails.Location__r.State__c,
                        Street: this.__eventDetails.Location__r.Street__c
                    },
                    title: this.__eventDetails.Name__c,
                    description: 'This is the landmark for the location'
                });
            }
        })
        .catch(error => {
            console.error('Error: ', error);
            this.__errors = error;
        })
        .finally(()=>{
            this.isSpinner = false;
        });
    }

    fetchSpeakerDetailsJS(){
        this.isSpinner = true;
        fetchSpeakerDetails({ 
            eventId : this.eventId 
        })
        .then(result => {
            this.__speakers = result;
        })
        .catch(error => {
            console.error('Error: ', error);
            this.__errors = error;
        })
        .finally(()=>{
            this.isSpinner = false;
        });
    }

    /* handle the rsvp modal close */
    handleRSVP(){
        this.__showModal = true;
    }

    handleRsvpSuccess(event){
        event.preventDefault();
        this.__showModal = false;
        this.__rsvpCompleted = true;
    }
    handleCancel(){
        this.__showModal = false;
    }

    /* handle the contact us modal close */
    handleContactCancel(){
        this.__showContactModal = false;
    }

    handleContactUsSuccess(event){
        event.preventDefault();
        this.__showContactModal = false;
    }

    handleContactUs(){
        this.__showContactModal = true;
    }
    handleDelete(){
        deleteRsvpRec(
            {
                eventId : this.eventId 
            }
        )
          .then(result => {
                alert('Succesfully Deleted')
                this.__showRsvpButton=true
                this.__rsvpCompleted=false
          })
          .catch(error => {
            console.error('Error:', error);
        });
    }
   
    handleLoginRedirect(){
        
        let navigationTarget = {
            type: 'comm__namedPage',
            attributes: {
                name: "login"
            },
           
        }
        
        this[NavigationMixin.Navigate](navigationTarget);
    }
    
    
}