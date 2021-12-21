import seedrandom from "seedrandom"
import Chamber from "./Chamber2"
import * as types from "./types"

const dummyThings: types.DungeonThing[] = [
  {
    type: "dungeonObj",
    artifact: { att: 1, def: 1, dmg: { min: 1, max: 1 } },
    extraHealth: 1,
  },
  {
    type: "guarded",
    passage: true,
    guard: {
      type: "creature",
      kind: types.CreatureType.Medusa,
      attr: {
        attack: 1,
        defense: 1,
        hitpoints: 1,
        damage: { min: 1, max: 1 },
      },
      health: 1,
      size: 1,
    },
  },
  {
    type: "creature",
    kind: types.CreatureType.Skeleton,
    attr: {
      attack: 1,
      defense: 1,
      hitpoints: 1,
      damage: { min: 1, max: 1 },
    },
    health: 1,
    size: 1,
  },
]

// TODO place stuff in addChamber
// TODO place guarded with passage in generated passage
// TODO place other guardeds in a carved out box

export type Map = string[][][]

export type Passage = [direction: string, row: number, col: number]

type Coords = [row: number, col: number]

type ChamberParams = {
  startRow: number
  startCol: number
  passages: Passage[]
}

type ThingOnMap = {
  index: number
  name: string
  row: number
  col: number
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
  private heroCoords: Coords
  private entranceCoords: Coords
  private thingsOnMap: ThingOnMap[] = []
  private dungeonThings: types.DungeonThing[] = []

  constructor() {
    this.rand = seedrandom("hello")
    this.rows = 100
    this.cols = 30
    this.makeMap()
    this.chambers = []

    // this.createFirstChamber()
    this.addChamber(dummyThings)
    // this.addChamber()
    // this.addChamber()
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
    const [r, c] = this.heroCoords

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
    this.heroCoords = [tr, tc]
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

  private addChamber(things: types.DungeonThing[] = []) {
    const passages: Passage[] = []
    let startRow: number, startCol: number
    const isFirstChamber = this.chambers.length === 0
    if (isFirstChamber) {
      startRow = 0
      startCol = 0
    } else {
      const chamberParams = this.chambers[this.chambers.length - 1]
      const passageNum = chamberParams.passages.length - 1
      const reversedPassage = this.getReversePassage(
        chamberParams.passages[passageNum]
      )
      passages.push(reversedPassage)
      const [row, col] = this.findSpace(chamberParams, passageNum)
      startRow = row
      startCol = col
    }

    if (this.guardsPassage(things)) {
      const nextPassage: Passage = ["south", 13, this.getRandom(0, C_COLS - 1)]
      passages.push(nextPassage)
    }

    // TODO error when seed is without + 1
    const seed = JSON.stringify(passages) + (this.chambers.length + 1).toString()
    const chamber = new Chamber(C_INIT_HEIGHT, C_INIT_WIDTH, C_SCALE, passages, seed)
    for (let i = 0; i < chamber.getRows(); i++) {
      for (let j = 0; j < chamber.getCols(); j++) {
        const chamberCell = chamber.map[i][j]
        this._map[startRow + i][startCol + j] = [...chamberCell]
      }
    }
    this.chambers.push({
      startRow,
      startCol,
      passages: [...passages],
    })

    if (isFirstChamber) {
      this.placeEntranceAndHero(startRow, startCol, C_ROWS, C_COLS)
    }
  }

  private getReversePassage(passage: Passage): Passage {
    switch (passage[0]) {
      case "north":
        return ["south", C_ROWS - 1, passage[2]]
      case "south":
        return ["north", 0, passage[2]]
      case "east":
        return ["west", passage[1], 0]
      case "west":
        return ["east", passage[1], C_COLS - 1]
    }
  }

  private findSpace(chamber: ChamberParams, passageNum: number) {
    const minSpace = 0
    const [direction, row, col] = chamber.passages[passageNum]
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

  private placeEntranceAndHero(
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
      if (cell.length === 0 && this.checkNeighborsEmpty(row, col)) {
        cell.push("hero")
        this._map[row - 1][col].push("entrance")
        this.heroCoords = [row, col]
        this.entranceCoords = [row - 1, col]
        break
      }
      if (count > 100) {
        throw Error("Could not place hero")
      }
    }
  }

  private checkNeighborsEmpty(row: number, col: number) {
    const nw = this._map[row - 1][col - 1].length === 0
    const n = this._map[row - 1][col].length === 0
    const ne = this._map[row - 1][col + 1].length === 0
    const w = this._map[row][col - 1].length === 0
    const e = this._map[row][col + 1].length === 0
    const sw = this._map[row + 1][col - 1].length === 0
    const s = this._map[row + 1][col].length === 0
    const se = this._map[row + 1][col + 1].length === 0
    return nw && n && ne && w && e && sw && s && se
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

  private guardsPassage(things: types.DungeonThing[]) {
    for (const thing of things) {
      if (thing.type === "guarded" && thing.passage) {
        return true
      }
    }
    return false
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
