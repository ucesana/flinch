export const serialise = <T>(obj: T): string | null => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error(e);
  }
  return null;
};
