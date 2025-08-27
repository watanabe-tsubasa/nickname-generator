'use client';

import { useState, useTransition } from 'react';
import { generateNickname } from './actions';
import { BackgroundAnimation } from './BackgroundAnimation';

export default function Home() {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await generateNickname(name);
      setNickname(result);
    });
  };

  return (
    <div className="relative font-sans min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 背景アニメーション */}
      <div className="absolute inset-0 -z-10">
        <BackgroundAnimation />
      </div>

      <header className="text-center relative z-10 p-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-blue-600 drop-shadow-lg">
          あだ名錬成マシーン3000
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          OpenAI APIとNext.js Server Actionsで遊んでみよう
        </p>
      </header>

      <main className="flex flex-col gap-8 w-full max-w-md mx-auto relative z-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              名前を入力してください
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：山田太郎"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !name}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? '生成中...' : 'ニックネームを生成'}
          </button>
        </form>

        {nickname && (
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md relative z-10">
            <h2 className="text-2xl font-semibold mb-4">生成されたニックネーム</h2>
            <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{nickname}</p>
          </div>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 mt-10 relative z-10">
        <p>Powered by Next.js, OpenAI, and a sprinkle of p5.js ✨</p>
      </footer>
    </div>
  );
}
