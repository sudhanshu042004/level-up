"use server";
export const expRequired = async (level: number) => {
  const exp = level * 200;
  return exp;
}
