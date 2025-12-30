'use client';

import { CalculatorButton } from './CalculatorButton';
import { useCalculatorStore } from '@/store/calculatorStore';

export const ScientificKeypad = () => {
    const { append } = useCalculatorStore();

    return (
        <div className="hidden landscape:grid grid-cols-6 grid-rows-5 gap-1 pr-4 border-r border-neutral-800 w-full h-full">
            {/* Row 1 */}
            <CalculatorButton label="(" onClick={() => append('(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label=")" onClick={() => append(')')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="mc" onClick={() => { }} variant="function" className="w-full opacity-30" textClass="text-sm md:text-xl" />
            <CalculatorButton label="m+" onClick={() => { }} variant="function" className="w-full opacity-30" textClass="text-sm md:text-xl" />
            <CalculatorButton label="m-" onClick={() => { }} variant="function" className="w-full opacity-30" textClass="text-sm md:text-xl" />
            <CalculatorButton label="mr" onClick={() => { }} variant="function" className="w-full opacity-30" textClass="text-sm md:text-xl" />

            {/* Row 2 */}
            <CalculatorButton label="2ⁿᵈ" onClick={() => { }} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="x²" onClick={() => append('^2')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="x³" onClick={() => append('^3')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="xʸ" onClick={() => append('^')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="eˣ" onClick={() => append('e^')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="10ˣ" onClick={() => append('10^')} variant="function" className="w-full" textClass="text-sm md:text-xl" />

            {/* Row 3 */}
            <CalculatorButton label="1/x" onClick={() => append('^(-1)')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="²√x" onClick={() => append('sqrt(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="³√x" onClick={() => append('cbrt(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="y√x" onClick={() => append('^(1/')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="ln" onClick={() => append('ln(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="log₁₀" onClick={() => append('log(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />

            {/* Row 4 */}
            <CalculatorButton label="x!" onClick={() => append('!')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="sin" onClick={() => append('sin(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="cos" onClick={() => append('cos(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="tan" onClick={() => append('tan(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="e" onClick={() => append('e')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="EE" onClick={() => append('e')} variant="function" className="w-full" textClass="text-sm md:text-xl" />

            {/* Row 5 */}
            <CalculatorButton label="Rad" onClick={() => { }} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="sinh" onClick={() => append('sinh(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="cosh" onClick={() => append('cosh(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="tanh" onClick={() => append('tanh(')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="π" onClick={() => append('π')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
            <CalculatorButton label="Rand" onClick={() => append('random()')} variant="function" className="w-full" textClass="text-sm md:text-xl" />
        </div>
    );
};
