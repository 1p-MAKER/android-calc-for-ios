import { create, all } from 'mathjs';
import { create as createStore } from 'zustand'; // Renamed to avoid conflict

// Math.js instance with configuration
const math = create(all, {});

// Override trigonometric functions to use Degrees by default (Android behavior)
// We pass these functions into the scope of evaluate()
const degreeScope = {
    sin: (x: number) => math.sin(math.unit(x, 'deg')),
    cos: (x: number) => math.cos(math.unit(x, 'deg')),
    tan: (x: number) => math.tan(math.unit(x, 'deg')),
    asin: (x: number) => math.evaluate(math.asin(x) + ' to deg').toNumber(),
    acos: (x: number) => math.evaluate(math.acos(x) + ' to deg').toNumber(),
    atan: (x: number) => math.evaluate(math.atan(x) + ' to deg').toNumber(),
    ln: math.log, // log is natural log in mathjs by default, but ln alias is good
    log: math.log10, // Standard calculator 'log' is base 10
    π: math.pi,
    e: math.e,
};

interface HistoryItem {
    expression: string;
    result: string;
    timestamp: number;
}

interface CalculatorState {
    expression: string;
    displayValue: string;
    isCalculated: boolean;
    history: HistoryItem[];

    // Actions
    append: (value: string) => void;
    deleteLast: () => void;
    clear: () => void;
    calculate: () => void;
    loadHistory: (item: HistoryItem) => void;
}

export const useCalculatorStore = createStore<CalculatorState>((set, get) => ({
    expression: '',
    displayValue: '0',
    isCalculated: false,
    history: [],

    append: (value: string) => {
        const { expression, isCalculated } = get();

        let newExpression = expression;
        // 演算子、または関数括弧の開始
        const isOperatorOrFunction = ['+', '-', '*', '/', '%', '^', '!', '('].includes(value) || value.endsWith('(');

        if (isCalculated) {
            if (isOperatorOrFunction) {
                // 結果を引き継ぐ (例: 結果10に + を押すと "10+")
                newExpression = get().displayValue;
            } else {
                // 新しい式
                newExpression = '';
            }
            set({ isCalculated: false });
        }

        // 文字列連結
        newExpression += value;

        set({
            expression: newExpression,
            displayValue: newExpression
        });
    },

    deleteLast: () => {
        const { expression, isCalculated } = get();
        if (isCalculated) {
            const curVal = get().displayValue;
            const newVal = curVal.slice(0, -1);
            set({
                expression: newVal,
                displayValue: newVal || '0',
                isCalculated: false
            });
            return;
        }

        // 末尾が "sin(" のような関数の場合、まとめて消すロジックがあると親切だが
        // 今回はシンプルに1文字(または1トークン)削除
        const newExpression = expression.slice(0, -1);
        set({
            expression: newExpression,
            displayValue: newExpression || '0'
        });
    },

    clear: () => {
        set({
            expression: '',
            displayValue: '0',
            isCalculated: false
        });
    },

    calculate: () => {
        const { expression } = get();
        if (!expression) return;

        try {
            // 表示用演算子をプログラム用に置換
            const sanitized = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'pi')
                .replace(/e/g, 'e')
                .replace(/\^/g, '^') // 念のため
                .replace(/√\(([^)]+)\)/g, 'sqrt($1)') // √x -> sqrt(x)
                .replace(/√(\d+)/g, 'sqrt($1)'); // 簡易対応

            // 数式評価 (Degree Scopeを使用)
            const resultNum = math.evaluate(sanitized, degreeScope);

            // 結果のフォーマット
            const resultStr = math.format(resultNum, { precision: 12, lowerExp: -9, upperExp: 9 });

            const newItem: HistoryItem = {
                expression: expression,
                result: resultStr,
                timestamp: Date.now(),
            };

            set((state) => ({
                displayValue: resultStr,
                expression: resultStr,
                isCalculated: true,
                history: [newItem, ...state.history].slice(0, 100)
            }));

        } catch (error) {
            console.error("Calculation Error:", error);
            set({ displayValue: 'Error', isCalculated: true });
        }
    },

    loadHistory: (item) => {
        set({
            expression: item.result, // 結果を呼び出すか、式を呼び出すか。Androidは「結果」を使うことが多い
            displayValue: item.result,
            isCalculated: true // 次の入力でクリアされるように
        });
    }
}));
