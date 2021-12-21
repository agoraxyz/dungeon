import { Box } from "@chakra-ui/react"
import { Component } from "react"
import Chamber from "./Chamber"
import Level from "./Level"

interface IProps {}

interface IState {
  chamber: Chamber
}

export default class Maze extends Component<IProps, IState> {
  constructor(props: IProps) {
    const level = new Level()
    super(props)
    this.state = {
      chamber: new Chamber(3, 4, [{ path: true }, { path: false }], [["south", 11]]),
    }
    this.logMaze = this.logMaze.bind(this)
    this.moveNorth = this.moveNorth.bind(this)
    this.moveSouth = this.moveSouth.bind(this)
    this.moveEast = this.moveEast.bind(this)
    this.moveWest = this.moveWest.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  logMaze() {
    const maze = this.state.chamber.map

    for (let i = 0; i < maze.length; i++) {
      let row = ""
      for (let j = 0; j < maze[i].length; j++) {
        const cell = maze[i][j]
        if (cell.length === 0) {
          row += " "
        } else if (cell[0] === "wall") {
          row += "X"
        } else if (cell.includes("hero")) {
          row += "H"
        } else if (cell[0] == "door") {
          row += "D"
        } else {
          row += "?"
        }
      }
      console.log(row)
    }
  }
  moveNorth() {
    this.state.chamber.moveNorth()
    this.setState({ chamber: this.state.chamber })
  }
  moveSouth() {
    this.state.chamber.moveSouth()
    this.setState({ chamber: this.state.chamber })
  }
  moveEast() {
    this.state.chamber.moveEast()
    this.setState({ chamber: this.state.chamber })
  }
  moveWest() {
    this.state.chamber.moveWest()
    this.setState({ chamber: this.state.chamber })
  }

  renderMaze() {
    const maze = this.state.chamber.map
    const board = []
    for (let i = 0; i < maze.length; i++) {
      const row = []
      for (let j = 0; j < maze[i].length; j++) {
        const cell = maze[i][j]
        if (cell.length === 0) {
          row.push(<Box key={j} bg="gray.300" w="20px" h="20px" />)
        } else if (cell.includes("wall")) {
          row.push(<Box key={j} bg="yellow.900" w="20px" h="20px" />)
        } else if (cell.includes("hero")) {
          row.push(<Box key={j} bg="blue.300" w="20px" h="20px" />)
        } else if (cell.includes("door")) {
          row.push(<Box key={j} bg="green.300" w="20px" h="20px" />)
        } else {
          row.push(<Box key={j} bg="red.300" w="20px" h="20px" />)
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
    }
  }

  render() {
    return (
      <Box onKeyDown={this.handleKeyPress} tabIndex="0">
        {this.renderMaze()}
      </Box>
    )
  }
}
