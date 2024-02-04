import SoopyContentChangeEvent from "../EventListener/SoopyContentChangeEvent";
import TextBox from "./TextBox";

class NumberTextBox extends TextBox {
    constructor(){
        super()

        this.text.addEvent(new SoopyContentChangeEvent().setHandler((newVal, oldVal, resetFun)=>{
            if(newVal === "" || newVal === "-") return;
            if(!this.isNumber(newVal)){
                resetFun()
            }
        }))
    }

    isNumber(val){
        val = "" + val; //coerce num to be a string
        return !isNaN(val) && !isNaN(parseFloat(val));
    }
}

export default NumberTextBox