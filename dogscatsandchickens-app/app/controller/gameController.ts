import {Creature} from "../models/creature";
import {Upgrade} from "../models/upgrade";
import {Action} from "../models/action";
import {Card} from "../models/card"
import {Player} from "../models/player"
import {GameBoard} from "../models/gameboard"

export class GameController {
    gameBoard: GameBoard;

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

    /* This function can be called multiple times to do moves at random...
    *  is a tester method that is not meant to be used in the final version of the 
    *  game but is designed to test current design. */
    step: number = 0;
    testerMove(isAttack: boolean): void {
        console.log("Turn: "+ this.gameBoard.turnNumber + " | Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " | Step: " + this.step)
        /*if the game is over, then reset the board*/
        if (this.gameBoard.turnNumber > 1 && this.step == 0 && (this.isWon() || this.isTie())) {
            if (this.isWon()){
                console.log("Player: " + this.gameBoard.players[this.gameBoard.currentPlayer].name + " has won!")
            }
            else {
                console.log("Game is tied")
            }
            this.step = 0;
            this.gameCleanUp();
            this.preGamePreparation();
            return;
        }
        //Forces player to put creature/action card down if they don't have a creature in front of them
        //if it is not their first turn
        else if (!this.hasFieldCreature() && (this.gameBoard.turnNumber > 1) && this.gameBoard.players[this.gameBoard.currentPlayer].moves > 0){
            //checks to see if player has a creature card or an action card
            if (this.hasCreature() || this.hasAction()) {
                //uses action or places creature on field
                if (this.hasAction()){
                    this.useAction(this.randomCardId("Action"));
                }
                else {
                    this.addCreatureToField(this.randomCardId("Creature"));
                }
                this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1;
            }
            else {
                this.gameBoard.nextPlayer();
                this.step = 0;
                return;
            }
        }
        //Forces player to put creature card down if they don't have a creature in front of them
        //for their first turn
        else if (!this.hasFieldCreature()){
            this.addCreatureToField(this.randomCardId("Creature"));
        }
        //if step is 0, then player draws a card
        else if (this.step == 0){
            if (this.gameBoard.deck.length > 0) {this.drawCard();}
            this.step += 1;
        }
        //chooses between fighting turn & reinforcement turn
        else if (this.step == 1 && this.gameBoard.players[this.gameBoard.currentPlayer].moves > 0){
            //Chooses attack turn
            if (isAttack && this.gameBoard.players[this.gameBoard.currentPlayer].moves == 2 && this.gameBoard.turnNumber > 1){
                this.attack(this.getCreatureMyField(), this.getCreatureOpponentField())
                this.gameBoard.players[this.gameBoard.currentPlayer].moves = 0;
                if (this.gameBoard.players[this.gameBoard.currentPlayer].field.length == 0) {
                    this.gameBoard.nextPlayer();
                    this.step = 0;
                    return;
                }
            }
            //chooses reinforcement turn
            else if (this.gameBoard.players[this.gameBoard.currentPlayer].hand.length > 0){
                let cardId = this.randomCardId()
                //Places creature on field
                if (cardId < 200) {
                    if (this.canMatch(cardId)){
                        this.matchCreature(cardId)
                        this.matchCreatureActivateAbility(cardId)
                    }
                    else {
                        this.addCreatureToField(cardId)
                    }
                }
                //places upgrade on field
                else if (cardId > 199 && cardId < 300){
                    if (this.canPlaceUpgrade()){
                        this.placeUpgradeOnCreature(cardId,this.randomCreatureForUpgrade())
                    }
                    else {
                        this.gameBoard.players[this.gameBoard.currentPlayer].moves += 1
                    }
                }
                //uses action card
                else if (cardId > 299 && cardId < 400) {
                    this.useAction(cardId)
                }
                //removes a move
                this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1
            }
            if (this.gameBoard.players[this.gameBoard.currentPlayer].moves == 0 || this.gameBoard.players[this.gameBoard.currentPlayer].hand.length == 0){
                this.step += 1
            }
        }
        else if (this.step == 1 && (this.gameBoard.players[this.gameBoard.currentPlayer].moves == 0 || this.gameBoard.players[this.gameBoard.currentPlayer].hand.length == 0)) this.step += 1
        //get rids of extra cards or ends turn
        else if (this.step == 2){
            //Gets rid of extra cards
            if (this.gameBoard.players[this.gameBoard.currentPlayer].hand.length > 5){
                this.discardCardFromHand(this.randomCardId());
            }
            else {
                this.step = 0;
                this.gameBoard.nextPlayer();
            }
        }
        
    }

    /* Draws a card for a player */
    drawCard(): void{
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
        this.gameBoard.players[this.gameBoard.currentPlayer].field.push([this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]])
        this.gameBoard.players[this.gameBoard.currentPlayer].hand.splice(this.gameBoard.players[this.gameBoard.currentPlayer].hand.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]),1)[0]
        if (this.checkForMatchedActivatedChicken()) {
            (this.gameBoard.players[this.gameBoard.currentPlayer].field[this.gameBoard.players[this.gameBoard.currentPlayer].field.length-1][0] as Creature).facedUp = true
        }
    }

    /* Uses action card and discards it
    WILL NEED TO BE MODIFIED*/
    useAction(cardId: number): void {
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

    /*ensures that an upgrade card can be placed on the field*/
    canPlaceUpgrade(): boolean {
        return this.gameBoard.players[this.gameBoard.currentPlayer].field.some(function (value, index, array) {return value.length < 3  || (value.length < 4 && value[1] instanceof Creature)})
    }

    /*picks random creature id to add upgrade to*/
    randomCreatureForUpgrade(): number {
        const length = this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return value.length < 3  || (value.length < 4 && value[1] instanceof Creature)}).length
        return this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return value.length < 3  || (value.length < 4 && value[1] instanceof Creature)})[Math.floor(Math.random()*length)][0].id
    }

    /*Places upgrade on specified creature*/
    placeUpgradeOnCreature(cardId: number, creatureCardId: number): void {
        const indexOfCreature = this.gameBoard.players[this.gameBoard.currentPlayer].field.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return value[0].id == creatureCardId})[0])
        this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature].push(this.gameBoard.players[this.gameBoard.currentPlayer].hand.splice(this.gameBoard.players[this.gameBoard.currentPlayer].hand.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]),1)[0])
        if (this.checkForMatchedActivatedChicken()) {
            (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature].length-1] as Upgrade).facedUp = true
        }
    }

    /* Discards specified card from hand */
    discardCardFromHand(cardId: number): void{
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
                break;
            case 'Upgrade':
                this.gameBoard.players[this.gameBoard.currentPlayer].hand.push(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.splice(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.indexOf(GameBoard.shuffle(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.filter(function (value, index, array) {return (value instanceof Upgrade)}))[0]),1)[0])
                break;
            case 'Action':
                this.gameBoard.players[this.gameBoard.currentPlayer].hand.push(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.splice(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.indexOf(GameBoard.shuffle(this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.filter(function (value, index, array) {return (value instanceof Action)}))[0]),1)[0])
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
        this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.forEach(function (value, index, array) {value.forEach(function (value, index, array) {if (value.id == cardId && value instanceof Creature) (value as Creature).facedUp = true; else if (value.id == cardId && value instanceof Upgrade) (value as Upgrade).facedUp = true;})})
    }

    /*Checks to see if creature card on the field can be matched by specified card*/
    canMatch(cardId: number): boolean {
        return this.gameBoard.players[this.gameBoard.currentPlayer].field.map(function (value, index, array) {return value[0]}).some(function (value, index, array) {return Math.floor(value.id) == Math.floor(cardId)})
    }

    /*Matches creature cards using id*/
    matchCreature(cardId: number): void {
        const indexOfCreature = this.gameBoard.players[this.gameBoard.currentPlayer].field.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(cardId)})[0]);
        this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature].splice(1, 0, this.gameBoard.players[this.gameBoard.currentPlayer].hand.splice(this.gameBoard.players[this.gameBoard.currentPlayer].hand.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]),1)[0]);
        (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).matched = true;
        (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][1] as Creature).matched = true;
        if ((this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).facedUp) this.matchCreatureActivateAbility(cardId)
    }

    /*Activates Matched Creature's ability*/
    matchCreatureActivateAbility(cardId: number): void {
        const indexOfCreature = this.gameBoard.players[this.gameBoard.currentPlayer].field.indexOf(this.gameBoard.players[this.gameBoard.currentPlayer].field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(cardId)})[0]);
        (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).facedUp = true;
        (this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][1] as Creature).facedUp = true;
        if ((this.gameBoard.players[this.gameBoard.currentPlayer].field[indexOfCreature][0] as Creature).creatureType == "Chicken") {
            this.revealAllOpponentCard()
        }
    }

    /*Reveals all Creature on opponent's field*/
    revealAllOpponentCard(): void {
        this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.forEach(function (value, index, array) {value.forEach(function (value, index, array) {if (value instanceof Creature) (value as Creature).facedUp = true; else {(value as Upgrade).facedUp = true}})})
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
        //player defeats opponent 
        if ((Math.floor(myCreatureId) <= 103 && Math.floor(opponentCreatureId) >= 107) || ((Math.floor(myCreatureId) >= 104 && Math.floor(myCreatureId) <= 106) && Math.floor(opponentCreatureId) <= 103) || (Math.floor(myCreatureId) >= 107 && (Math.floor(opponentCreatureId) >= 104 && Math.floor(opponentCreatureId) <= 106))){
            this.defeatedCreatureUpgrades(opponentCreatureId, myCreatureId)
            console.log(myCreatureId + "(" + this.gameBoard.players[this.gameBoard.currentPlayer].name + ") defeats " + opponentCreatureId + "(" + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ")")
        }
        //opponent defeats player
        else if ((Math.floor(opponentCreatureId) <= 103 && Math.floor(myCreatureId) >= 107) || ((Math.floor(opponentCreatureId) >= 104 && Math.floor(opponentCreatureId) <= 106) && Math.floor(myCreatureId) <= 103) || (Math.floor(opponentCreatureId) >= 107 && (Math.floor(myCreatureId) >= 104 && Math.floor(myCreatureId) <= 106))){
            this.discardCreatureOnField(myCreatureId, this.gameBoard.currentPlayer)
            console.log(opponentCreatureId + "(" + this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].name + ") defeats " + myCreatureId + "(" + this.gameBoard.players[this.gameBoard.currentPlayer].name + ")")
        }
        //battle is a tie (same creature type)
        else {
            console.log(myCreatureId + " does not impact " + opponentCreatureId)
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
        
        //Sorts deck
        this.gameBoard.deck.sort(function(a,b) {
            if (a.id < b.id) return -1;
            else if (a.id > b.id) return 1;
            else return 0;
        })

        //Resetting class variables
        this.step = 0;
        this.gameBoard.currentPlayer = 0;
        this.gameBoard.turnNumber = 0;
    }

    isWon(): boolean {
        return this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.length == 0;
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