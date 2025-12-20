import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const variantClasses = {
  primary: 'bg-[#8B7355] hover:bg-[#6B5B47] text-white',
  outline: 'border-2 border-[#8B7355] text-[#8B7355] hover:bg-stone-50 bg-transparent',
  ghost: 'text-gray-700 hover:bg-gray-100 bg-transparent'
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg
        transition-all duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}



