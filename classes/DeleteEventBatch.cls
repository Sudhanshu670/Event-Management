public class DeleteEventBatch implements DataBase.Batchable<sObject>{
    public database.queryLocator start(Database.batchablecontext bc){
        String query='select id from event__C where End_Date_Time__c < LAST_N_MONTHS:2 And Live__C=true';
        return database.getqueryLocator(query);
    }
    public void execute(Database.batchablecontext bc,List<Event__c> eventRecs){
        List<Database.Error> errorsinDelete=new  List<Database.Error>();
        if(!eventRecs.isEmpty()){
            Database.DeleteResult[] drList = Database.delete(eventRecs, false);
            
            for(Database.DeleteResult dr : drList) {
                if (!dr.isSuccess()) {
                    // Operation was successful, so get the ID of the record that was processed
                  
                }
                TransactionLogHandler.handleexceptionlogswithErrors(String.join(dr.getErrors(),','),'DeleteEventBatch');
                
            }
        }
    }
    public void finish(Database.batchablecontext bc){
        
    }
    
}