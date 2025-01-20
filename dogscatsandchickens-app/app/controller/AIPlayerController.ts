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

        //Analyzes cards
        let analysis = this.algorithmicAnalyze();

        //player puts a creature down for first turn
        if (this.player.turnNumber == 0) {
            console.log(analysis);
            this.player.moves = 0;
            this.gameController.addCreatureToField(this.highestCreatureAnalysis(analysis.hand));
            analysis = this.algorithmicAnalyze();
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
    algorithmicAnalyze(): { field: number[][], hand: number[] } {
        //Go through field
        let field: number[][] = [];
        this.player.field.forEach((card) => {
            field.push(this.fieldCardAnalyze(card[0]))
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
        if (this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.length != 0 && this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.some((opponentCard) => { return (opponentCard[0] as Creature).facedUp; })) {
            let opponentCanBeDefeated = false;
            let creatureCantBeDefeated = false;
            let fieldCreatureInDanger = false;
            let notSameType = false;

            //populate booleans based on each situation
            if ((card as Creature).creatureType == "Cat") {
                opponentCanBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.some((opponentCard) => {
                    return (opponentCard[0] as Creature).creatureType == "Chicken" && (opponentCard[0] as Creature).facedUp;
                })
                creatureCantBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.filter((opponentCard) => { return (opponentCard[0] as Creature).facedUp }).every((opponentCard) => {
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
                creatureCantBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.filter((opponentCard) => { return (opponentCard[0] as Creature).facedUp }).every((opponentCard) => {
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
                creatureCantBeDefeated = this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.filter((opponentCard) => { return (opponentCard[0] as Creature).facedUp }).every((opponentCard) => {
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
            console.log("opponentCanBeDefeated: " + opponentCanBeDefeated + " creatureCantBeDefeated: " + creatureCantBeDefeated + " fieldCreatureInDanger: " + fieldCreatureInDanger + " notSameType: " + notSameType)
            if (opponentCanBeDefeated && creatureCantBeDefeated && fieldCreatureInDanger && notSameType) knownOpponentAndCurrentFieldFactor = 1;
            else if (opponentCanBeDefeated && creatureCantBeDefeated && notSameType) knownOpponentAndCurrentFieldFactor = 0.8
            else if (opponentCanBeDefeated && notSameType && fieldCreatureInDanger) knownOpponentAndCurrentFieldFactor = 0.5
            else if (opponentCanBeDefeated && fieldCreatureInDanger && creatureCantBeDefeated) knownOpponentAndCurrentFieldFactor = 0.3
            else if (opponentCanBeDefeated && fieldCreatureInDanger) knownOpponentAndCurrentFieldFactor = 0.15
        }

        //Probability of specific creature types vs. creatures already on the field
        let futureCreaturePlacementFactor = 1;
        let typeCounts = this.creatureTypesFound();
        let knownCatCount = typeCounts[0];
        let knownDogCount = typeCounts[1];
        let knownChickenCount = typeCounts[2];
        if (knownCatCount + knownDogCount + knownChickenCount < 18) {
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
            console.log("knownCatCount: " + knownCatCount + " knownDogCount: " + knownDogCount + " knownChickenCount: " + knownChickenCount)
            console.log("fieldCreatureInDanger: " + fieldCreatureInDanger + " notSameType: " + notSameType)
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
        else if (!this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.some((fieldCard) => {
            return card.name == fieldCard[0].name && (fieldCard[0] as Creature).facedUp;
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

    /*This helper function determines how many known creature types are in the game*/
    creatureTypesFound(): number[] {
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
                else if ((handCard as Creature).creatureType == "Chicken") {
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
                else if ((discardCard as Creature).creatureType == "Chicken") {
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
            else if ((fieldCard[0] as Creature).creatureType == "Chicken") {
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
            else if ((fieldCard[0] as Creature).facedUp && (fieldCard[0] as Creature).creatureType == "Chicken") {
                if ((fieldCard[0] as Creature).matched) knownChickenCount = knownChickenCount + 2;
                else knownChickenCount = knownChickenCount + 1
            }
        })
        return [knownCatCount, knownDogCount, knownChickenCount]
    }

    /*This function analyzes all field creatures and determines which creature it should and if it should attack*/
    fieldCardAnalyze(card: Card): number[] {
        let typeCounts = this.creatureTypesFound()
        let typeTotal = typeCounts[0] + typeCounts[1] + typeCounts[2];
        let upgradeCounts = this.upgradeTypesFound()
        let upgradeTypeTotal = upgradeCounts[0] + upgradeCounts[1] + upgradeCounts[2] + upgradeCounts[3] + upgradeCounts[4];
        console.log(upgradeCounts)
        let defeatType = "Dog";
        let creatureFightValue: number[] = []
        if ((card as Creature).creatureType == "Cat") defeatType = "Chicken";
        else if ((card as Creature).creatureType == "Dog") defeatType = "Cat";
        //Analyze each opponent creature vs. current card
        this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.forEach(opponentCards => {
            let defeatCreature = 0
            let nonLethalUpgrade = 1
            //Check to see if it can be defeated
            if ((card as Creature).creatureType == "Dog" && (card as Creature).matched) defeatCreature = 1;
            if ((opponentCards[0] as Creature).facedUp && (opponentCards[0] as Creature).creatureType == defeatType) {
                defeatCreature = 1
            }
            else if (!(opponentCards[0] as Creature).facedUp) {
                if (defeatType == "Chicken") {
                    defeatCreature = (6 - typeCounts[2]) / (18 - typeTotal)
                }
                else if (defeatType == "Cat") {
                    defeatCreature = (6 - typeCounts[0]) / (18 - typeTotal)
                }
                else {
                    defeatCreature = (6 - typeCounts[1]) / (18 - typeTotal)
                }
            }
            //Check for possibility of lethal upgrade
            let upgradeNum = opponentCards.filter(opponentCard => { return opponentCard.id > 200 && opponentCard.id < 300 }).length
            if (upgradeNum > 0) {
                if (opponentCards.some((opponentCard) => { return opponentCard.id == 209 && (opponentCard as Upgrade).facedUp })) {
                    nonLethalUpgrade = 0;
                }
                else if (upgradeCounts[4] == 0) {
                    if (upgradeNum == 1) {
                        nonLethalUpgrade = (8 - upgradeTypeTotal) / (9 - upgradeTypeTotal)
                    }
                    else {
                        nonLethalUpgrade = ((8 - upgradeTypeTotal) / (9 - upgradeTypeTotal)) * ((8 - upgradeTypeTotal - 1) / (9 - upgradeTypeTotal))
                    }
                }
            }
            let tempFightValue = defeatCreature * 0.75 + nonLethalUpgrade * 0.25
            if (creatureFightValue.length == 0 || creatureFightValue[0] < tempFightValue) {
                creatureFightValue = [tempFightValue, opponentCards[0].id]
            }
        });

        return creatureFightValue;
    }

    /*This helper function determines how many known upgrades types are in the game*/
    upgradeTypesFound(): number[] {
        let knownCounterAttack = 0;
        let knownDefense = 0;
        let knownFakeUpgrade = 0;
        let knownRevive = 0;
        let knownSelfDestruct = 0;
        this.player.hand.forEach((handCard) => {
            if (handCard.id > 200 && handCard.id < 300) {
                if ((handCard as Upgrade).upgradeType == "Counter Attack") {
                    knownCounterAttack = knownCounterAttack + 1;
                }
                else if ((handCard as Upgrade).upgradeType == "Defense") {
                    knownDefense = knownDefense + 1;
                }
                else if ((handCard as Upgrade).upgradeType == "Fake Upgrade") {
                    knownFakeUpgrade = knownFakeUpgrade + 1;
                }
                else if ((handCard as Upgrade).upgradeType == "Revive") {
                    knownRevive = knownRevive + 1;
                }
                else if ((handCard as Upgrade).upgradeType == "Self-Destruct") {
                    knownSelfDestruct = knownSelfDestruct + 1;
                }
            }
        })
        this.gameBoard.discard.forEach((discardCard) => {
            if (discardCard.id > 200 && discardCard.id < 300) {
                if ((discardCard as Upgrade).upgradeType == "Counter Attack") {
                    knownCounterAttack = knownCounterAttack + 1;
                }
                else if ((discardCard as Upgrade).upgradeType == "Defense") {
                    knownDefense = knownDefense + 1;
                }
                else if ((discardCard as Upgrade).upgradeType == "Fake Upgrade") {
                    knownFakeUpgrade = knownFakeUpgrade + 1;
                }
                else if ((discardCard as Upgrade).upgradeType == "Revive") {
                    knownRevive = knownRevive + 1;
                }
                else if ((discardCard as Upgrade).upgradeType == "Self-Destruct") {
                    knownSelfDestruct = knownSelfDestruct + 1;
                }
            }
        })
        this.player.field.forEach((fieldCards) => {
            fieldCards.forEach((fieldCard => {
                if ((fieldCard as Upgrade).upgradeType == "Counter Attack") {
                    knownCounterAttack = knownCounterAttack + 1;
                }
                else if ((fieldCard as Upgrade).upgradeType == "Defense") {
                    knownDefense = knownDefense + 1;
                }
                else if ((fieldCard as Upgrade).upgradeType == "Fake Upgrade") {
                    knownFakeUpgrade = knownFakeUpgrade + 1;
                }
                else if ((fieldCard as Upgrade).upgradeType == "Revive") {
                    knownRevive = knownRevive + 1;
                }
                else if ((fieldCard as Upgrade).upgradeType == "Self-Destruct") {
                    knownSelfDestruct = knownSelfDestruct + 1;
                }
            }))
        })
        this.gameBoard.players[(this.gameBoard.currentPlayer + 1) % 2].field.forEach((fieldCards) => {
            fieldCards.forEach((fieldCard => {
                if ((fieldCard as Upgrade).facedUp && (fieldCard as Upgrade).upgradeType == "Counter Attack") {
                    knownCounterAttack = knownCounterAttack + 1;
                }
                else if ((fieldCard as Upgrade).facedUp && (fieldCard as Upgrade).upgradeType == "Defense") {
                    knownDefense = knownDefense + 1;
                }
                else if ((fieldCard as Upgrade).facedUp && (fieldCard as Upgrade).upgradeType == "Fake Upgrade") {
                    knownFakeUpgrade = knownFakeUpgrade + 1;
                }
                else if ((fieldCard as Upgrade).facedUp && (fieldCard as Upgrade).upgradeType == "Revive") {
                    knownRevive = knownRevive + 1;
                }
                else if ((fieldCard as Upgrade).facedUp && (fieldCard as Upgrade).upgradeType == "Self-Destruct") {
                    knownSelfDestruct = knownSelfDestruct + 1;
                }
            }))
        })
        return [knownCounterAttack, knownDefense, knownFakeUpgrade, knownRevive, knownSelfDestruct]
    }

    /*This function returns the creature id of the hand creature with the highest analysis value*/
    highestCreatureAnalysis(handAnalysis: number[]): number {
        let newHandAnalysis: number[] = [];
        for (let i = 0; i < handAnalysis.length; i++) {
            if (this.player.hand[i].id < 200) {
                newHandAnalysis.push(handAnalysis[i]);
            }
        }
        let newHand = this.player.hand.filter((handCard) => {
            return handCard.id < 200;
        });
        let maxNewHandAnalysis = Math.max(...newHandAnalysis)
        console.log(newHand[newHandAnalysis.findIndex((element) => element == maxNewHandAnalysis)].id);
        return newHand[newHandAnalysis.findIndex((element) => element == maxNewHandAnalysis)].id;
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