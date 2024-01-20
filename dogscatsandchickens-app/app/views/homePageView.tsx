import {GameController} from "../controller/gameController"
import { PlayerController } from "../controller/playerController";
import {useState, useEffect} from "react"
import { AIPlayerController } from "../controller/AIPlayerController";
import {Card} from "../models/card"
import {Creature} from "../models/creature"
import {Upgrade} from "../models/upgrade"
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
import { GameBoard } from "../models/gameboard";

export function HomePageView() {

    /*Chooses a random Dog Card to show*/
    function randomDogCard(){
        switch (Math.floor(Math.random() *3)){
            case 0:
                return fancyBella;
            case 1:
                return prettyBella;
            case 2:
                return puppyBella;
            default:
                return creature;
        }
    }

    /*Chooses a random Cat Card to show*/
    function randomCatCard(){
        switch (Math.floor(Math.random() *3)){
            case 0:
                return bella;
            case 1:
                return pounce;
            case 2:
                return snowball;
            default:
                return creature;
        }
    }

    /*Chooses a random Chicken Card to show*/
    function randomChickenCard(){
        switch (Math.floor(Math.random() *3)){
            case 0:
                return lulu;
            case 1:
                return olive;
            case 2:
                return theFamily;
            default:
                return creature;
        }
    }
    
    return (
        <div style={{backgroundColor: '#f39c12', display: "grid", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <div style={{display:"grid", placeItems:"center"}}>
            <h1 style={{textAlign:"center", fontSize: "xx-large", fontFamily:"Fantasy, cursive"}}>Dogs, Cats, and Chickens!</h1>
            <div style={{padding:'10px', display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: "10px", width:"35%", justifyItems: "center"}}>
                <img style={{border: '2px solid'}} src={randomDogCard().src}/>
                <img style={{border: '2px solid'}} src={randomCatCard().src}/>
                <img style={{border: '2px solid'}} src={randomChickenCard().src}/>
            </div>
            <div style={{display:"grid", gap:"10px", gridTemplateColumns: 'repeat(1, 1fr)'}}>
            <button style={{backgroundColor: "gray", textAlign: "center", padding: "10px", border: "solid 2px"}}><Link to="/play">Play!</Link></button>
            <button style={{backgroundColor: "gray", textAlign: "center", padding: "10px", border: "solid 2px"}}><Link to="/tutorial">Tutorial!</Link></button>
            </div>
            </div>
        </div>
    )
}