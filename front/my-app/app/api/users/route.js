import { NextResponse } from "next/server"

export async function GET() {
    try {
        const res = await fetch('http://localhost:3000/api/v1/users');

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// export async function GET() {
//   const users = [
//     { id: 1, name: "User 1", created_at: "2023-01-01", posts_count: 10 },
//     { id: 2, name: "User 2", created_at: "2023-02-01", posts_count: 20 },
//     // 他のユーザーのデータ...
//   ];
//   return NextResponse.json(users);
// }
