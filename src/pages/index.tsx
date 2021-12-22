import { Box, Heading } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import DebugStuff from "components/index/DebugStuff"
import { ClickDungeon, Dungeon } from "components/index/dungeon"

const Page = (): JSX.Element => (
  <Layout title="Home">
    <div>
      <Heading>debug stuff</Heading>
      <DebugStuff />
    </div>

    <Box display="flex" flexDirection="row">
      <Box padding="10px">
        <Heading>Dungeon</Heading>
        <Dungeon />
      </Box>
      <Box padding="10px">
        <Heading>ClickDungeon</Heading>
        <ClickDungeon />
      </Box>
    </Box>
  </Layout>
)

export default Page
