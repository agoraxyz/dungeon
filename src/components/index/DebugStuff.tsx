import {
  Box,
  Button,
  Grid,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js"
import * as borsh from "borsh"
import { useState } from "react"

const requestAirdrop = async (
  conn: Connection,
  publicKey: PublicKey
): Promise<string> => {
  try {
    const hash = await conn.requestAirdrop(publicKey, LAMPORTS_PER_SOL)
    await conn.confirmTransaction(hash)
    return hash
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Error"
    throw error
  }
}

const TestPubKey = new PublicKey("Ce8tvZDapCXXvHNQkCDEDbutRpNz1DMHZb65FtAc7VAf")
const programAddr = "FxhNkRokQnQWNtCXazTtfevc3aHnmapDknQUw76sPfhM"
const programPubkey = new PublicKey(programAddr)
const storageAddr = "B5uaun3nrjYVgh5wTX5LHMxHJKQXXiZLfeXt2tunDrK1"
const storagePubkey = new PublicKey(storageAddr)
const GREETING_SEED = "hello"

// The state of a greeting account managed by the hello world program
class GreetingAccount {
  counter = 0
  constructor(fields: { counter: number } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter
    }
  }
}

// Borsh schema definition for greeting accounts
const GreetingSchema = new Map([
  [GreetingAccount, { kind: "struct", fields: [["counter", "u32"]] }],
])

// The expected size of each greeting account.
const GREETING_SIZE = borsh.serialize(GreetingSchema, new GreetingAccount()).length

const DebugStuff = () => {
  const [balance1, setBalance1] = useState<number | null>(null)
  const [balance2, setBalance2] = useState<number | null>(null)
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const _fetchBalance = async () => {
    if (!publicKey) return
    const balance1_ = await connection.getBalance(publicKey)
    const balance2_ = await connection.getBalance(TestPubKey)
    setBalance1(balance1_ / LAMPORTS_PER_SOL)
    setBalance2(balance2_ / LAMPORTS_PER_SOL)
  }

  const _airDrop = async () => {
    if (!publicKey) return
    await requestAirdrop(connection, publicKey)
  }

  const _transfer = async () => {
    if (!publicKey) return
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: TestPubKey,
        lamports: 2 * LAMPORTS_PER_SOL,
      })
    )
    const signature = await sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, "processed")
    console.log("sent tx", signature)
  }

  const _accountInfo = async () => {
    const pubKey = new PublicKey(programAddr)
    const info = await connection.getAccountInfo(pubKey)
    console.log(info)
  }

  const _createGreeter = async () => {
    if (!publicKey) return
    const programId = new PublicKey(programAddr)

    const greetedPubkey = await PublicKey.createWithSeed(
      publicKey,
      GREETING_SEED,
      programId
    )
    console.log("new pub key", greetedPubkey.toString(), greetedPubkey)

    const tx = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: publicKey,
        basePubkey: publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports: 1 * LAMPORTS_PER_SOL,
        space: GREETING_SIZE,
        programId,
      })
    )

    const signature = await sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, "processed")
    console.log("sent tx", signature)
  }

  const _getCount = async () => {
    if (!publicKey) return

    const accountInfo = await connection.getAccountInfo(storagePubkey)
    console.log("account info", accountInfo)
    if (!accountInfo) return

    // Find the expected parameters.
    const greeting = borsh.deserialize(
      GreetingSchema,
      GreetingAccount,
      accountInfo.data
    )

    // A little helper
    console.log(greeting)
  }

  const _setCount = async () => {
    if (!publicKey) return

    const tx = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: storagePubkey, isSigner: false, isWritable: true }],
        programId: programPubkey,
        data: Buffer.alloc(0), // All instructions are hellos
      })
    )

    const signature = await sendTransaction(tx, connection)
    await connection.confirmTransaction(signature, "processed")
    console.log("sent tx", signature)
  }

  return (
    <Box>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <Button colorScheme="blue" onClick={_fetchBalance}>
          fetch balance
        </Button>
        <Button colorScheme="blue" onClick={_airDrop}>
          airdrop
        </Button>
        <Button colorScheme="blue" onClick={_transfer}>
          transfer
        </Button>
        <Button colorScheme="blue" onClick={_accountInfo}>
          getInfo
        </Button>
        <Button colorScheme="blue" onClick={_createGreeter}>
          create
        </Button>
        <Button colorScheme="blue" onClick={_getCount}>
          get
        </Button>
        <Button colorScheme="blue" onClick={_setCount}>
          set
        </Button>
      </Grid>

      <SimpleGrid columns={2} spacing={10}>
        <Box height="80px">
          <Stat>
            <StatLabel>Balance 1</StatLabel>
            <StatNumber>{balance1} SOL</StatNumber>
          </Stat>
        </Box>
        <Box height="80px">
          <Stat>
            <StatLabel>Balance 2</StatLabel>
            <StatNumber>{balance2} SOL</StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export default DebugStuff
