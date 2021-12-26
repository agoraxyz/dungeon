import { Keypair } from "@solana/web3.js"
import { getHeroState, getGameState } from "./queries"
import { initGame, deleteGame, performAction } from "./transactions"
import { sendTransaction, PLAYER_SECRET, CONNECTION } from "./test"

;(async () => {
  const player = Keypair.fromSecretKey(PLAYER_SECRET)
  //await CONNECTION.confirmTransaction(
  //  await CONNECTION.requestAirdrop(player.publicKey, 100000000)
  //)
  // INITIALIZE GAME
  //const transaction = await initGame(CONNECTION, player.publicKey);
  //await sendTransaction(transaction, player);
  //console.log(await getHeroState(CONNECTION, player.publicKey));
  // PERFORM ACITON
  console.log(await getGameState(CONNECTION, player.publicKey));
  var transaction = await performAction(CONNECTION, player.publicKey, 0);
  await sendTransaction(transaction, player);
  let gameState = await getGameState(CONNECTION, player.publicKey);
  console.log(await getGameState(CONNECTION, player.publicKey));
  // DELETE GAME
  //const transaction = await deleteGame(CONNECTION, player.publicKey);
  //await sendTransaction(transaction, player);
  //console.log("hero deleted");
})()
