import {GameController} from "../controller/gameController"
import { PlayerController } from "../controller/playerController";
import {useState, useEffect} from "react"
import { AIPlayerController } from "../controller/AIPlayerController";

const gameController: GameController = new GameController();
gameController.preGamePreparation();

const playerController: PlayerController = new PlayerController(gameController)
const aiPlayerController: AIPlayerController = new AIPlayerController(gameController)

export function BasicGameView() {
    const [turn, setTurn] = useState(0)

    function onclickHandler(isAttack: boolean){
        playerController.testerMove(isAttack)
        if (gameController.gameBoard.currentPlayer == 1) {
            aiPlayerController.testerMove();
        }
        setTurn(turn + 1)

    }
    const opponentHandView =  (<div style={{padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + gameController.gameBoard.players[1].hand.length+ ', 1fr)', gap: "10px"}}>{gameController.gameBoard.players[1].hand.map(card => <div style={{border: '2px solid'}}>{card.toString()}</div>)}</div>)

    const opponentFieldView = (
        <div style={{padding:'10px', display:'grid', gridTemplateColumns: 'repeat(' +gameController.gameBoard.players[1].field.length+', 1fr)', gap: "10px"}}>
            {gameController.gameBoard.players[1].field.map(cards=>
                <div style={{padding:'10px', display:'grid', gridTemplateColumns: '1fr', gap: "10px"}}>
                    {cards.map(card=>
                        <div style={{border: '2px solid'}}>
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
                        <div style={{border: '2px solid'}}>
                            {card.toString()}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
    
    const myHandView = (<div style={{padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + gameController.gameBoard.players[0].hand.length+ ', 1fr)', gap: "10px"}}>{gameController.gameBoard.players[0].hand.map(card => <div style={{border: '2px solid'}}>{card.toString()}</div>)}</div>)
    const deckView = (<div style={{padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: "10px"}}>{gameController.gameBoard.deck.map(card => <div style={{border: '2px solid'}}>{card.toString()}</div>).reverse()}</div>)   
    const discardView = (<div style={{padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: "10px"}}>{gameController.gameBoard.discard.map(card => <div style={{border: '2px solid'}}>{card.toString()}</div>).reverse()}</div>)        
    const bottomButtonView = (<div style={{display: "grid", justifyContent: "center", gridTemplateColumns: "1fr 1fr", gap: "20%", padding: "10px"}}>
    <button style={{backgroundColor: "gray", textAlign: "center", padding: "10px", border: "solid 2px"}} onClick={() => onclickHandler(true)}>Al ataque!</button>
       <button style={{backgroundColor: "gray", textAlign: "center", padding: "10px", border: "solid 2px"}} onClick={() => onclickHandler(false)}>Reinforce!</button>
    </div>)

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
         <div>Deck:</div>
         {deckView}
         <hr></hr>
         <div>Discard:</div>
         {discardView}
         <hr></hr>
         {bottomButtonView}
        </div>
    )
}