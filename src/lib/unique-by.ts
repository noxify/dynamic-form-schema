/**
 * Returns a new array with unique elements from the input array.
 *
 * For primitive arrays, simply call uniqueBy(array).
 * For arrays of objects, provide a callback to extract the unique key: uniqueBy(array, obj => obj.key).
 *
 * @template T - The type of array elements.
 * @template U - The type of the unique key (defaults to T for primitives).
 * @param {T[]} arr - The input array to deduplicate.
 * @param {(item: T) => U} [getKey] - Optional callback to extract the unique key from each item.
 * @returns {T[]} A new array containing only the first occurrence of each unique value/key.
 *
 * @example
 * // Primitives:
 * uniqueBy([1, 2, 2, 3]) // [1, 2, 3]
 *
 * // Objects:
 * uniqueBy([{id: 1}, {id: 2}, {id: 1}], obj => obj.id) // [{id: 1}, {id: 2}]
 */
export function uniqueBy<T, U = T>(arr: T[], getKey?: (item: T) => U): T[] {
  const seen = new Set<U | T>()
  const result: T[] = []
  for (const item of arr) {
    const key = getKey ? getKey(item) : (item as unknown as U)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  return result
}
