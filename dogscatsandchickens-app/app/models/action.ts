import {Card} from "./card"

export class Action extends Card {
    actionType: string;

    constructor(id: number, name: string, description: string, front: string, back: string, actionType: string){
        super(id, name, description, front, back)
        this.actionType = actionType
    }

    toString(): string{
        return this.id + " | " + this.name + " | " + this.description + " | " + this.front + " | " + this.back + " | " + this.actionType
    }
}