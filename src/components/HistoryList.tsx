'use client';

import { useCalculatorStore } from '@/store/calculatorStore';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils'; // Assuming this utility exists or I'll standardise imports

// Simple class merger if utils doesn't exist yet
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export const HistoryList = () => {
    const { history, loadHistory } = useCalculatorStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    // 新しい履歴が追加されたら最下部にスクロール
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history.length]);

    if (history.length === 0) return null;

    return (
        <div className="w-full h-full overflow-y-auto px-4 pt-12 pb-4 space-y-4 no-scrollbar scroll-smooth">
            {/* Reverse map to show oldest to newest (bottom) if we want standard chat-like flow,
          OR newest at top. This calc shows history above the current input. 
          Let's render them in chronological order (oldest -> newest) so it flows down like chat.
      */}
            {history.slice().reverse().map((item) => (
                <div
                    key={item.timestamp}
                    onClick={() => loadHistory(item)}
                    className="flex flex-col items-end text-right opacity-60 hover:opacity-100 transition-opacity cursor-pointer active:scale-95 origin-right"
                >
                    <div className="text-xl text-neutral-400 font-light">{item.expression}</div>
                    <div className="text-3xl text-ios-btn-orange font-normal">= {item.result}</div>
                </div>
            ))}
            <div ref={bottomRef} className="h-0" />
        </div>
    );
};
