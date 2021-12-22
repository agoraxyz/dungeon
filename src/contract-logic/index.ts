import { Keypair } from "@solana/web3.js"

const CONNECTION = new Connection("https://api.testnet.solana.com", "singleGossip")


;(async () => {
  const player = Keypair.fromSecretKey(PLAYER_SECRET)
  await CONNECTION.confirmTransaction(
    await CONNECTION.requestAirdrop(player.publicKey, 100000000)
  )
})()
