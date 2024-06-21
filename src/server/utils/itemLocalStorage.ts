export function getItemLocalStorage(itemName: string) {
  return localStorage.getItem(itemName);
}

export function setItemLocalStorage(itemName: string, item: string) {
  localStorage.setItem(itemName, item);
}

export function removeItemLocalStorage(itemName: string) {
  localStorage.removeItem(itemName);
}

export function checkLocalStorageOrSetItem(itemName: string, item: string) {
  if (getItemLocalStorage(itemName) === null) {
    setItemLocalStorage(itemName, item);
    return item;
  } else {
    return getItemLocalStorage(itemName);
  }
}
