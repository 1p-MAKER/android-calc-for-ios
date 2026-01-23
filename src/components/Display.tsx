'use client';

import { useCalculatorStore } from '@/store/calculatorStore';
import { useEffect, useRef, useState } from 'react';

// Helper: Format a purely numeric string with commas
const formatNumber = (numStr: string) => {
    if (!numStr) return '';
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

export const Display = () => {
    const { displayValue, history } = useCalculatorStore();
    const [showCopied, setShowCopied] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll to end
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [displayValue]);

    const lastHistory = history.length > 0 ? history[0] : null;

    // Handle Copy
    const handleCopy = async () => {
        if (!displayValue || displayValue === 'Error') return;
        try {
            await navigator.clipboard.writeText(displayValue);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    // Format the display value: find all number sequences and add commas
    // This handles both "123456" and "1234+5678"
    const formattedDisplay = displayValue.replace(/(\d+)(\.\d+)?/g, (match) => {
        return formatNumber(match);
    });


    // Font scaling
    const getPortraitFontSize = (len: number) => {
        if (len > 12) return 'text-4xl';
        if (len > 10) return 'text-5xl';
        if (len > 8) return 'text-6xl';
        return 'text-7xl';
    };

    const getLandscapeFontSize = (len: number) => {
        if (len > 18) return 'landscape:text-4xl';
        if (len > 15) return 'landscape:text-5xl';
        if (len > 12) return 'landscape:text-6xl';
        return 'landscape:text-7xl';
    };

    const fontSizeClass = `${getPortraitFontSize(formattedDisplay.length)} ${getLandscapeFontSize(formattedDisplay.length)}`;

    return (
        <div
            className="w-full flex flex-col items-end justify-end px-6 pb-4 space-y-2 relative active:opacity-70 transition-opacity cursor-pointer"
            onClick={handleCopy}
        >
            {/* Copied Toast */}
            <div className={`absolute top-0 right-6 bg-neutral-700/90 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none transition-opacity duration-300 ${showCopied ? 'opacity-100' : 'opacity-0'}`}>
                Copied
            </div>

            {/* History Expression (Standard behavior) */}
            <div className="h-8 text-neutral-400 text-xl font-light overflow-hidden whitespace-nowrap w-full text-right flex justify-end">
                {lastHistory ? (
                    <span className="opacity-70">{lastHistory.expression} =</span>
                ) : (
                    <span className="opacity-0">.</span>
                )}
            </div>

            {/* Main Display */}
            <div
                ref={scrollRef}
                className="w-full overflow-x-auto whitespace-nowrap text-right no-scrollbar"
            >
                <span className={`${fontSizeClass} font-light text-ios-display-text leading-tight tracking-tight transition-all duration-100`}>
                    {formattedDisplay}
                </span>
            </div>
        </div>
    );
};
