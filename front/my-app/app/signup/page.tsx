"use client";
import { useState, useRef, KeyboardEvent, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUp = (): JSX.Element => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      ref.current?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
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
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        setError(
          responseData.errors.join(", ") || "ユーザー登録に失敗しました"
        );
        return;
      }

      try {
        // 自動ログインのためのAPI呼び出し
        const loginResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions`,
          {
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
          }
        );

        const loginResponseData = await loginResponse.json();
        if (!loginResponse.ok) {
          setError(loginResponseData.error || "ログインに失敗しました");
          return;
        }
        window.location.href = "/dashboard";
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
        <Input
          type="text"
          placeholder="アカウントネーム"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, emailRef)}
        />
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          ref={emailRef}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          ref={passwordRef}
          onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
        />
        <Input
          type="password"
          placeholder="確認用パスワード"
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          ref={confirmPasswordRef}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
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
