import { TypeAndNameOptions } from "./TypeNameSelector";

export const getOptions = (
  objectsForOptions: Array<Object>,
  typeField: string,
  nameField: string,
  idField: string,
): TypeAndNameOptions => {
  if (objectsForOptions === undefined || objectsForOptions.length === 0)
    return undefined;
  let nameOptionsByType = {};
  for (let object of objectsForOptions) {
    if (nameOptionsByType[object[typeField]] === undefined) {
      nameOptionsByType[object[typeField]] = [
        { id: object[idField], value: object[nameField] },
      ];
    } else {
      nameOptionsByType[object[typeField]].push({
        id: object[idField],
        value: object[nameField],
      });
    }
  }
  const typeOptions = Object.keys(nameOptionsByType).map((key) => {
    return { id: key, value: key };
  });
  return { nameOptionsByType, typeOptions };
};
