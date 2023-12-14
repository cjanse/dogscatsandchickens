import {Creature} from "../models/creature";
import {Upgrade} from "../models/upgrade";
import {Action} from "../models/action";
import {Card} from "../models/card"
import {Player} from "../models/player"
import {GameBoard} from "../models/gameboard"

export class GameController {
    gameBoard: GameBoard;
    gameOver: boolean = false;

    constructor(player1Name: string = "Player 1", player2Name: string = "Player 2"){
        this.gameBoard = new GameBoard(player1Name, player2Name);
    }

    /* Prepares the game by shuffling the deck and dealing out cards */
    preGamePreparation(): void {
        //Shuffle Deck
        GameBoard.shuffle(this.gameBoard.deck)
        GameBoard.shuffle(this.gameBoard.deck)
        GameBoard.shuffle(this.gameBoard.deck)

        //Randomly pick 3 creature cards for each player
        while (this.gameBoard.players[0].hand.length < 3){
            let cardIndex = Math.floor(Math.random() * (this.gameBoard.deck.length))
            if (this.gameBoard.deck[cardIndex] instanceof Creature){
                this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(cardIndex, 1)[0])
            }
        }
        while (this.gameBoard.players[1].hand.length < 3){
            let cardIndex = Math.floor(Math.random() * (this.gameBoard.deck.length))
            if (this.gameBoard.deck[cardIndex] instanceof Creature){
                this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(cardIndex, 1)[0])
            }
        }

        //Draw 2 cards for each player
        this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
        this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
        this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
        this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
    }

    //Reset the board after game is over
    endOfGame(): void {
        /*if the game is over, then reset the board*/
        this.gameOver = false;
        this.gameCleanUp();
        this.preGamePreparation();
    }

    isGameOver(): boolean {
        return this.gameBoard.players[this.gameBoard.currentPlayer].turnNumber > 0 && (this.isWon() || this.isTie() || this.isLost())
    }

    //Checks to see if the end of the turn is reached
    //if it is, then it goes to next player
    endofTurn(): void {
        if (this.gameOver){
            this.endOfGame();
        }
        else if (this.isGameOver()){
            this.gameOver=true;
            if (this.isWon()){
                this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " has won!")
                console.log("Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " has won!")
            }
            else if (this.isLost()){
                this.gameBoard.summary.push(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + " has won!")
                console.log("Player: " + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + " has won!")
            }
            else {
                this.gameBoard.summary.push("Game is tied.")
                console.log("Game is tied")
            }
        }
        else
        {
            this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + "\'s turn " + this.gameBoard.players[this.gameBoard.currentPlayer].turnNumber + " has ended.")
            this.gameBoard.nextPlayer();
        }
    }

    //Returns the type of the card (creature, upgrade, or action)
    cardType(cardId: number): string{
        if (cardId < 200){
            return "Creature";
        }
        else if (cardId < 300){
            return "Upgrade"
        }
        else {
            return "Action"
        }
    }

    /* Draws a card for a player */
    drawCard(): void{
        console.log("Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " draws " + this.gameBoard.deck[this.gameBoard.deck.length-1].id)
        this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " draws a card of type " + this.cardType(this.gameBoard.deck[this.gameBoard.deck.length-1].id) + ".")
        this.gameBoard.players[this.gameBoard.currentPlayer].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
    }

    /* Checks to see if there is at least one creature in front of the player */
    hasFieldCreature(): boolean {
        return this.gameBoard.players[this.gameBoard.currentPlayer].field.length > 0
    }

    /* returns true if player has a creature card */
    hasCreature(): boolean {
        return this.gameBoard.players[this.gameBoard.currentPlayer].hand.some(function(value, index, array) {return (value instanceof Creature)})
    }

    /* returns true if player has an action card */
    hasAction(): boolean {
        return this.gameBoard.players[this.gameBoard.currentPlayer].hand.some(function(value, index, array) {return (value instanceof Action)})
    }

    /* Returns the id of a random card of specified type from player's hand
    Creature - creature card
    Upgrade - Upgrade card
    Action - action card
    Creature/Action - creature OR action
    Otherwise, it will return a randomcard id*/
    randomCardId(type: string= ""): number {
        switch (type) {
            case 'Creature':
                return GameBoard.shuffle(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value instanceof Creature)}))[0].id
            case 'Upgrade':
                return GameBoard.shuffle(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value instanceof Upgrade)}))[0].id
            case 'Action':
                return GameBoard.shuffle(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value instanceof Action)}))[0].id
            case 'Creature/Action':
                return GameBoard.shuffle(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value instanceof Creature || value instanceof Action)}))[0].id
            default:
                return GameBoard.shuffle(this.gameBoard.players[this.gameBoard.currentPlayer].hand)[0].id
        }
    }

    /* Adds Creature on field */
    addCreatureToField(cardId: number): void {
        console.log("Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " places " + cardId + " on the field.")
        this.gameBoard.players[this.gameBoard.currentPlayer].field.push([this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]])
        this.gameBoard.players[this.gameBoard.currentPlayer].hand.splice(this.gameBoard.players[this.gameBoard.currentPlayer].hand.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]),1)[0]
        if (this.checkForMatchedActivatedChicken()) {
            (this.gameBoard.players[this.gameBoard.currentPlayer].field[this.gameBoard.players[this.gameBoard.currentPlayer].field.length-1][0] as Creature).facedUp = true
            this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " places " + cardId + " on the field.") 
        }
        else {
            this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " places a creature on the field.") 
        }
    }

    /* Uses action card and discards it
    WILL NEED TO BE MODIFIED*/
    useAction(cardId: number): void {
        console.log("Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " uses " + cardId)
        if (cardId == 301){
            //Uses Beach Spirits
            if (this.gameBoard.discard.some(function (value, index, array) {return (value instanceof Upgrade)})) this.getCardFromDiscard(GameBoard.shuffle(this.gameBoard.discard.filter(function (value, index, array) {return (value instanceof Upgrade)}))[0].id)
        }
        else if (cardId == 302){
            //Uses Forest Spirits
            if (this.gameBoard.discard.some(function (value, index, array) {return (value instanceof Creature)})) this.getCardFromDiscard(GameBoard.shuffle(this.gameBoard.discard.filter(function (value, index, array) {return (value instanceof Creature)}))[0].id)
        }
        else if (cardId == 303){
            //Uses River Spirits
            if (this.gameBoard.discard.some(function (value, index, array) {return (value instanceof Action)})) this.getCardFromDiscard(GameBoard.shuffle(this.gameBoard.discard.filter(function (value, index, array) {return (value instanceof Action)}))[0].id)
        }
        else if (cardId == 304 || cardId == 305) {
            //Uses Bird Army
            const cardChoice = Math.floor(Math.random() % 3)
            if (cardChoice == 0 && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.some(function (value, index, array) {return (value instanceof Creature)})){
                this.stealCard("Creature")
            }
            else if (cardChoice == 1 && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.some(function (value, index, array) {return (value instanceof Upgrade)})){
                this.stealCard("Upgrade")
            }
            else if (cardChoice == 1 && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.some(function (value, index, array) {return (value instanceof Action)})) {
                this.stealCard("Action")
            }
            else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.some(function (value, index, array) {return (value instanceof Creature)})){
                this.stealCard("Creature")
            }
            else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.some(function (value, index, array) {return (value instanceof Upgrade)})){
                this.stealCard("Upgrade")
            }
            else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.some(function (value, index, array) {return (value instanceof Action)})){
                this.stealCard("Action")
            }
        }
        else if (cardId == 306 || cardId == 307) {
            //Uses Messy Dorm
            //DOES NOTHING FOR NOW SINCE THE VIEW IS NOT SET UP
        }
        else if ((cardId == 308 || cardId == 309) && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.length > 0) {
            this.makeFaceUp(this.getRandomCardOnOpponentField())
        }
        this.discardCardFromHand(cardId)
    }

    /*Uses bird army action card*/
    useBirdArmy(cardId: number, type: string){
        this.stealCard(type);
        this.discardCardFromHand(cardId)
        this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " steals a card of type " + this.cardType(cardId) + " from " + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2] + ".") 
    }

    /*ensures that an upgrade card can be placed on the field or on a specific card*/
    canPlaceUpgrade(cardId: number = 0): boolean {
        if (cardId == 0){
            return this.gameBoard.players[this.gameBoard.currentPlayer].field.some(function (value, index, array) {return value.length < 3  || (value.length < 4 && value[1] instanceof Creature)})
        }
        else {
            const indexOfCreature = this.gameBoard.players[this.gameBoard.currentPlayer].field.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(cardId)})[0])
            return this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature].length < 3  || (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature].length < 4 && this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][1] instanceof Creature)
        }
    }

    /*picks random creature id to add upgrade to*/
    randomCreatureForUpgrade(): number {
        const length = this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return value.length < 3  || (value.length < 4 && value[1] instanceof Creature)}).length
        return this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return value.length < 3  || (value.length < 4 && value[1] instanceof Creature)})[Math.floor(Math.random()*length)][0].id
    }

    /*Places upgrade on specified creature*/
    placeUpgradeOnCreature(cardId: number, creatureCardId: number): void {
        console.log("Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " places " + cardId + " on " + creatureCardId)
        const indexOfCreature = this.gameBoard.players[this.gameBoard.currentPlayer].field.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(creatureCardId)})[0])
        this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature].push(this.gameBoard.players[this.gameBoard.currentPlayer].hand.splice(this.gameBoard.players[this.gameBoard.currentPlayer].hand.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]),1)[0])
        if (this.checkForMatchedActivatedChicken()) {
            this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " places " + cardId + " on " + creatureCardId);
            (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature].length-1] as Upgrade).facedUp = true
        }
        else if ((this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).facedUp){
            this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " places an upgrade on " + creatureCardId);
        }
        else {
            this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " places an upgrade on a creature.");
        }
    }

    /* Discards specified card from hand */
    discardCardFromHand(cardId: number): void{
        console.log("Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " gets rid of " + cardId + ".")
        this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " gets rid of " + cardId + ".")
        this.gameBoard.discard.push(this.gameBoard.players[this.gameBoard.currentPlayer].hand.splice(this.gameBoard.players[this.gameBoard.currentPlayer].hand.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]),1)[0])
        if (this.gameBoard.discard[this.gameBoard.discard.length-1] instanceof Creature) {
            (this.gameBoard.discard[this.gameBoard.discard.length-1] as Creature).facedUp = false;
            (this.gameBoard.discard[this.gameBoard.discard.length-1] as Creature).matched = false;
        } 
        else if (this.gameBoard.discard[this.gameBoard.discard.length-1] instanceof Upgrade) {
            (this.gameBoard.discard[this.gameBoard.discard.length-1] as Upgrade).facedUp = false;
        }
    }

    /* Gets a specified card from the discard pile 
    and puts it into players hand */
    getCardFromDiscard(cardId: number): void{
        this.gameBoard.players[this.gameBoard.currentPlayer].hand.push(this.gameBoard.discard.splice(this.gameBoard.discard.indexOf(this.gameBoard.discard.filter(function (value, index, array) {return (value.id == cardId)})[0]),1)[0])
        this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " grabs " + cardId + " from the discard.")
    }

    /*Steals a random card from opponent of
    specified creature type
    Creature - creature card
    Upgrade - Upgrade card
    Action - action card*/
    stealCard(type: string): void {
        switch (type){
            case 'Creature':
                this.gameBoard.players[this.gameBoard.currentPlayer].hand.push(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.splice(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.indexOf(GameBoard.shuffle(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.filter(function (value, index, array) {return (value instanceof Creature)}))[0]),1)[0])
                this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " steals a creature card from " + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ".")
                break;
            case 'Upgrade':
                this.gameBoard.players[this.gameBoard.currentPlayer].hand.push(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.splice(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.indexOf(GameBoard.shuffle(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.filter(function (value, index, array) {return (value instanceof Upgrade)}))[0]),1)[0])
                this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " steals an upgrade card from " + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ".")
                break;
            case 'Action':
                this.gameBoard.players[this.gameBoard.currentPlayer].hand.push(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.splice(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.indexOf(GameBoard.shuffle(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.filter(function (value, index, array) {return (value instanceof Action)}))[0]),1)[0])
                this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " steals an action card from " + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ".")
                break;
        }
    }

    /*Get id of random card on the opponent's field*/
    getRandomCardOnOpponentField(): number {
        const creatureIndex = Math.floor(Math.random()*this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.length)
        return this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[creatureIndex][Math.floor(Math.random()*this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[creatureIndex].length)].id
    }

    /*Makes the specified card face up on opponent's field*/
    makeFaceUp(cardId: number): void {
        let activateChickenAbility: boolean = false;
        let opponent: boolean = false;
        this.gameBoard.players[this.gameBoard.currentPlayer].field.forEach(function (value, index, array) {value.forEach(function (value, index, array) {
            if (value.id == cardId && value instanceof Creature) { 
                (value as Creature).facedUp = true; 
                if (index == 1){
                    (array[0] as Creature).facedUp = true;
                }
                else if ((value as Creature).matched && index==0){
                    (array[1] as Creature).facedUp = true;
                }
                if ((value as Creature).matched && (value as Creature).creatureType == "Chicken"){
                    activateChickenAbility = true;
                    opponent = true;
                }
            }
            else if (value.id == cardId && value instanceof Upgrade) (value as Upgrade).facedUp = true;})})
        this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.forEach(function (value, index, array) {value.forEach(function (value, index, array) {
            if (value.id == cardId && value instanceof Creature) { 
                (value as Creature).facedUp = true; 
                if (index == 1){
                    (array[0] as Creature).facedUp = true;
                }
                else if ((value as Creature).matched && index==0){
                    (array[1] as Creature).facedUp = true;
                }
                if ((value as Creature).matched && (value as Creature).creatureType == "Chicken"){
                    activateChickenAbility = true;
                    opponent = false;
                }
            } 
            else if (value.id == cardId && value instanceof Upgrade) (value as Upgrade).facedUp = true;})})
            if (activateChickenAbility) this.revealAllOpponentCard(opponent)
    }

    /*Checks to see if creature card on the field can be matched by specified card*/
    canMatch(cardId: number): boolean {
        return this.gameBoard.players[this.gameBoard.currentPlayer].field.map(function (value, index, array) {return value[0]}).some(function (value, index, array) {return Math.floor(value.id) == Math.floor(cardId)})
    }

    /*Matches creature cards using id*/
    matchCreature(cardId: number): void {
        console.log("Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " matches " + cardId)
        this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " matches " + cardId)
        const indexOfCreature = this.gameBoard.players[this.gameBoard.currentPlayer].field.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(cardId)})[0]);
        this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature].splice(1, 0, this.gameBoard.players[this.gameBoard.currentPlayer].hand.splice(this.gameBoard.players[this.gameBoard.currentPlayer].hand.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]),1)[0]);
        (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).matched = true;
        (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][1] as Creature).matched = true;
        if ((this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).facedUp) this.matchCreatureActivateAbility(cardId);
    }

    /*Activates Matched Creature's ability*/
    matchCreatureActivateAbility(cardId: number): void {
        if (!this.gameOver) {
            const indexOfCreature = this.gameBoard.players[this.gameBoard.currentPlayer].field.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(cardId)})[0]);
            (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).facedUp = true;
            (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][1] as Creature).facedUp = true;
            if ((this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).creatureType == "Chicken") {
                this.revealAllOpponentCard()
            }
        }
    }

    /*Reveals all Creature on opponent's field*/
    revealAllOpponentCard(opponent: boolean = true): void {
        if (opponent) this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.forEach(function (value, index, array) {value.forEach(function (value, index, array) {if (value instanceof Creature) (value as Creature).facedUp = true; else {(value as Upgrade).facedUp = true}})});
        else this.gameBoard.players[this.gameBoard.currentPlayer].field.forEach(function (value, index, array) {value.forEach(function (value, index, array) {if (value instanceof Creature) (value as Creature).facedUp = true; else {(value as Upgrade).facedUp = true}})})
    }

    /*Checks to see if there is an activated matching chicken on opponent's field*/
    checkForMatchedActivatedChicken(): boolean {
        return this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.map(function (value, index, array) {return value[0]}).some(function (value, index, array) {return (value as Creature).creatureType == "Chicken" && (value as Creature).matched == true && (value as Creature).facedUp == true})
    }

    /*Gets id of a random creature on opponent field*/
    getCreatureOpponentField(): number {
        return this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[Math.floor(Math.random()*this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.length)][0].id
    }

    /*Gets id of a random creature on current player field*/
    getCreatureMyField(): number {
        return this.gameBoard.players[this.gameBoard.currentPlayer].field[Math.floor(Math.random()*this.gameBoard.players[this.gameBoard.currentPlayer].field.length)][0].id
    }

    /*Execute Attack Turn*/
    attack(myCreatureId: number, opponentCreatureId: number): void{
        this.gameBoard.summary.push(this.gameBoard.players[this.gameBoard.currentPlayer].name + " attacks " + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + "\'s creature " + opponentCreatureId + " with " + myCreatureId + ".")
        //Makes boths creature faced up when attacking
        this.makeFaceUp(myCreatureId)
        this.makeFaceUp(opponentCreatureId)

        //Checks to see if the card attacking is a matched dog, if so, attacker always wins
        const myMatchedDog: boolean = this.gameBoard.players[this.gameBoard.currentPlayer].field.some(function(value,index,array) {return Math.floor(value[0].id) == Math.floor(myCreatureId) && (value[0] as Creature).matched && (value[0] as Creature).creatureType == "Dog"})

        //player defeats opponent 
        if ((Math.floor(myCreatureId) <= 103 && Math.floor(opponentCreatureId) >= 107) || ((Math.floor(myCreatureId) >= 104 && Math.floor(myCreatureId) <= 106) && Math.floor(opponentCreatureId) <= 103) || (Math.floor(myCreatureId) >= 107 && (Math.floor(opponentCreatureId) >= 104 && Math.floor(opponentCreatureId) <= 106)) || myMatchedDog){
            this.defeatedCreatureUpgrades(opponentCreatureId, myCreatureId)
            console.log(myCreatureId + "(" + this.gameBoard.players[this.gameBoard.currentPlayer].name + ") defeats " + opponentCreatureId + "(" + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ")")
            this.gameBoard.summary.push(myCreatureId + "(" + this.gameBoard.players[this.gameBoard.currentPlayer].name + ") defeats " + opponentCreatureId + "(" + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ")")
        }
        //opponent defeats player
        else if ((Math.floor(opponentCreatureId) <= 103 && Math.floor(myCreatureId) >= 107) || ((Math.floor(opponentCreatureId) >= 104 && Math.floor(opponentCreatureId) <= 106) && Math.floor(myCreatureId) <= 103) || (Math.floor(opponentCreatureId) >= 107 && (Math.floor(myCreatureId) >= 104 && Math.floor(myCreatureId) <= 106))){
            this.discardCreatureOnField(myCreatureId, this.gameBoard.currentPlayer)
            console.log(opponentCreatureId + "(" + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ") defeats " + myCreatureId + "(" + this.gameBoard.players[this.gameBoard.currentPlayer].name + ")")
            this.gameBoard.summary.push(opponentCreatureId + "(" + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ") defeats " + myCreatureId + "(" + this.gameBoard.players[this.gameBoard.currentPlayer].name + ")")
        }
        //battle is a tie (same creature type)
        else {
            console.log(myCreatureId + " does not impact " + opponentCreatureId)
            this.gameBoard.summary.push(myCreatureId + " does not impact " + opponentCreatureId)
        }
    }

    /*Checks to see if opponent's defeated creature has upgrade cards to use and then activates them accordingly*/
    defeatedCreatureUpgrades(opponentCreatureId: number, myCreatureId: number): void {
        const indexOfOpponentCreature = this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.indexOf(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(opponentCreatureId)})[0]);
        //Discards creature if there are no attached upgrades
        if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length < 2 || (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length < 3 && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][1] instanceof Creature)){
            this.discardCreatureOnField(opponentCreatureId, (this.gameBoard.currentPlayer+1)%2)
        }
        //Activates Counter Attack
        else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1].id >= 201 && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1].id <= 202){
            if ((Math.floor(myCreatureId) >= 104 && Math.floor(myCreatureId) <= 106) && Math.floor(opponentCreatureId) >= 107) {
                this.discardCreatureOnField(myCreatureId, this.gameBoard.currentPlayer);
            }
            this.discardOpponentUpgrade(indexOfOpponentCreature)
        }
        //Activates Defense
        else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1].id >= 203 && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1].id <= 204){
            this.discardOpponentUpgrade(indexOfOpponentCreature)
        }
        //Activates Fake Upgrade
        else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1].id >= 205 && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1].id <= 207){
            this.returnFakeUpgrade(indexOfOpponentCreature)
            this.defeatedCreatureUpgrades(opponentCreatureId, myCreatureId)
        }
        //Activates Revive
        else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1].id == 208){
            this.discardOpponentUpgrade(indexOfOpponentCreature)
            if (!(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length < 2 || (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length < 3 && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][1] instanceof Creature))){
                this.discardOpponentUpgrade(indexOfOpponentCreature)
            }
            let i;
            for (i = 0; i <this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length; i++){
                (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][i] as Creature).facedUp = false;
                (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][i] as Creature).matched = false;
            }
            this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.push(...this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature])
            this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.splice(indexOfOpponentCreature,1)
        }
        //Activates self-destruct
        else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1].id == 209) {
            this.discardCreatureOnField(myCreatureId, this.gameBoard.currentPlayer)
            this.discardCreatureOnField(opponentCreatureId, (this.gameBoard.currentPlayer+1)%2)
        }
    }

    /*Discard opponent upgrade card*/
    discardOpponentUpgrade(indexOfOpponentCreature: number): void{
        (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1] as Upgrade).facedUp = false
        this.gameBoard.discard.push(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1])
        this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].splice(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1, 1) 
    }

    /*Returns fake upgrade to opponent's hand*/
    returnFakeUpgrade(indexOfOpponentCreature: number): void {
        (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1] as Upgrade).facedUp = false
        this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.push(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature][this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1])
        this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].splice(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[indexOfOpponentCreature].length-1, 1)
    }

    /*Discards creature and all attached upgrades on specified player's field*/
    discardCreatureOnField(creatureId: number, playerNum: number): void{
        const indexOfCreature = this.gameBoard.players[playerNum].field.indexOf(this.gameBoard.players[playerNum].field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(creatureId)})[0]);
        (this.gameBoard.players[playerNum].field[indexOfCreature][0] as Creature).facedUp = false
        if ((this.gameBoard.players[playerNum].field[indexOfCreature][0] as Creature).matched){
            (this.gameBoard.players[playerNum].field[indexOfCreature][0] as Creature).matched = false;
            (this.gameBoard.players[playerNum].field[indexOfCreature][1] as Creature).facedUp = false;
            (this.gameBoard.players[playerNum].field[indexOfCreature][1] as Creature).matched = false;
        }
        this.gameBoard.discard.push(...this.gameBoard.players[playerNum].field[indexOfCreature])
        this.gameBoard.players[playerNum].field.splice(indexOfCreature,1)
    }

    /*Executes game clean up function (puts all cards back into deck and then sorts it)*/
    gameCleanUp(): void {
        //Puts all cards back into the deck
        this.gameBoard.deck.push(...this.gameBoard.discard)
        this.gameBoard.discard.splice(0,this.gameBoard.discard.length)
        this.gameBoard.deck.push(...this.gameBoard.players[this.gameBoard.currentPlayer].hand)
        this.gameBoard.players[this.gameBoard.currentPlayer].hand.splice(0,this.gameBoard.players[this.gameBoard.currentPlayer].hand.length)
        this.gameBoard.deck.push(...this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand)
        this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.splice(0,this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.length)
        let i;
        for (i = 0; i < this.gameBoard.players[this.gameBoard.currentPlayer].field.length; i++) this.gameBoard.deck.push(...this.gameBoard.players[this.gameBoard.currentPlayer].field[i])
        this.gameBoard.players[this.gameBoard.currentPlayer].field.splice(0, this.gameBoard.players[this.gameBoard.currentPlayer].field.length)
        for (i = 0; i < this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.length; i++) this.gameBoard.deck.push(...this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[i])
        this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.splice(0, this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.length)
        
        //Ensures all cards are faced down and not matched
        for (i = 0; i < this.gameBoard.deck.length; i++){
            if (this.gameBoard.deck[i] instanceof Creature){
                (this.gameBoard.deck[i] as Creature).matched = false;
                (this.gameBoard.deck[i] as Creature).facedUp = false;
            }
            else if (this.gameBoard.deck[i] instanceof Upgrade){
                (this.gameBoard.deck[i] as Upgrade).facedUp = false;
            }
        }

        //Sorts deck
        this.gameBoard.deck.sort(function(a,b) {
            if (a.id < b.id) return -1;
            else if (a.id > b.id) return 1;
            else return 0;
        })

        //Resetting class variables
        this.gameBoard.currentPlayer = 0;
        this.gameBoard.players[0].turnNumber = 0;
        this.gameBoard.players[1].turnNumber = 0;
        this.gameBoard.players[0].moves = 2;
        this.gameBoard.players[1].moves = 2;

        //Resets game summary
        this.gameBoard.summary.splice(0,this.gameBoard.summary.length);
    }

    isWon(): boolean {
        return this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.length == 0 && !(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.some(function(value, index, array) {return (value instanceof Creature)}));
    }

    isLost(): boolean {
        return this.gameBoard.players[this.gameBoard.currentPlayer].field.length == 0 && this.gameBoard.players[this.gameBoard.currentPlayer].moves == 0;
    }

    /* Checks to see if the game is a tie (no cards can be placed & creatures can not defeat each other & the deck is empty) */
    isTie(): boolean {
        if (this.gameBoard.deck.length > 0) return false;
        else if ((this.gameBoard.players[this.gameBoard.currentPlayer].hand.length > 0) && (this.canPlaceUpgrade())) return false;
        else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.length > 0) return false;
        else if (this.gameBoard.players[this.gameBoard.currentPlayer].field.length == 0 || (this.gameBoard.players[this.gameBoard.currentPlayer].field.some(function (value, index, array) {return ((value[0] as Creature).creatureType !== (array[0][0] as Creature).creatureType) || ((value[0] as Creature).creatureType == "Dog" && (value[0] as Creature).matched)}))) return false;
        else if (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.length == 0 || (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.some(function (value, index, array) {return ((value[0] as Creature).creatureType !== (array[0][0] as Creature).creatureType) || ((value[0] as Creature).creatureType == "Dog" && (value[0] as Creature).matched)}))) return false;
        else if ((this.gameBoard.players[this.gameBoard.currentPlayer].field[0][0] as Creature).creatureType !== (this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field[0][0] as Creature).creatureType) return false;
        else return true;
    }
}