import {GameController} from "../controller/gameController"
import { PlayerController } from "../controller/playerController";
import {useState, useEffect} from "react"
import { AIPlayerController } from "../controller/AIPlayerController";

const gameController: GameController = new GameController();
gameController.preGamePreparation();

const playerController: PlayerController = new PlayerController(gameController)
const aiPlayerController: AIPlayerController = new AIPlayerController(gameController)

export function BasicGameView() {
    const [action, setTurn] = useState(0)

    /*End turn styling function (controls opacity)*/
    function endTurnStyle(){
        if (playerController.canEndTurn()){
            return "1"
        }
        else {
            return "0.33";
        }
    }

    /*deck card styling function*/
    function deckCardStyle(cardId: number){
        if (playerController.canDraw(cardId)){
            return {border: '2px solid', borderColor: "red"}
        }
        else {
            return {border: '2px solid', borderColor: "black"}
        }
    }

    /*hand card styling function*/
    function handCardStyle(cardId: number){
        if (playerController.upgradeCard == cardId || (playerController.messyDormIP && (cardId == 306 || cardId == 307))){
            return {border: '2px solid', borderColor: "green"}
        }
        else if (playerController.canUseHandCard(cardId)){
            return {border: '2px solid', borderColor: "red"}
        }
        else if (playerController.discardNeed()){
            return {border: '2px solid', borderColor: "blue"}
        }
        else {
            return {border: '2px solid', borderColor: "black"}
        }
    }

    /*field card styling function*/
    function fieldCardStyle(cardId: number){
        if (cardId == playerController.attackingCard) {
            return {border: '2px solid', borderColor: "green"}
        }
        else if (playerController.canFieldHandle(cardId)){
            return {border: '2px solid', borderColor: "red"}
        }
        else if (playerController.canActivateAbility(cardId)){
            return {border: '2px solid', borderColor: "yellow"}
        }
        else {
            return {border: '2px solid', borderColor: "black"}
        }
    }

    /*opponent field card styling function*/
    function opponentFieldCardStyle(cardId: number){
        if (playerController.canHandleOpponentField(cardId)){
            return {border: '2px solid', borderColor: "red"}
        }
        else {
            return {border: '2px solid', borderColor: "black"}
        }
    }

    /*discard card styling function*/
    function discardCardStyle(cardId: number){
        if (playerController.canGrabDiscard(cardId)) {
            return {border: '2px solid', borderColor: "red"}
        }
        else {
            return {border: '2px solid', borderColor: "black"}
        }
    }

    /*opponent hand styling function*/
    function opponentHandCardStyle(){
        if (playerController.canHandleOpponentHand()) {
            return {border: '2px solid', borderColor: "red"}
        }
        else {
            return {border: '2px solid', borderColor: "black"}
        }
    }

    /*onclickHandler for ending a turn*/
    function onclickEndTurn(){
        if(playerController.endTurn() && playerController.player.turnNumber > 0){
            aiPlayerController.move();
        }
        setTurn(action + 1)
    }

    /*onclickHandler for drawing a card*/
    function onclickDrawCard(cardId: number){
        playerController.drawCard(cardId);
        setTurn(action + 1)
    }

    /*onclickHandler for interacting with a card in hand*/
    function onclickHandCard(cardId: number){
        playerController.useHandCard(cardId);
        setTurn(action + 1)
    }

    /*onclickHandler for attacking*/
    function onclickFieldHandle(cardId: number){
        playerController.fieldHandle(cardId);
        setTurn(action + 1)
    }

    /*onclickHandler for finishing an attacking turn*/
    function onclickHandleOpponentField(opponentCardId: number){
        playerController.handleOpponentField(opponentCardId);
        setTurn(action + 1)
    }

    /*onclickHandler for discard pile*/
    function onclickDiscardHandle(cardId: number){
        playerController.grabDiscard(cardId)
        setTurn(action + 1)
    }

    /*onclickHandler for opponent hand*/
    function onclickOpponentHandHandle(cardId: number){
        playerController.grabOpponentCard(cardId)
        setTurn(action + 1)
    }

    const opponentHandView =  (<div style={{padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + gameController.gameBoard.players[1].hand.length+ ', 1fr)', gap: "10px"}}>{gameController.gameBoard.players[1].hand.map(card => <div style={opponentHandCardStyle()} onClick={() => onclickOpponentHandHandle(card.id)}>{card.toString()}</div>)}</div>)

    const opponentFieldView = (
        <div style={{padding:'10px', display:'grid', gridTemplateColumns: 'repeat(' +gameController.gameBoard.players[1].field.length+', 1fr)', gap: "10px"}}>
            {gameController.gameBoard.players[1].field.map(cards=>
                <div style={{padding:'10px', display:'grid', gridTemplateColumns: '1fr', gap: "10px"}}>
                    {cards.map(card=>
                        <div style={opponentFieldCardStyle(card.id)} onClick={() => onclickHandleOpponentField(card.id)}>
                            {card.toString()}
                        </div>
                    ).reverse()}
                </div>
            )}
        </div>
    )
    
    const myFieldView = (
        <div style={{padding:'10px', display:'grid', gridTemplateColumns: 'repeat(' +gameController.gameBoard.players[0].field.length+', 1fr)', gap: "10px"}}>
            {gameController.gameBoard.players[0].field.map(cards=>
                <div style={{padding:'10px', display:'grid', gridTemplateColumns: '1fr', gap: "10px"}}>
                    {cards.map(card=>
                        <div style={fieldCardStyle(card.id)} onClick={() => onclickFieldHandle(card.id)}>
                            {card.toString()}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
    
    const myHandView = (<div style={{padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + gameController.gameBoard.players[0].hand.length+ ', 1fr)', gap: "10px"}}>{gameController.gameBoard.players[0].hand.map(card => <div style={handCardStyle(card.id)} onClick={() => onclickHandCard(card.id)}>{card.toString()}</div>)}</div>)
    const deckView = (<div style={{padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: "10px"}}>{gameController.gameBoard.deck.map(card => <div style={deckCardStyle(card.id)} onClick={() => onclickDrawCard(card.id)}>{card.toString()}</div>).reverse()}</div>)   
    const discardView = (<div style={{padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: "10px"}}>{gameController.gameBoard.discard.map(card => <div style={discardCardStyle(card.id)} onClick={() => onclickDiscardHandle(card.id)}>{card.toString()}</div>).reverse()}</div>)        
    const bottomButtonView = (<div style={{display: "grid", justifyContent: "center", gridTemplateColumns: "1fr", gap: "20%", padding: "10px 325px 10px"}}><button style={{backgroundColor: "gray", textAlign: "center", padding: "10px", border: "solid 2px", opacity: endTurnStyle()}} onClick={() => onclickEndTurn()}>End Turn!</button></div>)

    return (
        <div style={{fontSize:"small"}}>
         <div>Opponent Hand:</div>
         {opponentHandView}
         <hr></hr>
         <div>Opponent Field:</div>
         {opponentFieldView}
         <hr></hr>
         <div>My Field:</div>
         {myFieldView}
         <hr></hr>
         <div>My Hand:</div>
         {myHandView}
         <hr></hr>
         {bottomButtonView}
         <hr></hr>
         <div>Deck:</div>
         {deckView}
         <hr></hr>
         <div>Discard:</div>
         {discardView}
        </div>
    )
}