import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom'; はsetupTests.jsで設定しているので不要
import Login from '@/components/Login';

test('h1タグに「ようこそ!」が存在しているか', () => {
    render(<Login />);
    const h1El = screen.getByText("ようこそ！");
    expect(h1El).toBeInTheDocument(); 
    expect(h1El.tagName).toBe("H1");
});

