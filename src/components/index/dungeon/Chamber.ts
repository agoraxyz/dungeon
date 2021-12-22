// Original JavaScript code by Chirp Internet: chirpinternet.eu
// Please acknowledge use of this code by including this header.
import seedrandom from "seedrandom"

export type Map = string[][][]
export type loc = [row: number, col: number]
export type Path = [direction: string, row: number, col: number]

export default class Chamber {
  private width: number
  private height: number
  private cols: number
  private rows: number
  private random: any
  private _paths: Path[]

  private _map: Map

  constructor(
    width: number,
    height: number,
    scale: number,
    paths: Path[],
    seed: string
  ) {
    this.width = width
    this.height = height
    this.random = seedrandom(seed)
    this._paths = paths

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
    this.scale(scale)
    this.placePaths()
  }

  public get map() {
    return JSON.parse(JSON.stringify(this._map))
  }

  public get paths() {
    return JSON.parse(JSON.stringify(this._paths))
  }

  public getRows() {
    return this._map.length
  }

  public getCols() {
    return this._map[0].length
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

  private placePaths() {
    for (const path of this._paths) {
      this.carvePath(path)
    }
  }

  private carvePath(path: Path) {
    const [direction, _row, _col] = path
    let nextRow, nextCol, row, col
    switch (direction) {
      case "north":
        nextRow = 1
        nextCol = 0
        row = 0
        col = _col
        break
      case "south":
        nextRow = -1
        nextCol = 0
        row = this._map.length - 1
        col = _col
        break
      case "west":
        nextRow = 0
        nextCol = 1
        row = _row
        col = 0
        break
      case "east":
        nextRow = 0
        nextCol = -1
        row = _row
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
