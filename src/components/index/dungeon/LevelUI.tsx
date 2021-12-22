import { Box } from "@chakra-ui/react"
import { Component } from "react"
import Level from "./Level"

interface IProps {}

interface IState {
  level: Level
}

export default class Maze extends Component<IProps, IState> {
  constructor(props: IProps) {
    const level = new Level()
    super(props)
    this.state = {
      level: level,
    }
    this.moveNorth = this.moveNorth.bind(this)
    this.moveSouth = this.moveSouth.bind(this)
    this.moveEast = this.moveEast.bind(this)
    this.moveWest = this.moveWest.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  moveNorth() {
    this.state.level.moveNorth()
    this.setState({ level: this.state.level })
  }
  moveSouth() {
    this.state.level.moveSouth()
    this.setState({ level: this.state.level })
  }
  moveEast() {
    this.state.level.moveEast()
    this.setState({ level: this.state.level })
  }
  moveWest() {
    this.state.level.moveWest()
    this.setState({ level: this.state.level })
  }

  renderLevel() {
    const maze = this.state.level.map
    const board = []
    for (let i = 0; i < maze.length; i++) {
      const row = []
      for (let j = 0; j < maze[i].length; j++) {
        const cell = maze[i][j]
        if (cell.length === 0) {
          row.push(<Box key={j} bg="gray.300" w="5px" h="5px" />)
        } else if (cell.includes("wall")) {
          row.push(<Box key={j} bg="yellow.900" w="5px" h="5px" />)
        } else if (cell.includes("hero")) {
          row.push(<Box key={j} bg="blue.300" w="5px" h="5px" />)
        } else if (cell.includes("obj")) {
          row.push(<Box key={j} bg="green.300" w="5px" h="5px" />)
        } else if (cell.includes("entrance")) {
          row.push(<Box key={j} bg="gray.0" w="5px" h="5px" />)
        } else if (cell.includes("ladder")) {
          row.push(<Box key={j} bg="yellow.300" w="5px" h="5px" />)
        } else {
          row.push(<Box key={j} bg="red.600" w="5px" h="5px" />)
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

  handleKeyPress(e) {
    if (e.key === "w") {
      this.moveNorth()
    } else if (e.key === "s") {
      this.moveSouth()
    } else if (e.key === "a") {
      this.moveWest()
    } else if (e.key === "d") {
      this.moveEast()
    } else if (e.key == "f") {
      this.state.level.interact()
      this.setState({ level: this.state.level })
    }
  }

  render() {
    return (
      <Box onKeyDown={this.handleKeyPress} tabIndex="0">
        {this.renderLevel()}
      </Box>
    )
  }
}
