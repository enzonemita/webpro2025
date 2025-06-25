// 生成した Prisma Client をインポート
// このClientは、`npx prisma migrate dev` を実行したときに自動で生成・更新されるものよ
import { PrismaClient } from "./generated/prisma/client";

// PrismaClientのインスタンスを作成する
const prisma = new PrismaClient({
  // Prismaが実行するクエリをコンソールにログ出力するための設定
  log: ["query"],
});

// データベース操作は非同期で行われるため、async/await を使ったメイン関数を定義する
async function main() {
  console.log("Prisma Client を初期化しました。");

  // データベースに接続して、全てのユーザーを取得する
  const usersBefore = await prisma.user.findMany();
  console.log("Before ユーザー一覧:", usersBefore);

  // 新しいユーザーを1件作成する
  const newUser = await prisma.user.create({
    data: {
      name: `新しいユーザー ${new Date().toISOString()}`,
    },
  });
  console.log("新しいユーザーを追加しました:", newUser);

  // もう一度、全てのユーザーを取得して、追加されたことを確認する
  const usersAfter = await prisma.user.findMany();
  console.log("After ユーザー一覧:", usersAfter);
}

// main 関数を実行する
main()
  .catch((e) => {
    // もしエラーが発生したら、内容を表示して異常終了する
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 処理が成功しても失敗しても、必ず最後にデータベースとの接続を切断する
    await prisma.$disconnect();
    console.log("Prisma Client を切断しました。");
  });
