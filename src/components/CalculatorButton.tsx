import { ImpactStyle, Haptics } from '@capacitor/haptics';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type ButtonVariant = 'number' | 'function' | 'operator' | 'operator-active';

interface CalculatorButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    textClass?: string; // Additional class specifically for the inner text/icon
}

export const CalculatorButton = ({
    label,
    onClick,
    className,
    variant = 'number',
    icon,
    textClass,
}: CalculatorButtonProps) => {

    const handlePress = () => {
        // Haptics.impact({ style: ImpactStyle.Light });
        onClick();
    };

    const getVariantClasses = (v: ButtonVariant) => {
        switch (v) {
            case 'function':
                return 'bg-ios-btn-light text-black active:bg-ios-btn-light-active rounded-xl';
            case 'operator':
                return 'bg-ios-btn-orange text-white active:bg-ios-btn-orange-active rounded-xl';
            case 'operator-active': // 選択中の演算子（iOS風の色反転などは今回保留、シンプルには明るくする）
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
                textClass // Apply text styling here without affecting layout
            )}>
                {icon ? icon : label}
            </div>
        </button>
    );
};
