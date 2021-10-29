function applyToList(f, list) {
  return list.length === 0
    ? list
    : [f(list[0]), ...applyToList(f, list.slice(1))]
}
