'use client';

import { useState, useEffect } from 'react';
import { Display } from '@/components/Display';
import { CalculatorButton } from '@/components/CalculatorButton';
import { ScientificKeypad } from '@/components/ScientificKeypad'; // コンポーネント名は既存に合わせる
import { useCalculatorStore } from '@/store/calculatorStore';
import { Settings, X, Trash2, History, RotateCcw } from 'lucide-react';
import { useAdBanner } from '@/hooks/useAdBanner';
import { AD_CONFIG, IAP_PRODUCT_ID } from '@/lib/AdConfig';
import { IAPManager } from '@/lib/IAPManager';
import { useAdStore } from '@/store/adStore';
import { HistoryList } from '@/components/HistoryList';

export default function Home() {
  const {
    append,
    deleteLast,
    clear,
    history
  } = useCalculatorStore();

  const { isAdFree, setAdFreeUntil } = useAdStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize Ads
  useAdBanner();

  // Restore IAP on mount
  useState(() => {
    // 起動時にリストアを試みる
    IAPManager.checkSubscriptionStatus().then((active) => {
      if (active) {
        console.log("Premium active via restoration");
        setAdFreeUntil(8640000000000000); // Forever
      }
    });

    // 既に購入済みかチェック (広告非表示用)
    if (!isAdFree) {
      // Additional check if needed
    }
  });


  // --- IAP Handler ---
  const handleRestore = async () => {
    try {
      const active = await IAPManager.restorePurchases();
      if (active) {
        setAdFreeUntil(8640000000000000);
        alert("購入を復元しました！広告は表示されません。");
      } else {
        alert("有効な購入が見つかりませんでした。");
      }
    } catch (e) {
      alert("復元に失敗しました。");
    }
  };

  const handlePurchase = async () => {
    try {
      const success = await IAPManager.purchasePremium();
      if (success) {
        setAdFreeUntil(8640000000000000);
        alert("購入ありがとうございます！");
      }
    } catch (e) {
      console.error(e);
      // キャンセル時は何もしない
    }
  };


  return (
    <main className="flex flex-col h-[100dvh] w-full bg-ios-bg overflow-hidden relative">

      {/* 
        [HEADER / DISPLAY / HISTORY AREA]
        flex-1: 残りの高さを全てここで消費し、キーパッドを下に押し出す。
        pt-[env(safe-area-inset-top)]: ステータスバー回避
        pb-0: 下部余白なし
      */}
      <div className="flex-1 flex flex-col justify-end w-full pt-[calc(env(safe-area-inset-top)+4px)] pb-0 min-h-0 relative">

        {/* Settings Button Layer (Absolute Top) */}
        <div className="absolute top-[calc(env(safe-area-inset-top)+4px)] right-4 z-50">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-black/20 backdrop-blur-md rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* History Overlay (Hidden in Landscape, visible in Portrait if needed, or just part of display flow) 
             For simplicity based on previous code, we keep HistoryList usage.
             Assuming HistoryList takes available space.
         */}
        <div className="flex-1 relative w-full overflow-hidden mb-0">
          <HistoryList />
        </div>

        {/* Display Component */}
        <div className="w-full px-4 landscape:px-8 z-10 bg-ios-bg mb-0">
          <Display />
        </div>
      </div>

      {/* 
        [KEYPAD AREA]
        mt-auto: フレックスアイテムを強制的に下に配置 (Brute Force)
        pb-[55px]: バナー広告高さ(50px) + 5px (微調整)
        bg-ios-bg: 背景色統一
        z-10: 前面確保
      */}
      <div className="w-full mt-auto pb-[env(safe-area-inset-bottom)] bg-ios-bg z-10">

        {/* Landscape Wrapper */}
        <div className="flex w-full h-full landscape:px-8 gap-2">

          {/* Scientific Pad (Landscape Only) */}
          <div className="hidden landscape:block flex-1">
            <ScientificKeypad />
          </div>

          {/* Main Keypad Grid */}
          <div className="w-full landscape:w-[55%] grid grid-cols-4 grid-rows-5 gap-[1px] landscape:gap-1">
            {/* Row 1 */}
            <CalculatorButton label="AC" onClick={clear} variant="function" className="text-3xl md:text-5xl landscape:text-xl" />
            <CalculatorButton label="Del" onClick={deleteLast} variant="function" icon={<DeleteIcon />} className="" />
            <CalculatorButton label="%" onClick={() => append('%')} variant="function" className="text-3xl md:text-5xl landscape:text-xl" />
            <CalculatorButton label="÷" onClick={() => append('/')} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />

            {/* Row 2 */}
            <CalculatorButton label="7" onClick={() => append('7')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="8" onClick={() => append('8')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="9" onClick={() => append('9')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="×" onClick={() => append('*')} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />

            {/* Row 3 */}
            <CalculatorButton label="4" onClick={() => append('4')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="5" onClick={() => append('5')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="6" onClick={() => append('6')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="-" onClick={() => append('-')} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />

            {/* Row 4 */}
            <CalculatorButton label="1" onClick={() => append('1')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="2" onClick={() => append('2')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="3" onClick={() => append('3')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="+" onClick={() => append('+')} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />

            {/* Row 5 */}
            <CalculatorButton label="0" onClick={() => append('0')} variant="number" className="col-span-2 rounded-bl-none text-4xl md:text-6xl landscape:text-2xl pl-6 text-left" />
            <CalculatorButton label="." onClick={() => append('.')} variant="number" className="text-4xl md:text-6xl landscape:text-2xl" />
            <CalculatorButton label="=" onClick={() => append('=')} variant="operator" className="rounded-br-none text-4xl md:text-6xl landscape:text-2xl" />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 w-full max-w-sm rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-lg font-semibold text-white">設定</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[70vh]">

              {/* IAP Section */}
              <div className="bg-neutral-800/50 rounded-xl p-2 space-y-2 mb-4">
                <div className="px-2 py-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Premium</div>
                <button onClick={handlePurchase} className="w-full p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center gap-3 active:scale-95 transition-transform">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Trash2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white">広告を削除</div>
                    <div className="text-xs text-orange-100">買い切り / ずっと快適</div>
                  </div>
                </button>
                <button onClick={handleRestore} className="w-full p-3 bg-neutral-700/50 rounded-lg flex items-center gap-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  <span>購入を復元</span>
                </button>
              </div>

              <div className="text-xs text-neutral-500 text-center mt-4 pb-4">
                v1.0.0 (Build 2026.01)
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

// Helper icon component for Delete button
function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" y1="9" x2="12" y2="15" />
      <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
  );
}
