import {Card} from "./card"

export class Creature extends Card {
    creatureType: string;
    facedUp: boolean = false;
    matchingAbilityDescription: string;
    matched: boolean = false;

    constructor(id: number, name: string, description: string, front: string, back: string, creatureType: string, matchingAbilityDescription: string){
        super(id, name, description, front, back)
        this.creatureType = creatureType;
        this.matchingAbilityDescription = matchingAbilityDescription;
    }

    getCreatureType(): string {
        return this.creatureType;
    }

    getMatchingAbilityDescription(): string {
        return this.matchingAbilityDescription;
    }

    toString(): string{
        return this.id + " | " + this.name + " | " + this.description + " | " + this.front + " | " + this.back + " | " + this.creatureType + " | " + this.matchingAbilityDescription + " | " + this.facedUp + " | " + this.matched
    }
}