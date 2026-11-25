import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}

export default function PremiumButton({ children, onClick, type = 'button', className = '', disabled }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-premium ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="btn-outer">
        <div className="btn-inner">
          <span>{children}</span>
        </div>
      </div>
    </button>
  );
}
