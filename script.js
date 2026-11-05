/* ============================================================
   接待じゃんけん — script.js

   手のボタンを押したときに
   1. 押したボタンから、自分の手（0～2）を決める
   2. 部長の手を決める（予告していた手を出して、次の手も前もって決めておく）
   3. 両者の手を画面に表示する
   4. 勝ち負けを判定する
   5. 結果によって評価を変える（勝ち -20、負け +10、あいこ ±0）
   6. 評価を画面に表示して、危機の演出を切り替える
      ・20点以下 → 大ピンチの演出
      ・30点以下 → ピンチの演出
      ・それ以外 → 平常に戻す
   7. 評価と結果によって、部長のセリフを決める
      ・評価が0以下 → クビ
      ・評価が100以上 → 昇進
      ・それ以外で、勝ったとき → 不機嫌
      ・それ以外で、負けたとき → 上機嫌
      ・それ以外（あいこ）→ もう一回
      ・評価が50点以下なら、50%の確率で次の手のヒントを出す
   8. 結果と部長のセリフを画面に表示する

   もう一度やるボタンを押したときに
   1. 評価を50点に戻す
   2. 手のボタンを押せるように戻す
   3. もう一度ボタンを隠して、危機の演出を元に戻す
   4. 画面の表示を最初の状態に戻す
============================================================ */

let handNames = ["グー", "チョキ", "パー"];
let score = 50;
let nextBossHand = Math.floor(Math.random() * 3);         //部長の次の手（前もって決めておく）

$(".hand-button").on("click", function () {
   // 1. 自分の手を決める
   let playerHand = $(this).data("hand");
   // 2. 部長の手を決める（予告していた手を出して、次の手も決めておく）
   let bossHand = nextBossHand;
   nextBossHand = Math.floor(Math.random() * 3);
   // 3. 両者の手を画面に表示する
   $(".player-hand").text("あなた：" + handNames[playerHand]);
   $(".boss-hand").text("部長：" + handNames[bossHand]);

   // 4.勝ち負けを判定する
   let result = "";

   if (playerHand === bossHand) {
      result = "あいこ";
   } else if (
      (playerHand === 0 && bossHand === 1) ||
      (playerHand === 1 && bossHand === 2) ||
      (playerHand === 2 && bossHand === 0)
   ) {
      result = "勝ち";
   } else {
      result = "負け";
   }

   // 5. 結果によって評価を変える
   if (result === "勝ち") {
      score = score - 20;
   } else if (result === "負け") {
      score = score + 10;
   }

   // 6. 評価を画面に表示する
   $(".score").text("部長からの評価：" + score + "点");

   // 評価によって、危機の演出を切り替える
   if (score <= 20) {
      $("body").addClass("pinch danger");
   } else if (score <= 30) {
      $("body").addClass("pinch");
      $("body").removeClass("danger");
   } else {
      $("body").removeClass("pinch danger");

   }


   // 7. 評価と結果によって、部長のセリフを決める
   let bossLine = "";

   if (score <= 0) {
      bossLine = "部長「明日から来なくていい」";
      $(".hand-button").prop("disabled",true);
      $(".retry-button").show();
   } else if (score >= 100) {
      bossLine = "部長「君、来月から課長だ！」";
      $(".hand-button").prop("disabled",true);
      $(".retry-button").show();
   } else if (result === "勝ち") {
      bossLine = "部長「…ほう。君、空気が読めないタイプか」";
   } else if (result === "負け") {
      bossLine = "部長「はっはっはっ！まだまだだな」";
   } else {
      bossLine = "部長「あいこか。もう一回だ」";
   }

   // 評価が50点以下で、ゲームが続いているときは50%の確率でヒントを出す
   if (score > 0 && score <= 50 && Math.random() < 0.5) {
      bossLine = bossLine + "\n部長「次は" + handNames[nextBossHand] + "をだしちゃおっかな～」";
   }

   // 8. 結果と部長のセリフを表示する
   $(".message").text(result + "\n" + bossLine);
});

$(".retry-button").on("click", function () {
   // 1. 評価を50点に戻す
   score = 50;

   // 2. 手のボタンを押せるように戻す
   $(".hand-button").prop("disabled", false);

   // 3. もう一度ボタンを隠す
   $(".retry-button").hide();
   $("body").removeClass("pinch danger");

   // 4. 画面の表示を最初の状態に戻す
   $(".score").text("部長からの評価：50点");
   $(".player-hand").text("あなた：？");
   $(".boss-hand").text("部長：？");
   $(".message").text("部長「さぁ、勝負だ。手加減はいらんぞ」");
});