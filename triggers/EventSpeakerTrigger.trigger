trigger EventSpeakerTrigger on EventSpeakers__c (before insert, before update ) {
    
    // Step 1 - Get the speaker id & event id 
    // Step 2 - SOQL on Event to get the Start Date and Put them into a Map
    // Step 3 - SOQL on Event - Spekaer to get the Related Speaker along with the Event Start Date
    // Step 4 - Check the Conditions and throw the Error
    set<Id> speakerids=new set<Id>();
    set<Id> eventIds=new set<Id>();
    Map<Id,DateTime> eventIdtoTime= new Map<Id,DateTime>();
    for(EventSpeakers__c es: trigger.new){
        speakerids.add(es.Speaker__c);
        eventIds.add(es.Event__c);
    }
   
    for(Event__c evtRecs :[Select Id, Start_DateTime__c From Event__c 
                                       Where Id IN : eventIds])
    {
        
		 eventIdtoTime.put(evtRecs.Id,evtRecs.Start_DateTime__c);        
    }
   
    List<EventSpeakers__c> esp = [Select Id,Event__r.Start_DateTime__c,speaker__c from EventSpeakers__c where speaker__c IN:
                                 speakerids];
    Set<String> uniqueString=new Set<String>();
    for(EventSpeakers__c esrecs: esp){
        String uqString=String.valueof(esrecs.Speaker__c)+String.valueof(esrecs.Event__r.Start_DateTime__c);
        uniqueString.add(uqString);
        
    }
    
    for(EventSpeakers__c es: trigger.new){
        DateTime bookingTime=eventIdtoTime.get(es.Event__c);
        String uqString=String.valueof(es.Speaker__c)+String.valueof(bookingTime);
        if(uniqueString.contains(uqString)){
            es.addError('The speaker is already booked for this time slot');
        }
        
    } 
        
    
}