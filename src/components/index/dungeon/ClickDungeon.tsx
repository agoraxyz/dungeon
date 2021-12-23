import {
  Box,
  Button,
  Heading,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import * as query from "contract-logic/queries"
import * as schema from "contract-logic/schema"
import * as txs from "contract-logic/transactions"
import { useState } from "react"
import * as print from "./dungeonInfo"

const dummyHero: schema.Hero = {
  stats: {
    core: {
      str: { base: 99999, modifier: 0 },
      dex: { base: 99999, modifier: 0 },
      con: { base: 99999, modifier: 0 },
      int: { base: 99999, modifier: 0 },
      wis: { base: 99999, modifier: 0 },
      cha: { base: 99999, modifier: 0 },
    },
    att: { base: 99999, modifier: 0 },
    ac: { base: 99999, modifier: 0 },
    size: { base: 99999, modifier: 0 },
    hp: 99999,
    xp: 99999,
  },
  xp: 999999,
  equipment: null,
  hitpoints: 99999,
}

const Dungeon = () => {
  const [dungeonState, setDungeonState] = useState<schema.DungeonState | undefined>(
    undefined
  )
  const [hero, setHero] = useState<schema.Hero | undefined>(undefined)
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const showHero = () =>
    hero ? (
      <Box>
        <Heading size="lg">Hero</Heading>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Viktor_Orb%C3%A1n_%2840462383173%29.jpg/1200px-Viktor_Orb%C3%A1n_%2840462383173%29.jpg"
          alt="hero"
          height="200px"
          width="150px"
        />
        <Text>xp: {hero.xp}</Text>
        <Text>attack: {hero.stats.att.base}</Text>
        <Text>defense: {hero.stats.ac.base}</Text>
        <Text>hitpoints: {hero.hitpoints}</Text>
        <Heading size="md">stats</Heading>
        <Text>
          att: {hero.stats.att.base} + {hero.stats.att.modifier}
        </Text>
        <Text>
          ac: {hero.stats.ac.base} + {hero.stats.ac.modifier}
        </Text>
        <Text>
          size: {hero.stats.size.base} + {hero.stats.size.modifier}
        </Text>
        <Text>hp: {hero.stats.hp}</Text>
        <Text>xp: {hero.stats.xp}</Text>
      </Box>
    ) : (
      <Box>
        <Heading size="lg">Hero</Heading>
      </Box>
    )

  const initGame = async () => {
    const tx = await txs.initGame(connection, publicKey)
    const res = await sendTransaction(tx, connection)
    await connection.confirmTransaction(res, "confirmed")
    console.log("initialized game")
    await fetchHero()
    await fetchDungeonState()
  }

  const deleteGame = async () => {
    const tx = await txs.deleteGame(connection, publicKey)
    const res = await sendTransaction(tx, connection)
    await connection.confirmTransaction(res, "confirmed")
    console.log("deleted game")
    setDungeonState(undefined)
    setHero(undefined)
  }

  const performAction = async (actionId: number) => {
    console.log("performing action", actionId)
    const tx = await txs.performAction(connection, publicKey, actionId)
    const res = await sendTransaction(tx, connection)
    await connection.confirmTransaction(res, "confirmed")
    await fetchHero()
    await fetchDungeonState()
  }

  const fetchHero = async () => {
    const _hero = await query.getHeroState(connection, publicKey)
    if (_hero === undefined) {
      console.log("hero not initialized")
      setHero(undefined)
    }
    setHero(_hero)
  }

  const fetchDungeonState = async () => {
    const state = await query.getGameState(connection, publicKey)
    if (state === undefined) {
      console.log("game not initialized")
      setDungeonState(undefined)
    }
    setDungeonState(state)
  }

  const fetchGameState = async () => {
    await fetchHero()
    await fetchDungeonState()
  }

  const showActions = () => {
    if (dungeonState === undefined) return
    const res = Array.from(dungeonState.actionSpace.keys()).map((key) => {
      const action = dungeonState.actionSpace.get(key)
      const forPrint = print.action(action)
      return (
        <Box key={key} display="flex" alignItems="center">
          {/* <Image src={`/creatures/1.png`} alt="asd" /> */}
          <Button onClick={() => performAction(key)}>{action.enum}</Button>
          <Box display="flex" alignItems="baseline">
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost" size="lg">
                  info
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>stats {key}</PopoverHeader>
                <PopoverBody>
                  <Text>{forPrint}</Text>
                  {/* <Text>size: 1</Text>
                  <Text>attributes:</Text>
                  <Text>&emsp; attack: 1</Text>
                  <Text>&emsp; defense: 1</Text>
                  <Text>&emsp; hitpoints: 1</Text>
                  <Text>&emsp; damage: 1 - 2</Text> */}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </Box>
      )
    })
    return res
  }

  const showLogs = () => {
    if (dungeonState) {
      return (
        <Box>
          <Heading size="lg">Logs</Heading>
          <Text>{print.combatLogs(dungeonState.combatLogs)}</Text>
        </Box>
      )
    } else {
      return <Box></Box>
    }
  }

  return (
    <Box display="flex" alignItems="flex-start" flexDir="column">
      <Box display="flex" flexDir="row">
        <Button colorScheme="blue" onClick={fetchGameState}>
          refresh gameState
        </Button>
        <Button colorScheme="blue" onClick={initGame}>
          init game
        </Button>
        <Button colorScheme="blue" onClick={deleteGame}>
          delete game
        </Button>
      </Box>
      <Box display="flex" flexDir="row">
        <Box display="flex" flexDir="column">
          <Box>{showHero()}</Box>
          <Box>{showLogs()}</Box>
        </Box>
        <Box>
          <Heading size="lg">Actions</Heading>
          <ol>{showActions()}</ol>
        </Box>
      </Box>
    </Box>
  )
}

export default Dungeon
