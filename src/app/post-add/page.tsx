"use client";
import { Button, Chip, Input, Textarea } from "@nextui-org/react";
import { CircleChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PastAdd() {
  const router = useRouter();
  const [title, setTitle] = useState<string>();
  const [content, setContent] = useState<string>();
  const [tags] = useState<string[]>([
    "iOS",
    "JavaScript",
    "Next.js",
    "MiniProgrammer",
  ]);
  const [selectTag, setSelectTag] = useState<string>("iOS");

  return (
    <div className="flex flex-row">
      <div className="max-w-md mt-6 flex flex-col gap-y-6">
        <div className="flex flex-row items-center relative">
          <Button
            startContent={<CircleChevronLeft />}
            variant="light"
            onClick={() => {
              router.back();
            }}
          >
            返回
          </Button>
          <div className="text-foreground font-medium text-2xl absolute left-1/2 transform -translate-x-1/2">
            创建
          </div>
        </div>

        <Input
          value={title}
          type="text"
          label="标题"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <div className="flex flex-row gap-4">
          {tags.map((tag, tagIndex) => (
            <Chip
              key={"tagIndex" + tagIndex}
              onClick={() => {
                setSelectTag(tag);
              }}
              color={selectTag == tag ? "secondary" : "default"}
            >
              {tag}
            </Chip>
          ))}
        </div>
        <Textarea label="内容" placeholder="请输入内容" />
        <Button size="lg" color="secondary">
          提交
        </Button>
      </div>
    </div>
  );
}
