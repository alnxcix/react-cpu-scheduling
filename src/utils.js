export const getLCM = (numbers) => {
  let r1 = 0;
  let r2 = 0;
  let l = numbers.length;
  for (let i = 0; i < l; i++) {
    r1 = numbers[i] % numbers[i + 1];
    if (r1 === 0)
      numbers[i + 1] = (numbers[i] * numbers[i + 1]) / numbers[i + 1];
    else {
      r2 = numbers[i + 1] % r1;
      if (r2 === 0) numbers[i + 1] = (numbers[i] * numbers[i + 1]) / r1;
      else numbers[i + 1] = (numbers[i] * numbers[i + 1]) / r2;
    }
  }
  return numbers[l - 1];
};

export const getAverage = (numbers) =>
  (
    numbers.reduce((accumulator, currentValue) => accumulator + currentValue) /
    numbers.length
  ).toFixed(2);
