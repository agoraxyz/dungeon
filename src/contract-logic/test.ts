//const CONNECTION = new Connection("https://api.testnet.solana.com", "singleGossip")
export const CONNECTION = new Connection("http://localhost:8899", "singleGossip")

export const PLAYER_SECRET = Uint8Array.from([
  110, 156, 29, 116, 136, 221, 72, 113, 16, 84, 50, 192, 65, 209, 100, 231, 3, 47, 231, 28, 161,
  218, 169, 110, 250, 194, 114, 27, 94, 114, 59, 109, 120, 10, 72, 77, 1, 26, 130, 146, 19, 164, 30,
  88, 232, 81, 31, 206, 127, 186, 90, 180, 126, 86, 40, 54, 128, 75, 248, 85, 2, 128, 84, 202,
])

export async function sendTransaction(transaction: Transaction, signer: Keypair) {
  await CONNECTION.confirmTransaction(
    await CONNECTION.sendTransaction(transaction, [signer], {
      skipPreflight: false,
      preflightCommitment: "singleGossip",
    })
  )
}
