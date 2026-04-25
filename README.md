# 2026-1-t3-g1

El código base fue tomado y adaptado desde GeeksforGeeks, artículo “Printing Items in 0/1 Knapsack”. 
https://www.geeksforgeeks.org/dsa/printing-items-01-knapsack/ 

Se adaptó el código original:
1. Se agregó #include <emscripten.h>
2. Para evitar que el compilador elimine funciones que parecen no usarse se puso EMSCRIPTEN_KEEPALIVE antes de cada función exportada
3. Se agregaron variables globales para mostrar el resultado esperado (lista de los items)
4. Se agregaron funciones getter para leer el resultado desde JS

## Compilación con Emscripten

### Instalar Emscripten SDK:
1. git clone https://github.com/emscripten-core/emsdk.git
2. cd emsdk
3. ./emsdk install latest
4. ./emsdk activate latest
5. ./emsdk_env.bat (Windows) o source ./emsdk_env.sh (Linux)

### Comando de compilación con Emscripten (genera .js y .wasm):
(Windows)
1. emcc knapsack.c -O3 -s WASM=1 `
  -s EXPORTED_FUNCTIONS='["_knapsack_solve","_get_result_value","_get_result_item","_get_result_count","_malloc","_free"]' `
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","getValue","setValue"]' `
  -o knapsack.js

(Linux)
```
emcc knapsack.c -O3 -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_knapsack_solve","_get_result_value","_get_result_item","_get_result_count","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","getValue","setValue"]' \
  -o knapsack.js
```

Flags usadas
1. -03: optimización agresiva
2. -s WASM=1: para generar .wasm 
3. -s EXPORTED_FUNCTIONS: funciones C que JS puede llamar (deben llevar _ al inicio)
4. -s EXPORTED_RUNTIME_METHODS: utilidades de Emscripten disponibles en JS

