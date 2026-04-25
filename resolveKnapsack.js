const weights = [];
const values = [];
let items_index = 0;

const addItem = () => {
    const w_form = document.getElementById('Item-W');
    const v_form = document.getElementById('item-V');

    const weight  = parseInt(w_form.value);
    const value = parseInt(v_form.value);

    if (isNaN(weight) || isNaN(value)) {
        alert('Ingresa números válidos');
        return;
    }

    weights.push(weight);
    values.push(value);

    const list_items = document.getElementById("list-items")
    list_items.innerHTML += `<li>Item ${items_index} - Peso: ${weight}kg. - Valor: $${value}</li>`
    items_index += 1;

    v_form.value = "";
    w_form.value = "";
}

const solvedKnapsack = async () => {
    if (weights.length < 1 || values.length < 1) return;
    
    const n = weights.length;
    const maxWeight = 25;

    // reservar memoria en el heap de WASM
    const wtPtr  = Module._malloc(n * 4);
    const valPtr = Module._malloc(n * 4);

    // copiar los arrays JS a memoria WASM
    for (let i = 0; i < n; i++) {
        Module.setValue(wtPtr  + i * 4, weights[i], 'i32');
        Module.setValue(valPtr + i * 4, values[i],  'i32');
    }

    const chosen_items = document.getElementById("chosen-items");
    chosen_items.innerHTML = "";


    const max_value = Module.ccall(
        'knapsack_solve', 
        'number', 
        ['number', 'number', 'number', 'number'],
        [maxWeight, wtPtr, valPtr, n]
    );

    const chosen_items_length = Module.ccall('get_result_count', 'number');
    
    for (let i = 0; i < chosen_items_length; i++) {
        let item_idx = Module.ccall('get_result_item', 'number', ['number'], [i]);
        let idx_js   = item_idx - 1;
        chosen_items.innerHTML += `<li>Item ${idx_js} - Peso: ${weights[idx_js]}kg - Valor: ${values[idx_js]}</li>`
    }

    chosen_items.innerHTML += `<li>Valor total: ${max_value}</li>`

    Module._free(wtPtr);
    Module._free(valPtr);
}