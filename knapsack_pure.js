// code from: https://javascript.plainenglish.io/javascript-algorithms-knapsack-problem-0-1-6dc96a5d68d
// const values = [10, 20, 30, 40];
// const weights = [30, 10, 40, 20];
// const capacity = 40;

export function knapsackJS(capacity, values, weights) {
  // Create array
  const arr = new Array(values.length + 1);

  for (let i = 0; i < arr.length; i++){
    arr[i] = new Array(capacity + 1).fill(0);
  }

  for (let i = 1; i <= values.length; i++) {
    // choose all weights from 0 to maximum capacity
    
    for (let j = 0; j <= capacity; j++) {
      // Don't pick ith element if j-weights[i-1] is negative
      if (weights[i - 1] > j) {
        arr[i][j] = arr[i - 1][j];
      } else {
        // Store the max value that we get by picking or leaving the i-th item
        arr[i][j] = Math.max(arr[i - 1][j], arr[i - 1][j - weights[i - 1]] + values[i - 1]);
      }
    }
  }

  // Return maximum value
  return arr[values.length][capacity];
}

// knapsackJS(capacity, values, weights);