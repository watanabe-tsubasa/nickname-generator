"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateNickname(name: string): Promise<string> {
  if (!name) {
    return "名前を入力してください。";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 最新推奨モデル
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates creative nicknames.",
        },
        {
          role: "user",
          content: `"${name}"という名前のニックネームを3つ提案してください。マークダウンは含めないでください。`,
        },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim();
    return result ?? "ニックネームを生成できませんでした。";
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error generating nickname:", error.message);
    } else {
      console.error("Unknown error generating nickname:", error);
    }
    return "エラーが発生しました。";
  }
}
