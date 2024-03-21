public with sharing class EventDetailsController {
@AuraEnabled
    public static List<EventSpeakers__c> getSpeakerDetails(String eventId){
        List<EventSpeakers__c> esp=[Select Id,Speaker__c,Speaker__r.Name,Speaker__r.Company__c,
                                Speaker__r.Phone__c,Speaker__r.Email__c from EventSpeakers__c where event__c =:eventId
                                WITH SECURITY_ENFORCED];

        return esp;
    
    }
    @AuraEnabled
    public static Event__c getEventloc(String eventId){
        Event__c evtRec= [Select Id,Location__c,Location__r.City__c,Location__r.Country__c,Location__r.Land_Mark__c,
                   Location__r.Postal_Code__c,Location__r.State__c,Location__r.Street__c from Event__c where id =:eventId
                   WITH SECURITY_ENFORCED];
        return evtRec;
    }
@AuraEnabled
  public static List<Event_Attendee__c> getAttendees(String eventId) {
    List<Event_Attendee__c> eventAttendeeList = [
      SELECT
        Id,
        Name,
        Attendee__c,
        Attendee__r.Name,
        Attendee__r.Email__c,
        Attendee__r.Company_Name__c,
        Attendee__r.Location__c,
        Attendee__r.Location__r.Name
      FROM Event_Attendee__c
      WHERE Event__c = :eventId
      WITH SECURITY_ENFORCED
    ];
    return eventAttendeeList;
  }
}