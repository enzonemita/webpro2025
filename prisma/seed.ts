// prisma/seed.ts

import { PrismaClient } from "../generated/prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Day 1 のデータを作成 ---
  const day1 = await prisma.day.create({
    data: {
      dayNumber: 1,
      title: "チャートの基本",
      description:
        "株価がどうやって動くのか、基本的なチャートの読み方を学びます。",
      lessons: {
        create: [
          // Dayに紐づくLessonも一緒に作成
          {
            title: "ローソク足ってなあに？",
            content:
              "ローソク足は、一本で『始値』『終値』『高値』『安値』の4つの値段を表す優れものよ。<strong>陽線</strong>は始値より終値が高い状態で、<strong>陰線</strong>はその逆ね。",
            quizzes: {
              create: [
                // Lessonに紐づくQuizも一緒に作成
                {
                  question:
                    "始値より終値が高い状態を表すローソク足は次のうちどれ？",
                  option1: "陽線",
                  option2: "陰線",
                  option3: "十字線",
                  correctOption: 1,
                  explanation:
                    "陽線は株価が上がったことを示す、ポジティブなサインよ。",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // --- Day 2 のデータを作成 ---
  const day2 = await prisma.day.create({
    data: {
      dayNumber: 2,
      title: "決算ってなんだろう？",
      description: "会社の成績表である決算短信を読むための第一歩を学びます。",
    },
  });

  console.log(`Seeding finished.`);
  console.log({ day1, day2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
