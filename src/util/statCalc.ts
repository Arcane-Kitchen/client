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

// Handle point calc based on goal/actual ratio
export const handlePointCalc = (ratio: number) => {
  if (ratio > 0.9) {
    return 50;
  }
  if (ratio > 0.8) {
    return 45;
  }
  if (ratio > 0.7) {
    return 40;
  }
  if (ratio > 0.6) {
    return 35;
  }
  if (ratio > 0.5) {
    return 30;
  }
  if (ratio > 0.4) {
    return 25;
  }
  if (ratio > 0.3) {
    return 20;
  }
  if (ratio > 0.2) {
    return 15;
  }
  return 10;
};

export const handleRatioCalc = (goal: number, actual: number) => {
  let ratio = goal / actual;
  if (ratio > 1) {
    ratio = 1 / ratio;
  }
  return ratio;
};
