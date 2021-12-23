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
