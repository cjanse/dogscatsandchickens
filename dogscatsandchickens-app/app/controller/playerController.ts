import {Creature} from "../models/creature";
import {Upgrade} from "../models/upgrade";
import {Action} from "../models/action";
import {Card} from "../models/card";
import {Player} from "../models/player";
import {GameBoard} from "../models/gameboard"
import {GameController} from "./gameController";

export class PlayerController {

    gameController: GameController;
    player: Player;
    gameBoard: GameBoard;

    constructor(gameController: GameController){
        this.gameController = gameController;
        this.gameBoard = this.gameController.gameBoard;
        this.player = this.gameController.gameBoard.players[0]
    }

    /*Other variables to keep track of*/
    hasDrawn: boolean = false;
    attackInProgress: boolean = false;
    attackingCard: number = 0;
    upgradePlacementIP = false;
    upgradeCard: number = 0;
    placeMatchedCreatureIP = false;
    matchCreature: number = 0;
    myMatchedCatIP: boolean = false;
    myMatchedCatCard: number = 0;
    beachSpiritsIP: boolean = false;
    forestSpiritsIP:boolean = false;
    riverSpiritsIP: boolean = false;
    birdArmyIP: boolean = false;
    birdArmyCard: number = 0;
    teaIP: boolean = false
    teaCard: number = 0;
    messyDormIP: boolean = false;
    recoveryTurn: boolean = false;



    /* This function can be called multiple times to do moves at random...
    *  is a tester method that is not meant to be used in the final version of the 
    *  game but is designed to test current design. */
    step: number = 0;
    testerMove(isAttack: boolean): void {
        //Checks to see if the step = 2 incorrectly
        if (this.step == 2 && this.gameBoard.players[this.gameBoard.currentPlayer].hand.length <= 5){
            this.step = 0;
        }

        console.log("Turn: "+ this.player.turnNumber + " | Player: " + this.player.name + " | Step: " + this.step + " | Moves: " + this.player.moves)
        
        //player puts a creature down for first turn
        if (this.player.turnNumber == 0){
            this.player.moves = 0;
            this.gameController.addCreatureToField(this.gameController.randomCardId("Creature"));
        }
        //Forces player to put creature/action card down if they don't have a creature in front of them
        //if it is not their first turn
        else if (!this.gameController.hasFieldCreature() && this.player.moves > 0){
            //checks to see if player has a creature card or an action card
            if (this.gameController.hasCreature() || this.gameController.hasAction()) {
                //uses action or places creature on field
                if (this.gameController.hasAction()){
                    this.gameController.useAction(this.gameController.randomCardId("Action"));
                    this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1;
                }
                if (this.gameController.hasCreature()) {
                    this.gameController.addCreatureToField(this.gameController.randomCardId("Creature"));
                    this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1;
                }
            }
            else {
                this.gameBoard.nextPlayer();
                this.step = 0;
                return;
            }
        }
        //if step is 0, then player draws a card
        else if (this.step == 0){
            if (this.gameBoard.deck.length > 0) {this.gameController.drawCard();}
            this.step += 1;
        }
        //chooses between fighting turn & reinforcement turn
        else if (this.step == 1 && this.gameBoard.players[this.gameBoard.currentPlayer].moves > 0){
            //Chooses attack turn
            if (isAttack && this.gameBoard.players[this.gameBoard.currentPlayer].moves == 2 && this.player.turnNumber > 0){
                this.gameBoard.players[this.gameBoard.currentPlayer].moves = 0;
                this.gameController.attack(this.gameController.getCreatureMyField(), this.gameController.getCreatureOpponentField());
                this.step += 1;
            }
            //chooses reinforcement turn
            else if (this.gameBoard.players[this.gameBoard.currentPlayer].hand.length > 0){
                //removes a move
                this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1
                if (this.gameBoard.players[this.gameBoard.currentPlayer].moves == 0){
                    this.step += 1;
                }
                
                let cardId = this.gameController.randomCardId()
                //Places creature on field
                if (cardId < 200) {
                    if (this.gameController.canMatch(cardId)){
                        this.gameController.matchCreature(cardId)
                        this.gameController.matchCreatureActivateAbility(cardId)
                    }
                    else {
                        this.gameController.addCreatureToField(cardId)
                    }
                }
                //places upgrade on field
                else if (cardId > 199 && cardId < 300){
                    if (this.gameController.canPlaceUpgrade()){
                        this.gameController.placeUpgradeOnCreature(cardId,this.gameController.randomCreatureForUpgrade())
                    }
                }
                //uses action card
                else if (cardId > 299 && cardId < 400) {
                    this.gameController.useAction(cardId)
                }
            }
        }
        else if (this.step == 1 && (this.gameBoard.players[this.gameBoard.currentPlayer].moves == 0 || this.gameBoard.players[this.gameBoard.currentPlayer].hand.length == 0)) this.step += 1
        //get rids of extra cards or ends turn
        else if (this.gameBoard.players[this.gameBoard.currentPlayer].hand.length > 5){
            this.gameController.discardCardFromHand(this.gameController.randomCardId());
        }
    }

    /*Checks to see if the turn can be ended*/
    canEndTurn(){
        return (this.player.field.length > 0 || this.player.turnNumber > 0) && this.player.hand.length <= 5 && (!this.actionIP() || this.gameController.gameOver);
    }

    /*Checks to see if there are any actions in progress*/
    actionIP(){
        return this.attackInProgress || this.upgradePlacementIP || this.placeMatchedCreatureIP || this.beachSpiritsIP || this.forestSpiritsIP || this.riverSpiritsIP || this.birdArmyIP || this.teaIP || this.myMatchedCatIP || this.gameController.gameOver || this.messyDormIP;
    }

    /*Checks to see if player can draw card*/
    canDraw(cardId: number){
        return cardId == this.gameBoard.deck[this.gameBoard.deck.length-1].id && this.player.field.length > 0 && (this.player.moves == 2 || this.recoveryTurn) && this.player.turnNumber > 0 && !this.hasDrawn && !this.actionIP();
    }

    /*Checks to see if the card in hand can be used*/
    canUseHandCard(cardId: number){
        if (this.player.field.length == 0 && this.player.turnNumber > 0 && (this.player.moves == 2 || this.recoveryTurn)){
            this.recoveryTurn = true;
            return (cardId > 100 && cardId < 200) || (cardId == 302 && this.gameBoard.discard.some(function(value, index, array) {return (value instanceof Creature)})) || ((cardId == 304 || cardId == 305) && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.some(function(value, index, array) {return (value instanceof Creature)}))
        }
        else if (cardId > 100 && cardId < 200){
            return ((this.player.turnNumber == 0 && this.player.moves == 2) || (this.player.turnNumber > 0 && this.player.moves > 0 && (this.hasDrawn || this.gameBoard.deck.length == 0) && !this.actionIP())) || (this.placeMatchedCreatureIP && this.matchCreature == cardId);
        }
        else if (cardId > 200 && cardId < 300){
            return this.player.turnNumber > 0 && this.player.moves > 0 && this.gameController.canPlaceUpgrade() && (this.hasDrawn || this.gameBoard.deck.length == 0) && !this.actionIP();
        }
        else {
            if(this.player.turnNumber > 0 && this.player.moves > 0 && (this.hasDrawn || this.gameBoard.deck.length == 0) && !this.actionIP()) {
                switch (cardId) {
                    case 301:
                        return this.gameBoard.discard.length>0 && this.gameBoard.discard.some(function (value, index, array) {return (value instanceof Upgrade)});
                    case 302:
                        return this.gameBoard.discard.length>0 && this.gameBoard.discard.some(function (value, index, array) {return (value instanceof Creature)});
                    case 303:
                        return this.gameBoard.discard.length>0 && this.gameBoard.discard.some(function (value, index, array) {return (value instanceof Action)});
                    case 304:
                    case 305:
                        return this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.length > 0
                    case 306:
                    case 307:
                        return this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].hand.length > 0
                    case 308:
                    case 309:
                        return this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.some(function(value, index, array) {return value.some(function(value, index, array) {if (value instanceof Creature) {return !(value as Creature).facedUp} else return !(value as Upgrade).facedUp})})
                    default:
                        return true;
                }
            }
            else {
                return false;
            }
        }
    }

    /*Checks to see if cards need to discarded */
    discardNeed(){
        return this.player.moves == 0 && this.player.hand.length > 5
    }

    canFieldHandle(cardId: number){
        return this.canAttack(cardId) || this.canFinishUpgrade(cardId) || this.canFinishMatch(cardId)
    }

    /*Checks the conditions for the player to attack*/
    canAttack(cardId: number){
        return cardId > 100 && cardId < 200 && this.player.moves == 2 && this.player.turnNumber > 0 && (this.hasDrawn || this.gameBoard.deck.length == 0) && !this.actionIP()
    }

    /*Checks to see if upgrade task can be finished*/
    canFinishUpgrade(cardId: number){
        return cardId > 100 && cardId < 200 && this.upgradePlacementIP && this.gameController.canPlaceUpgrade(cardId);
    }

    /*Checks to see if one can finish placing a matched Creature*/
    canFinishMatch(cardId: number){
        return cardId > 100 && cardId < 200 && this.placeMatchedCreatureIP && Math.floor(cardId)==Math.floor(this.matchCreature)
    }

    /*Checks the conditions to choose the card for the player to attack*/
    canHandleOpponentField(cardId: number){
        return this.canFinishAttack(cardId) || this.canFinishTea(cardId);
    }

    canFinishAttack(cardId: number){
        return (cardId > 100 && cardId < 200 && this.attackInProgress)
    }

    canFinishTea(cardId: number){
        return this.teaIP && this.gameBoard.players[(this.gameBoard.currentPlayer+1)%2].field.some(function(value, index, array) {return value.some(function(value, index, array) {if (value instanceof Creature) {return !(value as Creature).facedUp && value.id == cardId} else return !(value as Upgrade).facedUp && value.id == cardId})})
    }

    /*Checks to see if the card can activate its matching ability*/
    canActivateAbility(cardId: number){
        const indexOfCreature = this.player.field.indexOf(this.player.field.filter(function (value, index, array) {return Math.floor(value[0].id) == Math.floor(cardId)})[0]);
        return cardId > 100 && cardId < 200 && this.player.field[indexOfCreature].length > 1 && Math.floor(this.player.field[indexOfCreature][1].id) == Math.floor(cardId) && !(this.player.field[indexOfCreature][0] as Creature).facedUp
    }

    /*Checks to see if card can be grabbed from discard*/
    canGrabDiscard(cardId: number){
        const indexOfCard = this.gameBoard.discard.indexOf(this.gameBoard.discard.filter(function (value, index, array) {return value.id == cardId})[0]);
        return (this.gameBoard.discard[indexOfCard] instanceof Upgrade && this.beachSpiritsIP) || (this.gameBoard.discard[indexOfCard] instanceof Creature && this.forestSpiritsIP) || (this.gameBoard.discard[indexOfCard] instanceof Action && this.riverSpiritsIP)
    }

    /*Checks to see if opponent card can be grabbed*/
    canHandleOpponentHand(){
        return this.birdArmyIP;
    }

    /*Ends Player turn*/
    endTurn(): boolean {
        console.log("End Turn button clicked.")
        if (this.canEndTurn()){
            console.log(this.player.name + " turn: " + this.player.turnNumber + " has ended.")
            this.hasDrawn = false;
            this.gameController.endofTurn();
            return true;
        }
        return false;
    }

    /*Allows player to draw a card, assuming correct conditions*/
    drawCard(cardId: number) {
        console.log(cardId + " clicked from deck")
        if (this.canDraw(cardId)){
            this.recoveryTurn = false;
            console.log(cardId + " drawn")
            this.gameController.drawCard();
            this.hasDrawn = true;
        }
        else {
            console.log(cardId + " not drawn")
        }
    }

    /*Allows player to use card, assuming correct conditions*/
    useHandCard(cardId: number){
        console.log(cardId + " clicked from hand")
        if (this.messyDormIP && (cardId == 306 || cardId == 307)){
            this.messyDormIP = false;
            this.player.moves -= 1;
            this.gameController.discardCardFromHand(this.teaCard)
        }
        else if (this.discardNeed()){
            this.gameController.discardCardFromHand(cardId)
        }
        else if (this.canFinishMatch(cardId)){
            this.finishMatching(cardId)
        }
        else if (this.canUseHandCard(cardId)){
            console.log(cardId + " is used from hand")
            if (cardId > 100 && cardId < 200)
            {
                if (this.gameController.canMatch(cardId)){
                    this.placeMatchedCreatureIP = true;
                    this.matchCreature = cardId;
                }
                else {
                    this.gameController.addCreatureToField(cardId)
                    this.player.moves -= 1;
                }
            }
            else if (cardId > 200 && cardId < 300){
                this.upgradeCard = cardId;
                this.upgradePlacementIP = true;
            }
            else {
                switch (cardId) {
                    case 301:
                        this.beachSpiritsIP = true;
                        break;
                    case 302:
                        this.forestSpiritsIP = true;
                        break;
                    case 303:
                        this.riverSpiritsIP = true;
                        break;
                    case 304:
                    case 305:
                        this.birdArmyIP = true;
                        this.birdArmyCard = cardId;
                        break;
                    case 306:
                    case 307:
                        this.messyDormIP = true;
                        break;
                    case 308:
                    case 309:
                        this.teaIP = true;
                        this.teaCard = cardId;
                        break;
                    default:
                        this.gameController.useAction(cardId)
                        this.player.moves -= 1;
                }
            }
        }
    }

    /*Does desired action with field card*/
    fieldHandle(cardId: number){
        console.log(cardId + " clicked from field")
        if (this.canFinishUpgrade(cardId)) {
            this.finishUpgrade(cardId)
        }
        else if (this.myMatchedCatIP && Math.floor(cardId) == Math.floor(this.myMatchedCatCard)){
            this.finishCatAttack();
        }
        else if (this.canAttack(cardId)){
            this.attack(cardId)
        }
        else if (this.canFinishMatch(cardId)){
            this.finishMatching(cardId)
        }
        else if (this.canActivateAbility(cardId)){
            this.activateAbility(cardId)
        }
    }

    /*finishes upgrade process*/
    finishUpgrade(fieldCardId: number){
        if (this.canFinishUpgrade(fieldCardId)){
            this.player.moves -= 1;
            this.upgradePlacementIP = false;
            this.gameController.placeUpgradeOnCreature(this.upgradeCard,fieldCardId)
            this.upgradeCard = 0;
        }
    }

    /*¡Al ataque! Begins attack process*/
    attack(cardId: number){
        if (this.canAttack(cardId)){
            this.myMatchedCatIP = this.gameBoard.players[this.gameBoard.currentPlayer].field.some(function(value,index,array) {return Math.floor(value[0].id) == Math.floor(cardId) && (value[0] as Creature).matched && (value[0] as Creature).creatureType == "Cat"})
            this.gameController.makeFaceUp(cardId)
            this.attackingCard = cardId;
            this.attackInProgress = true;
        }
    }

    /*finishes matching process*/
    finishMatching(cardId: number){
        if (this.canFinishMatch(cardId)){
            if (cardId == this.matchCreature){
                this.gameController.addCreatureToField(cardId)
            }
            else {
                this.gameController.matchCreature(this.matchCreature)
            }
            this.player.moves -= 1;
            this.matchCreature = 0;
            this.placeMatchedCreatureIP = false;
        }
    }

    /*finishes attacking cat handle*/
    finishCatAttack(){
        this.attackInProgress = false;
        this.attackingCard = 0;
        this.myMatchedCatIP = false;
        this.myMatchedCatCard = 0;
    }

    /*¡Al ataque! Finishes attack process*/
    handleOpponentField(opponentCardId: number){
        console.log(opponentCardId + " clicked from opponent's field")
        if (this.canHandleOpponentField(opponentCardId)) {
            if (this.teaIP){
                this.player.moves -= 1;
                this.teaIP = false;
                this.gameController.makeFaceUp(opponentCardId)
                this.gameController.discardCardFromHand(this.teaCard)
                this.teaCard = 0;
            }
            else {
                this.gameBoard.players[this.gameBoard.currentPlayer].moves = 0;
                this.gameController.attack(this.attackingCard, opponentCardId)
                if (!this.myMatchedCatIP) {
                    this.attackInProgress = false;
                    this.attackingCard = 0;
                }
                else {
                    this.myMatchedCatCard = this.attackingCard
                }
            }
        }
    }

    /*activates the ability of the matched cards*/
    activateAbility(cardId: number){
        this.gameController.matchCreatureActivateAbility(cardId);
    }

    /*grabs the specific card from the discard pile*/
    grabDiscard(cardId: number){
        console.log(cardId + " clicked from discard")
        if (this.canGrabDiscard(cardId)){
            if (cardId < 200) {
                this.gameController.getCardFromDiscard(cardId)
                this.player.moves -= 1;
                this.forestSpiritsIP = false;
                this.gameController.discardCardFromHand(302) 
            }
            else if (cardId > 200 && cardId < 300){
                this.gameController.getCardFromDiscard(cardId)
                this.player.moves -= 1;
                this.beachSpiritsIP = false;
                this.gameController.discardCardFromHand(301)
            }
            else {
                this.gameController.getCardFromDiscard(cardId)
                this.player.moves -= 1;
                this.riverSpiritsIP = false;
                this.gameController.discardCardFromHand(303)
            }
        }
    }

    /*grabs a card from opponent at random*/
    grabOpponentCard(cardId: number){
        console.log(cardId + " was clicked from opponent hand")
        if (this.canHandleOpponentHand()){
            if (cardId < 200) {
                this.gameController.stealCard("Creature")
            }
            else if (cardId < 300){
                this.gameController.stealCard("Upgrade")
            }
            else {
                this.gameController.stealCard("Action")
            }
            this.player.moves -= 1;
            this.birdArmyIP = false
            this.gameController.discardCardFromHand(this.birdArmyCard)
            this.birdArmyCard = 0;
        }
    }

}