import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function StarBorder({ children, className = '', onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`relative group inline-flex items-center justify-center px-6 py-2.5 rounded-full font-medium text-sm overflow-hidden ${className}`}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 opacity-70 group-hover:opacity-100 transition blur-sm" />
      <span className="absolute inset-[1px] rounded-full bg-[#0c0c10]" />
      <span className="relative z-10 text-white/90 group-hover:text-white transition">
        {children}
      </span>
    </button>
  );
}
