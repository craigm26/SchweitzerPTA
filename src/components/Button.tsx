import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  icon?: React.ReactNode;
};

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  className = '',
  icon,
}: ButtonProps) => {
  const baseClasses =
    'flex items-center justify-center overflow-hidden rounded-lg font-bold transition-colors shadow-md';

  const variantClasses = {
    primary: 'bg-primary hover:bg-orange-600 text-white',
    secondary:
      'bg-background-light dark:bg-white/10 border border-[#e6e0db] dark:border-white/20 text-[#181411] dark:text-white hover:bg-[#e6e0db] dark:hover:bg-white/20',
  };

  const sizeClasses = {
    small: 'h-9 px-5 text-sm',
    medium: 'h-10 px-6 text-sm',
    large: 'h-12 px-8 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;
