"use client";
import type { AppProps } from "next/app";
import { Avatar, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { useRouter } from "next/navigation";
import { Home } from "./components/home";

function MyApp() {
  return <Home>{/* <Component {...pageProps} /> */}</Home>;
}

export default MyApp;
