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

app.post("/users", async (req, res) => {
  const name = req.body.name; // フォームから送信された名前を取得
  const age = Number(req.body.age); // フォームから送信された年齢を取得

  // 年齢が数字じゃなかったらエラーを返すようにする
  if (req.body.age && isNaN(age)) {
    console.error("年齢は数値でなければなりません。");
    res.status(400).send("年齢は数値でなければなりません。");
    return;
  }

  if (name) {
    const newUser = await prisma.user.create({
      data: {
        name,
        age: req.body.age ? age : null, // 年齢が入力されていれば数値で、なければnullで保存
      },
    });
    console.log("新しいユーザーを追加しました:", newUser);
  }
  res.redirect("/"); // ユーザー追加後、一覧ページにリダイレクト
});

// サーバーを指定したポートで起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
