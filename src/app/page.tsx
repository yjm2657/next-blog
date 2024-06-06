import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

function MyApp({}) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="d">
        <div className="px-10 mt-6 h-screen w-screen flex flex-row bg-background justify-between">
          <div className="text-large text-primary-400 leading-10">My Blog</div>
          <ThemeSwitcher className="h-10"></ThemeSwitcher>
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default MyApp;
