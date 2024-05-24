import { render, screen, fireEvent } from "@testing-library/react";
// import '@testing-library/jest-dom'; はsetupTests.jsで設定しているので不要
import Login from "@/components/Login";
import SignUp from "@/app/signup/page";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// モック化された fetch 関数を設定
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
);

// Login コンポーネントのモック
const LoginMock = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/signup")}>アカウントを新規作成</button>
    </div>
  );
};

describe("Login Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("h1タグに「ようこそ!」が存在しているか", () => {
    render(<Login />);
    const h1El = screen.getByText("ようこそ！");
    expect(h1El).toBeInTheDocument();
    expect(h1El.tagName).toBe("H1");
  });

  test("ログインが成功するか", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );

    render(<Login />);

    const email = "sawata@example.com";
    const password = "password";

    fireEvent.change(screen.getByPlaceholderText("メールアドレス"), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText("パスワード"), {
      target: { value: password },
    });
    fireEvent.click(screen.getByText("ログイン"));

    const successMessage = await screen.findByText("ログインに成功しました");
    expect(successMessage).toBeInTheDocument();
  });

  test("ゲストログインが成功するか", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );

    render(<Login />);

    // ゲストログインボタンをクリック
    fireEvent.click(screen.getByText("ゲストログイン"));

    // 成功メッセージの確認
    const successMessage = await screen.findByText("ログインに成功しました");
    expect(successMessage).toBeInTheDocument();
  });
  test("アカウント新規作成ボタンを押した時に /signup に遷移するか", () => {
    render(
      <Router>
        <Routes>
          <Route path="/" element={<LoginMock />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>,
    );

    // アカウント新規作成ボタンをクリック
    fireEvent.click(screen.getByText("アカウントを新規作成"));

    // /signup ページが表示されているかを確認
    expect(window.location.pathname).toBe("/signup");
  });
});
