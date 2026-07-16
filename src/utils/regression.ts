export function linearRegression(x: number[], y: number[]): { slope: number, intercept: number, line: number[] } {
  const n = x.length;
  if (n === 0) return { slope: 0, intercept: 0, line: [] };
  
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const line = x.map(xVal => slope * xVal + intercept);
  
  return { slope, intercept, line };
}