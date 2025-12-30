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
    isSoundEnabled: boolean;

    // Actions
    append: (value: string) => void;
    deleteLast: () => void;
    clear: () => void;
    calculate: () => void;
    loadHistory: (item: HistoryItem) => void;
    toggleSound: () => void;
}

export const useCalculatorStore = createStore<CalculatorState>((set, get) => ({
    expression: '',
    displayValue: '0',
    isCalculated: false,
    history: [],
    isSoundEnabled: true, // Default to true

    toggleSound: () => {
        set((state) => ({ isSoundEnabled: !state.isSoundEnabled }));
    },

    append: (value: string) => {
        const { expression, isCalculated } = get();

        let newExpression = expression;
        // 演算子かどうか判定
        const isOperator = ['+', '-', '*', '/', '%', '^'].includes(value);

        // 計算完了直後の処理
        if (isCalculated) {
            if (isOperator) {
                // 結果を引き継ぐ (例: 結果10に + を押すと "10+")
                newExpression = get().displayValue;
                set({ isCalculated: false }); // ここでフラグを折る
            } else {
                // 新しい式としてリセット
                newExpression = '';
                set({ isCalculated: false });
            }
        }

        // 演算子の連続入力制御 (Android挙動: 最後が演算子なら置き換える)
        // ただし、'(' や関数の場合は置き換えない
        if (isOperator && newExpression.length > 0) {
            const lastChar = newExpression.slice(-1);
            const isLastCharOperator = ['+', '-', '*', '/', '%', '^'].includes(lastChar);

            if (isLastCharOperator) {
                // 末尾を削除して新しい演算子に置き換え
                newExpression = newExpression.slice(0, -1) + value;
                set({
                    expression: newExpression,
                    displayValue: newExpression
                });
                return;
            }
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
            let sanitized = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'pi')
                .replace(/e/g, 'e')
                .replace(/\^/g, '^') // 念のため
                .replace(/√\(([^)]+)\)/g, 'sqrt($1)') // √x -> sqrt(x)
                .replace(/√(\d+)/g, 'sqrt($1)'); // 簡易対応

            // 括弧のバランス調整 (自動補完)
            const openParens = (sanitized.match(/\(/g) || []).length;
            const closeParens = (sanitized.match(/\)/g) || []).length;
            if (openParens > closeParens) {
                sanitized += ')'.repeat(openParens - closeParens);
            }

            // 数式評価 (Degree Scopeを使用)
            const resultNum = math.evaluate(sanitized, degreeScope);

            // 結果のフォーマット
            // e表記になる閾値を広げる (10^16程度までは通常表記)
            const resultStr = math.format(resultNum, { precision: 16, lowerExp: -16, upperExp: 16 });

            set((state) => {
                const history = state.history;
                // 重複チェック: 直近の履歴と同じ式・結果なら履歴に追加しない
                const lastItem = history.length > 0 ? history[0] : null;
                const isDuplicate = lastItem && lastItem.expression === expression && lastItem.result === resultStr;

                if (isDuplicate) {
                    return {
                        displayValue: resultStr,
                        expression: resultStr,
                        isCalculated: true,
                        // history 更新なし
                    };
                }

                const newItem: HistoryItem = {
                    expression: expression,
                    result: resultStr,
                    timestamp: Date.now(),
                };

                return {
                    displayValue: resultStr,
                    expression: resultStr,
                    isCalculated: true,
                    history: [newItem, ...history].slice(0, 100)
                };
            });

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
