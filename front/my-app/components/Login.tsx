"use client";
import { useState, useRef, useLayoutEffect, KeyboardEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

const Login = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isGuestLogin, setIsGuestLogin] = useState<boolean>(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault(); // Enterキーのデフォルト動作を防ぐ
      passwordInputRef.current?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions`,
        {
          session: {
            email: email,
            password: password,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      setSuccess("ログインに成功しました");
      window.location.href = `/rooms`;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        setError(responseData.error || "ログインに失敗しました");
      } else {
        setError("ログインに失敗しました");
      }
      setEmail("");
      setPassword("");
    }
  };

  const handleGuestLogin = (): void => {
    setEmail("guest@example.com");
    setPassword("foobar");
    setIsGuestLogin(true);
  };

  useLayoutEffect(() => {
    if (isGuestLogin && formRef.current) {
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(submitEvent);
      setIsGuestLogin(false);
    }
  }, [email, password, isGuestLogin]);

  return (
    <div className="fixed top-20 md:right-10 2xl:right-72 my-10 mx-auto md:mx-0 md:w-auto w-full">
      <div className="container shadow-custom-dark p-10 max-w-72 rounded-2xl bg-white flex flex-col items-center space-y-3">
        <p></p>
        <h1 className="text-4xl">ようこそ！</h1>
        <p></p>
        <form onSubmit={handleSubmit} className="w-full space-y-4" ref={formRef}>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <Input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordInputRef}
            autoComplete="current-password"
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
    </div>
  );
};

export default Login;
