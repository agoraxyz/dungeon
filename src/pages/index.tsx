import { Box, Button, Heading } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import DebugStuff from "components/index/DebugStuff"
import { ClickDungeon, Dungeon } from "components/index/dungeon"
import { useState } from "react"

const Page = (): JSX.Element => {
  const [which, setWhich] = useState<string>("Dungeon")

  const changeDungeon = () => {
    if (which === "Dungeon") {
      setWhich("ClickDungeon")
    } else {
      setWhich("Dungeon")
    }
  }

  return (
    <Layout title="Home">
      <div>
        <Heading>debug stuff</Heading>
        <DebugStuff />
      </div>

      <Box display="flex" flexDirection="column">
        <Button onClick={changeDungeon}>switch</Button>
        {which === "ClickDungeon" ? (
          <Box padding="10px">
            <Heading>ClickDungeon</Heading>
            <ClickDungeon />
          </Box>
        ) : (
          <Box padding="10px">
            <Heading>Dungeon</Heading>
            <Dungeon />
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default Page
