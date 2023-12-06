import {Creature} from "../models/creature";
import {Upgrade} from "../models/upgrade";
import {Action} from "../models/action";
import {Card} from "../models/card";
import {Player} from "../models/player";
import {GameBoard} from "../models/gameboard"
import {GameController} from "./gameController";

export class AIPlayerController {

    gameController: GameController;
    player: Player;
    gameBoard: GameBoard;

    constructor(gameController: GameController){
        this.gameController = gameController;
        this.gameBoard = this.gameController.gameBoard;
        this.player = this.gameController.gameBoard.players[1]
    }


    /* This function can be called multiple times to do moves at random...
    *  is a tester method that is not meant to be used in the final version of the 
    *  game but is designed to test current design. */
    step: number = 0;
    testerMove(): void {
        while (this.gameBoard.currentPlayer == 1) {
        const isAttack: boolean = (Math.round(Math.random()) ? true : false);

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
                this.gameController.attack(this.gameController.getCreatureMyField(), this.gameController.getCreatureOpponentField())
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
                    else {
                        this.gameBoard.players[this.gameBoard.currentPlayer].moves += 1
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
    } }
}