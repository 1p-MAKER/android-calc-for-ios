'use client';

import { CalculatorButton } from './CalculatorButton';
import { useCalculatorStore } from '@/store/calculatorStore';

export const ScientificKeypad = () => {
    const { append } = useCalculatorStore();

    // 短いラベル用の基本クラス
    const baseTextClass = "text-xs sm:text-sm md:text-base lg:text-xl";
    // 長いラベル用の少し小さいクラス (sinh, tanh, Rand, log10 など)
    const longTextClass = "text-[10px] sm:text-xs md:text-sm lg:text-lg";

    return (
        <div className="hidden landscape:grid grid-cols-6 grid-rows-5 gap-1 pr-4 border-r border-neutral-800 w-full h-full">
            {/* Row 1 */}
            <CalculatorButton label="(" onClick={() => append('(')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label=")" onClick={() => append(')')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="mc" onClick={() => { }} variant="function" className="w-full opacity-30" textClass={baseTextClass} />
            <CalculatorButton label="m+" onClick={() => { }} variant="function" className="w-full opacity-30" textClass={baseTextClass} />
            <CalculatorButton label="m-" onClick={() => { }} variant="function" className="w-full opacity-30" textClass={baseTextClass} />
            <CalculatorButton label="mr" onClick={() => { }} variant="function" className="w-full opacity-30" textClass={baseTextClass} />

            {/* Row 2 */}
            <CalculatorButton label="2ⁿᵈ" onClick={() => { }} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="x²" onClick={() => append('^2')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="x³" onClick={() => append('^3')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="xʸ" onClick={() => append('^')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="eˣ" onClick={() => append('e^')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="10ˣ" onClick={() => append('10^')} variant="function" className="w-full" textClass={baseTextClass} />

            {/* Row 3 */}
            <CalculatorButton label="1/x" onClick={() => append('^(-1)')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="²√x" onClick={() => append('sqrt(')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="³√x" onClick={() => append('cbrt(')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="y√x" onClick={() => append('^(1/')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="ln" onClick={() => append('ln(')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="log₁₀" onClick={() => append('log(')} variant="function" className="w-full" textClass={longTextClass} />

            {/* Row 4 */}
            <CalculatorButton label="x!" onClick={() => append('!')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="sin" onClick={() => append('sin(')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="cos" onClick={() => append('cos(')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="tan" onClick={() => append('tan(')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="e" onClick={() => append('e')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="EE" onClick={() => append('e')} variant="function" className="w-full" textClass={baseTextClass} />

            {/* Row 5 */}
            <CalculatorButton label="Rad" onClick={() => { }} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="sinh" onClick={() => append('sinh(')} variant="function" className="w-full" textClass={longTextClass} />
            <CalculatorButton label="cosh" onClick={() => append('cosh(')} variant="function" className="w-full" textClass={longTextClass} />
            <CalculatorButton label="tanh" onClick={() => append('tanh(')} variant="function" className="w-full" textClass={longTextClass} />
            <CalculatorButton label="π" onClick={() => append('π')} variant="function" className="w-full" textClass={baseTextClass} />
            <CalculatorButton label="Rand" onClick={() => append('random()')} variant="function" className="w-full" textClass={longTextClass} />
        </div>
    );
};
