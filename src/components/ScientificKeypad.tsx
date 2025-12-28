'use client';

import { CalculatorButton } from './CalculatorButton';
import { useCalculatorStore } from '@/store/calculatorStore';

export const ScientificKeypad = () => {
    const { append } = useCalculatorStore();

    return (
        <div className="hidden landscape:grid grid-cols-6 gap-0 pr-4 border-r border-neutral-800">
            {/* Row 1 */}
            <CalculatorButton label="(" onClick={() => append('(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label=")" onClick={() => append(')')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="mc" onClick={() => { }} variant="function" className="h-9 w-full opacity-30" textClass="text-sm" />
            <CalculatorButton label="m+" onClick={() => { }} variant="function" className="h-9 w-full opacity-30" textClass="text-sm" />
            <CalculatorButton label="m-" onClick={() => { }} variant="function" className="h-9 w-full opacity-30" textClass="text-sm" />
            <CalculatorButton label="mr" onClick={() => { }} variant="function" className="h-9 w-full opacity-30" textClass="text-sm" />

            {/* Row 2 */}
            <CalculatorButton label="2ⁿᵈ" onClick={() => { }} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="x²" onClick={() => append('^2')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="x³" onClick={() => append('^3')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="xʸ" onClick={() => append('^')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="eˣ" onClick={() => append('e^')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="10ˣ" onClick={() => append('10^')} variant="function" className="h-9 w-full" textClass="text-sm" />

            {/* Row 3 */}
            <CalculatorButton label="1/x" onClick={() => append('^(-1)')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="²√x" onClick={() => append('sqrt(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="³√x" onClick={() => append('cbrt(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="y√x" onClick={() => append('^(1/')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="ln" onClick={() => append('ln(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="log₁₀" onClick={() => append('log(')} variant="function" className="h-9 w-full" textClass="text-sm" />

            {/* Row 4 */}
            <CalculatorButton label="x!" onClick={() => append('!')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="sin" onClick={() => append('sin(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="cos" onClick={() => append('cos(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="tan" onClick={() => append('tan(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="e" onClick={() => append('e')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="EE" onClick={() => append('e')} variant="function" className="h-9 w-full" textClass="text-sm" />

            {/* Row 5 */}
            <CalculatorButton label="Rad" onClick={() => { }} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="sinh" onClick={() => append('sinh(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="cosh" onClick={() => append('cosh(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="tanh" onClick={() => append('tanh(')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="π" onClick={() => append('π')} variant="function" className="h-9 w-full" textClass="text-sm" />
            <CalculatorButton label="Rand" onClick={() => append('random()')} variant="function" className="h-9 w-full" textClass="text-sm" />
        </div>
    );
};
