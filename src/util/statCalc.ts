export const calcLevel = (exp: number) => {
  const level = Math.floor(exp / 100) + 1;
  return level;
};

export const calcRemainderExp = (exp: number) => {
  if (exp < 100) {
    return exp;
  }
  const result = exp % 100;
  return result;
};
