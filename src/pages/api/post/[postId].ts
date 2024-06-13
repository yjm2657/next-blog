import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { postId } = req.query as { postId: string };
  if (!postId) {
    return res.status(500).json({ message: "ID is required" });
  }
  try {
    if (req.method === "GET") {
      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(postId, 10),
        },
      });
      if (!post) {
        res.status(500).json({ message: "Post not found" });
      } else {
        res.status(200).json({ data: post });
      }
    } else if (req.method === "DELETE") {
      const deletedPost = await prisma.post.delete({
        where: {
          id: parseInt(postId, 10),
        },
      });
      if (!deletedPost) {
        res.status(500).json({ message: "Post not found" });
      }
      res.status(200).json({ message: "Post deleted successfully" });
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
