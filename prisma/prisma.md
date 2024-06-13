### 一、前言

在本文中，我将介绍如何在 NestJS 中使用 Prisma。Prisma 是一个用于构建和管理数据库的工具，它可以与 NestJS 无缝集成，提供了一个强大和类型安全的查询语言，以及更加便捷的数据库 CURD，具体使用请阅读本文。

### 二、 Prisma

本文基于 mysql 关系型数据库进行讲解，如需非关系型数据库的讲解，如 MongoDB,请移步 从头开始使用 MongoDB

#### 1.安装所需包

$ pnpm i prisma@5.5.2
$ pnpm i @prisma/client@5.5.2

#### 2.初始化

$ npx prisma init

执行以上命令会创建.env 文件与 prisma 文件夹

.env 用于定义数据库连接
prisma 用于定义模型结构与数据迁移与数据填充文件

#### 3.连接数据库

修改.env 文件设置 mysql 连接，以下连接请根据你的情况修改
DATABASE_URL="mysql://root:root@localhost:3306/databasename" #定义环境
NODE_ENV=development

注：databasename 是指你的数据库名，例如：mydatabase

#### 4.迁移文件

迁移文件 migrate 用于构建数据表结构变化，他是数据库的版本控制机制，每次表结构的修改都有单独文件记录。

##### 1.结构定义

在  prisman/schema.prisma  文件内定义表结构，你可以查看数据模型或   字段类型文档了解使用方法。本文重点在于从已创建好的数据库中迁移至 prisma，以下仅做手动建表的示例，详细请查看 Prisma 架构（参考）
generator client {
provider = "prisma-client-js"
}

    datasource db {
      provider = "mysql"
      url      = env("DATABASE_URL")
    }

    model user {
      //BigInt类型	主键 自增值	非负BitInt
      id       BigInt    @id @default(autoincrement()) @db.UnsignedBigInt()
      //字符串，默认为varchar(191)
      email    String
      password String
      //添加时自动设置时间，即设置Mysql默认值为CURRENT_TIMESTAMP
      createdAt DateTime @default(now())
      // 让Prisma在添加与更新时自动维护该字段
      updatedAt DateTime @updatedAt
    }

##### 2.生成迁移

① 手动迁移
要将数据模型映射到数据库模式(即创建相应的数据库表)，你需要使用  prisma migrate CLI 命令
$ npx prisma migrate dev --name init

该命令做了两件事：

它为此迁移创建一个新的 SQL 迁移文件
它针对数据库运行 SQL 迁移文件

该命令执行动作为：

根据定义生成迁移文件
执行新的迁移文件修改数据表
生成 Prisma Client

② 自动迁移
执行以下命令，将自动根据已经存在的数据库生成文件  prisman/schema.prisma ，而不需要向上面一样手动定义。
$ npx prisma db pull

#### 5.安装客户端

$ npx prisma generate

客户端提供众多方法完成对数据的增删改查
你可以查看文档  prisma-client 了解详细使用

#### 6.更新表结构

使用   db push  来改变现有的原型架构，例如在某一个表中新增某个字段
$ npx prisma db push

#### 7.重置数据库

如果你是使用自动迁移的方法导入映射关系，请确保你的数据留有备份，执行此操作在没有数据迁移记录的情况下，可能导致数据丢失。
通过运行以下命令自行   重置   数据库以撤消手动更改或   db push 的实验:
$ npx prisma migrate reset

该命令执行动作为:

如果环境允许，则删除数据库；如果环境不允许删除数据库，则执行软重置。
如果数据库被删除，则创建相同名称的新数据库。
适用于所有迁移。
运行种子脚本。

### 三、配置 log 日志输出

本文的配置环境是 node18.18.1；prisma 与@prisma/client 的版本均为 5.5.2
简单配置
在 src 目录下创建.env 文件
在 env 文件中
ini 复制代码#定义环境
NODE_ENV=development

在 src 目录下创建 config.ts 文件
//config.ts
export default () => ({

      app: {

        name: 'MingxiangLuo',

        isDev: process.env.NODE_ENV == 'development',

      },

      database: {

        url: 'localhost',

      },

    });

确保你的 prisma.module.ts 中有提供和导出 PrismaService，例如：
kotlin 复制代码 //prisma.module.ts
import { Global, Module } from '@nestjs/common';

    import { PrismaService } from './prisma.service';

    @Global()

    @Module({

      providers: [PrismaService],

      exports: [PrismaService],

    })

    export class PrismaModule {}

prisma 日志配置
官方在文档中做了如下说明：配置日志记录（概念）
创建 prisma.service.ts ，粘贴如下代码
prisma.service.ts 复制代码 import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

    @Injectable()
    export class PrismaService extends PrismaClient {
      constructor(configService: ConfigService) {
        //输出查询SQL等LOG
        super(
          configService.getOrThrow('app.isDev')
            ? { log: ['query', 'info', 'warn', 'error'] }
            : undefined,
        );
      }
    }

创建 prisma.module.ts，粘贴如下代码
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

    @Global()
    @Module({
      providers: [PrismaService],
      exports: [PrismaService],
    })
    export class PrismaModule {}

在全局使用
在 app.module.ts 添加如下代码
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    PrismModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [],
  providers: [],

})

export class AppModule {}

在装饰器的构造函数中使用
constructor(

private readonly prisma: PrismaService,

) {}

基于事务配置
当我根据官方的文档配置时（stdout 转成基于事件）出现了以下问题:
在 on 监听报错
类型“string”的参数不能赋给类型“never”的参数。ts(2345)

首先我在 stack overflow 中找到类似问题：
typescript - Logging with Prisma 2 and NestJS - Dependency Injection problem? - Stack Overflow
但似乎不太能对我有帮助，于是我前往 github prisma 官方 issues 中找到答案,通过标签筛选出与 logging 有关的，我找到 issue#5026 与 issue#35
issue#5026：Printing full SQL queries with parameters in debug mode · Issue #5026 · prisma/prisma · GitHub
issue#35：How to access $on in PrismaService? · Issue #35 · notiz-dev/nestjs-prisma · GitHub
通过阅读各位大佬的回复，我发现这极有可能是本地 ts 语法检测有问题，于是我为报错的代码上一行添加 //@ts-ignore 这一句代码，即
prisma.service.ts
import { Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    //输出查询 SQL 等 LOG
    super(
      configService.getOrThrow('app.isDev')
        ? {
            log: [
              {
                emit: 'event',
                level: 'query' as const,
              },
              {
                emit: 'stdout',
                level: 'error',
              },
              {
                emit: 'stdout',
                level: 'info',
              },
              {
                emit: 'stdout',
                level: 'warn',
              },
            ],
          }
        : undefined,
    );

//@ts-ignore
    this.$on('query', async (e) => {
      //@ts-ignore
      let timestamp = new Date();
      //@ts-ignore
      let query = e.query;
      //@ts-ignore
      let params = JSON.parse(e.params);
      //@ts-ignore
      let duration = e.duration;
      console.log({
        Timestamp: timestamp,
        Query: query,
        Params: params,
        Duration: duration,
      });
    });
  }
}

以上代码无报错提示，能够正常打印输出 log 日志
四、总结
本文为您介绍了如何在 NestJS 中使用 Prisma 以及配置 prisma 日志记录,希望通过本文的学习能够帮助您更好地使用 NestJS 搭建服务端。本文若有错误的地方，欢迎大家来互相交流鸭~