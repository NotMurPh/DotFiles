import TextBox from "./TextBox";

class PasswordInput extends TextBox {
    constructor() {
        super()

        this.char = "*"

        this.text.getRenderText = () => {
            return this.text.prefix + this.char.repeat(this.text.text.length) + this.text.suffix
        }
    }
}

export default PasswordInput