import { knapsackJS } from "./knapsack_pure.js";

function generateBigCase() {
  const n = 1000;
  const W = Array.from({ length: n }, () => Math.floor(Math.random() * 1000));
  const V = Array.from({ length: n }, () => Math.floor(Math.random() * 1000));

  document.getElementById("weights").value = W.join(",");
  document.getElementById("values").value = V.join(",");
  document.getElementById("capacity").value = 1000;
}

function getInput() {
  return {
    W: document.getElementById("weights").value.split(",").map(Number),
    V: document.getElementById("values").value.split(",").map(Number),
    M: Number(document.getElementById("capacity").value)
  };
}

function knapsackWASM(W, V, M) {
  const n = W.length;

  const wPtr = Module._malloc(n * 4);
  const vPtr = Module._malloc(n * 4);

  for (let i = 0; i < n; i++) {
    Module.setValue(wPtr + i * 4, W[i], 'i32');
    Module.setValue(vPtr + i * 4, V[i], 'i32');
  }

  Module.ccall(
    "knapsack_solve",
    null,
    ["number", "number", "number", "number"],
    [M, wPtr, vPtr, n]
  );

  const result = Module.ccall("get_result_value", "number");

  Module._free(wPtr);
  Module._free(vPtr);

  return result;
}

export function runComparison() {
  const { W, V, M } = getInput();

  // Reset bars
  document.getElementById('js-bar').style.width   = '0%';
  document.getElementById('wasm-bar').style.width = '0%';
  document.getElementById('speedup-card').style.display = 'none';
  document.getElementById('wasm-badge').classList.remove('show');
  document.getElementById('js-badge').classList.remove('show');
  document.getElementById('wasm-thief').classList.remove('show');
  document.getElementById('wasm-police').classList.remove('show');
  document.getElementById('js-thief').classList.remove('show');
  document.getElementById('js-police').classList.remove('show');

  // JS
  let start = performance.now();
  const jsResult = knapsackJS(M, V, W);
  let jsTime = performance.now() - start;

  // WASM
  start = performance.now();
  const wasmResult = knapsackWASM(W, V, M);
  let wasmTime = performance.now() - start;

  // Mostrar
  document.getElementById("js-result").innerText = "Valor: " + jsResult;
  document.getElementById("js-time").innerText = "Tiempo: " + jsTime.toFixed(2) + " ms";

  document.getElementById("wasm-result").innerText = "Valor: " + wasmResult;
  document.getElementById("wasm-time").innerText = "Tiempo: " + wasmTime.toFixed(2) + " ms";

  // Bars
  const maxMs = Math.max(parseFloat(jsTime), parseFloat(wasmTime));
  if (maxMs > 0) {
      document.getElementById('js-bar').style.width   = `${(parseFloat(jsTime)   / maxMs * 100).toFixed(1)}%`;
      document.getElementById('wasm-bar').style.width = `${(parseFloat(wasmTime) / maxMs * 100).toFixed(1)}%`;
  }
    // Speedup
    const ratio = (parseFloat(jsTime) / parseFloat(wasmTime));
    const card  = document.getElementById('speedup-card');
    card.style.display = 'block';
    if (ratio >= 1) {
        document.getElementById('wasm-badge').classList.add('show');
        document.getElementById('wasm-thief').classList.add('show');
        document.getElementById('js-police').classList.add('show');
        document.getElementById('speedup-val').textContent  = `${ratio.toFixed(2)}×`;
        document.getElementById('speedup-desc').textContent = 'WASM es más rápido que JS';
      } else {
        document.getElementById('js-badge').classList.add('show');
        document.getElementById('js-thief').classList.add('show');
        document.getElementById('wasm-police').classList.add('show');
        document.getElementById('speedup-val').textContent  = `${(1/ratio).toFixed(2)}×`;
        document.getElementById('speedup-desc').textContent = 'JS es más rápido que WASM';
      }
}

window.runComparison = runComparison;
window.generateBigCase = generateBigCase;