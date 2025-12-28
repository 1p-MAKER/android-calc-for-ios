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
    <div className="h-screen max-h-screen bg-ios-bg text-ios-text-white flex flex-col landscape:flex-row pt-[calc(env(safe-area-inset-top)+20px)] landscape:pt-[env(safe-area-inset-top)] pb-8 landscape:pb-0 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] safe-area-inset-bottom overflow-hidden">

      {/* LEFT PANE (Landscape): History List */}
      <div className="hidden landscape:flex w-1/4 h-full border-r border-neutral-800 flex-col bg-black/20">
        <div className="p-4 border-b border-neutral-800 text-neutral-400 text-sm font-medium">History</div>
        <div className="flex-1 w-full overflow-y-auto relative">
          <div className="absolute inset-0">
            <HistoryList />
          </div>
        </div>
      </div>

      {/* RIGHT PANE (Landscape): Display + Keypad */}
      {/* In Portrait: It's the bottom part, but here we restructure. */}
      {/* We need to group Display and Keypad together for the left side in landscape. */}

      <div className="flex flex-col w-full landscape:w-3/4 h-full">

        {/* 1. History Area (Portrait ONLY) - Hidden in Landscape */}
        <div className="flex-1 w-full overflow-y-auto min-h-0 relative landscape:hidden">
          <div className="absolute inset-0 bottom-2">
            <HistoryList />
          </div>
        </div>

        {/* 2. Display Area */}
        {/* In Landscape, this needs to be at the top of the Left Pane or above keypad */}
        <div className="w-full max-w-sm landscape:max-w-none landscape:w-full px-4 landscape:px-8 mx-auto flex-shrink-0 mb-2 landscape:mb-4 landscape:mt-auto z-10 bg-ios-bg">
          <Display />
        </div>

        {/* 3. Keypad Area */}
        <div className="w-full flex-shrink-0 z-20 bg-ios-bg pb-safe-offset landscape:pb-6">
          <div className="flex flex-row w-full max-w-sm landscape:max-w-none landscape:w-full px-4 landscape:px-8 gap-0 mx-auto justify-center">

            {/* Scientific Keypad */}
            <ScientificKeypad />

            {/* Standard Keypad */}
            <div className="grid grid-cols-4 gap-0 landscape:gap-0 w-full landscape:w-[40%]">
              {/* Row 1 */}
              <CalculatorButton label="AC" onClick={clear} variant="function" className="h-20 landscape:h-9 landscape:text-xl" />
              <CalculatorButton label="Del" onClick={deleteLast} variant="function" icon={<Delete className="w-8 h-8 landscape:w-6 landscape:h-6" />} className="h-20 landscape:h-9" />
              <CalculatorButton label="%" onClick={() => append('%')} variant="function" className="h-20 landscape:h-9 landscape:text-xl" />
              <CalculatorButton label="÷" onClick={() => append('/')} variant="operator" className="h-20 landscape:h-9 landscape:text-2xl" />

              {/* Row 2 */}
              <CalculatorButton label="7" onClick={() => append('7')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="8" onClick={() => append('8')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="9" onClick={() => append('9')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="×" onClick={() => append('*')} variant="operator" className="h-20 landscape:h-9 landscape:text-2xl" />

              {/* Row 3 */}
              <CalculatorButton label="4" onClick={() => append('4')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="5" onClick={() => append('5')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="6" onClick={() => append('6')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="-" onClick={() => append('-')} variant="operator" className="h-20 landscape:h-9 landscape:text-2xl" />

              {/* Row 4 */}
              <CalculatorButton label="1" onClick={() => append('1')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="2" onClick={() => append('2')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="3" onClick={() => append('3')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="+" onClick={() => append('+')} variant="operator" className="h-20 landscape:h-9 landscape:text-2xl" />

              {/* Row 5 */}
              <CalculatorButton label="0" onClick={() => append('0')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="00" onClick={() => append('00')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="." onClick={() => append('.')} className="h-20 landscape:h-9 landscape:text-2xl" />
              <CalculatorButton label="=" onClick={calculate} variant="operator" className="h-20 landscape:h-9 landscape:text-2xl" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
