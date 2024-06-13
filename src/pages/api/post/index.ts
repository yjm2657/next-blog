import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const postData = req.body;
      try {
        const post = await prisma.post.create({
          data: {
            title: postData.title,
            content: postData.content,
            authorId: postData.authorId,
            published: false,
            type: postData.type,
          },
        });
        res.status(200).json({ data: post });
      } catch (error) {
        console.error("Prisma error:", error);
        res.status(500).json({ message: "Error creating post" });
      }
    } else if (req.method === "GET") {
      try {
        const { pageIndex = 1, pageSize = 10 } = req.query;
        // 10 为十进制的意思
        const pageIndexNumber = parseInt(pageIndex as string, 10);
        const pageSizeNumber = parseInt(pageSize as string, 10);

        const offset = (pageIndexNumber - 1) * pageSizeNumber;
        const posts = await prisma.post.findMany({
          skip: offset,
          take: pageSizeNumber,
          orderBy: {
            createdAt: "desc",
          },
        });

        res.status(200).json({ data: posts });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching posts" });
      }
    } else if (req.method === "PUT" || req.method === "PATCH") {
      try {
        const updateData = req.body;
        let updatedPost: any;
        if (req.method === "PUT") {
          // PUT 请求通常意味着替换整个资源，所以不提供则使用默认值或空对象
          updatedPost = await prisma.post.update({
            where: {
              id: updateData.id,
            },
            data: updateData || {},
          });
        } else {
          // PATCH 请求用于更新资源的部分字段
          updatedPost = await prisma.post.update({
            where: {
              id: updateData.id,
            },
            data: updateData, // 只更新提供的字段
          });
        }
        if (!updatedPost) {
          res.status(500).json({ message: "Post not found" });
        } else {
          res.status(200).json({ data: updatedPost });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating post" });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error("Error disconnecting from database:", error);
    }
  }
}
