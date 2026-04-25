const weights = [];
const values = [];
let items_index = 0;
let firstItem = true;

// ── WASM status ──────────────────────────────────────────
Module.onRuntimeInitialized = () => {
    document.getElementById('wdot').className = 'wdot ok';
    document.getElementById('wasm-status').textContent = 'Módulo WASM listo';
    document.getElementById('btn-solve').disabled = false;
};

setTimeout(() => {
    if (document.getElementById('wdot').className.includes('spin')) {
        document.getElementById('wdot').className          = 'wdot err';
        document.getElementById('wasm-status').textContent = 'error al cargar WASM';
    }
}, 7000);


const addItem = () => {
    const w_form = document.getElementById('Item-W');
    const v_form = document.getElementById('item-V');

    const weight = parseInt(w_form.value);
    const value  = parseInt(v_form.value);

    if (isNaN(weight) || isNaN(value)) {
        alert('Ingresa números válidos');
        return;
    }

    weights.push(weight);
    values.push(value);

    const list_items = document.getElementById('list-items');

    if (firstItem) {
        list_items.innerHTML = '';
        firstItem = false;
    }

    list_items.innerHTML += `<li>Item ${items_index} - Peso: ${weight}kg. - Valor: $${value}</li>`;
    items_index += 1;

    w_form.value = '';
    v_form.value = '';
};



const solvedKnapsack = async () => {
    if (weights.length < 1) return;

    const maxWeight = parseInt(document.getElementById('max-weight').value);
    const n = weights.length;

    const wtPtr  = Module._malloc(n * 4);
    const valPtr = Module._malloc(n * 4);

    for (let i = 0; i < n; i++) {
        Module.setValue(wtPtr  + i * 4, weights[i], 'i32');
        Module.setValue(valPtr + i * 4, values[i],  'i32');
    }

    const max_value = Module.ccall(
        'knapsack_solve',
        'number',
        ['number', 'number', 'number', 'number'],
        [maxWeight, wtPtr, valPtr, n]
    );

    const chosen_items_length = Module.ccall('get_result_count', 'number');

    Module._free(wtPtr);
    Module._free(valPtr);

   
    const ul = document.getElementById('chosen-items');
    ul.innerHTML = '';

    for (let i = 0; i < chosen_items_length; i++) {
        let item_idx = Module.ccall('get_result_item', 'number', ['number'], [i]);
        let idx_js   = item_idx - 1;
        const li = document.createElement('li');
        li.innerHTML = `<span class="li-idx">Item ${idx_js}</span><span>Peso: ${weights[idx_js]}kg — Valor: $${values[idx_js]}</span>`;
        ul.appendChild(li);
    }

    document.getElementById('res-valor').textContent = max_value;
    document.getElementById('res-count').textContent = chosen_items_length;

    const result = document.getElementById('result-section');
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth' });
};