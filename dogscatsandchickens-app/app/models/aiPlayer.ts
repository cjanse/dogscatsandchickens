import {Creature} from "./creature";
import {Upgrade} from "./upgrade";
import {Action} from "./action";
import {Player} from "./player"
import {Card} from "./card"

export class AIPlayer extends Player{

    constructor(name:string = "Carter"){
        super(name)
    }
}