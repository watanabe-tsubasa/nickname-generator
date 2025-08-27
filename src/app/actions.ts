"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateNickname(name: string): Promise<string> {
  if (!name) {
    return "名前を入力してください。";
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates creative nicknames.",
        },
        {
          role: "user",
          content: `"${name}"という名前のニックネームを3つ提案してください。`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const result = completion.choices[0]?.message?.content?.trim();
    return result ?? "ニックネームを生成できませんでした。";
  } catch (error) {
    console.error("Error generating nickname:", error);
    return "エラーが発生しました。";
  }
}
