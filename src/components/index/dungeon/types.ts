export enum CreatureType {
  Skeleton = 1,
  Zombie = 2,
  Mummy = 3,
  Orc = 4,
  Goblin = 5,
  Dwarf = 6,
  Centaur = 7,
  Griffin = 8,
  Elf = 9,
  Genie = 10,
  Medusa = 11,
  Troll = 12,
  Werewolf = 13,
  Sphinx = 14,
  Unicorn = 15,
  Ogre = 16,
  Basilisk = 17,
  Wyvern = 18,
  Cyclops = 19,
  Dragon = 20,
}

export type Item = {
  name: string
}

export type CreatureAttributes = {
  attack: number
  defense: number
  hitpoints: number
  damage: Damage
}

export type Damage = {
  min: number
  max: number
}

export type Creature = {
  type: CreatureType
  attr: CreatureAttributes
  health: number
  size: number
}

export type HeroAttributes = {
  attack: number
  defense: number
  hitpoints: number
}

export type Hero = {
  attr: HeroAttributes
  name: string
  isAlive: boolean
  xp: number
}

export type Thing = {
  creature?: Creature
  item?: Item
  path?: boolean
}
