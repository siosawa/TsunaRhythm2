"use client";
import { useState, useRef, useLayoutEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const passwordInputRef = useRef(null);
  const [isGuestLogin, setIsGuestLogin] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Enterキーのデフォルト動作を防ぐ
      passwordInputRef.current.focus(); // パスワードフィールドにフォーカスを移動
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/v1/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          session: {
            email: email,
            password: password,
          },
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.error || "ログインに失敗しました");
        return;
      }

      setSuccess("ログインに成功しました");
      setError("");
      // ログイン成功後の処理はここに追加（例：リダイレクト）
      window.location.href = `/rooms`;
      // setEmail("");
      // setPassword("");
    } catch (error) {
      setError("ログインに失敗しました");
    }
  };

  const handleGuestLogin = () => {
    setEmail("guest@example.com");
    setPassword("foobar");
    setIsGuestLogin(true); // フラグを設定
  };

  useLayoutEffect(() => {
    if (isGuestLogin) {
      handleSubmit(new Event("submit", { bubbles: true, cancelable: true }));
      setIsGuestLogin(false); // フラグをリセット
    }
  }, [email, password, isGuestLogin]); // isGuestLoginを依存配列に追加

  return (
    <div className="container shadow-lg p-10 max-w-72 flex flex-col items-center space-y-3 fixed top-20 right-0 lg:right-10 2xl:right-72 my-10 mx-10 rounded-2xl">
      <p></p>
      <h1 className="text-4xl">ようこそ！</h1>
      <p></p>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="email" // autocomplete属性を追加
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordInputRef}
          autoComplete="current-password" // autocomplete属性を追加
        />
        <Button
          type="submit"
          className="bg-emerald-500 text-white shadow-lg hover:bg-emerald-700 w-full"
        >
          ログイン
        </Button>
      </form>
      <p></p>
      <Button
        onClick={handleGuestLogin}
        className="bg-emerald-500 text-white shadow-lg hover:bg-emerald-700 w-full"
      >
        ゲストログイン
      </Button>
      <p></p>
      <p>アカウントが未設定ですか？</p>
      <Button
        asChild
        className="bg-emerald-500 text-white shadow-lg hover:bg-emerald-700 w-full"
      >
        <Link href="/signup">アカウントを新規作成</Link>
      </Button>
      <p className="mb-10"></p>
    </div>
  );
};

export default Login;
