export function objectId(value: string, helpers: any) {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
}
export function capitalize(value: string, helpers: any) {
  return value.replace(/\b\w/g, (l) => l.toUpperCase());
}

export function password(value: string, helpers: any) {
  if (value.length < 6) {
    return helpers.message("password must be at least 6 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter or 1 number"
    );
  }
  return value;
}
