import SoopyHoverChangeEvent from "../EventListener/SoopyHoverChangeEvent";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");
const { default: SoopyTextElement } = require("./SoopyTextElement");

class ButtonWithArrow extends SoopyBoxElement{
    constructor(){
        super();

        this.text = new SoopyTextElement().setMaxTextScale(2).setLocation(0, 0, 0.9, 1)

        this.arrow = new SoopyTextElement().setText("§7>").setMaxTextScale(2).setLocation(0.9, 0, 0.1, 1)

        this.addChild(this.text).addChild(this.arrow)

        this.directionRight = true
        
        let hoverEvent = new SoopyHoverChangeEvent()

        hoverEvent.setHandler(()=>{
            if(this.hovered){
                this.arrow.setMaxTextScale(3, 1000)
                this.arrow.location.location.x.set(this.directionRight?0.85:0, 700)
                this.arrow.location.size.x.set(0.15, 700)
                this.text.setMaxTextScale(2.5, 1000)

                if(this.color[0]+this.color[1]+this.color[2]<0.5*(255+255+255)){
                    this.setColorOffset(10, 10, 10, 100)
                }else{
                    this.setColorOffset(-10, -10, -10, 100)
                }
            }else{
                this.arrow.setMaxTextScale(2, 500)
                this.arrow.location.location.x.set(this.directionRight?0.9:0, 500)
                this.arrow.location.size.x.set(0.1, 500)
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

        this.arrow.setText("§7" + (val? ">" : "<")).setLocation(0, 0, 0.1, 1)
        this.text.setLocation(0.2, 0, 0.8, 1)
        return this
    }

    setText(text){
        this.text.setText(text)
        return this;
    }
}

export default ButtonWithArrow