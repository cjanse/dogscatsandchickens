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
}