import { Creature } from "../models/creature";
import { Upgrade } from "../models/upgrade";
import { Action } from "../models/action";
import { Card } from "../models/card";
import { Player } from "../models/player";
import { GameBoard } from "../models/gameboard"
import { GameController } from "./gameController";

export class AIPlayerController {

    gameController: GameController;
    player: Player;
    gameBoard: GameBoard;
    aiType: string;

    constructor(gameController: GameController, type: string = "basic") {
        this.gameController = gameController;
        this.gameBoard = this.gameController.gameBoard;
        this.player = this.gameController.gameBoard.players[1]
        this.aiType = type;
    }

    /* This function is reponsible for all of the AI moves*/
    move(): void {
        //Doesn't do anything if the game is already over
        if (this.gameController.gameOver) {
            return;
        }

        if (this.aiType == "basic") {
            this.basicMove();
        }
    }

    /* This function is reponsible for all of the basic AI moves*/
    basicMove(): void {
        //player puts a creature down for first turn
        if (this.player.turnNumber == 0) {
            this.player.moves = 0;
            this.gameController.addCreatureToField(this.gameController.randomCardId("Creature"));
            this.gameController.endofTurn();
        }
        //player is forced to play an action or creature if they have no creature in front of them
        else if (!this.gameController.hasFieldCreature()) {
            //checks to see if player has a creature card or an action card
            if (this.gameController.hasCreature() || this.gameController.hasAction()) {
                //uses action or places creature on field
                if (this.gameController.hasAction() && !this.gameController.hasCreature()) {
                    if (this.player.hand.some(function (value, index, array) { return (value.id == 302) }) && this.gameBoard.discard.some(function (value, index, array) { return (value instanceof Creature) })) {
                        this.gameController.useAction(302);
                        this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1;
                    }
                    else if (this.player.hand.some(function (value, index, array) { return (value.id == 304) }) && this.gameBoard.players[0].hand.some(function (value, index, array) { return (value instanceof Creature) })) {
                        this.gameController.useBirdArmy(304, "Creature");
                        this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1;
                    }
                    else if (this.player.hand.some(function (value, index, array) { return (value.id == 305) }) && this.gameBoard.players[0].hand.some(function (value, index, array) { return (value instanceof Creature) })) {
                        this.gameController.useBirdArmy(305, "Creature");
                        this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1;
                    }
                }
                if (this.gameController.hasCreature()) {
                    this.gameController.addCreatureToField(this.gameController.randomCardId("Creature"));
                    this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1;
                }
                if (this.player.field.length > 0) {
                    if (this.gameBoard.deck.length > 0) { this.gameController.drawCard(); }
                    if (this.player.moves > 0 && this.player.hand.length > 0) {
                        this.randomReinforce();
                    }
                }
            }
            this.gameController.endofTurn();
        }
        //Execute regular turn
        else {
            if (this.gameBoard.deck.length > 0) { this.gameController.drawCard(); }
            //Determines randomly if the turn is reinforce or attack
            if (Math.round(Math.random()) ? true : false || this.player.hand.length == 0) {
                this.randomAttack()
            }
            else {
                this.randomReinforce();
                if (this.player.hand.length > 0) { this.randomReinforce(); }
            }
            //Gets rid of extra cards
            while (this.player.hand.length > 5) {
                this.randomDiscard();
            }
            this.gameController.endofTurn();
        }
    }

    /*This function reinforces randomly*/
    randomReinforce(): void {
        //Removes a move
        this.gameBoard.players[this.gameBoard.currentPlayer].moves -= 1

        let cardId = this.gameController.randomCardId()
        //Places creature on field
        if (cardId < 200) {
            if (this.gameController.canMatch(cardId)) {
                this.gameController.matchCreature(cardId)
                this.gameController.matchCreatureActivateAbility(cardId)
            }
            else {
                this.gameController.addCreatureToField(cardId)
            }
        }
        //places upgrade on field
        else if (cardId > 199 && cardId < 300) {
            if (this.gameController.canPlaceUpgrade()) {
                this.gameController.placeUpgradeOnCreature(cardId, this.gameController.randomCreatureForUpgrade())
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

    /*This function attacks randomly*/
    randomAttack(): void {
        this.gameBoard.players[this.gameBoard.currentPlayer].moves = 0;
        this.gameController.attack(this.gameController.getCreatureMyField(), this.gameController.getCreatureOpponentField())
    }

    /*This function randomly discards a card*/
    randomDiscard(): void {
        this.gameController.discardCardFromHand(this.gameController.randomCardId());
    }

}