import { LightningElement,api } from 'lwc';

export default class LwcSearchComponent extends LightningElement {
    @api searchLabel
    searchKeyword
    handleChange(event){
       
        let keyword=event.target.value;
        console.log(keyword);
        if(keyword && keyword.length>=2){
            this.dispatchEvent(new CustomEvent('search',{
                detail:{
                    value:keyword
                }
            }));
            console.log('event dispatched');

        }
        else{
            this.dispatchEvent(new CustomEvent('search',{
                detail:{
                    value:keyword
                }
            }));
        }
    }
   

}