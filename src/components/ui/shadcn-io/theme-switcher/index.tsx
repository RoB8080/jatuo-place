"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useId, useState } from "react";
import { cn } from "@/libs/utils";
import { useTheme } from "@/components/global/theme";

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
];

export type ThemeSwitcherProps = {
  size?: "lg" | "md" | "sm";
  className?: string;
};

export const ThemeSwitcher = ({
  size = "md",
  className,
}: ThemeSwitcherProps) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const layoutId = useId();

  const handleThemeClick = useCallback(
    (themeKey: "light" | "dark" | "system") => {
      setTheme(themeKey);
    },
    [setTheme],
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      data-size={size}
      className={cn(
        "relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border data-[size=lg]:h-9 data-[size=sm]:h-6 data-[size=sm]:p-0.5",
        className,
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={label}
            data-size={size}
            className="relative h-6 w-6 cursor-pointer rounded-full hover:bg-muted data-[size=lg]:h-7 data-[size=lg]:w-7 data-[size=sm]:h-5 data-[size=sm]:w-5"
            key={key}
            onClick={() => handleThemeClick(key as "light" | "dark" | "system")}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary"
                layoutId={layoutId}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon
              data-size={size}
              data-active={isActive}
              className={cn(
                "relative z-10 m-auto h-4 w-4 text-muted-foreground data-[active=true]:text-foreground data-[size=lg]:h-4.5 data-[size=lg]:w-4.5 data-[size=sm]:h-3.5 data-[size=sm]:w-3.5",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
