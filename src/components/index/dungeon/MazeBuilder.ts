// Original JavaScript code by Chirp Internet: chirpinternet.eu
// Please acknowledge use of this code by including this header.
import seedrandom from "seedrandom"

export type Map = string[][][]

export default class MazeBuilder {
  private width: number
  private height: number
  private cols: number
  private rows: number
  private random: any

  private _map: Map

  constructor(width: number, height: number, seed: string) {
    this.width = width
    this.height = height
    this.random = seedrandom(seed)

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

      if (r == 0) {
        // place exit in top row
        let doorPos = this.posToSpace(this.rand(1, this.width))
        this._map[r][doorPos] = ["door", "exit"]
      }

      if (r == this.rows - 1) {
        // place entrance in bottom row
        let doorPos = this.posToSpace(this.rand(1, this.width))
        this._map[r][doorPos] = ["door", "entrance", "hero"]
      }
    })

    // start partitioning
    this.partition(1, this.height - 1, 1, this.width - 1)
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

  private find(item: string): [number, number] {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this._map[r][c].includes(item)) {
          return [r, c]
        }
      }
    }
    return [-1, -1]
  }
}
