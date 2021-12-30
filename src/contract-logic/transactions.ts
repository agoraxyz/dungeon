import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import { serialize } from "borsh"
import { DeleteGameArgs, InitializeGameArgs, PerformActionArgs, SCHEMA } from "./schema"
import { parseInstruction } from "./utils"

export async function initGame(connection: Connection, ownerPubkey: PublicKey) {
  const { initGameWasm } = await import("../../wasm-factory")

  const initGameArgs = new InitializeGameArgs({ heroOwnerPubkey: ownerPubkey })

  try {
    const instruction = parseInstruction(initGameWasm(serialize(SCHEMA, initGameArgs)))
    return new Transaction().add(instruction)
  } catch (e) {
    console.log("wasm error:", e)
  }
}

export async function deleteGame(connection: Connection, ownerPubkey: PublicKey) {
  const { deleteGameWasm } = await import("../../wasm-factory")

  const deleteGameArgs = new DeleteGameArgs({ heroOwnerPubkey: ownerPubkey })

  try {
    const instruction = parseInstruction(deleteGameWasm(serialize(SCHEMA, deleteGameArgs)))
    return new Transaction().add(instruction)
  } catch (e) {
    console.log("wasm error:", e)
  }
}

export async function performAction(connection: Connection, ownerPubkey: PublicKey, actionId: number) {
  const { performActionWasm } = await import("../../wasm-factory")

  const performActionArgs = new PerformActionArgs({
    heroOwnerPubkey: ownerPubkey,
    actionId,
  })
  const serialized_args = serialize(SCHEMA, performActionArgs)
  const serialized_instruction = performActionWasm(serialized_args)
  try {
    const instruction = parseInstruction(serialized_instruction)
    return new Transaction().add(instruction)
  } catch (e) {
    console.log("wasm error:", e)
  }
}


