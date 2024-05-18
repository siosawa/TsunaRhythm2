import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import Login from '@/components/Login';

test('h1が存在するかどうか', () => {
    render(<Login />);
    const h1El = screen.getByText("ようこそ！");
    expect(h1El).toBeInTheDocument(); 
});

