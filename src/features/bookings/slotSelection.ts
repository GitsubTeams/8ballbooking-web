export function toggleSlotSelection(selected: number[], index: number): number[] {
  if (selected.length === 0) {
    return [index]
  }

  const min = Math.min(...selected)
  const max = Math.max(...selected)

  if (index >= min && index <= max) {
    return selected.filter((item) => item !== index)
  }

  if (index === min - 1 || index === max + 1) {
    return [...selected, index].sort((a, b) => a - b)
  }

  return [index]
}
