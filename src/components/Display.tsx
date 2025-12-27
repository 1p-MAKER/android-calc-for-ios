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
    // 文字数に応じたフォントサイズ決定
    // Portrait: 幅が狭いので早めに縮小 (iOS電卓風)
    const getPortraitFontSize = (len: number) => {
        if (len > 15) return 'text-3xl';
        if (len > 12) return 'text-4xl';
        if (len > 9) return 'text-5xl';
        if (len > 6) return 'text-6xl';
        return 'text-7xl';
    };

    // Landscape: 幅が広いので、かなり桁数が多くなるまで縮小しない
    const getLandscapeFontSize = (len: number) => {
        if (len > 25) return 'landscape:text-3xl';
        if (len > 20) return 'landscape:text-4xl';
        if (len > 16) return 'landscape:text-5xl';
        if (len > 13) return 'landscape:text-6xl';
        return 'landscape:text-7xl'; // 13文字程度までは最大サイズ維持
    };

    const fontSizeClass = `${getPortraitFontSize(displayValue.length)} ${getLandscapeFontSize(displayValue.length)}`;

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
