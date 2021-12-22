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
  const [actions, setActions] = useState<schema.Action[]>([])
  const [hero, setHero] = useState<schema.Hero>(dummyHero)
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const showHero = () => (
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
    </Box>
  )

  const initGame = async () => {
    const tx = await txs.initGame(connection, publicKey)
    const res = await sendTransaction(tx, connection)
    console.log("initialized game")
  }

  const deleteGame = async () => {
    const tx = await txs.deleteGame(connection, publicKey)
    const res = await sendTransaction(tx, connection)
    console.log("deleted game")
  }

  const updateHero = async () => {
    const _hero = await query.getHeroState(connection, publicKey)
    setHero(_hero)
  }

  const updateActions = async () => {
    const _actions = await query.getGameState(connection, publicKey)
    console.log(_actions)
    // setActions(_actions.actionSpace)
  }

  const showActions = () =>
    actions.map((action, i) => (
      <Box key={i} display="flex" alignItems="center">
        <Image src={`/creatures/1.png`} alt={action.enum} />
        <Box display="flex" alignItems="baseline">
          <Popover>
            <PopoverTrigger>
              <Button variant="ghost" size="lg">
                action type
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>stats</PopoverHeader>
              <PopoverBody>
                <Text>health: 1</Text>
                <Text>size: 1</Text>
                <Text>attributes:</Text>
                <Text>&emsp; attack: 1</Text>
                <Text>&emsp; defense: 1</Text>
                <Text>&emsp; hitpoints: 1</Text>
                <Text>&emsp; damage: 1 - 2</Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      </Box>
    ))

  return (
    <Box display="flex" alignItems="flex-start">
      <Box display="flex" flexDir="column">
        <Button colorScheme="blue" onClick={updateHero}>
          update hero
        </Button>
        <Button colorScheme="blue" onClick={initGame}>
          init game
        </Button>
        <Button colorScheme="blue" onClick={deleteGame}>
          delete game
        </Button>
        <Button colorScheme="blue" onClick={updateActions}>
          update actions
        </Button>
      </Box>
      <Box>{showHero()}</Box>
      <Box>
        <Heading size="lg">Actions</Heading>
        <ol>{showActions()}</ol>
      </Box>
    </Box>
  )
}

export default Dungeon
