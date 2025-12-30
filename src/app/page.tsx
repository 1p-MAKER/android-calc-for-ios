'use client';

import { CalculatorButton } from '@/components/CalculatorButton';
import { Display } from '@/components/Display';
import { HistoryList } from '@/components/HistoryList';
import { ScientificKeypad } from '@/components/ScientificKeypad';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Delete, Settings, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { append, deleteLast, clear, calculate, isSoundEnabled, toggleSound } = useCalculatorStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSupportPage = () => {
    window.open('https://scented-zinc-a47.notion.site/2d9768aba03f80859597d0f99cdb1d5f', '_blank');
  };

  return (
    <div className="h-screen max-h-screen bg-ios-bg text-ios-text-white flex flex-col landscape:flex-row pt-[calc(env(safe-area-inset-top)+20px)] landscape:pt-[max(env(safe-area-inset-top),1rem)] pb-8 landscape:pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] landscape:pl-[max(env(safe-area-inset-left),1.5rem)] pr-[env(safe-area-inset-right)] landscape:pr-[max(env(safe-area-inset-right),1.5rem)] overflow-hidden relative">

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 w-full max-w-sm rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors active:scale-95 duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">Keyboard Sound</span>
                </div>
                <div className={`w-12 h-7 rounded-full transition-colors relative ${isSoundEnabled ? 'bg-green-500' : 'bg-neutral-600'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isSoundEnabled ? 'left-6' : 'left-1'}`} />
                </div>
              </button>

              <button
                onClick={openSupportPage}
                className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors active:scale-95 duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-left">Support & Privacy Policy</span>
                </div>
                <ExternalLink className="w-5 h-5 text-neutral-400" />
              </button>
              <p className="mt-4 text-xs text-center text-neutral-500">
                Version 1.0.0<br />
                © 2024 DevCat
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LEFT PANE (Landscape): History List */}
      <div className="hidden landscape:flex w-[30%] h-full border-r border-neutral-800 flex-col bg-black/20">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center text-neutral-400 text-sm font-medium">
          <span>History</span>
          <button onClick={() => setIsSettingsOpen(true)} className="p-1 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 w-full overflow-y-auto relative">
          <div className="absolute inset-0">
            <HistoryList />
          </div>
        </div>
      </div>

      {/* RIGHT PANE (Landscape): Display + Keypad */}
      <div className="flex flex-col w-full landscape:w-[70%] h-full">

        {/* 1. History Area (Portrait ONLY) */}
        <div className="flex-[0.8] w-full overflow-y-auto min-h-[20%] relative landscape:hidden flex flex-col">
          {/* Portrait Header with Settings */}
          <div className="flex justify-between items-center px-4 py-2 sticky top-0 z-10">
            <div className="text-sm font-medium text-neutral-500">History</div>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-neutral-800/50 rounded-full text-neutral-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bottom-2">
              <HistoryList />
            </div>
          </div>
        </div>

        {/* 2. Display Area */}
        {/* iPad Portrait: Increase height slightly. Flex basis auto or grow */}
        <div className="w-full px-4 landscape:px-8 mx-auto flex-shrink-0 mb-2 landscape:mb-0 z-10 bg-ios-bg flex flex-col justify-end landscape:h-[25%] md:landscape:h-[30%]">
          <Display />
        </div>

        {/* 3. Keypad Area (Fills remaining space) */}
        <div className="flex-1 w-full min-h-0 z-20 bg-ios-bg pb-safe-offset landscape:pb-4 flex flex-col justify-end">
          <div className="flex flex-row w-full h-full landscape:px-8 gap-2 mx-auto">
            {/* Scientific Keypad (Landscape Left) */}
            <div className="flex-1 hidden landscape:block h-full">
              <ScientificKeypad />
            </div>

            {/* Standard Keypad */}
            {/* grid-rows-5 for 5 rows. h-full to fill height. */}
            <div className="grid grid-cols-4 grid-rows-5 gap-[1px] landscape:gap-1 w-full landscape:w-[55%] h-full">
              {/* Row 1 */}
              <CalculatorButton label="AC" onClick={clear} variant="function" className="text-3xl md:text-5xl landscape:text-xl" />
              <CalculatorButton label="Del" onClick={deleteLast} variant="function" icon={<Delete className="w-8 h-8 md:w-12 md:h-12 landscape:w-6 landscape:h-6" />} className="" />
              <CalculatorButton label="%" onClick={() => append('%')} variant="function" className="text-3xl md:text-5xl landscape:text-xl" />
              <CalculatorButton label="÷" onClick={() => append('/')} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />

              {/* Row 2 */}
              <CalculatorButton label="7" onClick={() => append('7')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="8" onClick={() => append('8')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="9" onClick={() => append('9')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="×" onClick={() => append('*')} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />

              {/* Row 3 */}
              <CalculatorButton label="4" onClick={() => append('4')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="5" onClick={() => append('5')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="6" onClick={() => append('6')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="-" onClick={() => append('-')} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />

              {/* Row 4 */}
              <CalculatorButton label="1" onClick={() => append('1')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="2" onClick={() => append('2')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="3" onClick={() => append('3')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="+" onClick={() => append('+')} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />

              {/* Row 5 */}
              <CalculatorButton label="0" onClick={() => append('0')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="00" onClick={() => append('00')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="." onClick={() => append('.')} className="text-4xl md:text-6xl landscape:text-2xl" />
              <CalculatorButton label="=" onClick={calculate} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
