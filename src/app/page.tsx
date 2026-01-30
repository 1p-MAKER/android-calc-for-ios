'use client';

import { CalculatorButton } from '@/components/CalculatorButton';
import { Display } from '@/components/Display';
import { HistoryList } from '@/components/HistoryList';
import { ScientificKeypad } from '@/components/ScientificKeypad';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useAdStore } from '@/store/adStore';
import { showInterstitial, showRewardVideo } from '@/lib/AdManager';
import { purchasePremium, getProductPrice, restorePurchases, initializeRevenueCat } from '@/lib/IAPManager';
import { AdBanner } from '@/components/AdBanner';
import { Delete, Settings, X, ExternalLink, Gift, Calculator, LayoutGrid, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { append, deleteLast, clear, calculate, isSoundEnabled, toggleSound } = useCalculatorStore();
  const {
    incrementCalcCount,
    shouldShowInterstitial,
    grantRewardAdFree,
    isPremium,
    setPremium,
    adFreeUntil
  } = useAdStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRewardLoading, setIsRewardLoading] = useState(false);
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false);
  const [productPrice, setProductPrice] = useState('¥100');

  // RevenueCat初期化と価格取得
  useEffect(() => {
    const init = async () => {
      await initializeRevenueCat();
      const price = await getProductPrice();
      setProductPrice(price);
    };
    init();
  }, []);

  // 計算実行時のラッパー関数
  const handleCalculate = async () => {
    calculate();

    // 計算回数をカウントアップ
    incrementCalcCount();

    // インタースティシャル表示判定
    if (shouldShowInterstitial()) {
      // ユーザー体験を損なわないよう少し遅延させる、または即時表示
      // ここでは計算結果が表示された直後に実行
      await showInterstitial();
    }
  };

  const openDeveloperPage = () => {
    window.open('https://profile-portfolio-one-tau.vercel.app/', '_blank');
  };

  const openPrivacyPolicy = () => {
    window.open('https://profile-portfolio-one-tau.vercel.app/privacy', '_blank');
  };

  const openOtherApps = () => {
    window.open('https://apps.apple.com/us/developer/ippei-nagamine/id1860723239', '_blank');
  };

  const shareApp = async () => {
    const url = 'https://apps.apple.com/us/app/%E9%9B%BB%E5%8D%93-%E5%B1%A5%E6%AD%B4%E3%81%8C%E8%A6%8B%E3%81%88%E3%82%8B%E8%A8%88%E7%AE%97%E6%A9%9F/id6757658561';
    if (navigator.share) {
      try {
        await navigator.share({
          title: '電卓 - 履歴が見える計算機',
          text: '履歴が見える便利な電卓アプリを使ってみませんか？',
          url: url,
        });
      } catch (error) {
        // Share cancelled or failed, fallback to opening URL if it's not an abort error
        console.log('Share cancelled or failed', error);
      }
    } else {
      // Fallback for browsers that don't support share API
      window.open(url, '_blank');
    }
  };

  const handleRewardVideo = async () => {
    setIsRewardLoading(true);
    await showRewardVideo((reward) => {
      grantRewardAdFree();
      alert('🎉 24時間広告なしになりました！');
    });
    setIsRewardLoading(false);
  };

  const handlePurchase = async () => {
    setIsPurchaseLoading(true);
    const result = await purchasePremium();
    setIsPurchaseLoading(false);

    if (result.success) {
      setPremium(true);
      alert('🎉 ' + result.message);
    } else if (result.message) {
      alert(result.message);
    }
  };

  const handleRestore = async () => {
    const result = await restorePurchases();
    if (result.success) {
      setPremium(true);
    }
    alert(result.message);
  };

  const isAdFreeActive = !isPremium && Date.now() < adFreeUntil;

  return (
    // Outer container: Full screen, forces flex layout
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-ios-bg relative">

      {/* App Content: Takes remaining space */}
      <div className="flex-1 w-full flex flex-col landscape:flex-row relative min-h-0 pt-[calc(env(safe-area-inset-top)+4px)] landscape:pt-[max(env(safe-area-inset-top),1rem)] pl-[env(safe-area-inset-left)] landscape:pl-[max(env(safe-area-inset-left),1.5rem)] pr-[env(safe-area-inset-right)] landscape:pr-[max(env(safe-area-inset-right),1.5rem)] pb-[60px] landscape:pb-[env(safe-area-inset-bottom)]">

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 w-full max-w-sm rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                <h2 className="text-lg font-semibold">設定</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-4 space-y-3 overflow-y-auto max-h-[70vh]">

                {/* Premium / Ads Section */}
                <div className="bg-neutral-800/50 rounded-xl p-2 space-y-2 mb-4">
                  <div className="px-2 py-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    課金・広告
                  </div>

                  {!isPremium && !isAdFreeActive && (
                    <button
                      onClick={handleRewardVideo}
                      disabled={isRewardLoading}
                      className="w-full flex items-center justify-between p-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors active:scale-95 duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-white" />
                        <div className="text-left">
                          <div className="font-medium text-white">動画を見て広告なし</div>
                          <div className="text-xs text-blue-200">24時間限定 (Free)</div>
                        </div>
                      </div>
                      {isRewardLoading && <div className="animate-spin text-white">...</div>}
                    </button>
                  )}

                  {isAdFreeActive && (
                    <div className="w-full p-4 bg-green-900/30 border border-green-800 rounded-xl flex items-center gap-3">
                      <Gift className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-medium text-green-400">広告なし適用中</div>
                        <div className="text-xs text-green-500">
                          残り: {Math.max(0, Math.ceil((adFreeUntil - Date.now()) / (1000 * 60 * 60)))}時間
                        </div>
                      </div>
                    </div>
                  )}

                  {!isPremium ? (
                    <>
                      <button
                        onClick={handlePurchase}
                        disabled={isPurchaseLoading}
                        className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors active:scale-95 duration-200 disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <Calculator className="w-5 h-5 text-yellow-500" />
                          <div className="text-left">
                            <div className="font-medium">プレミアムプラン</div>
                            <div className="text-xs text-neutral-400">広告を永久に削除</div>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-neutral-700 rounded-full text-xs font-medium">
                          {isPurchaseLoading ? '...' : productPrice}
                        </div>
                      </button>
                      <button
                        onClick={handleRestore}
                        className="w-full p-3 text-sm text-neutral-400 hover:text-white transition-colors"
                      >
                        購入履歴を復元
                      </button>
                    </>
                  ) : (
                    <div className="w-full p-4 bg-yellow-900/20 border border-yellow-800 rounded-xl flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium text-yellow-500">プレミアムプラン有効</span>
                    </div>
                  )}
                </div>

                {/* Sound Toggle */}
                <button
                  onClick={toggleSound}
                  className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors active:scale-95 duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">キー操作音</span>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-colors relative ${isSoundEnabled ? 'bg-green-500' : 'bg-neutral-600'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isSoundEnabled ? 'left-6' : 'left-1'}`} />
                  </div>
                </button>

                {/* Other Apps */}
                <button
                  onClick={openOtherApps}
                  className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors active:scale-95 duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-left">その他のアプリ</span>
                  </div>
                  <LayoutGrid className="w-5 h-5 text-neutral-400" />
                </button>

                {/* Share App */}
                <button
                  onClick={shareApp}
                  className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors active:scale-95 duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-left">このアプリを共有する</span>
                  </div>
                  <Share2 className="w-5 h-5 text-neutral-400" />
                </button>

                {/* Developer */}
                <button
                  onClick={openDeveloperPage}
                  className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors active:scale-95 duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-left">開発者</span>
                  </div>
                  <ExternalLink className="w-5 h-5 text-neutral-400" />
                </button>

                {/* Privacy Policy */}
                <button
                  onClick={openPrivacyPolicy}
                  className="w-full flex items-center justify-between p-4 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors active:scale-95 duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-left">プライバシーポリシー</span>
                  </div>
                  <ExternalLink className="w-5 h-5 text-neutral-400" />
                </button>
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
          <div className="flex-[0.5] w-full overflow-y-auto min-h-[15%] relative landscape:hidden flex flex-col">
            {/* Portrait Header with Settings */}
            <div className="flex justify-between items-center px-4 py-3 sticky top-[calc(env(safe-area-inset-top)+20px)] z-10 bg-black/90 backdrop-blur-sm border-b border-neutral-800/50">
              <div className="text-sm font-medium text-neutral-500">History</div>
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-neutral-800/50 rounded-full text-neutral-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 relative pb-2">
              <div className="absolute inset-0">
                <HistoryList />
              </div>
            </div>
          </div>

          {/* 2. Display Area */}
          <div className="w-full px-4 landscape:px-8 mx-auto flex-shrink-0 mb-2 landscape:mb-0 z-10 bg-ios-bg flex flex-col justify-end landscape:h-[25%] md:landscape:h-[30%]">
            <Display />
          </div>

          {/* 3. Keypad Area (Fills remaining space) */}
          <div className="flex-1 w-full min-h-0 z-20 bg-ios-bg pb-safe-offset landscape:pb-4 flex flex-col justify-end">
            <div className="flex flex-row w-full h-full landscape:px-8 gap-2 mx-auto">
              <div className="flex-1 hidden landscape:block h-full">
                <ScientificKeypad />
              </div>

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
                <CalculatorButton label="=" onClick={handleCalculate} variant="operator" className="text-4xl md:text-6xl landscape:text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for AdBanner & Safe Area - Forces content compression */}
      <div
        className="flex-shrink-0 w-full bg-ios-bg transition-[height] duration-300 pointer-events-none"
        style={{ height: 'calc(env(safe-area-inset-bottom) + var(--banner-height, 0px))' }}
      />

      <AdBanner />
    </div>
  );
}
