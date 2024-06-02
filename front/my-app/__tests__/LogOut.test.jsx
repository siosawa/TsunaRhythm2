import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Settings from "@/components/Settings";
import Login from "@/components/Login";

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
);

describe("Setting Component", () => {
  beforeEach(async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    // ゲストログインボタンをクリック
    render(<Login />);
    fireEvent.click(screen.getByText("ゲストログイン"));

    // ログイン成功メッセージが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("ログインに成功しました")).toBeInTheDocument();
    });
  });

  test("ログアウトボタンをクリックした時にログアウトが成功するか", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    // window.location.href をモック化
    render(<Settings />);

    // ドロップダウンメニューを開く
    fireEvent.click(screen.getByText("設定"));

    // ログアウトボタンを取得してクリック
    const logoutButton = await screen.getByText("ログアウト");
    fireEvent.click(logoutButton);
    expect(window.location.pathname).toBe("/diarys");
  });
});
