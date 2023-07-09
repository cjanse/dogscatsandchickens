//import Image from 'next/image'
import {Creature} from "./models/creature";
import {Upgrade} from "./models/upgrade";
import {Action} from "./models/action";
import {Player} from "./models/player";
import {GameBoard} from "./models/gameboard"

export default function Home() {

  let creature: Creature = new Creature(0, "Fancy Bella", "Defeats Cats, Defeated By Chickens", "fancy_bella.jpg", "creature.jpg", "Dog", "Matching Ability: Defeats Any Creature")
  let upgrade: Upgrade = new Upgrade(1, "Cactus Attack", "Counter Attack - blocks opposing creature's attack and attacks that creature", "cactus_attack.jpg", "upgrade.jpg", "Counter Attack")
  let action: Action = new Action(2, "Forest Spirits", "Go into the discard pile and choose one creature card", "forest_spirits.jpg", "action.jpg", "Spirits")
  let player: Player = new Player();
  let gameBoard: GameBoard = new GameBoard();

  return (
    <main>
      <div><i>Hello World!</i></div>
      <b>Testing Creating Different Cards:</b>
      <h2>{creature.toString()}</h2>
      <h2>{upgrade.toString()}</h2>
      <h2>{action.toString()}</h2>
      <h2>------------------------------------------------</h2>
      <b>Testing Player:</b>
      <h2>{player.name}</h2>
      <h2>{player.hand[0].toString()}</h2>
      <h2>{player.hand[1].toString()}</h2>
      <h2>{player.hand[2].toString()}</h2>
      <h2>{player.field[0][0].toString()}</h2>
      <h2>{player.field[0][1].toString()}</h2>
      <h2>{player.field[1][0].toString()}</h2>
      <h2>------------------------------------------------</h2>
      <b>Testing Deck in GameBoard:</b>
      <h2>{gameBoard.players[0].name}</h2>
      <h2>{gameBoard.players[1].name}</h2>
      <h2>{gameBoard.deck[0].toString()}</h2>
      <h2>{gameBoard.deck[1].toString()}</h2>
      <h2>{gameBoard.deck[2].toString()}</h2>
      <h2>{gameBoard.deck[3].toString()}</h2>
      <h2>{gameBoard.deck[4].toString()}</h2>
      <h2>{gameBoard.deck[5].toString()}</h2>
      <h2>{gameBoard.deck[6].toString()}</h2>
      <h2>{gameBoard.deck[7].toString()}</h2>
      <h2>{gameBoard.deck[8].toString()}</h2>
      <h2>{gameBoard.deck[9].toString()}</h2>
      <h2>{gameBoard.deck[10].toString()}</h2>
      <h2>{gameBoard.deck[11].toString()}</h2>
      <h2>{gameBoard.deck[12].toString()}</h2>
      <h2>{gameBoard.deck[13].toString()}</h2>
      <h2>{gameBoard.deck[14].toString()}</h2>
      <h2>{gameBoard.deck[15].toString()}</h2>
      <h2>{gameBoard.deck[16].toString()}</h2>
      <h2>{gameBoard.deck[17].toString()}</h2>
      <h2>{gameBoard.deck[18].toString()}</h2>
      <h2>{gameBoard.deck[19].toString()}</h2>
      <h2>{gameBoard.deck[20].toString()}</h2>
      <h2>{gameBoard.deck[21].toString()}</h2>
      <h2>{gameBoard.deck[22].toString()}</h2>
      <h2>{gameBoard.deck[23].toString()}</h2>
      <h2>{gameBoard.deck[24].toString()}</h2>
      <h2>{gameBoard.deck[25].toString()}</h2>
      <h2>{gameBoard.deck[26].toString()}</h2>
      <h2>{gameBoard.deck[27].toString()}</h2>
      <h2>{gameBoard.deck[28].toString()}</h2>
      <h2>{gameBoard.deck[29].toString()}</h2>
      <h2>{gameBoard.deck[30].toString()}</h2>
      <h2>{gameBoard.deck[31].toString()}</h2>
      <h2>{gameBoard.deck[32].toString()}</h2>
      <h2>{gameBoard.deck[33].toString()}</h2>
      <h2>{gameBoard.deck[34].toString()}</h2>
      <h2>{gameBoard.deck[35].toString()}</h2>
    </main>
  )
}

/*<main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore the Next.js 13 playground.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
    */