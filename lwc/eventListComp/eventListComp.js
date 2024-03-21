import { LightningElement, wire,track } from 'lwc';
import fetchUpComingEvents from '@salesforce/apex/EventListLWCService.fetchUpComingEvents';
import fetchPastEvents from '@salesforce/apex/EventListLWCService.fetchPastEvents';
import fetchUpComingEventsForCurrentUser from '@salesforce/apex/EventListLWCService.fetchUpComingEventsForCurrentUser';
import fetchUpPastEventsForCurrentUser from '@salesforce/apex/EventListLWCService.fetchUpPastEventsForCurrentUser'
import { NavigationMixin } from 'lightning/navigation';

import EventTitle from '@salesforce/resourceUrl/EventTitle';
import userId from '@salesforce/user/Id';

export default class EventListComponent extends NavigationMixin( LightningElement ) {
    
    @track upcomingEvnets;
    pastEvents;
    __errors;
    isSpinner = false;

    images = {
        event : EventTitle
    }

   @wire(fetchUpComingEvents)
    wiredUpcomingEventsData({ error, data }) {
        if (data) {
            this.upcomingEvnets = data;
            if(location.pathname.includes('/s/my-events')){
                this.fetchCurrentUserEvents();
                this.fetchPastEventsofCurrentUser();
                console.log('inside my events');
                console.log(userId)
            }
        } else if (error) {
            console.error('Error:', error);
            this.upcomingEvnets = undefined;
            this.__errors = error;
        }
    }

    @wire(fetchPastEvents)
    wiredPastEventsData({ error, data }) {
        if (data) {
            this.pastEvents = data;
        } else if (error) {
            console.error('Past Event Error:', error);
            this.__errors = error;
            this.pastEvents = undefined;
        }
    }
    connectedCallback() {
        console.log('Inside connectedcallback')
       
           
          
    }
    handleEventClick = event => {

        event.preventDefault();
        let selectedEventId = event.detail.eventId;

        let navigationTarget = {
            type: 'comm__namedPage',
            attributes: {
                name: "eventdetail__c"
            },
            state : {
                eventId : selectedEventId,
                source  : 'eventListPage'
            }
        }
        
        this[NavigationMixin.Navigate](navigationTarget);
    }
    fetchCurrentUserEvents(){
        fetchUpComingEventsForCurrentUser({ attendeeUserId:userId  })
        .then(result => {
           result.forEach(item=>{
            item.Name__c=item.Event__r.Name__c,
            item.TitleImageUrl__c=item.Event__r.TitleImageUrl__c,
            item.Start_DateTime__c=item.Event__r.Start_DateTime__c,
            item.Location__c=item.Event__r.Location__c?item.Event__r.Location__c:undefined,
            item.Location__r= item.Location__c!=undefined?item.Event__r.Location__r:undefined
            item.Id=item.Event__c
            
           })
          //this.upcomingEvnets={...this.upcomingEvnets,result}
          this.upcomingEvnets=result
         
        })
        .catch(error => {
          console.error('Error:', error);
      });
    }
    fetchPastEventsofCurrentUser(){
        fetchUpPastEventsForCurrentUser({ attendeeUserId:userId })
            .then(result => {
                result.forEach(item=>{
                    item.Name__c=item.Event__r.Name__c,
                    item.TitleImageUrl__c=item.Event__r.TitleImageUrl__c,
                    item.Start_DateTime__c=item.Event__r.Start_DateTime__c,
                    item.Location__c=item.Event__r.Location__c?item.Event__r.Location__c:undefined,
                    item.Location__r= item.Location__c!=undefined?item.Event__r.Location__r:undefined
                    item.Id=item.Event__c
                    
                    
                    });
                    
                this.pastEvents=result
                console.log(result,'pastEvt')
            })
            .catch(error => {
              console.error('Error:', error);
          });
        }

        get pastEventSize(){
            return this.pastEvents?true:false
        }
        get upcomingEventSize(){
            return this.upcomingEvnets?true:false
        }
       
    
}