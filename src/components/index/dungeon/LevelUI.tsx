import { Box, Button, Heading, Image, Text } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import * as query from "contract-logic/queries"
import * as schema from "contract-logic/schema"
import * as txs from "contract-logic/transactions"
import { useState } from "react"
import * as print from "./dungeonInfo"
import Level from "./Level"

const LevelUi = () => {
  const level = new Level()
  const [_level] = useState<Level | undefined>(level)
  const [hero, setHero] = useState<schema.Hero | undefined>(undefined)
  const [dungeonState, setDungeonState] = useState<schema.DungeonState | undefined>(
    undefined
  )
  const [_actionNum, _setActionNum] = useState<number | undefined>(undefined)

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const [_fVal, _setFval] = useState<number>(0)
  const _forceUpdate = () => {
    _setFval(_fVal + 1)
  }

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

  const renderLevel = () => {
    const maze = _level.map
    const board = []
    for (let i = 0; i < maze.length; i++) {
      const row = []
      for (let j = 0; j < maze[i].length; j++) {
        const cell = maze[i][j]
        if (cell.length === 0) {
          row.push(<Box key={j} bg="gray.300" w="10px" h="10px" />)
        } else if (cell.includes("wall")) {
          row.push(<Box key={j} bg="yellow.900" w="10px" h="10px" />)
        } else if (cell.includes("hero")) {
          row.push(<Box key={j} bg="blue.300" w="10px" h="10px" />)
        } else if (cell.includes("obj")) {
          row.push(<Box key={j} bg="green.300" w="10px" h="10px" />)
        } else if (cell.includes("entrance")) {
          row.push(<Box key={j} bg="gray.0" w="10px" h="10px" />)
        } else if (cell.includes("ladder")) {
          row.push(<Box key={j} bg="yellow.300" w="10px" h="10px" />)
        } else {
          row.push(<Box key={j} bg="red.600" w="10px" h="10px" />)
        }
      }
      board.push(
        <Box key={i} display="flex">
          {row}
        </Box>
      )
    }
    return board
  }

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
        {print.heroInList(hero).map((h, i) => (
          <Text key={i}>{h}</Text>
        ))}
      </Box>
    ) : (
      <Box>
        <Heading size="lg">Hero</Heading>
      </Box>
    )

  const showAction = () => {
    const key = _actionNum
    if (key === undefined) return <Box>nothing selected</Box>
    const action = dungeonState.actionSpace.get(key)
    return (
      <Box key={key} display="flex" flexDir="column" alignItems="center">
        {/* <Image src={`/creatures/1.png`} alt="asd" /> */}
        <Text>action {key}</Text>
        <Box display="flex" alignItems="baseline">
          <Box>
            {print.actionInfoInList(action).map((a, i) => (
              <Text key={i}>{a}</Text>
            ))}
          </Box>
        </Box>
      </Box>
    )
  }

  const handleKeyPress = (e) => {
    if (e.key === "w") {
      _level.moveNorth()
      _forceUpdate()
    } else if (e.key === "s") {
      _level.moveSouth()
      _forceUpdate()
    } else if (e.key === "a") {
      _level.moveWest()
      _forceUpdate()
    } else if (e.key === "d") {
      _level.moveEast()
      _forceUpdate()
    } else if (e.key === "i") {
      if (!dungeonState) return
      _setActionNum(0)
    } else if (e.key == "f") {
      _level.interact()
      _forceUpdate()
    }
  }

  return (
    <Box>
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
      <Box display="flex" flexDir="row" padding="5px">
        <Box padding="5px">{showHero()}</Box>
        <Box onKeyDown={handleKeyPress} tabIndex={0}>
          {renderLevel()}
        </Box>
        <Box padding="5px">{showAction()}</Box>
      </Box>
    </Box>
  )
}

export default LevelUi
