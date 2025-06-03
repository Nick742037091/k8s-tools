export const listToMap = <T>(list: T[], key: keyof T, extractKey?: keyof T) => {
  if (!list) return {}
  if (!key) return {}
  return list.reduce((map, item: T) => {
    if (item[key] || item[key] === 0) {
      if (extractKey) {
        map[item[key]] = item[extractKey]
      } else {
        map[item[key]] = item
      }
    }
    return map
  }, {} as any)
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
