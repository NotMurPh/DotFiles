import SoopyTextElement from "./SoopyTextElement"

const { default: ButtonWithArrow } = require("./ButtonWithArrow");

class ButtonWithArrowAndDescription extends ButtonWithArrow{
    constructor(){
        super();
        
        this.text.location.size.y.set(0.6)

        this.description = new SoopyTextElement().setMaxTextScale(1).setLocation(0.05, 0.6, 0.8, 0.4)
        this.addChild(this.description)
    }

    setDesc(text){
        this.description.setText(text)
        return this;
    }
}

export default ButtonWithArrowAndDescription