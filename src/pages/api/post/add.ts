import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
// import bodyParser from "body-parser";

const prisma = new PrismaClient();
// 解析JSON请求体
// const parseBody = bodyParser.json();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const postData = req.body;

      const post = await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          authorId: postData.authorId,
          type: postData.type,
        },
      });
      res.status(200).json({post});
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

//预渲染时不要运行API Route
export const config = {
  api: {
    bodyParser: false,
  },
};
