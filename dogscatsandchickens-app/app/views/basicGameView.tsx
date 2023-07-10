import {GameController} from "../controller/gameController"

export function BasicGameView() {
    let gameController: GameController = new GameController();
    gameController.preGamePreparation();
    console.log(gameController.gameBoard.toString())
    const opponentHandView =  (<div style={{padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + gameController.gameBoard.players[1].hand.length+ ', 1fr)', gap: "10px"}}>{gameController.gameBoard.players[1].hand.map(card => <div style={{border: '2px solid'}}>{card.toString()}</div>)}</div>)
    
    const opponentFieldView = (
        <div style={{padding:'10px', display:'grid', gridTemplateColumns: 'repeat(' +gameController.gameBoard.players[1].field.length+', 1fr)', gap: "10px"}}>
            {gameController.gameBoard.players[1].field.map(cards=>
                <div style={{padding:'10px', display:'grid', gridTemplateColumns: '1fr', gap: "10px"}}>
                    {cards.reverse().map(card=>
                        <div style={{border: '2px solid'}}>
                            {card.toString()}
                        </div>
                    )}
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
    const deckView = (<div style={{padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: "10px"}}>{gameController.gameBoard.deck.reverse().map(card => <div style={{border: '2px solid'}}>{card.toString()}</div>)}</div>)   
    const discardView = (<div style={{padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: "10px"}}>{gameController.gameBoard.discard.reverse().map(card => <div style={{border: '2px solid'}}>{card.toString()}</div>)}</div>)        


    return (
        <div>
         <h1>Hello basic Game View!</h1>
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
        </div>
    )
}