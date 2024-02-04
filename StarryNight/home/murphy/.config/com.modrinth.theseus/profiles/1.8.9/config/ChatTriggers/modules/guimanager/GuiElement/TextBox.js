import SoopyBoxElement from "./SoopyBoxElement";
import EditableText from "./EditableText";

class TextBox extends SoopyBoxElement {
    constructor() {
        super()

        this.text = new EditableText().setLocation(0, 0, 1, 1)
        this.addChild(this.text)
    }

    setText(text) {
        this.text.setText(text)
        return this
    }

    getText() {
        return this.text.getText()
    }

    setPrefix(text) {
        this.text.setPrefix(text)
        return this
    }

    setSuffix(text) {
        this.text.setSuffix(text)
        return this
    }

    setPlaceholder(placeholder) {
        this.text.placeholder = placeholder
        return this;
    }

    select() {
        this.text.selected = true
        return this
    }

    deselect() {
        this.text.selected = false
        return this
    }
}

export default TextBox