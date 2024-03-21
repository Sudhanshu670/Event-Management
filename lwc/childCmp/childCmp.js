import { LightningElement } from 'lwc';
import {publish,subscribe,unsubscribe} from 'lightning/messageService';
import testChannel from '@salesforce/messageChannel/testLms__c';
export default class ChildCmp extends LightningElement 
{
    msg = 'Child message';

   handleClick(event)
   {
       var selectedEvent = new CustomEvent('uploadevent',{detail : {msg : this.msg}});
   }
}