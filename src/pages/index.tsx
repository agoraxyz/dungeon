import { Heading } from "@chakra-ui/react"
import Layout from "components/common/Layout"
import DebugStuff from "components/index/DebugStuff"
import Dungeon from "components/index/dungeon"

const Page = (): JSX.Element => {
  return (
    <Layout title="Home">
      <div>
        <Heading>debug stuff</Heading>
        <DebugStuff />
      </div>

      <div>
        <Heading>Dungeon</Heading>
        <Dungeon />
      </div>
    </Layout>
  )
}

export default Page
