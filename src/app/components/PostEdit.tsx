"use client";
import { Button } from "@nextui-org/react";
import { CirclePlus } from "lucide-react";

interface PostEditProps {
  className?: string;
  addPostClick: () => void;
}

export const PostEdit = (props: PostEditProps) => {
  return (
    <div className={"flex flex-row items-center " + props.className}>
      <Button
        startContent={<CirclePlus />}
        color="secondary"
        onPress={() => {
          props.addPostClick();
        }}
      >
        添加
      </Button>
    </div>
  );
};
