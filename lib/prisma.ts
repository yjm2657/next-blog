declare global {
  var prisma: PrismaClient; // This must be a `var` and not a `let / const`
}

// 这段代码用于配置并导出一个 Prisma 实例。
// 在生产环境中，每次请求都会创建一个新的 PrismaClient 实例，而在开发环境中，它会重复使用全局的实例以防止数据连接数耗尽。
// 这样的设置可以有效提高性能并减少资源占用。

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
