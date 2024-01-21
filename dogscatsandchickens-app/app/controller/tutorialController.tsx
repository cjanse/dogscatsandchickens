import {Creature} from "../models/creature";
import {Upgrade} from "../models/upgrade";
import {Action} from "../models/action";
import {Card} from "../models/card"
import {Player} from "../models/player"
import {GameBoard} from "../models/gameboard"

export class TutorialController {
    step: number;
    gameBoard: GameBoard;
    bellaQuotes: String[] = ["Hi! I'm Bella. I'm going to teach you how to play Dogs, Cats, and Chickens. It's a really cool game. The main objective is to defeat all of your opponent's creatures while protecting your own. First, I will walk you through the game board. Scroll to the bottom to see your hand (it has a dotted border around it). This is where you have all your cards that you can play throughout the game. Click \"Okay\" at the bottom to continue.",
    "This area is your field. It is currently empty, but you will add creature cards on it throughout the game.", "Here is your opponent hand. You can't see what cards your opponent has, but you can see what types they have. It looks like they have four creature cards and one upgrade card.",
    "This is your opponent's field. They will place creature cards here. In order to win, you need to make sure that they have no cards on their field.",
    "This is the deck. You will draw one card at the beginning of every turn except when you don't have any creatures in front of you. There are a lot of neat cards that you will learn about during this tutorial!",
    "This is the discard pile. It is currently empty since there are no cards that have been discarded. When there are cards in the pile, you can click the top card to see what cards are in the discard pile.",
    "Great! Now, that you are familiar with the board. Let's start playing. For the first move, you have to put down one creature. Let's put down our chicken Lulu. Click on the card in your hand to place it on the field."]

    constructor(player1Name: string = "Player 1", player2Name: string = "Player 2"){
        this.step = 0;
        this.gameBoard = new GameBoard(player1Name, player2Name);
    }

    preTutorialPreparation(): void {
        //Pick cards for player 1
        this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(6, 1)[0])
        this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(0, 1)[0])
        this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(10, 1)[0])
        this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(18, 1)[0])
        this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(26, 1)[0])

        //Pick cards for player 2
        this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(6, 1)[0])
        this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(6, 1)[0])
        this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(1, 1)[0])
        this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(16, 1)[0])
        this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(9, 1)[0])
    }

    doActionWithEndTurnButton(): void {
        switch (this.step){
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                this.step += 1;
                break;
        }
    }

    doActionWithCard(cardId: number): void{
        switch (this.step){
            case 6:
                if (cardId == 107.1){
                    this.gameBoard.players[0].field.push([this.gameBoard.players[0].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]])
                    this.gameBoard.players[0].hand.splice(2,1)[0]
                    this.step += 1;
                }
                break;
        }
    }

    highlightCard(cardId: number): string{
        switch (this.step){
            case 6:
                if (cardId == 104.1 || cardId == 101.1 || cardId == 107.1){
                    return "red"
                }
                else {
                    return "black"
                }
                break;
            default:
                return "black";
        }
    }
}