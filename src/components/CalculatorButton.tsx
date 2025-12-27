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
                return 'bg-ios-btn-light text-black active:bg-ios-btn-light-active';
            case 'operator':
                return 'bg-ios-btn-orange text-white active:bg-ios-btn-orange-active';
            case 'operator-active': // 選択中の演算子（iOS風の色反転などは今回保留、シンプルには明るくする）
                return 'bg-ios-text-white text-ios-btn-orange';
            case 'number':
            default:
                return 'bg-ios-btn-gray text-white active:bg-ios-btn-gray-active';
        }
    };

    return (
        <button
            onClick={handlePress}
            className={cn(
                'h-20 w-20 rounded-full text-3xl font-medium transition-colors duration-100 flex items-center justify-center',
                getVariantClasses(variant),
                className
            )}
        >
            {icon ? icon : label}
        </button>
    );
};
