#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ITEMS 105
#define MAX_WEIGHT 105

static int result_value = 0;
static int result_items[MAX_ITEMS];
static int result_count = 0;

EMSCRIPTEN_KEEPALIVE
int knapsack_solve(int W, int* wt, int* val, int n) {
    int K[MAX_ITEMS][MAX_WEIGHT];
    int i, w;

    for (i = 0; i <= n; i++) {
        for (w = 0; w <= W; w++) {
            if (i == 0 || w == 0) {
                K[i][w] = 0;
            } else if (wt[i - 1] <= w) {
                int take    = val[i - 1] + K[i - 1][w - wt[i - 1]];
                int no_take = K[i - 1][w];
                K[i][w] = (take > no_take) ? take : no_take;
            } else {
                K[i][w] = K[i - 1][w];
            }
        }
    }

    result_value = K[n][W];
    result_count = 0;

    int res = K[n][W];
    w = W;
    for (i = n; i > 0 && res > 0; i--) {
        if (res != K[i - 1][w]) {
            result_items[result_count++] = i;
            res -= val[i - 1];
            w  -= wt[i - 1];
        }
    }

    return result_value;
}

/* Getters para leer los resultados desde JavaScript */
EMSCRIPTEN_KEEPALIVE
int get_result_value() {
    return result_value;
}

EMSCRIPTEN_KEEPALIVE
int get_result_count() {
    return result_count;
}

/* Devuelve el índice del ítem en la posición idx del resultado (1-based) */
EMSCRIPTEN_KEEPALIVE
int get_result_item(int idx) {
    if (idx < 0 || idx >= result_count) return -1;
    return result_items[idx];
}