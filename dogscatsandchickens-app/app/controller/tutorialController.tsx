import {Creature} from "../models/creature";
import {Upgrade} from "../models/upgrade";
import {Action} from "../models/action";
import {Card} from "../models/card"
import {Player} from "../models/player"
import {GameBoard} from "../models/gameboard"

export class TutorialController {
    step: number;
    gameBoard: GameBoard;

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
}