public with sharing class CustomRecordController {
    @AuraEnabled
    public static OutputWrapper fetchRecordsforlookup(String fieldName,String objectName,String searchKey){
      OutputWrapper op = new OutputWrapper();
      String searchKeyword = searchKey + '*';
      String returningQuery = objectName+' ( Id, '+fieldName+')';
      String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING '+returningQuery+' LIMIT 2000';
      try{
          List<List<sObject>> sobjectList = Search.query(Query);
            if(!sobjectList.isEmpty()){
              op.success=true;
              op.sobjectList=sobjectList;
              
      }
      }
      catch(Exception ex){
      op.success=false;
      op.message=ex.getmessage();
     
      }
      return op;

     


    }
    public class OutputWrapper{
    @auraenabled public boolean success;
    @auraenabled public List<List<sObject>> sobjectList;
    @auraenabled public String message;
    
    
    }
}