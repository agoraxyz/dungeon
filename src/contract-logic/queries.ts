import { Connection, PublicKey } from "@solana/web3.js"
import { deserializeUnchecked } from "borsh"
import { Hero, DungeonState, SCHEMA } from "./schema"

export async function getHeroState(connection: Connection, ownerPubkey: PublicKey): Promise<Hero> {
  const { getHeroStatePubkeyWasm } = await import ("../../wasm-factory")
  const heroStatePubkey = new PublicKey(
    await getHeroStatePubkeyWasm(ownerPubkey.asBytes())
  );

  const heroStateAccount = await connection.getAccountInfo(heroStatePubkey)
  const heroStateData: Buffer = heroStateAccount!.data
  return deserializeUnchecked(SCHEMA, Hero, heroStateData)
}

export async function getGameState(connection: Connection, ownerPubkey: PublicKey): Promise<DungeonState> {
  const { getGameStatePubkeyWasm } = await import ("../../wasm-factory")
  const gameStatePubkey = new PublicKey(
    await getGameStatePubkeyWasm(ownerPubkey.asBytes())
  );

  const gameStateAccount = await connection.getAccountInfo(gameStatePubkey)
  const gameStateData: Buffer = gameStateAccount!.data
  return deserializeUnchecked(SCHEMA, DungeonState, gameStateData)
}
