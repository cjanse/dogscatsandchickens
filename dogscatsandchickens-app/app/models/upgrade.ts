import {Card} from "./card"

export class Upgrade extends Card {
    upgradeType: string;
    facedUp: boolean = false;

    constructor(id: number, name: string, description: string, front: string, back: string, upgradeType: string){
        super(id, name, description, front, back)
        this.upgradeType = upgradeType
    }

    toString(): string{
        return this.id + " | " + this.name + " | " + this.description + " | " + this.front + " | " + this.back + " | " + this.upgradeType + " | " + this.facedUp
    }
}