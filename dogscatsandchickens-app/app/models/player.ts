import {Creature} from "./creature";
import {Upgrade} from "./upgrade";
import {Action} from "./action";
import {Card} from "./card"

export class Player{
    name: string;
    hand: Card[] = [];
    field: Card[][] = [];
    moves: number;

    constructor(name:string = "Carter"){
        this.name = name;
        this.moves = 2;
    }

    toString(): string {
        let message: string;
        //Print player's name
        message = "Player: " + this.name + "\nHand: ";

        //Print hand
        if (this.hand.length == 0){
            message += "EMPTY\n"
        }
        this.hand.forEach(function (card){
            message += card.toString() + "\n" 
        })

        //Print Field
        message += "Field: "
        if (this.field.length == 0){
            message += "EMPTY\n"
        }
        this.field.forEach(function (cardArray){
            cardArray.forEach(function (card){
                message += card.toString() + ","
            })
            message = message.substring(0, message.length-1);
            message += "\n"
        })

        return message;
    }
}