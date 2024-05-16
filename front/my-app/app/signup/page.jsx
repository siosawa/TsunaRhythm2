'use client';

import { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  const handleKeyDown = (event, ref) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Enterキーのデフォルト動作を防ぐ
      ref.current.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // ここでサインアップロジックを実装します（例：APIにデータを送信）
    console.log('メールアドレス:', email);
    console.log('パスワード:', password);
    console.log('確認用パスワード:', confirmPassword);
  };

  return (
    <div className="container shadow-lg p-10 max-w-72 flex flex-col items-center space-y-3 fixed top-20 right-0 lg:right-10 2xl:right-72 my-10 mx-10 rounded-2xl bg-white">
      <h1 className="text-4xl mb-6">新規作成</h1>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input 
          placeholder="メールアドレス" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
        />
        <Input 
          type="password" 
          placeholder="パスワード" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordRef}
          onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
        />
        <Input 
          type="password" 
          placeholder="確認用パスワード" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          ref={confirmPasswordRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Enterキーのデフォルト動作を防ぐ
              handleSubmit(e);
            }
          }}
        />
        <Button 
          type="submit" 
          className="bg-emerald-500 text-white shadow-lg hover:bg-emerald-700 w-full"
          ref={submitButtonRef}
        >
          アカウントを新規作成
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
