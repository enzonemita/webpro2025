import express from "express";
// 生成した Prisma Client をインポート
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient({
  // クエリが実行されたときに実際に実行したクエリをログに表示する設定
  log: ["query"],
});
const app = express();

// 環境変数が設定されていれば、そこからポート番号を取得する。環境変数に設定がなければ 8888 を使用する。
const PORT = process.env.PORT || 8888;

// EJS をテンプレートエンジンとして設定するわ
app.set("view engine", "ejs");
// EJSのテンプレートファイルが置かれているディレクトリを指定
app.set("views", "./views");

// HTMLのフォームから送信されたデータ（POSTリクエストのボディ）を解析できるようにするおまじない
app.use(express.urlencoded({ extended: true }));

// ルートパス ("/") へのGETリクエストに対する処理
app.get("/", async (req, res) => {
  // データベースから全てのユーザーを取得
  const users = await prisma.user.findMany();
  // 'index.ejs' を使ってHTMLを生成し、'users'という名前でデータを渡す
  res.render("index", { users });
});

// "/users" へのPOSTリクエストに対する処理（ユーザー追加）
app.post("/users", async (req, res) => {
  // フォームの 'name' フィールドから送信された値を取得
  const name = req.body.name;
  if (name) {
    // データベースに新しいユーザーを作成
    const newUser = await prisma.user.create({
      data: { name },
    });
    console.log("新しいユーザーを追加しました:", newUser);
  }
  // 処理が終わったら、ルートパスにリダイレクト（ページを再読み込みさせる）
  res.redirect("/");
});

// サーバーを指定したポートで起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
