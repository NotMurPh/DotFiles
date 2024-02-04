/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

//A TEST GUI TO MAKE SURE EVERYTHING IS WORKING
//OPEN WITH /guitest

import SoopyBoxElement from "./GuiElement/SoopyBoxElement"
import SoopyTextElement from "./GuiElement/SoopyTextElement"
import TextBox from "./GuiElement/TextBox"
import Toggle from "./GuiElement/Toggle"
import PasswordInput from './GuiElement/PasswordInput.js';
import NumberTextBox from './GuiElement/NumberTextBox.js';
import BoxWithLoading from './GuiElement/BoxWithLoading.js';
import SoopyMarkdownElement from './GuiElement/SoopyMarkdownElement.js';
import ProgressBar from './GuiElement/ProgressBar.js';
import SoopyImageElement from './GuiElement/SoopyImageElement';
import SoopyGui from "./SoopyGui";
import SoopyOpenGuiEvent from "./EventListener/SoopyOpenGuiEvent"
import Slider from "./GuiElement/Slider";
import ColorPicker from "./GuiElement/ColorPicker";
import BoxWithGear from "./GuiElement/BoxWithGear";

let testGui = new SoopyGui();

testGui.setOpenCommand("guitest")

let box = new SoopyBoxElement().setLocation(0.25, 0.25, 0.5, 0.5).setScrollable(true)

testGui.element.addChild(box)

box.addEvent(new SoopyOpenGuiEvent().setHandler(() => {
    box.location.size.y.set(0, 0)
    box.location.size.y.set(0.5, 500)
}))

box.addChild(new SoopyTextElement().setText("§0Hello World!").setMaxTextScale(100).setLocation(0.1, 0.05, 0.8, 0.3))

let y = 0.4

let textBox = new PasswordInput().setLocation(0.1, y, 0.8, 0.2)
textBox.text.placeholder = "Password input"
box.addChild(textBox)
y += 0.2
let textBox2 = new TextBox().setLocation(0.1, y, 0.8, 0.2)
textBox2.text.placeholder = "Textbox"
box.addChild(textBox2)
y += 0.2
let textBox3 = new NumberTextBox().setLocation(0.1, y, 0.8, 0.2)
textBox3.text.placeholder = "Number input"
box.addChild(textBox3)
y += 0.2
let textBox4 = new NumberTextBox().setLocation(0.1, y, 0.8, 0.2)
textBox4.text.placeholder = "Number input2"
box.addChild(textBox4)
y += 0.2
let colorPicker1 = new ColorPicker().setRGBColor(0, 255, 0).setLocation(0.1, y, 0.2, 0.2)
let colorPicker2 = new ColorPicker().setRGBColor(0, 255, 0).setLocation(0.4, y, 0.2, 0.2)
let colorPicker3 = new ColorPicker().setRGBColor(0, 255, 0).setLocation(0.7, y, 0.2, 0.2)
y += 0.2

box.addChild(colorPicker1)
box.addChild(colorPicker2)
box.addChild(colorPicker3)

let toggle = new Toggle().setLocation(0.1, y, 0.8, 0.2)
y += 0.2

let loading = new BoxWithLoading().setLocation(0.1, y, 0.8, 0.2)
y += 0.2

box.addChild(toggle)
box.addChild(loading)

let slider = new Slider().setLocation(0.1, y, 0.8, 0.2)
y += 0.2
box.addChild(slider)

let markUp = new SoopyMarkdownElement().setLocation(0.1, y, 0.8, 0.2).setText("Hello\n#### _WORLD_\nThis is __COOL__\n\n# Right?")
box.addChild(markUp)
y += markUp.getHeight()

let loading2 = new BoxWithLoading().setLocation(0.1, y, 0.8, 0.2).setLore(["Hello this is some HOVER LORE", "", "That is so pog right", "It should even have §6COLORS"])
y += 0.2

let settingGear = new BoxWithGear().setLocation(0.1, y, 0.8, 0.2)
y += 0.2


box.addChild(loading2)
box.addChild(settingGear)

let imageThing = new SoopyImageElement().setLocation(0.1, y, 0.8, 0.2).setImage("https://www.nurseriesonline.com.au/wp-content/uploads/2016/05/trees-for-narrow-spaces.jpg").loadHeightFromImage()

let preHeight = y

box.addChild(imageThing)
imageThing.onImageHeightChange(() => {
    y = preHeight + imageThing.location.size.y.get()

    progressBar.location.location.y.set(y)
    y += 0.2
}, {})
y += 0.2

let progressBar = new ProgressBar().setLocation(0.1, y, 0.8, 0.2).setProgress(0.3)
y += 0.2

box.addChild(progressBar)

register("step", () => {
    progressBar.setProgress(Math.random())
}).setFps(1)

box.setScrollable(true)