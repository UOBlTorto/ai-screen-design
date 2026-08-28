export function debounce(fn, ms) {
  let time
  return function (this, ...args) {
    const ctx = this
    clearTimeout(time)
    time = setTimeout(() => fn.apply(this, args), ms)
  }
}

/**
 * 属性面板设计辅助方法
 */

/**
 *
 * @param target obj:{a:'123'}
 * @param key obj.a
 */
export function getValue(target, key) {
  const keys = key.split('.')
  while (keys.length) {
    const prop = keys.shift()
    target = target[prop]
  }
  return target
}
/**
 *
 */
export function setValue(target, key, val) {
  const keys = key.split('.')
  const lastKey = keys.pop()
  while (keys.length) {
    target = target[keys.shift()]
  }
  target[lastKey] = val
}

export function deepClone<T>(value: T): T {
  if (typeof value !== 'object' || value === null) return
  return JSON.parse(JSON.stringify(value))
}
