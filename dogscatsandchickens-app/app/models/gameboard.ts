import {Creature} from "./creature";
import {Upgrade} from "./upgrade";
import {Action} from "./action";
import {Card} from "./card"
import {Player} from "./player"


export class GameBoard {
    deck: Card[] = []
    discard: Card[] = []
    players: Player[] = []
    currentPlayer: number = 0

    constructor(player1Name: string = "Player 1", player2Name: string = "Player 2"){
        //Making Player
        this.players.push(new Player(player1Name))
        this.players.push(new Player(player2Name))

        //Making Deck
        this.deck.push(new Creature(101, "Bella", "Defeats Chickens, Defeated By Dogs", "bella.jpg", "creature.jpg", "Cat", "Matching Ability: Multiple Attacks"))
        this.deck.push(new Creature(101, "Bella", "Defeats Chickens, Defeated By Dogs", "bella.jpg", "creature.jpg", "Cat", "Matching Ability: Multiple Attacks"))
        this.deck.push(new Creature(102, "Pounce", "Defeats Chickens, Defeated By Dogs", "pounce.jpg", "creature.jpg", "Cat", "Matching Ability: Multiple Attacks"))
        this.deck.push(new Creature(102, "Pounce", "Defeats Chickens, Defeated By Dogs", "pounce.jpg", "creature.jpg", "Cat", "Matching Ability: Multiple Attacks"))
        this.deck.push(new Creature(103, "Snowball", "Defeats Chickens, Defeated By Dogs", "snowball.jpg", "creature.jpg", "Cat", "Matching Ability: Multiple Attacks"))
        this.deck.push(new Creature(103, "Snowball", "Defeats Chickens, Defeated By Dogs", "snowball.jpg", "creature.jpg", "Cat", "Matching Ability: Multiple Attacks"))
        this.deck.push(new Creature(104, "Fancy Bella", "Defeats Cats, Defeated By Chickens", "fancy_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature"))
        this.deck.push(new Creature(104, "Fancy Bella", "Defeats Cats, Defeated By Chickens", "fancy_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature"))
        this.deck.push(new Creature(105, "Pretty Bella", "Defeats Cats, Defeated By Chickens", "pretty_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature"))
        this.deck.push(new Creature(105, "Pretty Bella", "Defeats Cats, Defeated By Chickens", "pretty_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature"))
        this.deck.push(new Creature(106, "Puppy Bella", "Defeats Cats, Defeated By Chickens", "puppy_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature"))
        this.deck.push(new Creature(106, "Puppy Bella", "Defeats Cats, Defeated By Chickens", "puppy_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature"))
        this.deck.push(new Creature(107, "Lulu", "Defeats Dogs, Defeated By Cats", "lulu.jpg", "creature.jpg", "Chicken", "Matching Ability: Opponent Must Have All Face-Up Cards"))
        this.deck.push(new Creature(107, "Lulu", "Defeats Dogs, Defeated By Cats", "lulu.jpg", "creature.jpg", "Chicken", "Matching Ability: Opponent Must Have All Face-Up Cards"))
        this.deck.push(new Creature(108, "Olive", "Defeats Dogs, Defeated By Cats", "olive.jpg", "creature.jpg", "Chicken", "Matching Ability: Opponent Must Have All Face-Up Cards"))
        this.deck.push(new Creature(108, "Olive", "Defeats Dogs, Defeated By Cats", "olive.jpg", "creature.jpg", "Chicken", "Matching Ability: Opponent Must Have All Face-Up Cards"))
        this.deck.push(new Creature(109, "The Family", "Defeats Dogs, Defeated By Cats", "the_family.jpg", "creature.jpg", "Chicken", "Matching Ability: Opponent Must Have All Face-Up Cards"))
        this.deck.push(new Creature(109, "The Family", "Defeats Dogs, Defeated By Cats", "the_family.jpg", "creature.jpg", "Chicken", "Matching Ability: Opponent Must Have All Face-Up Cards"))
        this.deck.push(new Upgrade(201, "Cactus Attack", "Counter Attack - blocks opposing creature's attack and attacks that creature", "cactus_attack.jpg", "upgrade.jpg", "Counter Attack"))
        this.deck.push(new Upgrade(202, "Duck Army", "Counter Attack - blocks opposing creature's attack and attacks that creature", "duck_army.jpg", "upgrade.jpg", "Counter Attack"))
        this.deck.push(new Upgrade(203, "Deflect", "Defense - blocks opposing creature's attack", "deflect.jpg", "upgrade.jpg", "Defense"))
        this.deck.push(new Upgrade(204, "Sand Shield", "Defense - blocks opposing creature's attack", "sand_shield.jpg", "upgrade.jpg", "Defense"))
        this.deck.push(new Upgrade(205, "Payphones Don\'t Exist Anymore", "Fake Upgrade - returns to your hand when creature is defeated", "payphones_dont_exist_anymore.jpg", "upgrade.jpg", "Fake Upgrade"))
        this.deck.push(new Upgrade(206, "Fading Away", "Fake Upgrade - returns to your hand when creature is defeated", "fading_away.jpg", "upgrade.jpg", "Fake Upgrade"))
        this.deck.push(new Upgrade(207, "Sleeping", "Fake Upgrade - returns to your hand when creature is defeated", "sleeping.jpg", "upgrade.jpg", "Fake Upgrade"))
        this.deck.push(new Upgrade(208, "Cool Down Squirrel", "Revive - instead of placing your defeated creature in the discard pile, place it back in your hand", "cool_down_squirrel.jpg", "upgrade.jpg", "Revive"))
        this.deck.push(new Upgrade(209, "Snow Apocalypse", "Self-Destruct - when creature is defeated, opposing creature and attached upgrades are discarded", "snow_apocalypse.jpg", "upgrade.jpg", "Self-Destruct"))
        this.deck.push(new Action(301, "Beach Spirits", "Go into the discard pile and choose one upgrade card", "beach_spirits.jpg", "action.jpg", "Spirits"))
        this.deck.push(new Action(302, "Forest Spirits", "Go into the discard pile and choose one creature card", "forest_spirits.jpg", "action.jpg", "Spirits"))
        this.deck.push(new Action(303, "River Spirits", "Go into the discard pile and choose one action card", "river_spirits.jpg", "action.jpg", "Spirits"))
        this.deck.push(new Action(304, "Bird Army", "Steal one card from your opponent at random", "bird_army_1.jpg", "action.jpg", "Bird Army"))
        this.deck.push(new Action(305, "Bird Army", "Steal one card from your opponent at random", "bird_army_2.jpg", "action.jpg", "Bird Army"))
        this.deck.push(new Action(306, "Messy Dorm", "Examine your opponent's hand", "messy_dorm_1.jpg", "action.jpg", "Messy Dorm"))
        this.deck.push(new Action(307, "Messy Dorm", "Examine your opponent's hand", "messy_dorm_2.jpg", "action.jpg", "Messy Dorm"))
        this.deck.push(new Action(308, "Power of Tea", "Reveal one of your opponent's cards on the field", "power_of_tea_1.jpg", "action.jpg", "Power of Tea"))
        this.deck.push(new Action(309, "Power of Tea", "Reveal one of your opponent's cards on the field", "power_of_tea_2.jpg", "action.jpg", "Power of Tea"))
    }

    toString(): String{
        let message: String = "Deck: ";
        
        //Print Deck
        if (this.deck.length == 0){
            message += "EMPTY\n"
        }
        this.deck.forEach(function (card){
            message += card.toString() + "\n" 
        })

        //Print Discard
        message += "Discard: "
        if (this.discard.length == 0){
            message += "EMPTY\n"
        }
        this.discard.forEach(function (card){
            message += card.toString() + "\n" 
        })

        //Print players
        message += this.players[0].toString()
        message += this.players[1].toString()

        return message;
    }

    static shuffle(cards: Card[]): Card[]{
        for (let i = cards.length -1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]]
        }
        return cards;
    }

}