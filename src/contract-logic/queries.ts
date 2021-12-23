import { Connection, PublicKey } from "@solana/web3.js";
import { deserializeUnchecked } from "borsh";
import { DungeonState, Hero, SCHEMA } from "./schema";

export async function getHeroState(connection: Connection, ownerPubkey: PublicKey): Promise<Hero | undefined> {
  const { getHeroStatePubkeyWasm } = await import ("../../wasm-factory")
  const heroStatePubkey = new PublicKey(
    await getHeroStatePubkeyWasm(ownerPubkey.toBytes())
  );

  const heroStateAccount = await connection.getAccountInfo(heroStatePubkey)
  if (!heroStateAccount) return undefined
  const heroStateData: Buffer = heroStateAccount!.data
  return deserializeUnchecked(SCHEMA, Hero, heroStateData)
}

export async function getGameState(connection: Connection, ownerPubkey: PublicKey): Promise<DungeonState | undefined> {
  const { getGameStatePubkeyWasm } = await import ("../../wasm-factory")
  const gameStatePubkey = new PublicKey(
    await getGameStatePubkeyWasm(ownerPubkey.toBytes())
  );

  const gameStateAccount = await connection.getAccountInfo(gameStatePubkey)
  if (!gameStateAccount) return undefined
  const gameStateData: Buffer = gameStateAccount!.data
  return deserializeUnchecked(SCHEMA, DungeonState, gameStateData)
}
