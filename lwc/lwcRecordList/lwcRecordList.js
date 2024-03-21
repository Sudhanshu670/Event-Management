import { LightningElement,api } from 'lwc';

export default class LwcRecordList extends LightningElement {
    @api rec
    @api iconName

    handleSelect(event){
        this.dispatchEvent(new CustomEvent("selected",{
            detail:{
                selectedrecord:this.rec,
               
            }
        }))

    }
}