import SoopyHoverChangeEvent from "../EventListener/SoopyHoverChangeEvent";
import Toggle from "./Toggle";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");
const { default: SoopyTextElement } = require("./SoopyTextElement");

class BoxWithToggle extends SoopyBoxElement{
    constructor(){
        super();

        this.text = new SoopyTextElement().setMaxTextScale(2).setLocation(0, 0, 0.8, 1)

        this.toggle = new Toggle().setLocation(0.8, 0.3, 0.15, 0.4)

        this.addChild(this.text).addChild(this.toggle)

        this.directionRight = true
        
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

    /**
     * @returns {ButtonWithArrow}
     */
    setDirectionRight(val){
        this.directionRight = val

        this.toggle.setLocation(0, 0, 0.1, 1)
        this.text.setLocation(0.2, 0, 0.8, 1)
        return this
    }

    setText(text){
        this.text.setText(text)
        return this;
    }
}

export default BoxWithToggle