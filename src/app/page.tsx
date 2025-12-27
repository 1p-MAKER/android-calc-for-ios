'use client';

import { CalculatorButton } from '@/components/CalculatorButton';
import { Display } from '@/components/Display';
import { HistoryList } from '@/components/HistoryList';
import { ScientificKeypad } from '@/components/ScientificKeypad';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Delete } from 'lucide-react';

export default function Home() {
  const { append, deleteLast, clear, calculate } = useCalculatorStore();

  return (
    <div className="min-h-screen bg-ios-bg text-ios-text-white flex flex-col items-center justify-end pb-8 sm:pb-12 safe-area-inset-bottom overflow-hidden">

      {/* History Area (Expands to fill available space) */}
      <HistoryList />

      {/* Main Display Area */}
      <div className="w-full max-w-sm landscape:max-w-4xl px-4 mb-2">
        <Display />
      </div>

      {/* Keypad Container (Flex for landscape split) */}
      <div className="flex flex-row w-full max-w-sm landscape:max-w-5xl px-4 gap-4">

        {/* Scientific Keypad (Hidden in Portrait) */}
        <ScientificKeypad />

        {/* Standard Keypad */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 w-full landscape:w-[40%]">
          {/* Row 1 */}
          <CalculatorButton
            label="AC"
            onClick={clear}
            variant="function"
            className="landscape:h-14 landscape:text-xl"
          />
          <CalculatorButton
            label="Del"
            onClick={deleteLast}
            variant="function"
            icon={<Delete className="w-8 h-8 landscape:w-6 landscape:h-6" />}
            className="landscape:h-14"
          />
          <CalculatorButton
            label="%"
            onClick={() => append('%')}
            variant="function"
            className="landscape:h-14 landscape:text-xl"
          />
          <CalculatorButton
            label="÷"
            onClick={() => append('/')}
            variant="operator"
            className="landscape:h-14 landscape:text-2xl"
          />

          {/* Row 2 */}
          <CalculatorButton
            label="7"
            onClick={() => append('7')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="8"
            onClick={() => append('8')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="9"
            onClick={() => append('9')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="×"
            onClick={() => append('*')}
            variant="operator"
            className="landscape:h-14 landscape:text-2xl"
          />

          {/* Row 3 */}
          <CalculatorButton
            label="4"
            onClick={() => append('4')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="5"
            onClick={() => append('5')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="6"
            onClick={() => append('6')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="-"
            onClick={() => append('-')}
            variant="operator"
            className="landscape:h-14 landscape:text-2xl"
          />

          {/* Row 4 */}
          <CalculatorButton
            label="1"
            onClick={() => append('1')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="2"
            onClick={() => append('2')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="3"
            onClick={() => append('3')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="+"
            onClick={() => append('+')}
            variant="operator"
            className="landscape:h-14 landscape:text-2xl"
          />

          {/* Row 5 */}
          <CalculatorButton
            label="0"
            onClick={() => append('0')}
            className="col-span-2 w-auto pl-8 justify-start landscape:h-14 landscape:pl-6 landscape:text-2xl"
          />
          <CalculatorButton
            label="."
            onClick={() => append('.')}
            className="landscape:h-14 landscape:text-2xl"
          />
          <CalculatorButton
            label="="
            onClick={calculate}
            variant="operator"
            className="landscape:h-14 landscape:text-2xl"
          />
        </div>
      </div>
    </div>
  );
}
