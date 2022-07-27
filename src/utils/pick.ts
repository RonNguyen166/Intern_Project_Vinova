export default (object: any, keys: string[]) => {
  return keys.reduce((obj: any, key: string) => {
    if (object && object.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
