"use client";
import { Avatar } from "@nextui-org/react";
import { PostEdit } from "./PostEdit";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";

export const Home = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  const router = useRouter();
  function gotoAddPostPage() {
    router.push("/post-add");
  }
  return (
    <div className="pl-10 pr-4 mt-6 h-screen w-screen flex flex-row bg-background justify-between">
      <div className="text-large text-primary-400 leading-10">My Blog</div>
      <div className="h-10 flex flex-row items-center gap-x-2">
        <PostEdit addPostClick={gotoAddPostPage}></PostEdit>
        <Avatar
          isBordered
          src="https://i.pinimg.com/564x/0f/c0/94/0fc09479e293e4f78a6e39ea542ceaf4.jpg"
        />
        <ThemeSwitcher></ThemeSwitcher>
      </div>
    </div>
  );
};
