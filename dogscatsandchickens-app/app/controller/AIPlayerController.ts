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

    constructor(gameController: GameController, type: string = "algorithmic") {
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
        else if (this.aiType == "algorithmic") {
            this.algorithmicMove();
        }
    }

    /* This function is responsiable for all of the algorithmic AI moves*/
    //CURRENT BEHAVES EXACTLY LIKE BASIC
    algorithmicMove(): void {

        //player puts a creature down for first turn
        if (this.player.turnNumber == 0) {
            this.player.moves = 0;
            this.gameController.addCreatureToField(this.gameController.randomCardId("Creature"));
            let analysis = this.algorithmicAnalyze();
            console.log(analysis);
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
            let analysis = this.algorithmicAnalyze();
            console.log(analysis);
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
            let analysis = this.algorithmicAnalyze();
            console.log(analysis);
            this.gameController.endofTurn();
        }
    }

    /* This function analyzes all cards for algorithm AI Players */
    algorithmicAnalyze(): { field: number[], hand: number[] } {
        //Go through field
        let field: number[] = [];
        this.player.field.forEach((card) => {
            field.push(0.4)
        })

        //Go through hand
        let hand: number[] = [];
        this.player.hand.forEach((card) => {
            if (card.id < 200) {
                hand.push(this.creatureCardAnalyze(card))
            }
            else {
                hand.push(0.4);
            }
        })

        return { field: field, hand: hand }
    }

    /*This function analyzes all hand creature card for algorithm AI Player */
    creatureCardAnalyze(card: Card): number {

        //amount of opponent creatures on the field factor
        let opponentCreatureAmountFactor = Math.min(this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.length * 0.2, 1);

        //Known opponent creature cards vs. creatures already on the field
        let knownOpponentAndCurrentFieldFactor = 0;
        if (this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.length != 0) {
            let opponentCanBeDefeated = false;
            let creatureCantBeDefeated = false;
            let fieldCreatureInDanger = false;
            let notSameType = false;

            //populate booleans based on each situation
            if ((card as Creature).creatureType == "Cat") {
                opponentCanBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.some((opponentCard) => {
                    return (opponentCard[0] as Creature).creatureType == "Chicken" && (opponentCard[0] as Creature).facedUp;
                })
                creatureCantBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.filter((opponentCard) => {return (opponentCard[0] as Creature).facedUp}).every((opponentCard) => {
                    return ((opponentCard[0] as Creature).creatureType == "Cat" || (opponentCard[0] as Creature).creatureType == "Chicken");
                })
                fieldCreatureInDanger = opponentCanBeDefeated && this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Dog";
                })
                notSameType = !this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Cat";
                })
            }
            else if ((card as Creature).creatureType == "Dog") {
                opponentCanBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.some((opponentCard) => {
                    return (opponentCard[0] as Creature).creatureType == "Cat" && (opponentCard[0] as Creature).facedUp;
                })
                creatureCantBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.filter((opponentCard) => {return (opponentCard[0] as Creature).facedUp}).every((opponentCard) => {
                    return ((opponentCard[0] as Creature).creatureType == "Dog" || (opponentCard[0] as Creature).creatureType == "Cat");
                })
                fieldCreatureInDanger = opponentCanBeDefeated && this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Chicken";
                })
                notSameType = !this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Dog";
                })
            }
            else {
                opponentCanBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.some((opponentCard) => {
                    return (opponentCard[0] as Creature).creatureType == "Dog" && (opponentCard[0] as Creature).facedUp;
                })
                creatureCantBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.filter((opponentCard) => {return (opponentCard[0] as Creature).facedUp}).every((opponentCard) => {
                    return (opponentCard[0] as Creature).creatureType == "Chicken" || (opponentCard[0] as Creature).creatureType == "Dog";
                })
                fieldCreatureInDanger = opponentCanBeDefeated && this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Cat";
                })
                notSameType = !this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Chicken";
                })
            }

            //Based on booleans determine factor value
            //console.log("opponentCanBeDefeated: " + opponentCanBeDefeated + " creatureCantBeDefeated: " + creatureCantBeDefeated + " fieldCreatureInDanger: " + fieldCreatureInDanger + " notSameType: " + notSameType)
            if (opponentCanBeDefeated && creatureCantBeDefeated && fieldCreatureInDanger && notSameType) knownOpponentAndCurrentFieldFactor = 1;
            else if (opponentCanBeDefeated && creatureCantBeDefeated && notSameType) knownOpponentAndCurrentFieldFactor = 0.8
            else if (opponentCanBeDefeated && notSameType && fieldCreatureInDanger) knownOpponentAndCurrentFieldFactor = 0.5
            else if (opponentCanBeDefeated && fieldCreatureInDanger && creatureCantBeDefeated) knownOpponentAndCurrentFieldFactor = 0.3
            else if (opponentCanBeDefeated && fieldCreatureInDanger) knownOpponentAndCurrentFieldFactor = 0.15
        }

        //Probability of specific creature types vs. creatures already on the field
        let futureCreaturePlacementFactor = 0;
        let knownCatCount = 0;
        let knownDogCount = 0;
        let knownChickenCount = 0
        this.player.hand.forEach((handCard) => {
            if (handCard.id < 200) {
                if ((handCard as Creature).creatureType == "Cat") {
                    knownCatCount = knownCatCount + 1;
                }
                else if ((handCard as Creature).creatureType == "Dog") {
                    knownDogCount = knownDogCount + 1;
                }
                else {
                    knownChickenCount = knownChickenCount + 1;
                }
            }
        })
        this.gameBoard.discard.forEach((discardCard) => {
            if (discardCard.id < 200) {
                if ((discardCard as Creature).creatureType == "Cat") {
                    knownCatCount = knownCatCount + 1;
                }
                else if ((discardCard as Creature).creatureType == "Dog") {
                    knownDogCount = knownDogCount + 1;
                }
                else {
                    knownChickenCount = knownChickenCount + 1;
                }
            }
        })
        this.player.field.forEach((fieldCard) => {
            if ((fieldCard[0] as Creature).creatureType == "Cat") {
                if ((fieldCard[0] as Creature).matched) knownCatCount = knownCatCount + 2;
                else knownCatCount = knownCatCount + 1;
            }
            else if ((fieldCard[0] as Creature).creatureType == "Dog") {
                if ((fieldCard[0] as Creature).matched) knownDogCount = knownDogCount + 2;
                else knownDogCount = knownDogCount + 1;
            }
            else {
                if ((fieldCard[0] as Creature).matched) knownChickenCount = knownChickenCount + 2;
                else knownChickenCount = knownChickenCount + 1
            }
        })
        this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.forEach((fieldCard) => {
            if ((fieldCard[0] as Creature).facedUp && (fieldCard[0] as Creature).creatureType == "Cat") {
                if ((fieldCard[0] as Creature).matched) knownCatCount = knownCatCount + 2;
                else knownCatCount = knownCatCount + 1;
            }
            else if ((fieldCard[0] as Creature).facedUp && (fieldCard[0] as Creature).creatureType == "Dog") {
                if ((fieldCard[0] as Creature).matched) knownDogCount = knownDogCount + 2;
                else knownDogCount = knownDogCount + 1;
            }
            else if ((fieldCard[0] as Creature).facedUp) {
                if ((fieldCard[0] as Creature).matched) knownChickenCount = knownChickenCount + 2;
                else knownChickenCount = knownChickenCount + 1
            }
        })
        if (knownCatCount + knownDogCount + knownDogCount < 18) {
            let fieldCreatureInDanger = false;
            let notSameType = false;
            let creaturePlacementProbability = 0;

            //populate booleans based on each situation
            if ((card as Creature).creatureType == "Cat") {
                fieldCreatureInDanger = this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Dog";
                })
                notSameType = !this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Cat";
                })
                creaturePlacementProbability = (6 - knownChickenCount) / (18 - (knownCatCount + knownDogCount + knownChickenCount))
            }
            else if ((card as Creature).creatureType == "Dog") {
                fieldCreatureInDanger = this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Chicken";
                })
                notSameType = !this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Dog";
                })
                creaturePlacementProbability = (6 - knownCatCount) / (18 - (knownCatCount + knownDogCount + knownChickenCount))
            }
            else {
                fieldCreatureInDanger = this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Cat";
                })
                notSameType = !this.player.field.some((fieldCard) => {
                    return (fieldCard[0] as Creature).creatureType == "Chicken";
                })
                creaturePlacementProbability = (6 - knownDogCount) / (18 - (knownCatCount + knownDogCount + knownChickenCount))
            }
            //console.log("knownCatCount: " + knownCatCount + " knownDogCount: " + knownDogCount + " knownChickenCount: " + knownChickenCount)
            //console.log("fieldCreatureInDanger: " + fieldCreatureInDanger + " notSameType: " + notSameType)
            if (fieldCreatureInDanger && notSameType) futureCreaturePlacementFactor = Math.min(creaturePlacementProbability * 1.5, 1);
            else if (fieldCreatureInDanger) futureCreaturePlacementFactor = Math.min(creaturePlacementProbability * 1.25, 1);
            else if (notSameType) futureCreaturePlacementFactor = Math.min(creaturePlacementProbability * 1.15, 1);
            else futureCreaturePlacementFactor = creaturePlacementProbability;
        }

        //Ability to match creature
        let abilityToMatchFactor = 0;
        if (this.player.hand.some((handCard) => {
            return card.name == handCard.name && card.id != handCard.id;
        }) || this.player.field.some((fieldCard) => {
            return card.name == fieldCard[0].name;
        })) abilityToMatchFactor = 1;
        else if (this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.every((fieldCard) => {
            return card.name != fieldCard[0].name;
        }) && this.gameBoard.discard.every((discardCard) => {
            return card.name != discardCard.name;
        })) abilityToMatchFactor = 0.25

        //RETURN FINAL CALCULATION
        console.log("opponentCreatureAmountFactor: " + opponentCreatureAmountFactor)
        console.log("knownOpponentAndCurrentFieldFactor: " + knownOpponentAndCurrentFieldFactor)
        console.log("futureCreaturePlacementFactor: " + futureCreaturePlacementFactor)
        console.log("abilityToMatchFactor: " + abilityToMatchFactor)
        return opponentCreatureAmountFactor * 0.1 + knownOpponentAndCurrentFieldFactor * 0.5 + futureCreaturePlacementFactor * 0.2 + abilityToMatchFactor * 0.2;
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