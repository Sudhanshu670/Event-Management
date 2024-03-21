import { LightningElement,api } from 'lwc';
import getSpeakerDetails from '@salesforce/apex/EventDetailsController.getSpeakerDetails';
import getEventloc from '@salesforce/apex/EventDetailsController.getEventloc';
import getAttendees from '@salesforce/apex/EventDetailsController.getAttendees'
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";
import { NavigationMixin } from "lightning/navigation";
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Company', fieldName: 'Company'}
];
const columnsAtt = [
    {
      label: "Name",
      fieldName: "Name",
      cellAttributes: {
        iconName: "standard:user",
        iconPosition: "left"
      }
    },
    { label: "Email", fieldName: "Email", type: "email" },
    { label: "Company Name", fieldName: "CompanyName" },
    {
      label: "Location",
      fieldName: "Location",
      cellAttributes: {
        iconName: "utility:location",
        iconPosition: "left"
      }
    }
  ];
export default class EventDetails extends NavigationMixin(LightningElement)  {
    @api recordId
    @api objectApiName
    columns=columns
    columnAtt = columnsAtt;
    speakerDetails=[]
    error
    locationDetails
    speakerDetailsLength
    attendeesList
    handleActive(){
        getSpeakerDetails ({ eventId: this.recordId })
          .then(result => {
            console.log(result,'data');

               if(result.length>0){
                this.error=undefined;
              
                result.forEach(speaker =>{
                speaker.Name=speaker.Speaker__r.Name,
                speaker.Company=speaker.Speaker__r.Company__c,
                speaker.Phone=speaker.Speaker__r.Phone__c,
                speaker.Email=speaker.Speaker__r.Email__c
                });
                
                console.log(result,'data');
                this.speakerDetails=result;
               }
               else{
                console.log('in else')
                this.speakerDetails=undefined;
               }
               
               
          })
         
          .catch(error => {
            this.speakerDetails=undefined;
            this.error=error;
            console.error('Error:', error);
        });
       
       
    }
    handleLocationDetails(){
        console.log(this.recordId)
        getEventloc({ eventId: this.recordId})
        .then(result => {
          if(result.Location__c){
            this.locationDetails=result
            this.error=undefined;
            console.log(result,'data');
          }
          else{
            this.locationDetails=undefined;
          }
         
        })
        .catch(error => {
          this.locationDetails=undefined
          this.error=error;
          console.error('Error:', error);
      });
    }
    handleEventAttendee() {
        getAttendees({
          eventId: this.recordId
        })
          .then((result) => {
            result.forEach((att) => {
              //window.console.log(att.Attendee__r.Name);
              att.Name = att.Attendee__r.Name;
              att.Email = "*********@gmail.com";
              att.CompanyName = att.Attendee__r.Company_Name__c;
              if (att.Attendee__r.Location__c) {
                att.Location = att.Attendee__r.Location__r.Name;
              } else {
                att.Location = "Preferred Not to Say";
              }
            });
    
            //window.console.log(" result ", result);
            this.attendeesList = result;
            //window.console.log(" attendeesList ", this.attendeesList);
            this.errors = undefined;
          })
          .catch((err) => {
            this.errors = err;
            this.attendeesList = undefined;
          });
      }
     
    
    get speakerDetailsLength() {
        console.log('Inside getter')
        return this.speakerDetails.length>0?true:false
        
    }
    createSpeaker(){
      const defaultValues = encodeDefaultFieldValues({
        Event__c: this.recordId
      });
      this[NavigationMixin.Navigate]({
        type: "standard__objectPage",
        attributes: {
          objectApiName: "EventSpeakers__c",
          actionName: "new"
        },
        state: {
          defaultFieldValues: defaultValues
        }
      });
    }
    createAttendee(){
      const defaultValues = encodeDefaultFieldValues({
        Event__c: this.recordId
      });
      this[NavigationMixin.Navigate]({
        type: "standard__objectPage",
        attributes: {
          objectApiName: "Event_Attendee__c",
          actionName: "new"
        },
        state: {
          defaultFieldValues: defaultValues
        }
      });
    }
}

