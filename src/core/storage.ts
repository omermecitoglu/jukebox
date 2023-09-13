export function getSetValues(keyName: string) {
  const item = localStorage.getItem(keyName);
  return item ? item.split(",") : [];
}

export function addSetValue(keyName: string, value: string) {
  const currentValues = getSetValues(keyName);
  const set = new Set([...currentValues, value]);
  set.add(value);
  localStorage.setItem(keyName, Array.from(set).join(","));
}

export function removeSetValue(keyName: string, value: string) {
  const currentValues = getSetValues(keyName);
  const newValues = currentValues.filter(v => v !== value);
  if (newValues.length) {
    localStorage.setItem(keyName, newValues.join(","));
  } else {
    localStorage.removeItem(keyName);
  }
}
