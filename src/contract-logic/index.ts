import { Keypair } from "@solana/web3.js"
import { getHeroState, getGameState } from "./queries"
import { initGame, deleteGame, performAction } from "./transactions"
import { sendTransaction } from "./test"

//const CONNECTION = new Connection("https://api.testnet.solana.com", "singleGossip")
const CONNECTION = new Connection("http://localhost:8899", "singleGossip")


;(async () => {
  const player = Keypair.fromSecretKey(PLAYER_SECRET)
  await CONNECTION.confirmTransaction(
    await CONNECTION.requestAirdrop(player.publicKey, 100000000)
  )
  const transaction = await initGame(CONNECTION, player.publicKey);

  console.log(await getHeroState(CONNECTION, player.publicKey));
})()
