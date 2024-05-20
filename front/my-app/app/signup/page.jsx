"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  const handleKeyDown = (event, ref) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Enterキーのデフォルト動作を防ぐ
      ref.current.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    try {
      // アカウント作成APIの呼び出し
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            name: name,
            email: email,
            password: password,
            password_confirmation: confirmPassword,
          },
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.errors.join(", ") || "ユーザー登録に失敗しました");
        return;
      }

      // アカウント作成成功
      setSuccess("アカウントが作成されました");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");

      try {
        // 自動ログインのためのAPI呼び出し
        const loginResponse = await fetch("http://localhost:3000/api/v1/sessions", {
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

        const loginResponseData = await loginResponse.json();
        if (!loginResponse.ok) {
          setError(loginResponseData.error || "ログインに失敗しました");
          return;
        }

        setSuccess("アカウントが作成され、ログインに成功しました");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // ログイン成功後の処理（例：リダイレクト）
        window.location.href = '/diarys'; //一時的に/diarysを使用

      } catch (error) {
        setError("ログインに失敗しました");
      }

    } catch (error) {
      setError("ユーザー登録に失敗しました");
    }
  };

  return (
    <div className="container shadow-lg p-10 max-w-72 flex flex-col items-center space-y-3 fixed top-20 right-0 lg:right-10 2xl:right-72 my-10 mx-10 rounded-2xl bg-white">
      <h1 className="text-4xl mb-6">新規作成</h1>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <Input
          placeholder="アカウントネーム"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, emailRef)}
        />
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ref={emailRef}
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
            if (e.key === "Enter") {
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
