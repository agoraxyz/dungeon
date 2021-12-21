import seedrandom from "seedrandom"
import Chamber from "./Chamber2"

export type Map = string[][][]

export type Path = [direction: string, row: number, col: number]

type ChamberParams = {
  startRow: number
  startCol: number
  paths: Path[]
}

const C_INIT_HEIGHT = 3
const C_INIT_WIDTH = 3
const C_SCALE = 4
const C_ROWS = (C_INIT_HEIGHT * 2 + 1) * C_SCALE - 2 * C_SCALE + 2
const C_COLS = (C_INIT_WIDTH * 2 + 1) * C_SCALE - 2 * C_SCALE + 2

export default class Level {
  private rand: any
  private rows: number
  private cols: number
  private chambers: ChamberParams[] = []
  private _map: Map = []

  constructor() {
    this.rand = seedrandom("hello")
    this.rows = 100
    this.cols = 30
    this.makeMap()
    this.chambers = []

    this.createFirstChamber()
    this.addChamber(this.chambers[0])
    this.addChamber(this.chambers[1])
    this.addChamber(this.chambers[2])
  }

  public get map() {
    return JSON.parse(JSON.stringify(this._map))
  }

  public moveNorth() {
    this.move("north")
  }

  public moveSouth() {
    this.move("south")
  }

  public moveWest() {
    this.move("west")
  }

  public moveEast() {
    this.move("east")
  }

  private move(direction: string) {
    const [r, c] = this.find("hero")

    let tr: number, tc: number
    switch (direction) {
      case "north":
        tr = r - 1
        tc = c
        break
      case "south":
        tr = r + 1
        tc = c
        break
      case "west":
        tr = r
        tc = c - 1
        break
      case "east":
        tr = r
        tc = c + 1
        break
      default:
        tr = r
        tc = c
    }
    if (!this.inBounds(tr, tc)) {
      return
    }
    const _map = this.map
    const locationCell = _map[r][c]
    const targetCell = _map[tr][tc]
    if (targetCell.includes("wall")) {
      return
    }
    locationCell.splice(locationCell.indexOf("hero"), 1)
    targetCell.push("hero")
    this._map = _map
  }

  private makeMap() {
    for (let i = 0; i < this.rows; i++) {
      this._map[i] = []
      for (let j = 0; j < this.cols; j++) {
        this._map[i][j] = ["wall"]
      }
    }
  }

  private createFirstChamber() {
    const chamber = new Chamber(
      C_INIT_HEIGHT,
      C_INIT_WIDTH,
      C_SCALE,
      [["south", 13, 5]],
      "1"
    )

    const fromRow = 0
    const fromCol = 0

    for (let i = 0; i < chamber.getRows(); i++) {
      for (let j = 0; j < chamber.getCols(); j++) {
        const chamberCell = chamber.map[i][j]
        this._map[fromRow + i][fromCol + j] = [...chamberCell]
      }
    }
    this.placeLadderAndHero(fromRow, fromCol, C_ROWS, C_COLS)
    this.chambers.push({
      startRow: fromRow,
      startCol: fromCol,
      paths: chamber.paths,
    })
  }

  private addChamber(chamberParams: ChamberParams) {
    const pathNum = chamberParams.paths.length - 1
    const reversedPath = this.getReversePath(chamberParams.paths[pathNum])
    const nextPath: Path = ["south", 13, this.getRandom(0, C_COLS - 1)]
    const chamber = new Chamber(
      C_INIT_HEIGHT,
      C_INIT_WIDTH,
      C_SCALE,
      [reversedPath, nextPath],
      "2"
    )
    const [startRow, startCol] = this.findSpace(chamberParams, pathNum)

    for (let i = 0; i < chamber.getRows(); i++) {
      for (let j = 0; j < chamber.getCols(); j++) {
        const chamberCell = chamber.map[i][j]
        this._map[startRow + i][startCol + j] = [...chamberCell]
      }
    }
    this.chambers.push({
      startRow,
      startCol,
      paths: [reversedPath, nextPath],
    })
  }

  private getReversePath(path: Path): Path {
    switch (path[0]) {
      case "north":
        return ["south", C_ROWS - 1, path[2]]
      case "south":
        return ["north", 0, path[2]]
      case "east":
        return ["west", path[1], 0]
      case "west":
        return ["east", path[1], C_COLS - 1]
    }
  }

  private findSpace(chamber: ChamberParams, pathNum: number) {
    const minSpace = 0
    const [direction, row, col] = chamber.paths[pathNum]
    let startRow, startCol
    switch (direction) {
      case "north":
        startRow = chamber.startRow - minSpace - C_ROWS
        startCol = chamber.startCol
        break
      case "south":
        startRow = chamber.startRow + minSpace + C_ROWS
        startCol = chamber.startCol
        break
      case "west":
        startRow = chamber.startRow
        startCol = chamber.startCol - minSpace - C_COLS
        break
      case "east":
        startRow = chamber.startRow
        startCol = chamber.startCol - minSpace + C_COLS
        break
    }
    return [startRow, startCol]
  }

  private placeLadderAndHero(
    startRow: number,
    startCol: number,
    rows: number,
    cols: number
  ) {
    let count = 0
    while (true) {
      count += 1
      const row = this.getRandom(startRow, startRow + rows)
      const col = this.getRandom(startCol, startCol + cols)
      const cell = this._map[row][col]
      if (!cell.includes("wall")) {
        cell.push("ladder")
        cell.push("hero")
        break
      }
      if (count > 100) {
        throw Error("Could not place hero")
      }
    }
  }

  private getRandomCorner() {
    while (true) {
      const row = this.rand(0, Math.floor(this._map.length - 1))
      const col = this.rand(0, Math.floor(this._map[0].length - 1))
      const cell = this._map[row][col]
      if (cell.length === 0) {
        let wallCount = 0
        const nw = this._map[row - 1][col - 1]
        const n = this._map[row - 1][col]
        const ne = this._map[row - 1][col + 1]
        const w = this._map[row][col - 1]
        const e = this._map[row][col + 1]
        const sw = this._map[row + 1][col - 1]
        const s = this._map[row + 1][col]
        const se = this._map[row + 1][col + 1]

        if (n.includes("wall") && s.includes("wall")) continue
        if (w.includes("wall") && e.includes("wall")) continue

        if (nw.includes("wall")) wallCount += 1
        if (n.includes("wall")) wallCount += 1
        if (ne.includes("wall")) wallCount += 1
        if (w.includes("wall")) wallCount += 1
        if (e.includes("wall")) wallCount += 1
        if (sw.includes("wall")) wallCount += 1
        if (s.includes("wall")) wallCount += 1
        if (se.includes("wall")) wallCount += 1
        if (wallCount >= 5) {
          return [row, col]
        }
      }
    }
  }

  private find(item: string): [number, number] {
    for (let r = 0; r < this._map.length; r++) {
      for (let c = 0; c < this._map[0].length; c++) {
        if (this._map[r][c].includes(item)) {
          return [r, c]
        }
      }
    }
    return [-1, -1]
  }

  private getRandom(from: number, to: number) {
    return Math.floor(this.rand() * (to - from + 1)) + from
  }

  private inBounds(r: number, c: number) {
    if (
      typeof this._map[r] == "undefined" ||
      typeof this._map[r][c] == "undefined"
    ) {
      return false // out of bounds
    }
    return true
  }
}
