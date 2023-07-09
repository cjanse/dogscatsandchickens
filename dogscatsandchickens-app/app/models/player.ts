import {Creature} from "./creature";
import {Upgrade} from "./upgrade";
import {Action} from "./action";
import {Card} from "./card"

export class Player{
    name: string;
    hand: Card[] = [];
    field: Card[][] = [];

    constructor(name:string = "Carter"){
        this.name = name;
        this.hand.push(new Creature(0, "Fancy Bella", "Defeats Cats, Defeated By Chickens", "fancy_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature"))
        this.hand.push(new Upgrade(1, "Cactus Attack", "Counter Attack - blocks opposing creature's attack and attacks that creature", "cactus_attack.jpg", "upgrade.jpg", "Counter Attack"))
        this.hand.push(new Action(2, "Forest Spirits", "Go into the discard pile and choose one creature card", "forest_spirits.jpg", "action.jpg", "Spirits"))
        this.field.push([new Creature(0, "Fancy Bella", "Defeats Cats, Defeated By Chickens", "fancy_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature")])
        this.field[0].push(new Upgrade(1, "Cactus Attack", "Counter Attack - blocks opposing creature's attack and attacks that creature", "cactus_attack.jpg", "upgrade.jpg", "Counter Attack"))
        this.field.push([new Creature(0, "Fancy Bella", "Defeats Cats, Defeated By Chickens", "fancy_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature")])
    }
}