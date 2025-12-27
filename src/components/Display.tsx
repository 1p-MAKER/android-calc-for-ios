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
                <span className="text-7xl font-light text-ios-display-text leading-tight tracking-tight">
                    {displayValue}
                </span>
            </div>
        </div>
    );
};
