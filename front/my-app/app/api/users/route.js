import { NextResponse } from "next/server"

// export const GET = () => {
//     return NextResponse.json({ hello: "hello" })
// }

export async function GET() {
    try {
        const res = await fetch('http://localhost:3000/api/v1/users');

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch users data' }, { status: res.status });
        }

        const data = await res.json();

        if (!data) {
            return NextResponse.json({ error: 'No data returned from the API' }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching users data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
