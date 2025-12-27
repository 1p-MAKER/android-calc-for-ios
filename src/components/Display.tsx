'use client';

import { useCalculatorStore } from '@/store/calculatorStore';
import { useEffect, useRef } from 'react';

export const Display = () => {
    const { displayValue, history } = useCalculatorStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // 常に最新の計算結果が見えるようにスクロール
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [displayValue]);

    // 直近の履歴（もしあれば）を表示
    const lastHistory = history.length > 0 ? history[0] : null;

    // 文字数に応じたフォントサイズ決定 (iOS電卓風のスケーリング - より積極的に縮小)
    const getFontSize = (len: number) => {
        if (len > 15) return 'text-3xl';
        if (len > 12) return 'text-4xl';
        if (len > 9) return 'text-5xl';
        if (len > 6) return 'text-6xl'; // 1,000,000 (7文字) から小さくする
        return 'text-7xl'; // Default (~6文字)
    };

    const fontSizeClass = getFontSize(displayValue.length);

    return (
        <div className="w-full flex flex-col items-end justify-end px-6 pb-4 space-y-2">
            {/* 履歴表示 (Android風) */}
            <div className="h-8 text-neutral-400 text-xl font-light overflow-hidden whitespace-nowrap w-full text-right flex justify-end">
                {lastHistory ? (
                    <span className="opacity-70">{lastHistory.expression} =</span>
                ) : (
                    <span className="opacity-0">.</span> // レイアウト崩れ防止のダミー
                )}
            </div>

            {/* メイン表示 */}
            <div
                ref={scrollRef}
                className="w-full overflow-x-auto whitespace-nowrap text-right no-scrollbar"
            >
                <span className={`${fontSizeClass} font-light text-ios-display-text leading-tight tracking-tight transition-all duration-100`}>
                    {displayValue}
                </span>
            </div>
        </div>
    );
};
