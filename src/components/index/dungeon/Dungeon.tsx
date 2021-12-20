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
import { Component } from "react"
import Maze from "./Maze"
import * as types from "./types"

interface IProps {}

interface IState {
  actions: types.Creature[]
  hero: types.Hero
}

const dummyHero: types.Hero = {
  name: "Orbán Viktor",
  isAlive: true,
  xp: 999999,
  attr: {
    attack: 99999,
    defense: 99999,
    hitpoints: 99999,
  },
}

const dummyCreatures: types.Creature[] = [
  {
    type: 1,
    attr: { attack: 4, defense: 2, hitpoints: 10, damage: { min: 2, max: 4 } },
    health: 100,
    size: 1,
  },
  {
    type: 2,
    attr: { attack: 3, defense: 10, hitpoints: 15, damage: { min: 1, max: 5 } },
    health: 80,
    size: 2,
  },
  {
    type: 3,
    attr: { attack: 3, defense: 10, hitpoints: 15, damage: { min: 1, max: 5 } },
    health: 80,
    size: 2,
  },
  {
    type: 4,
    attr: { attack: 3, defense: 10, hitpoints: 15, damage: { min: 1, max: 5 } },
    health: 80,
    size: 2,
  },
]

export default class Dungeon extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      actions: dummyCreatures,
      hero: dummyHero,
    }
  }

  showHero() {
    const hero = this.state.hero
    return (
      <Box>
        <Heading size="lg">Hero</Heading>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Viktor_Orb%C3%A1n_%2840462383173%29.jpg/1200px-Viktor_Orb%C3%A1n_%2840462383173%29.jpg"
          alt="hero"
          height="200px"
          width="150px"
        />
        <Text>name: {hero.name}</Text>
        <Text>xp: {hero.xp}</Text>
        <Text>attack: {hero.attr.attack}</Text>
        <Text>defense: {hero.attr.defense}</Text>
        <Text>hitpoints: {hero.attr.hitpoints}</Text>
      </Box>
    )
  }

  showActions() {
    return this.state.actions.map((creature, i) => {
      return (
        <Box key={i} display="flex" alignItems="center">
          <Image
            src={`/creatures/${creature.type}.png`}
            alt={types.CreatureType[creature.type]}
          />
          <Box display="flex" alignItems="baseline">
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost" size="lg">
                  {types.CreatureType[creature.type]}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>stats</PopoverHeader>
                <PopoverBody>
                  <Text>health: {creature.health}</Text>
                  <Text>size: {creature.size}</Text>
                  <Text>attributes:</Text>
                  <Text>&emsp; attack: {creature.attr.attack}</Text>
                  <Text>&emsp; defense: {creature.attr.defense}</Text>
                  <Text>&emsp; hitpoints: {creature.attr.hitpoints}</Text>
                  <Text>
                    &emsp; damage: {creature.attr.damage.min} -{" "}
                    {creature.attr.damage.max}
                  </Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </Box>
      )
    })
  }

  render() {
    return (
      <Box display="flex" alignItems="flex-start">
        {/* <Box>{this.showHero()}</Box> */}
        {/* <Box>
          <Heading size="lg">Actions</Heading>
          <ol>{this.showActions()}</ol>
        </Box> */}
        <Box>
          <Maze />
        </Box>
      </Box>
    )
  }
}
