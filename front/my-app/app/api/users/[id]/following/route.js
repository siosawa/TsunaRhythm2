import { NextResponse } from 'next/server';

export async function GET({ params }) {
  const { id } = params;

  try {
    // ここでバックエンドAPIを呼び出してフォロー中のユーザー情報を取得
    const res = await fetch(`http://localhost:3000/api/v1/users/${id}/following`, {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
