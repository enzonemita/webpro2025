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

app.get("/", async (req, res) => {
  // "/days" のページに自動で転送（リダイレクト）する
  res.redirect("/days");
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

// 学習日の一覧ページ
app.get("/days", async (req, res) => {
  const days = await prisma.day.findMany({
    orderBy: { dayNumber: "asc" }, // 日付順に並べると親切ね
  });
  // 'days.ejs' という新しいテンプレートを呼び出して、取得したデータを渡す
  res.render("days", { days });
});

// 各学習日の詳細ページ
app.get("/days/:dayNumber", async (req, res) => {
  // URLからdayNumberを取得する (例: "/days/1" なら 1 が取れる)
  const dayNumber = Number(req.params.dayNumber);

  // 指定されたdayNumberのDayを、それに紐づくLessonも一緒に取得する
  // prisma.day.findUnique の部分
  const day = await prisma.day.findUnique({
    where: { dayNumber: dayNumber },
    include: {
      lessons: {
        // lessonsを取得するときに...
        include: {
          quizzes: true, // ...それに紐づくquizzesも一緒に取得する
        },
      },
    },
  });

  // もし指定された番号のDayが見つからなかったら、404エラーを返す
  if (!day) {
    return res.status(404).send("その学習日は見つかりませんでした。");
  }

  // 'day-detail.ejs'という新しいテンプレートを呼び出して、取得したデータを渡す
  res.render("day-detail", { day });
});

// クイズの回答を処理する
app.post("/quiz/answer", async (req, res) => {
  const quizId = Number(req.body.quizId);
  const userAnswer = Number(req.body.answer);

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });

  if (!quiz) {
    return res.status(404).send("クイズが見つかりません。");
  }

  const isCorrect = userAnswer === quiz.correctOption;

  // 'quiz-result.ejs' を呼び出して、クイズの情報と正解かどうかを渡す
  res.render("quiz-result", { quiz, isCorrect });
});

// サーバーを指定したポートで起動する
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
