"use client";

import Link from "next/link";
import { useState } from "react";

interface FloatingActionButtonProps {
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
}

export function FloatingActionButton({
  href,
  onClick,
  icon,
  label = "Create",
  className = "",
}: FloatingActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const defaultIcon = (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );

  const buttonContent = (
    <div
      className={`
        fixed bottom-24 right-4 z-[60] w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 
        rounded-full shadow-lg hover:shadow-xl transition-all duration-200 
        flex items-center justify-center text-white
        ${isPressed ? "scale-95" : "scale-100"}
        ${className}
      `}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {icon || defaultIcon}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="md:hidden">
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="md:hidden"
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {buttonContent}
    </button>
  );
}
