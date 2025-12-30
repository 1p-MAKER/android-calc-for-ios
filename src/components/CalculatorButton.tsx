import { ImpactStyle, Haptics } from '@capacitor/haptics';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useCalculatorStore } from '@/store/calculatorStore';

// Utility for class merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Simple click sound generator using Web Audio API
const playClickSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
        // Ignore audio errors
    }
};

type ButtonVariant = 'number' | 'function' | 'operator' | 'operator-active';

interface CalculatorButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    textClass?: string;
}

export const CalculatorButton = ({
    label,
    onClick,
    className,
    variant = 'number',
    icon,
    textClass,
}: CalculatorButtonProps) => {
    const { isSoundEnabled } = useCalculatorStore();

    const handlePress = () => {
        if (isSoundEnabled) {
            playClickSound();
        }
        // Haptics.impact({ style: ImpactStyle.Light });
        onClick();
    };

    const getVariantClasses = (v: ButtonVariant) => {
        switch (v) {
            case 'function':
                return 'bg-ios-btn-light text-black active:bg-ios-btn-light-active rounded-xl';
            case 'operator':
                return 'bg-ios-btn-orange text-white active:bg-ios-btn-orange-active rounded-xl';
            case 'operator-active':
                return 'bg-ios-text-white text-ios-btn-orange rounded-xl';
            case 'number':
            default:
                return 'bg-ios-btn-gray text-white active:bg-ios-btn-gray-active rounded-xl';
        }
    };

    return (
        <button
            onClick={handlePress}
            className={cn(
                "w-full h-full p-[1px] bg-transparent touch-manipulation select-none outline-none",
                className
            )}
        >
            <div className={cn(
                "w-full h-full flex items-center justify-center font-medium transition-colors text-3xl",
                getVariantClasses(variant),
                textClass
            )}>
                {icon ? icon : label}
            </div>
        </button>
    );
};
