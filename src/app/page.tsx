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
    <div className="min-h-screen bg-ios-bg text-ios-text-white flex flex-col items-center justify-end pt-[calc(env(safe-area-inset-top)+20px)] pb-8 sm:pb-12 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] safe-area-inset-bottom overflow-hidden">

      {/* History & Display Container (Flex-grow to fill available space, but allow proper sizing) */}
      <div className="w-full flex-1 flex flex-col justify-end min-h-0 mb-4 landscape:mb-2">

        {/* History Area */}
        <HistoryList />

        {/* Main Display Area */}
        <div className="w-full max-w-sm landscape:max-w-4xl px-4 mx-auto flex-shrink-0">
          <Display />
        </div>

      </div>

      {/* Keypad Container (Flex for landscape split) */}
      <div className="flex flex-row w-full max-w-sm landscape:max-w-5xl px-4 gap-2 mx-auto justify-center flex-shrink-0">

        {/* Scientific Keypad (Hidden in Portrait) */}
        <ScientificKeypad />

        {/* Standard Keypad */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 landscape:gap-2 w-full landscape:w-[40%]">
          {/* Row 1 */}
          <CalculatorButton
            label="AC"
            onClick={clear}
            variant="function"
            className="landscape:h-10 landscape:text-base"
          />
          <CalculatorButton
            label="Del"
            onClick={deleteLast}
            variant="function"
            icon={<Delete className="w-8 h-8 landscape:w-5 landscape:h-5" />}
            className="landscape:h-10"
          />
          <CalculatorButton
            label="%"
            onClick={() => append('%')}
            variant="function"
            className="landscape:h-10 landscape:text-base"
          />
          <CalculatorButton
            label="÷"
            onClick={() => append('/')}
            variant="operator"
            className="landscape:h-10 landscape:text-xl"
          />

          {/* Row 2 */}
          <CalculatorButton
            label="7"
            onClick={() => append('7')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="8"
            onClick={() => append('8')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="9"
            onClick={() => append('9')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="×"
            onClick={() => append('*')}
            variant="operator"
            className="landscape:h-10 landscape:text-xl"
          />

          {/* Row 3 */}
          <CalculatorButton
            label="4"
            onClick={() => append('4')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="5"
            onClick={() => append('5')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="6"
            onClick={() => append('6')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="-"
            onClick={() => append('-')}
            variant="operator"
            className="landscape:h-10 landscape:text-xl"
          />

          {/* Row 4 */}
          <CalculatorButton
            label="1"
            onClick={() => append('1')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="2"
            onClick={() => append('2')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="3"
            onClick={() => append('3')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="+"
            onClick={() => append('+')}
            variant="operator"
            className="landscape:h-10 landscape:text-xl"
          />

          {/* Row 5 */}
          <CalculatorButton
            label="0"
            onClick={() => append('0')}
            className="col-span-2 w-auto pl-8 justify-start landscape:h-10 landscape:pl-6 landscape:text-xl"
          />
          <CalculatorButton
            label="."
            onClick={() => append('.')}
            className="landscape:h-10 landscape:text-xl"
          />
          <CalculatorButton
            label="="
            onClick={calculate}
            variant="operator"
            className="landscape:h-10 landscape:text-xl"
          />
        </div>
      </div>
    </div>
  );
}
