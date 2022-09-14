interface Countable {
  count: number
}

export function sortByCount(left: Countable, right: Countable): number {
  return right.count - left.count
}
