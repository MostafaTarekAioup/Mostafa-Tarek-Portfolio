"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { motion, HTMLMotionProps } from "framer-motion";

interface RuneButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
}

export function RuneButton({
  variant = "primary",
  size = "md",
  icon,
  children,
  fullWidth = false,
  glow = false,
  className = "",
  onClick,
  ...props
}: RuneButtonProps) {
  const { playSfx } = useGame();

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-dark-steel via-iron to-dark-steel text-gold border-gold/60 hover:border-gold hover:text-white shadow-lg shadow-gold/10 hover:shadow-gold/25 active:bg-gold/20",
    secondary:
      "bg-gradient-to-r from-dark-steel via-iron/80 to-dark-steel text-mana border-mana/60 hover:border-mana hover:text-white shadow-lg shadow-mana/10 hover:shadow-mana/25 active:bg-mana/20",
    danger:
      "bg-gradient-to-r from-dark-steel via-iron/80 to-dark-steel text-ember border-ember/60 hover:border-ember hover:text-white shadow-lg shadow-ember/10 hover:shadow-ember/25 active:bg-ember/20",
    ghost:
      "bg-transparent text-slate-300 border-iron/40 hover:border-gold/50 hover:text-gold active:bg-dark-steel/40",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-semibold tracking-wider",
    md: "px-5 py-2.5 text-sm font-bold tracking-widest uppercase",
    lg: "px-8 py-3.5 text-base font-extrabold tracking-widest uppercase",
  };

  const glowStyles = {
    primary: "glow-gold",
    secondary: "glow-mana",
    danger: "glow-ember",
    ghost: "",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSfx("click");
    if (onClick) onClick(e);
  };

  const handleMouseEnter = () => {
    playSfx("hover");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98, y: 1 }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`relative inline-flex items-center justify-center gap-2.5 rounded-lg border font-mono transition-all duration-200 cursor-pointer overflow-hidden ${variantStyles[variant]} ${sizeStyles[size]} ${glow ? glowStyles[variant] : ""} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {/* Corner Ornaments */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-70" />
      <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-current opacity-70" />
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-current opacity-70" />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-70" />

      {/* Shimmer overlay on hover */}
      <span className="absolute inset-0 shimmer-bg opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

      {icon && <span className="shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
