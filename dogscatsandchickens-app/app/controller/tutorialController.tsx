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
    "Great! Now, that you are familiar with the board. Let's start playing. For the first move, you have to put down one creature. Let's put down our chicken Lulu. Click on the card in your hand to place it on the field.",
    "Now, click \"End Turn\" to end your turn.",
    "The opponent also put down a creature card, but we don't know which card it is. Now, it's time to start a real turn. Go ahead and draw a card! Click on the deck to draw a card.",
    "There are two types of turns. A reinforce turn and an attack turn. During this turn, we will do a reinforce turn. You can put down up to two cards during a reinforce turn after drawing. For your first move, let's place down Bella.",
    "Great job! Let's use an upgrade. Upgrades are activated when a creature is defeated when attacked by an opposing creature. Let's put down the defense upgrade. First, click on the Sand Shield defense upgrade in your hand.",
    "Click on the cat on your field to attach the upgrade to the cat.",
    "End you turn.",
    "Caramba! It looks like your opponent used its dog card to attack your cat. Fortunately, your cat had the defense upgrade, so it did not experience any damage. In this game, dogs defeat cats, cats defeat chickens, and chickens defeat dogs. Notice that cards that attack or have been attacked are revealed. Let's draw a card!",
    "Wow, you drew another Lulu. When you have two identical creature cards, you can place together on your field to form on creature with a special ability called \"Matching Ability\". Each creature type has a different matching ability. Click on the Lulu in your hand to place it on the field.",
    "If you click on the Lulu in your hand, you will place it on the field without matching it. If you click on the Lulu on your field, you will match it, making it one creature. Click on the Lulu on your field!",
    "The matching ability of your chicken won't be activated until you make it face up. Click on one of your Lulu cards on your field to make it face up.",
    "Great Job! The chicken's matching ability forces all cards on your opponent's field to be revealed. It's a pretty powerful ability. Let's protect your chicken with a revive. If your chicken is defeated, then the revive upgrade will place your chicken back into your hand instead of the discard pile. Click on the revive!",
    "Click on one of your chickens on the field.",
    "Your chicken is now protected. End your turn.",
    "Your opponent made a matched dog and added a fake upgrade to it. Its ability is that it can defeat any creature type. You need to make sure that you get rid of that creature as soon as possible. Let's go ahead and draw another card.",
    "Let's get rid of that dog! Click on one of your chickens to begin the attack on the dog.",
    "Now, click on one of the opponent's dog cards.",
    "Woohoo! Your opponent has no creatures on their field. They must put a creature on their field by the end of their upcoming turn, or they will lose. End your turn.",
    "Your opponent put another dog on the field with an upgrade. Let's draw a card.",
    "Let's attack the opponent's dog with your chicken again!",
    "Get that dog!",
    "Oops, that creature had a self-destruct upgrade, so when you defeated it, your attacking creature and all of its upgrades are also discarded. Sorry about that. Let's end your turn.",
    "Your opponent put two creatures down. We don't know what types anymore because we don't have our double chicken creature. Draw a card.",
    "Use your cat to attack.",
    "Attack the card on the right... Trust me.",
    "Alright! We got rid of your opponent's chicken. Let's end our turn here."]

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
        this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(9, 1)[0]);

        //Organize Deck accordingly
        [this.gameBoard.deck[16], this.gameBoard.deck[25]] = [this.gameBoard.deck[25], this.gameBoard.deck[16]];
        [this.gameBoard.deck[17], this.gameBoard.deck[24]] = [this.gameBoard.deck[24], this.gameBoard.deck[17]];
        [this.gameBoard.deck[7], this.gameBoard.deck[23]] = [this.gameBoard.deck[23], this.gameBoard.deck[7]];
        [this.gameBoard.deck[11], this.gameBoard.deck[22]] = [this.gameBoard.deck[22], this.gameBoard.deck[11]];
        [this.gameBoard.deck[7], this.gameBoard.deck[21]] = [this.gameBoard.deck[21], this.gameBoard.deck[7]];
        [this.gameBoard.deck[4], this.gameBoard.deck[20]] = [this.gameBoard.deck[20], this.gameBoard.deck[4]];
        [this.gameBoard.deck[8], this.gameBoard.deck[19]] = [this.gameBoard.deck[19], this.gameBoard.deck[8]];
        [this.gameBoard.deck[5], this.gameBoard.deck[18]] = [this.gameBoard.deck[18], this.gameBoard.deck[5]];
        [this.gameBoard.deck[14], this.gameBoard.deck[17]] = [this.gameBoard.deck[17], this.gameBoard.deck[14]];
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
            case 7:
                this.gameBoard.players[1].field.push([this.gameBoard.players[1].hand.filter(function (value, index, array) {return (value.id == 105.1)})[0]])
                this.gameBoard.players[1].hand.splice(0,1)[0]
                this.step += 1;
                break;
            case 12:
                this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                this.gameBoard.discard.push(this.gameBoard.players[0].field[1][this.gameBoard.players[0].field[1].length-1])
                this.gameBoard.players[0].field[1].splice(this.gameBoard.players[0].field[1].length-1, 1);
                (this.gameBoard.players[1].field[0][0] as Creature).facedUp = true;
                (this.gameBoard.players[0].field[1][0] as Creature).facedUp = true; 
                this.step += 1;
                break;
            case 19:
                this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                this.gameBoard.players[1].field[0].push(this.gameBoard.players[1].hand.filter(function (value, index, array) {return (value.id == 105.2)})[0])
                this.gameBoard.players[1].hand.splice(0,1)[0]
                this.gameBoard.players[1].field[0].push(this.gameBoard.players[1].hand.filter(function (value, index, array) {return (value.id == 206)})[0])
                this.gameBoard.players[1].hand.splice(1,1)[0];
                (this.gameBoard.players[1].field[0][1] as Creature).facedUp = true;
                (this.gameBoard.players[1].field[0][2] as Creature).facedUp = true;
                this.step += 1;
                break;
            case 23:
                this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                this.gameBoard.players[1].field.push([this.gameBoard.players[1].hand.filter(function (value, index, array) {return (value.id == 104.2)})[0]])
                this.gameBoard.players[1].hand.splice(4,1)[0]
                this.gameBoard.players[1].field[0].push(this.gameBoard.players[1].hand.filter(function (value, index, array) {return (value.id == 209)})[0])
                this.gameBoard.players[1].hand.splice(2,1)[0];
                (this.gameBoard.players[1].field[0][0] as Creature).facedUp = true;
                (this.gameBoard.players[1].field[0][1] as Creature).facedUp = true;
                this.step += 1;
                break;
            case 27:
                this.gameBoard.players[1].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                this.gameBoard.players[1].field.push([this.gameBoard.players[1].hand.filter(function (value, index, array) {return (value.id == 102.1)})[0]])
                this.gameBoard.players[1].hand.splice(0,1)[0]
                this.gameBoard.players[1].field.push([this.gameBoard.players[1].hand.filter(function (value, index, array) {return (value.id == 108.2)})[0]])
                this.gameBoard.players[1].hand.splice(0,1)[0]
                this.step += 1;
                break;
            case 31:
                //HERE!!!!!
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
            case 8:
                if (cardId == 208) {
                    this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                    this.step += 1;
                }
                break;
            case 9:
                if (cardId == 101.1){
                    this.gameBoard.players[0].field.push([this.gameBoard.players[0].hand.filter(function (value, index, array) {return (value.id == cardId)})[0]])
                    this.gameBoard.players[0].hand.splice(1,1)[0]
                    this.step += 1;
                }
                break;
            case 10:
                if (cardId == 204){
                    this.step += 1;
                }
                break;
            case 11:
                if (cardId == 101.1){
                    this.gameBoard.players[0].field[1].push(this.gameBoard.players[0].hand.splice(this.gameBoard.players[0].hand.indexOf(this.gameBoard.players[0].hand.filter(function (value, index, array) {return (value.id == 204)})[0]),1)[0])
                    this.step += 1;
                }
                break;
            case 13:
                if (cardId == 107.2){
                    this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                    this.step += 1;
                }
                break;
            case 14:
                if (cardId == 107.2){
                    this.step += 1;
                }
                break;
            case 15:
                if (cardId == 107.1){
                    this.gameBoard.players[0].field[0].push(this.gameBoard.players[0].hand.splice(this.gameBoard.players[0].hand.indexOf(this.gameBoard.players[0].hand.filter(function (value, index, array) {return (value.id == 107.2)})[0]),1)[0])
                    this.step += 1;
                }
                break;
            case 16:
                if (cardId == 107.1 || cardId == 107.2){ 
                    (this.gameBoard.players[0].field[0][0] as Creature).facedUp = true;
                    (this.gameBoard.players[0].field[0][1] as Creature).facedUp = true;
                    this.step += 1;
                }
                break;
            case 17:
                if (cardId == 208){
                    this.step += 1;
                }
                break;
            case 18:
                if (cardId == 107.1 || cardId == 107.2){
                    this.gameBoard.players[0].field[0].push(this.gameBoard.players[0].hand.splice(this.gameBoard.players[0].hand.indexOf(this.gameBoard.players[0].hand.filter(function (value, index, array) {return (value.id == 208)})[0]),1)[0])
                    this.step += 1;
                }
                break;
            case 20:
                if (cardId == 307) {
                    this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                    this.step += 1;
                }
                break;
            case 21:
                if (cardId == 107.1 || cardId == 107.2){
                    this.step += 1;
                }
                break;
            case 22:
                if (cardId == 105.1 || cardId == 105.2){
                    (this.gameBoard.players[1].field[0][0] as Creature).facedUp = false;
                    (this.gameBoard.players[1].field[0][1] as Creature).facedUp = false;
                    (this.gameBoard.players[1].field[0][2] as Upgrade).facedUp = false;
                    this.gameBoard.discard.push(...this.gameBoard.players[1].field[0]);
                    this.gameBoard.players[1].field.splice(0,1);
                    this.step += 1;
                }
                break;
            case 24:
                if (cardId == 108.1){
                    this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                    this.step += 1;
                }
                break;
            case 25:
                if (cardId == 107.1 || cardId == 107.2){
                    this.step += 1;
                }
                break;
            case 26:
                if (cardId == 104.2) {
                    (this.gameBoard.players[1].field[0][0] as Creature).facedUp = false;
                    (this.gameBoard.players[1].field[0][1] as Upgrade).facedUp = false;
                    (this.gameBoard.players[0].field[0][0] as Creature).facedUp = false;
                    (this.gameBoard.players[0].field[0][1] as Creature).facedUp = false;
                    (this.gameBoard.players[0].field[0][2] as Upgrade).facedUp = false;
                    this.gameBoard.discard.push(...this.gameBoard.players[1].field[0]);
                    this.gameBoard.players[1].field.splice(0,1);
                    this.gameBoard.discard.push(...this.gameBoard.players[0].field[0]);
                    this.gameBoard.players[0].field.splice(0,1);
                    this.step += 1;
                }
                break;
            case 28:
                if (cardId == 205){
                    this.gameBoard.players[0].hand.push(this.gameBoard.deck.splice(this.gameBoard.deck.length-1, 1)[0])
                    this.step += 1;
                }
                break;
            case 29:
                if (cardId == 101.1){
                    this.step += 1;
                }
                break;
            case 30:
                if (cardId == 108.2){
                    this.gameBoard.discard.push(...this.gameBoard.players[1].field[1]);
                    this.gameBoard.players[1].field.splice(1,1);
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
            case 8:
                if (cardId == 208){
                    return "red";
                }
                else {
                    return "black";
                }
            case 9:
                if (cardId == 104.1 || cardId == 101.1 || cardId == 204 || cardId == 304 || cardId == 208 || cardId == 107.1) {
                    return "red";
                }
                else {
                    return "black";
                }
            case 10:
                if (cardId == 104.1 || cardId == 204 || cardId == 304 || cardId == 208) {
                    return "red";
                }
                else {
                    return "black";
                }
            case 11:
                if (cardId == 107.1 || cardId == 101.1) {
                    return "red";
                }
                else if (cardId == 204){
                    return "green";
                }
            case 13:
                if (cardId == 107.2){
                    return "red";
                }
                else {
                    return "black";
                }
            case 14:
                if (cardId == 104.1 || cardId == 304 || cardId == 208 || cardId == 107.2 || cardId == 107.1 || cardId == 101.1){
                    return "red";
                }
                else {
                    return "black";
                }
            case 15:
                if (cardId == 107.1 || cardId == 107.2){
                    return "red";
                }
                else {
                    return "black";
                }
            case 16:
                if (cardId == 107.1 || cardId == 107.2){
                    return "yellow";
                }
                else if (cardId == 104.1 || cardId == 304 || cardId == 208){
                    return "red";
                }
                else {
                    return "black"
                }
            case 17:
                if (cardId == 104.1 || cardId == 304 || cardId == 208){
                    return "red";
                }
                else {
                    return "black"
                }
            case 18:
                if (cardId == 107.1 || cardId == 107.2 || cardId == 101.1){
                    return "red"
                }
                else if (cardId == 208){
                    return "green";
                }
                else {
                    return "black";
                }
            case 20:
                if (cardId == 307){
                    return "red";
                }
                else {
                    return "black";
                }
            case 21:
                if (cardId == 107.1 || cardId == 107.2 || cardId == 101.1 || cardId == 104.1 || cardId == 304 || cardId == 307) {
                    return "red";
                }
                else {
                    return "black";
                }
            case 22:
                if (cardId == 107.1 || cardId == 107.2){
                    return "green"
                }
                else if (cardId == 105.1 || cardId == 105.2){
                    return "red"
                }
                else {
                    return "black"
                }
            case 24:
                if (cardId == 108.1){
                    return "red";
                }
                else {
                    return "black";
                }
            case 25:
                if (cardId == 107.1 || cardId == 107.2 || cardId == 101.1 || cardId == 104.1 || cardId == 304 || cardId == 307 || cardId == 108.1){
                    return "red";
                }
                else {
                    return "black";
                }
            case 26:
                if (cardId == 107.1 || cardId == 107.2){
                    return "green";
                }
                else if (cardId == 104.2) {
                    return "red";
                }
                else {
                    return "black";
                }
            case 28:
                if (cardId == 205){
                    return "red";
                }
                else return "black";
            case 29:
                if (cardId == 101.1 || cardId == 104.1 || cardId == 304 || cardId == 307 || cardId == 108.1 || cardId == 205){
                    return "red";
                }
                else {
                    return "black";
                }
            case 30:
                if (cardId == 101.1) {
                    return "green"
                }
                else if (cardId == 102.1 || cardId == 108.2){
                    return "red"
                }
                else {
                    return "black"
                }
            default:
                return "black";
        }
    }
}