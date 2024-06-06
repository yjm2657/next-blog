"use client";
import { Button, Switch } from "@nextui-org/react";
import { Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeSwitcherProps = {
  className?: string;
};

export const ThemeSwitcher = (props: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      className={props.className}
      defaultSelected
      size="lg"
      color="primary"
      isSelected={theme === "dark"}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunMoon className={className} />
        ) : (
          <Sun className={className} />
        )
      }
      onValueChange={(e) => {
        setTheme(e ? "dark" : "light");
      }}
    ></Switch>
  );
};
