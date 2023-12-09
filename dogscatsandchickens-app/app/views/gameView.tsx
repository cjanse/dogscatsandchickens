import {GameController} from "../controller/gameController"
import { PlayerController } from "../controller/playerController";
import {useState, useEffect} from "react"
import { AIPlayerController } from "../controller/AIPlayerController";

//Import all images
import creature from "../../assets/cards/creature.jpg"
import upgrade from "../../assets/cards/upgrade.jpg"
import action from "../../assets/cards/action.jpg"

const gameController: GameController = new GameController();
gameController.preGamePreparation();

const playerController: PlayerController = new PlayerController(gameController)
const aiPlayerController: AIPlayerController = new AIPlayerController(gameController)

export function GameView() {
    const [move, setmove] = useState(0)

    //const opponentHandView = (<div style={{padding:'10px', display: 'grid', gridTemplateColumns: 'repeat(' + gameController.gameBoard.players[1].hand.length+ ', 1fr)', gap: "10px"}}>{gameController.gameBoard.players[1].hand.map(card => <img style={{border: '2px solid', borderColor: "black"}} /*onClick={() => onclickOpponentHandHandle(card.id)}*/ src="../assets/cards/creature.jpg"/>)}</div>)


    return (
        <div>
            <img src={action.src} alt="creature image"></img>
        </div>
    )
}