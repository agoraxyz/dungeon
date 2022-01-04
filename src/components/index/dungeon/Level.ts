import * as schema from "contract-logic/schema"
import seedrandom from "seedrandom"
import Chamber from "./Chamber"

const dummyThings: DungeonThing[] = [
  {
    id: 0,
    type: "dungeonObj",
    kind: "asd",
  },
  {
    id: 1,
    type: "guarded",
    passage: true,
    guard: {
      id: 1,
      type: "creature",
      kind: "skeleton",
    },
  },
  {
    id: 2,
    type: "creature",
    kind: "skeleton",
  },
  {
    id: 3,
    type: "guarded",
    ladder: true,
    guard: {
      id: 3,
      type: "creature",
      kind: "skeleton",
    },
  },
]

export type Map = string[][][]

export type Passage = [direction: string, row: number, col: number]

type Coords = [row: number, col: number]

type ChamberParams = {
  startRow: number
  startCol: number
  passages: Passage[]
}

type ThingOnMap = {
  id: number
  name: string
  row: number
  col: number
}

type DungeonThing = DungeonObj | Creature | Guarded

type DungeonObj = {
  id: number
  type: "dungeonObj"
  kind: string
}

type Guarded = {
  id: number
  type: "guarded"
  chamberObj?: DungeonObj
  passage?: boolean
  ladder?: boolean
  guard: Creature
}

type Creature = {
  id: number
  type: "creature"
  kind: string
}

const dungeonStateToThings = (state: schema.DungeonState): DungeonThing[] => {
  const asd: DungeonThing[] = []
  state.actionSpace.forEach((action, id) => {
    if (action.actionLadder) {
      asd.push({
        id,
        type: "dungeonObj",
        kind: "ladder",
      })
    } else if (action.actionInteract) {
      asd.push({
        id,
        type: "dungeonObj",
        kind: action.actionInteract.unnamed_0.enum,
      })
    } else if (action.actionAttack) {
      const creature = action.actionAttack.unnamed_0
      const guard: Creature = {
        id: id,
        type: "creature",
        kind: creature.creature.enum,
      }
      if (creature.guarded) {
        const guarded = creature.guarded
        if (guarded.guardedLadder) {
          const chamberObj: DungeonObj = {
            id: id,
            type: "dungeonObj",
            kind: "ladder",
          }
          asd.push({
            id,
            type: "guarded",
            guard,
            chamberObj,
          })
        } else if (guarded.guardedObj) {
          const chamberObj: DungeonObj = {
            id: id,
            type: "dungeonObj",
            kind: guarded.guardedObj.unnamed_0.enum,
          }
          asd.push({
            id,
            type: "guarded",
            guard,
            chamberObj,
          })
        } else if (guarded.guardedPassage) {
          asd.push({
            id,
            type: "guarded",
            guard,
            passage: true,
          })
        }
      }
    }
  })
  return asd
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
  private dungeonThings: DungeonThing[] = []

  constructor() {
    this.rand = seedrandom("hello")
    this.rows = 100
    this.cols = 30
    this.makeMap()
    this.chambers = []

    // this.createFirstChamber()
    // this.addChamber(dummyThings)
    // this.addChamber(dummyThings)
    // this.addChamber(dummyThings)
    // this.addChamber(dummyThings)

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

  public interact() {
    console.log("interact")
    const coords = this.getNearbyThingCoords()
    if (!coords) return
    const thingIndex = this.getThingIdByCoords(coords)
    if (thingIndex === -1) return

    const thingOnMap = this.thingsOnMap[thingIndex]
    const thing = this.dungeonThings[thingIndex]
    if (thing.type === "creature") {
      console.log("creature")
    } else if (thing.type === "dungeonObj") {
      console.log("dungeonObj")
    } else if (thing.type === "guarded") {
      console.log("guarded")
      console.log("thing", thing)
      if (!thing.passage) return
      this.addChamber(dummyThings)
      this.thingsOnMap.splice(thingIndex, 1)
      this.dungeonThings.splice(thingIndex, 1)
      this._map[thingOnMap.row][thingOnMap.col] = []
    }
    console.log(coords, thingIndex)
  }

  public getNearbyActionIndex(): number | undefined {
    console.log("getNearbyActionIndex")
    const coords = this.getNearbyThingCoords()
    console.log("coords", coords)
    if (!coords) return undefined
    const thingIndex = this.getThingIdByCoords(coords)
    console.log("thingIndex", thingIndex)
    if (thingIndex === -1) return undefined
    return thingIndex
  }

  public updateMap(state: schema.DungeonState) {
    console.log("updating map")
    const newThings = dungeonStateToThings(state)
    if (this.dungeonThings.length === 0) {
      this.addChamber(newThings)
      return
    }
    // loop through schema dungeon state actions
    // if id found in existing things, remove from newThings,
    // and remove from map

    // put call addChamber with remaining newThings
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
    console.log("hero coords", ...this.heroCoords)
  }

  private makeMap() {
    for (let i = 0; i < this.rows; i++) {
      this._map[i] = []
      for (let j = 0; j < this.cols; j++) {
        this._map[i][j] = ["wall"]
      }
    }
  }

  private addChamber(things: DungeonThing[] = []) {
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

    let nextPassageCoords: Coords | undefined = undefined
    if (this.guardsPassage(things)) {
      const [row, col] = [C_ROWS - 1, this.getRandom(1, C_COLS - 1)]
      const nextPassage: Passage = ["south", row, col]
      nextPassageCoords = [row, col]
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

    this.addThings(things, startRow, startCol, nextPassageCoords)
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

  private addThings(
    things: DungeonThing[],
    startRow: number,
    startCol: number,
    nextPassageCoords?: Coords
  ) {
    const _things: DungeonThing[] = JSON.parse(JSON.stringify(things))

    // add the passage guard first because it has to have a fixed location
    if (nextPassageCoords) {
      const guardIndex = _things.findIndex((t) => t.type === "guarded" && t.passage)
      this.dungeonThings.push(_things[guardIndex])
      const [row, col] = nextPassageCoords
      this._map[row + startRow][col + startCol].push("creature")
      this.thingsOnMap.push({
        id: _things[guardIndex].id,
        row: row + startRow,
        col: col + startCol,
        name: "creature",
      })
      _things.splice(guardIndex, 1)
    }

    for (const thing of _things) {
      if (thing.type === "dungeonObj" || thing.type === "creature") {
        let count = 0
        while (true) {
          count += 1
          if (count > 2000) throw Error("Could not place dungeon object")
          const row = this.getRandom(startRow, startRow + C_ROWS)
          const col = this.getRandom(startCol, startCol + C_COLS)
          if (!this.checkNothingNearby(row, col)) continue

          // TODO rename objects and creatures to their type
          const name = thing.type === "dungeonObj" ? "obj" : "creature"
          this._map[row][col].push(name)
          this.thingsOnMap.push({
            id: thing.id,
            row,
            col,
            name,
          })
          this.dungeonThings.push(thing)
          break
        }
      } else if (thing.type === "guarded") {
        let count = 0
        while (true) {
          count += 1
          if (count > 200) throw Error("Could not place dungeon object")
          const row = this.getRandom(startRow, startRow + C_ROWS)
          const col = this.getRandom(startCol, startCol + C_COLS)
          const wallCoords = this.getWallCordsIfNextToWall(row, col)
          if (!wallCoords) continue
          if (!this.checkNothingNearby(row, col)) continue

          const [wallRow, wallCol] = wallCoords
          const wall = this._map[wallRow][wallCol]
          const guardedName = thing.ladder ? "ladder" : "obj"

          // first add the creature guarding the stuff
          const cell = this._map[row][col]
          cell.push("creature")
          this.thingsOnMap.push({
            id: thing.id,
            row,
            col,
            name: "creature",
          })
          this.dungeonThings.push(thing)

          // then carve out the wall and add stuff
          wall.pop()
          wall.push(guardedName)
          this.thingsOnMap.push({
            id: thing.id,
            row: wallRow,
            col: wallCol,
            name: guardedName,
          })
          this.dungeonThings.push(thing)
          break
        }
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

  private checkNothingNearby(row: number, col: number) {
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        if (!this._map[row + i] || !this._map[row + i][col + j]) {
          continue
        }
        if (i === 0 && j === 0 && this._map[row + i][col + j].length !== 0) {
          return false
        }
        if (
          this._map[row + i][col + j].length !== 0 &&
          !this._map[row + i][col + j].includes("wall")
        ) {
          return false
        }
      }
    }
    return true
  }

  private getNearbyThingCoords(): Coords | undefined {
    const [row, col] = this.heroCoords
    const neighbours = [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ]
    for (const [i, j] of neighbours) {
      if (
        this._map[row + i][col + j].length !== 0 &&
        !this._map[row + i][col + j].includes("wall")
      ) {
        return [row + i, col + j]
      }
    }
  }

  private getThingIdByCoords(coords: Coords): number {
    const [row, col] = coords
    const thing = this.thingsOnMap.find((val) => val.row === row && val.col === col)
    return thing.id
  }

  private getWallCordsIfNextToWall(row: number, col: number) {
    if (
      !this._map[row] ||
      !this._map[row][col] ||
      this._map[row][col].length !== 0
    ) {
      return undefined
    }
    const nw = this._map[row - 1][col - 1].includes("wall")
    const n = this._map[row - 1][col].includes("wall")
    const ne = this._map[row - 1][col + 1].includes("wall")
    const w = this._map[row][col - 1].includes("wall")
    const e = this._map[row][col + 1].includes("wall")
    const sw = this._map[row + 1][col - 1].includes("wall")
    const s = this._map[row + 1][col].includes("wall")
    const se = this._map[row + 1][col + 1].includes("wall")
    if (nw && n && ne) {
      return [row - 1, col]
    } else if (nw && w && sw) {
      return [row, col - 1]
    } else if (ne && e && se) {
      return [row, col + 1]
    } else if (sw && s && se) {
      return [row + 1, col]
    } else {
      return undefined
    }
  }

  private guardsPassage(things: DungeonThing[]) {
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
