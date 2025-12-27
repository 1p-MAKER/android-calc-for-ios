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
    variant?: ButtonVariant;
    className?: string; // col-span-2 などのために
    icon?: React.ReactNode; // Backspace用
}

export const CalculatorButton = ({
    label,
    onClick,
    variant = 'number',
    className,
    icon,
}: CalculatorButtonProps) => {

    const handlePress = async () => {
        try {
            await Haptics.impact({ style: ImpactStyle.Light });
        } catch {
            // Web or non-supported environment: ignore
        }
        onClick();
    };

    const getVariantClasses = (v: ButtonVariant) => {
        switch (v) {
            case 'function':
                return 'bg-ios-btn-light text-black active:bg-ios-btn-light-active rounded-2xl';
            case 'operator':
                return 'bg-ios-btn-orange text-white active:bg-ios-btn-orange-active rounded-2xl';
            case 'operator-active': // 選択中の演算子（iOS風の色反転などは今回保留、シンプルには明るくする）
                return 'bg-ios-text-white text-ios-btn-orange rounded-2xl';
            case 'number':
            default:
                return 'bg-ios-btn-gray text-white active:bg-ios-btn-gray-active rounded-2xl';
        }
    };

    return (
        <button
            onClick={handlePress}
            className={cn(
                "w-full h-full p-[3px] bg-transparent touch-manipulation select-none outline-none",
                className // Allow external sizing classes (h-9 etc) to apply to the button wrapper
            )}
        >
            <div className={cn(
                "w-full h-full flex items-center justify-center font-medium transition-colors text-3xl",
                getVariantClasses(variant),
            )}>
                {icon ? icon : label}
            </div>
        </button>
    );
};
