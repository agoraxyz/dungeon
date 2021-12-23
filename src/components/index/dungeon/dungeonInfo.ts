import * as schema from "contract-logic/schema"

export const combatLogs = (log: schema.CombatLog[]): string => {
  const res = JSON.stringify(log, null, 2)
  return res
}

export const action = (info: schema.Action): string => {
  const res = JSON.stringify(info, null, 2)
  return res
}

export const hero = (info: schema.Hero): string => {
  const res = JSON.stringify(info, null, 2)
  return res
}

export const combatLogsInList = (log: schema.CombatLog[]): string[] => {
  const res = log.map(
    (l) => `attacker hp:${l.attackerHp} - defender hp:${l.defenderHp}`
  )
  return res
}

export const actionInfoInList = (info: schema.Action): string[] => {
  const res = []
  if (info.actionAttack) {
    const stack = info.actionAttack.unnamed_0
    res.push(stack.creature.enum)
    res.push(...statsToList(stack.stats))
    res.push(`healthpool: ${stack.healthPool}`)
    res.push(`stack size: ${stack.stackSize}`)
    res.push(`dmg type: ${stack.damageType.enum}`)
    if (stack.guarded) {
      res.push(`guards: ${stack.guarded.enum}`)
    }
  } else if (info.actionInteract) {
    res.push(...formatObject(info.actionInteract.unnamed_0))
  } else if (info.actionLadder) {
    res.push("ladder")
  }
  return res
}

export const heroInList = (info: schema.Hero): string[] => {
  const res = []
  res.push(`hitpoints: ${info.hitpoints}`)
  res.push(`xp: ${info.xp}`)
  res.push(...statsToList(info.stats))
  if (info.equipment) {
    res.push(`equipment: ${info.equipment.id}`)
  } else {
    res.push("no items equipped")
  }
  return res
}

const statsToList = (stats: schema.Stats): string[] => {
  const res = []
  res.push("stats:")
  res.push("core:")
  res.push(...Object.entries(stats.core).map(([k, v]) => formatStat(k, v)))
  res.push(formatStat("att", stats.att))
  res.push(formatStat("ac", stats.ac))
  res.push(formatStat("size", stats.size))
  res.push(`hp: ${stats.hp}`)
  res.push(`xp: ${stats.xp}`)
  return res
}

const formatObject = (obj: schema.DungeonObject): string[] => {
  const res = []
  res.push(`${obj.enum}`)
  if (obj.dungeonObjectArtifact) {
    res.push(`artifact: ${obj.dungeonObjectArtifact.unnamed_0.id}`)
  } else if (obj.dungeonObjectExtraHealth) {
    res.push(`extra health: ${obj.dungeonObjectExtraHealth.unnamed_0}`)
  }
  return res
}

const formatStat = (name: string, stat: schema.Stat): string =>
  `${name}: ${stat.base} +${stat.modifier}`
