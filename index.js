// node.jsの標準ライブラリであるhttpモジュールとurlモジュールをインポートする
import http from "node:http";
import url from "node:url";

// 環境変数でPORTが指定されていればそれを使う。なければ8888番ポートを使う。
const PORT = process.env.PORT || 8888;

// http.createServer() でサーバーを生成する。
// このメソッドには、リクエストが来るたびに実行されるコールバック関数を渡す。
const server = http.createServer((req, res) => {
  // リクエストURLをパースして、パス名やクエリパラメータを取得しやすくする
  const parsedUrl = url.parse(req.url, true);

  // Content-Typeヘッダーをtext/plain; charset=utf-8に設定
  // これでブラウザが日本語を正しく表示できるようになる
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // URLのパスによって処理を分岐する
  if (parsedUrl.pathname === "/") {
    console.log("ルートパス (/) へのリクエストがありました。");
    // ステータスコード200 (OK) を設定
    res.writeHead(200);
    // レスポンスボディに「こんにちは！」を書き込む
    res.end("こんにちは！");
  } else if (parsedUrl.pathname === "/ask") {
    console.log("/ask パスへのリクエストがありました。");
    // クエリパラメータからqの値を取得する
    const question = parsedUrl.query.q;
    // ステータスコード200 (OK) を設定
    res.writeHead(200);
    // レスポンスボディに質問内容を書き込む
    res.end(`Your question is '${question}'`);
  } else {
    console.log("未定義のパスへのリクエストがありました。");
    // ステータスコード404 (Not Found) を設定
    res.writeHead(404);
    // レスポンスボディに「ページが見つかりません」と書き込む
    res.end("ページが見つかりません");
  }
});

// 指定したポートでリクエストの待受を開始する
server.listen(PORT, () => {
  console.log(
    `サーバーが起動しました。 http://localhost:${PORT} で待受中です。`
  );
});
