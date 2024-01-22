import {GameController} from "../controller/gameController"
import { PlayerController } from "../controller/playerController";
import {useState, useEffect} from "react"
import { AIPlayerController } from "../controller/AIPlayerController";
import {Card} from "../models/card"
import {Creature} from "../models/creature"
import {Upgrade} from "../models/upgrade"
import { TutorialController } from "../controller/tutorialController";
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

//Import all images
import creature from "../../assets/cards/creature.jpg"
import upgrade from "../../assets/cards/upgrade.jpg"
import action from "../../assets/cards/action.jpg"
import bella from "../../assets/cards/bella.jpg"
import pounce from "../../assets/cards/pounce.jpg"
import snowball from "../../assets/cards/snowball.jpg"
import fancyBella from "../../assets/cards/fancy_bella.jpg"
import prettyBella from "../../assets/cards/pretty_bella.jpg"
import puppyBella from "../../assets/cards/puppy_bella.jpg"
import lulu from "../../assets/cards/lulu.jpg"
import olive from "../../assets/cards/olive.jpg"
import theFamily from "../../assets/cards/the_family.jpg"
import cactusAttack from "../../assets/cards/cactus_attack.jpg"
import duckArmy from "../../assets/cards/duck_army.jpg"
import deflect from "../../assets/cards/deflect.jpg"
import sandShield from "../../assets/cards/sand_shield.jpg"
import payphonesDontExistAnymore from "../../assets/cards/payphones_dont_exist_anymore.jpg"
import fadingAway from "../../assets/cards/fading_away.jpg"
import sleeping from "../../assets/cards/sleeping.jpg"
import coolDownSquirrel from "../../assets/cards/cool_down_squirrel.jpg"
import snowApocalypse from "../../assets/cards/snow_apocalypse.jpg"
import beachSpirits from "../../assets/cards/beach_spirits.jpg"
import forestSpirits from "../../assets/cards/forest_spirits.jpg"
import riverSpirits from "../../assets/cards/river_spirits.jpg"
import birdArmy1 from "../../assets/cards/bird_army_1.jpg"
import birdArmy2 from "../../assets/cards/bird_army_2.jpg"
import messyDorm1 from "../../assets/cards/messy_dorm_1.jpg"
import messyDorm2 from "../../assets/cards/messy_dorm_2.jpg"
import powerOfTea1 from "../../assets/cards/power_of_tea_1.jpg"
import powerOfTea2 from "../../assets/cards/power_of_tea_2.jpg"
import bellaTalking from "../../assets/fancy_bella_talking.jpg"
import { GameBoard } from "../models/gameboard";

const tutorialController: TutorialController = new TutorialController(); 
tutorialController.preTutorialPreparation();


export function TutorialView() {
    const [move, setMove] = useState(0)
    const [showDiscard, setShowDiscard] = useState(false)
    const [showCard, setShowCard] = useState(false)

    //gets image associated with id of card
    function getImageFromId(cardId: number){
        switch (cardId){
            case 101.1:
            case 101.2:
                return bella;
            case 102.1:
            case 102.2:
                return pounce;
            case 103.1:
            case 103.2:
                return snowball;
            case 104.1:
            case 104.2:
                return fancyBella;
            case 105.1:
            case 105.2:
                return prettyBella;
            case 106.1:
            case 106.2:
                return puppyBella;
            case 107.1:
            case 107.2:
                return lulu;
            case 108.1:
            case 108.2:
                return olive;
            case 109.1:
            case 109.2:
                return theFamily;
            case 201:
                return cactusAttack;
            case 202:
                return duckArmy;
            case 203:
                return deflect;
            case 204:
                return sandShield;
            case 205:
                return payphonesDontExistAnymore;
            case 206:
                return fadingAway;
            case 207:
                return sleeping;
            case 208:
                return coolDownSquirrel;
            case 209:
                return snowApocalypse;
            case 301:
                return beachSpirits;
            case 302:
                return forestSpirits;
            case 303:
                return riverSpirits;
            case 304:
                return birdArmy1;
            case 305:
                return birdArmy2;
            case 306:
                return messyDorm1;
            case 307:
                return messyDorm2;
            case 308:
                return powerOfTea1;
            case 309:
                return powerOfTea2;
            default:
                return creature;
        }
    }

    //gets type associated with id of card
    function getTypeFromId(cardId: number){
        if (cardId < 200){
            return creature;
        }
        else if (cardId < 300) {
            return upgrade;
        }
        else {
            return action
        } 
    }

    //gets image for opponent hand
    function setOpponentHandImage(card: Card){
        if (tutorialController.step == 51){
            return getImageFromId(card.id)
        }
        else {
            return getTypeFromId(card.id)
        }
    }

    //gets image for player hand
    function setMyHandImage(card: Card){
        return getImageFromId(card.id)
    }

    //gets image for deck
    function setDeckImage(card: Card){
        return getTypeFromId(card.id)
    }

    //gets image for discard
    function setDiscardImage(card: Card){
        return getImageFromId(card.id)
    }

    //gets image for opponent field
    function setOpponentFieldImage(card: Card){
        if ((card instanceof Creature && (card as Creature).facedUp)||(card instanceof Upgrade && (card as Upgrade).facedUp))
        {
            return getImageFromId(card.id)
        }
        else {
            return getTypeFromId(card.id)
        }
    }

    //gets image for player field
    function setMyFieldImage(card: Card){
        if ((card instanceof Creature && (card as Creature).facedUp)||(card instanceof Upgrade && (card as Upgrade).facedUp) || showCard)
        {
            return getImageFromId(card.id)
        }
        else {
            return getTypeFromId(card.id)
        }
    }

    /*End turn styling function (controls opacity)*/
    function endTurnStyle(){
        return "1"
    }

    function generalCardStyle(cardId: number){
        return tutorialController.highlightCard(cardId);
    }

    /*discard card styling function*/
    function fullDiscardCardStyle(cardId: number){
        return tutorialController.highlightCard(cardId);
    }

    /*top discard card styling function*/
    function topDiscardCardStyle(){
        if (tutorialController.step == 59) {
            return "red"
        }
        else {
            return "black"
        }
    }

    function gamePartBorder(gamePart: String){
        if (gamePart == "myHandView" && tutorialController.step == 0){
            return 8;
        }
        else if (gamePart == "myFieldView" && tutorialController.step == 1){
            return 8;
        }
        else if (gamePart == "opponentHandView" && tutorialController.step == 2){
            return 8;
        }
        else if (gamePart == "opponentFieldView" && tutorialController.step == 3){
            return 8;
        }
        else if (gamePart == "deckView" && tutorialController.step == 4){
            return 8;
        }
        else if (gamePart == "discardView" && tutorialController.step == 5){
            return 8;
        }
        return 0;
    }

    /*onclickHandler for ending a turn*/
    function onclickEndTurn(){
        tutorialController.doActionWithEndTurnButton();
        setMove(move + 1)
    }

    /*onclickHandler for drawing a card*/
    function onclickDrawCard(cardId: number){
        tutorialController.doActionWithCard(cardId);
        setMove(move + 1)
    }

    /*onclickHandler for interacting with a card in hand*/
    function onclickHandCard(cardId: number){
        tutorialController.doActionWithCard(cardId);
        setMove(move + 1)
    }

    /*onclickHandler for attacking*/
    function onclickFieldHandle(cardId: number){
        tutorialController.doActionWithCard(cardId);
        setMove(move + 1)
    }

    /*onclickHandler for finishing an attacking turn*/
    function onclickHandleOpponentField(opponentCardId: number){
        tutorialController.doActionWithCard(opponentCardId);
        setMove(move + 1)
    }

    /*onclickHandler for opponent hand*/
    function onclickOpponentHandHandle(cardId: number){
        tutorialController.doActionWithCard(cardId);
        setMove(move + 1)
    }

    /*onclickHandler for discard pile*/
    function onclickDiscardHandle(cardId: number){
        tutorialController.doActionWithCard(cardId);
        setMove(move + 1)
    }

    /*onclickHandler for top discard pile*/
    function onclickTopDiscardHandle(){
        if (showDiscard){
            setShowDiscard(false);
        }
        else {
            setShowDiscard(true);
        }
    }

    function bottomButtonText(){
        if (tutorialController.step < 6){
            return "Okay";
        }
        else {
            return "End Turn!";
        }
        /*if (gameController.gameOver){
            return "New Game!"
        }
        else {
            return "End Turn!"
        }*/
    }

    const opponentHandView = (<div style={{border: `${gamePartBorder("opponentHandView")}px dotted`, backgroundColor: '#e74c3c',padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + tutorialController.gameBoard.players[1].hand.length+ ', 1fr)', gap: "10px", justifyItems:"center"}}>{tutorialController.gameBoard.players[1].hand.map(card => <img key={card.id} style={{border: '2px solid', borderColor: generalCardStyle(card.id), width: "100%", maxWidth: window.innerWidth/10}} onClick={() => onclickOpponentHandHandle(card.id)} src={setOpponentHandImage(card).src}/>)}</div>)

    const opponentFieldView = (
        <div style={{border: `${gamePartBorder("opponentFieldView")}px dotted`,backgroundColor: '#ff6d5a',padding:'10px', display:'grid', gridTemplateColumns: 'repeat(' +tutorialController.gameBoard.players[1].field.length+', 1fr)', gap: "10px", justifyItems:"center"}}>
            {tutorialController.gameBoard.players[1].field.map(cards=> 
                <div key={cards[0].id} style={{padding:'10px', display:'grid', gridTemplateColumns: '1fr'}}>
                    {cards.map(card=>
                        <img key={card.id} style={{border: '2px solid', borderColor: generalCardStyle(card.id), width: "100%", maxWidth: window.innerWidth/10}} onClick={() => onclickHandleOpponentField(card.id)} src={setOpponentFieldImage(card).src}/>).reverse()}
                </div>
            )}
        </div>
    )
    let deckView;
    if (tutorialController.gameBoard.deck.length>0) {deckView = (<div style={{border: `${gamePartBorder("deckView")}px dotted`,padding: '10px', backgroundColor: '#f39c12', display:'grid', justifyItems:"center", alignItems: "center"}}><img style={{border: '2px solid', borderColor: generalCardStyle(tutorialController.gameBoard.deck[tutorialController.gameBoard.deck.length-1].id), width: "100%", maxWidth: window.innerWidth/10}} onClick={() => onclickDrawCard(tutorialController.gameBoard.deck[tutorialController.gameBoard.deck.length-1].id)} src={setDeckImage(tutorialController.gameBoard.deck[tutorialController.gameBoard.deck.length-1]).src}/></div>)}
    else {deckView = (<div style={{padding: '10px', backgroundColor: '#f39c12'}}></div>)}
    const myFieldView = (
        <div style={{border: `${gamePartBorder("myFieldView")}px dotted`,backgroundColor: '#5abaff',padding:'10px', display:'grid', gridTemplateColumns: 'repeat(' + tutorialController.gameBoard.players[0].field.length+', 1fr)', gap: "10px", justifyItems:"center"}}>
            {tutorialController.gameBoard.players[0].field.map(cards=>
                <div key={cards[0].id} style={{padding:'10px', display:'grid', gridTemplateColumns: '1fr'}}>
                    {cards.map(card=>
                        <img key={card.id} style={{border: '2px solid', borderColor: generalCardStyle(card.id), width: "100%", maxWidth: window.innerWidth/10}} onClick={() => onclickFieldHandle(card.id)} src={setMyFieldImage(card).src} onMouseEnter={() => setShowCard(true)} onMouseLeave={() => setShowCard(false)} />)}
                </div>
            )}
        </div>
    )
    let discardView
    if (tutorialController.gameBoard.discard.length > 0) {discardView = (<div style={{padding: '10px', backgroundColor: '#2ecc71', display:'grid', justifyItems:"center", alignItems: "center"}}><img style={{border: '2px solid', borderColor: topDiscardCardStyle(), width: "100%", maxWidth: window.innerWidth/10}} onClick={() => onclickTopDiscardHandle()} src={setDiscardImage(tutorialController.gameBoard.discard[tutorialController.gameBoard.discard.length-1]).src}/></div>)}
    else {{discardView = (<div style={{border: `${gamePartBorder("discardView")}px dotted`,padding: '10px', backgroundColor: '#2ecc71'}}></div>)}}
    const fieldView = (<div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr'}}>
        {opponentFieldView}
        {deckView}
        {myFieldView}
        {discardView}
  </div>)

    const myHandView = (<div style={{border: `${gamePartBorder("myHandView")}px dotted`,backgroundColor: '#3498db', padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + tutorialController.gameBoard.players[0].hand.length+ ', 1fr)', gap: "10px", justifyItems:"center"}}>{tutorialController.gameBoard.players[0].hand.map(card => <img key={card.id} src={setMyHandImage(card).src} style={{border: '2px solid', borderColor: generalCardStyle(card.id), width: "100%", maxWidth: window.innerWidth/10}} onClick={() => onclickHandCard(card.id)}/>)}</div>)

    let bottomButtonView;
    if (tutorialController.step < 69){
        bottomButtonView = (<div style={{backgroundColor: "#8e44ad", display: "grid", justifyContent: "center", gridTemplateColumns: "1fr", gap: "20%", padding: "10px 325px 10px"}}><button style={{backgroundColor: "gray", textAlign: "center", padding: "10px", border: "solid 2px", opacity: endTurnStyle()}} onClick={() => onclickEndTurn()}>{bottomButtonText()}</button></div>) 
    }
    else {
        bottomButtonView = (<div style={{backgroundColor: "#8e44ad", display: "grid", justifyContent: "center", gridTemplateColumns: "1fr", gap: "20%", padding: "10px 325px 10px"}}><button style={{backgroundColor: "gray", textAlign: "center", padding: "10px", border: "solid 2px", opacity: endTurnStyle()}}><Link to="/">Return to home</Link></button></div>)
    } 

    let fullDiscardView;
    if (showDiscard && tutorialController.gameBoard.discard.length > 0){
        fullDiscardView = (<div style={{backgroundColor: '#44db5e', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: "10px"}}>{tutorialController.gameBoard.discard.map(card => <img key={card.id} style={{border: '2px solid', borderColor: fullDiscardCardStyle(card.id)}} onClick={() => onclickDiscardHandle(card.id)} src={setDiscardImage(card).src}/>).reverse()}</div>)
    }
    
    const bellaView = (<div style={{backgroundImage: `url(https://github.com/cjanse/dogscatsandchickens/blob/tutorial/dogscatsandchickens-app/assets/fancy_bella_talking.jpg?raw=true)`, backgroundSize: `contain`, backgroundRepeat: "no-repeat", backgroundPosition: "center",margin: 0, overflow:'hidden'}}>
        <p style={{paddingLeft: "25%", paddingTop: "1%", paddingRight: "1.5%", width:window.innerWidth/1.15, height:window.innerWidth/2.5/2}}>{tutorialController.bellaQuotes[tutorialController.step]}</p>
    </div>)
    /*let bellaView = (<div style={{display: "grid", justifyContent: "center", alignItems: "center"}}>
    <button style={{backgroundColor: "gray", textAlign: "center", padding: "10px", border: "solid 2px"}}><Link to="/">Go Back!</Link></button>
    </div>)*/
    return (
        <div>
            {bellaView}
            {opponentHandView}
            {fieldView}
            {fullDiscardView}
            {myHandView}
            {bottomButtonView}
        </div>
    )
}