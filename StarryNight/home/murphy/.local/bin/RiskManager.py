#!/bin/python3
import inquirer
from termcolor import colored

questions = [
    inquirer.Text(name="balance",message="What's your current " + colored("balance","blue") + " ?"),
    inquirer.Text(name="price",message="What's the current asset " + colored("price","green") + " ?"),
    inquirer.Text(name="stoploss",message="What's your " + colored("stoploss","red") + " ?")
]

print(colored("-------------------------------------------------","white"))

answers = inquirer.prompt(questions)
balance = float(answers["balance"])
price = float(answers["price"])
stoploss = float(answers["stoploss"])

entering_balance = balance
two_percant_of_balance = ( balance / 100 ) * 2
loss = two_percant_of_balance
loss_percantage = 2
absolute_difference = abs(price - stoploss)
shares_needed = two_percant_of_balance / absolute_difference
shares_needed_price = shares_needed * price
leverage = round(shares_needed_price / balance)
if ( leverage > 1 ):
    entering_balance = balance * leverage
    shares_with_leverage = entering_balance / price
    loss = shares_with_leverage * absolute_difference
    loss_percantage = loss * 100 / balance
makerfee = entering_balance * 0.020 / 100
takerfee = entering_balance * 0.040 / 100

print("-------------------------------------------------")
print("On this trade:")
if ( price - stoploss > 0 ):
    print("You are going " + colored("Long ","green",attrs=["bold"]))
else:
    print("You are going " + colored("Short ","red",attrs=["bold"]))
print(f"You need {colored(round(shares_needed,2),"blue")} shares or {colored(str(round(shares_needed_price,2))+"$","blue")}")
print(f"You can achive the closest entry by {colored("~"+str(leverage),"blue",attrs=["bold","underline"])} leverage")
if (round(loss_percantage,2) != 2):
    print(f"Which is {colored(round(shares_with_leverage,2),"cyan")} shares or {colored(str(round(entering_balance,2))+"$","cyan")}")
print(f"You may lose {colored(str(round(loss_percantage,2))+"%","red")} of your balance ({colored(str(round(loss,2))+"$","red")})")
print(f"Your {colored("Taker","red")} fee is {colored(str(round(takerfee,2))+"$","red")} x 2 = {colored(str(round(takerfee*2,2))+"$","red")}")
print(f"Your {colored("Maker","green")} fee is {colored(str(round(makerfee,2))+"$","green")} x 2 = {colored(str(round(makerfee*2,2))+"$","green")}")
print("-------------------------------------------------")
