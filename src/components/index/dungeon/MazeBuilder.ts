// Original JavaScript code by Chirp Internet: chirpinternet.eu
// Please acknowledge use of this code by including this header.
import seedrandom from "seedrandom"
import * as types from "./types"

export type Map = string[][][]
export type loc = [row: number, col: number]
export type Path = [direction: string, place: number]

export default class MazeBuilder {
  private width: number
  private height: number
  private cols: number
  private rows: number
  private random: any
  private things: types.Thing[]
  private paths: Path[]

  private _map: Map

  constructor(width: number, height: number, things: types.Thing[], paths: Path[]) {
    this.width = width
    this.height = height
    this.random = seedrandom("asd")
    this.things = things
    this.paths = paths

    this.cols = 2 * this.width + 1
    this.rows = 2 * this.height + 1

    this._map = this.initArray([])

    // place initial walls
    this._map.forEach((row, r) => {
      row.forEach((cell, c) => {
        switch (r) {
          case 0:
          case this.rows - 1:
            this._map[r][c] = ["wall"]
            break

          default:
            if (r % 2 == 1) {
              if (c == 0 || c == this.cols - 1) {
                this._map[r][c] = ["wall"]
              }
            } else if (c % 2 == 0) {
              this._map[r][c] = ["wall"]
            }
        }
      })
    })

    // start partitioning
    this.partition(1, this.height - 1, 1, this.width - 1)
    this.scale(3)
    this.placeLadderAndHero()
    this.placeThings()
    this.placePaths()
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

  private initArray(value: string[]) {
    return new Array(this.rows)
      .fill(null)
      .map(() => new Array(this.cols).fill(value))
  }

  private rand(min: number, max: number) {
    return min + Math.floor(this.random() * (1 + max - min))
  }

  private posToSpace(x: number) {
    return 2 * (x - 1) + 1
  }

  private posToWall(x: number) {
    return 2 * x
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

  private shuffle(array: boolean[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  private partition(r1: number, r2: number, c1: number, c2: number) {
    // create partition walls
    // ref: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method

    let horiz, vert, x, y, start, end

    if (r2 < r1 || c2 < c1) {
      return false
    }

    if (r1 == r2) {
      horiz = r1
    } else {
      x = r1 + 1
      y = r2 - 1
      start = Math.round(x + (y - x) / 4)
      end = Math.round(x + (3 * (y - x)) / 4)
      horiz = this.rand(start, end)
    }

    if (c1 == c2) {
      vert = c1
    } else {
      x = c1 + 1
      y = c2 - 1
      start = Math.round(x + (y - x) / 3)
      end = Math.round(x + (2 * (y - x)) / 3)
      vert = this.rand(start, end)
    }

    for (let i = this.posToWall(r1) - 1; i <= this.posToWall(r2) + 1; i++) {
      for (let j = this.posToWall(c1) - 1; j <= this.posToWall(c2) + 1; j++) {
        if (i == this.posToWall(horiz) || j == this.posToWall(vert)) {
          this._map[i][j] = ["wall"]
        }
      }
    }

    const gaps = this.shuffle([true, true, true, false])

    // create gaps in partition walls

    if (gaps[0]) {
      const gapPosition = this.rand(c1, vert)
      this._map[this.posToWall(horiz)][this.posToSpace(gapPosition)] = []
    }

    if (gaps[1]) {
      const gapPosition = this.rand(vert + 1, c2 + 1)
      this._map[this.posToWall(horiz)][this.posToSpace(gapPosition)] = []
    }

    if (gaps[2]) {
      const gapPosition = this.rand(r1, horiz)
      this._map[this.posToSpace(gapPosition)][this.posToWall(vert)] = []
    }

    if (gaps[3]) {
      const gapPosition = this.rand(horiz + 1, r2 + 1)
      this._map[this.posToSpace(gapPosition)][this.posToWall(vert)] = []
    }

    // recursively partition newly created chambers

    this.partition(r1, horiz - 1, c1, vert - 1)
    this.partition(horiz + 1, r2, c1, vert - 1)
    this.partition(r1, horiz - 1, vert + 1, c2)
    this.partition(horiz + 1, r2, vert + 1, c2)
  }

  private scale(times = 2) {
    const _map = []
    for (let i = 0; i < this.rows; i++) {
      const row = []
      for (let j = 0; j < this.cols; j++) {
        row.push(JSON.parse(JSON.stringify(this._map[i][j])))
        if (j !== 0 && j !== this.cols - 1) {
          for (let k = 1; k < times; k++) {
            row.push(JSON.parse(JSON.stringify(this._map[i][j])))
          }
        }
      }
      _map.push(JSON.parse(JSON.stringify(row)))
      if (i !== 0 && i !== this.rows - 1) {
        for (let k = 1; k < times; k++) {
          _map.push(JSON.parse(JSON.stringify(row)))
        }
      }
    }
    this._map = _map
  }

  private placeLadderAndHero() {
    while (true) {
      const row = this.rand(0, Math.floor(this._map.length - 1))
      const col = this.rand(0, Math.floor(this._map[0].length - 1))
      const cell = this._map[row][col]
      if (!cell.includes("wall")) {
        cell.push("ladder")
        cell.push("hero")
        break
      }
    }
  }

  private placeThings() {
    for (const thing of this.things) {
      let row: number, col: number
      if (thing.path) {
        ;[row, col] = this.getRandomEdge("north")
        this._map[row][col].splice(this._map[row][col].indexOf("wall"), 1)
      } else {
        ;[row, col] = this.getRandomCorner()
      }
      this._map[row][col].push("thing")
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

  private getRandomEdge(direction: string) {
    while (true) {
      let row, col, nextRow, nextCol
      if (direction === "north") {
        row = 0
        col = this.rand(0, this._map[0].length - 1)
        nextRow = 1
        nextCol = col
      } else if (direction === "south") {
        row = this.rows - 1
        col = this.rand(0, this._map[0].length - 1)
        nextRow = row - 1
        nextCol = col
      } else if (direction === "west") {
        row = this.rand(0, this._map.length - 1)
        col = 0
        nextRow = row
        nextCol = 1
      } else if (direction === "east") {
        row = this.rand(0, this._map.length - 1)
        col = this.cols - 1
        nextRow = row
        nextCol = col - 1
      }
      if (
        this._map[row][col].includes("wall") &&
        !this._map[nextRow][nextCol].includes("wall")
      ) {
        return [row, col]
      }
    }
  }

  private placePaths() {
    for (const path of this.paths) {
      this.carvePath(path)
    }
  }

  private carvePath(path: Path) {
    const [direction, place] = path
    let nextRow, nextCol, row, col
    switch (direction) {
      case "north":
        nextRow = 1
        nextCol = 0
        row = 0
        col = place
        break
      case "south":
        nextRow = -1
        nextCol = 0
        row = this._map.length - 1
        col = place
        break
      case "west":
        nextRow = 0
        nextCol = 1
        row = place
        col = 0
        break
      case "east":
        nextRow = 0
        nextCol = -1
        row = place
        col = this._map[0].length - 1
        break
      default:
        break
    }
    let cell = this._map[row][col]
    cell.splice(cell.indexOf("wall"), 1)
    while (true) {
      cell = this._map[row + nextRow][col + nextCol]
      if (!cell.includes("wall")) {
        break
      }
      cell.splice(cell.indexOf("wall"), 1)
      row += nextRow
      col += nextCol
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
}
