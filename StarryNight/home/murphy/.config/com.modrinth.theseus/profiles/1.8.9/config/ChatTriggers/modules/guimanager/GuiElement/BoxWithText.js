import SoopyHoverChangeEvent from "../EventListener/SoopyHoverChangeEvent";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");
const { default: SoopyTextElement } = require("./SoopyTextElement");

class BoxWithText extends SoopyBoxElement{
    constructor(){
        super();

        this.text = new SoopyTextElement().setMaxTextScale(2).setLocation(0, 0, 1, 1)

        this.addChild(this.text)

        
        let hoverEvent = new SoopyHoverChangeEvent()

        hoverEvent.setHandler(()=>{
            if(this.hovered){
                this.text.setMaxTextScale(2.5, 1000)

                if(this.color[0]+this.color[1]+this.color[2]<0.5*(255+255+255)){
                    this.setColorOffset(10, 10, 10, 100)
                }else{
                    this.setColorOffset(-10, -10, -10, 100)
                }
            }else{
                this.text.setMaxTextScale(2, 500)

                this.setColorOffset(0, 0, 0, 100)
            }

         })

        this.events.push(hoverEvent)
    }

    setText(text){
        this.text.setText(text)
        return this;
    }
}

export default BoxWithText