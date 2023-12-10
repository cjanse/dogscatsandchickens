import {GameController} from "../controller/gameController"
import { PlayerController } from "../controller/playerController";
import {useState, useEffect} from "react"
import { AIPlayerController } from "../controller/AIPlayerController";
import {Card} from "../models/card"
import {Creature} from "../models/creature"
import {Upgrade} from "../models/upgrade"

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

//Possible color choices
/*
Player 1:

Main Color: #3498db (a shade of blue)
Lighter Shade: #5abaff
Player 2:

Main Color: #e74c3c (a shade of red)
Lighter Shade: #ff6d5a
Neutral Colors:

#95a5a6 (a shade of gray)
#2ecc71 (a shade of green)
#f39c12 (a shade of orange)
#8e44ad (a shade of purple)
*/


const gameController: GameController = new GameController();
gameController.preGamePreparation();

const playerController: PlayerController = new PlayerController(gameController)
const aiPlayerController: AIPlayerController = new AIPlayerController(gameController)

export function GameView() {
    const [move, setmove] = useState(0)

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
                return creature
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
        return getTypeFromId(card.id)
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
        return getImageFromId(card.id);
    }

    const opponentHandView = (<div style={{backgroundColor: '#e74c3c',padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + gameController.gameBoard.players[1].hand.length+ ', 1fr)', gap: "10px"}}>{gameController.gameBoard.players[1].hand.map(card => <img style={{border: '2px solid', borderColor: "black", height: "100%"}} /*onClick={() => onclickOpponentHandHandle(card.id)}*/ src={setOpponentHandImage(card).src}/>)}</div>)

    const opponentFieldView = (
        <div style={{backgroundColor: '#ff6d5a',padding:'10px', display:'grid', gridTemplateColumns: 'repeat(' +1/*gameController.gameBoard.players[1].field.length*/+', 1fr)', gap: "10px"}}>
            {gameController.gameBoard.players[1].field.map(cards=>
                <div style={{padding:'10px', display:'grid', gridTemplateColumns: '1fr'}}>
                    {cards.map(card=>
                        <img style={{border: '2px solid', borderColor: "black", maxWidth: "30%"}} /*onClick={() => onclickDrawCard(card.id)}>{card.toString()}*/ src={setOpponentFieldImage(card).src}/>).reverse()}
                </div>
            )}
        </div>
    )
    let deckView;
    if (gameController.gameBoard.deck.length>0) {deckView = (<div style={{padding: '10px', backgroundColor: '#f39c12'}}><img style={{border: '2px solid', borderColor: "black"}} /*onClick={() => onclickDrawCard(card.id)}>{card.toString()}*/ src={setDeckImage(gameController.gameBoard.deck[gameController.gameBoard.deck.length-1]).src}/></div>)}
    else {deckView = (<div style={{padding: '10px', backgroundColor: '#f39c12'}}></div>)}
    const myFieldView = (
        <div style={{backgroundColor: '#5abaff',padding:'10px', display:'grid', gridTemplateColumns: 'repeat(' +'1'/*gameController.gameBoard.players[1].field.length*/+', 1fr)', gap: "10px"}}>
            {gameController.gameBoard.players[0].field.map(cards=>
                <div style={{padding:'10px', display:'grid', gridTemplateColumns: '1fr'}}>
                    {cards.map(card=>
                        <img style={{border: '2px solid', borderColor: "black", maxWidth: "30%"}} /*onClick={() => onclickDrawCard(card.id)}>{card.toString()}*/ src={setMyFieldImage(card).src}/>)}
                </div>
            )}
        </div>
    )
    let discardView
    if (gameController.gameBoard.discard.length > 0) {discardView = (<div style={{padding: '10px', backgroundColor: '#2ecc71'}}><img style={{border: '2px solid', borderColor: "black"}} /*onClick={() => onclickDrawCard(card.id)}>{card.toString()}*/ src={setDiscardImage(gameController.gameBoard.discard[gameController.gameBoard.discard.length-1]).src}/></div>)}
    else {{discardView = (<div style={{padding: '10px', backgroundColor: '#2ecc71'}}></div>)}}
    const fieldView = (<div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr'}}>
        {opponentFieldView}
        {deckView}
        {myFieldView}
        {discardView}
  </div>)

    const myHandView = (<div style={{backgroundColor: '#3498db', padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + gameController.gameBoard.players[0].hand.length+ ', 1fr)', gap: "10px"}}>{gameController.gameBoard.players[0].hand.map(card => <img src={setMyHandImage(card).src} style={{border: '2px solid', borderColor: "black", height: "100%"}} /*onClick={() => onclickHandCard(card.id)}*//>)}</div>)


    return (
        <div>
            {opponentHandView}
            {fieldView}
            {myHandView}
        </div>
    )
}