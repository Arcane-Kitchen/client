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
export const handlePointCalc = (ratio: number, isSubtraction: boolean) => {
  if (ratio > 0.9) {
    if (isSubtraction) {
      return -35;
    }
    return 35;
  }
  if (ratio > 0.8) {
    if (isSubtraction) {
      return -29;
    }
    return 29;
  }
  if (ratio > 0.7) {
    if (isSubtraction) {
      return -24;
    }
    return 24;
  }
  if (ratio > 0.6) {
    if (isSubtraction) {
      return -20;
    }
    return 20;
  }
  if (ratio > 0.5) {
    if (isSubtraction) {
      return -17;
    }
    return 17;
  }
  if (ratio > 0.4) {
    if (isSubtraction) {
      return -15;
    }
    return 15;
  }
  if (ratio > 0.3) {
    if (isSubtraction) {
      return -13;
    }
    return 13;
  }
  if (ratio > 0.2) {
    if (isSubtraction) {
      return -11;
    }
    return 11;
  }
  if (isSubtraction) {
    return -10;
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
