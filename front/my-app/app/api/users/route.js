import { NextResponse } from "next/server"
// export const GET = () => {
//     return NextResponse.json({ hello: "hello" })
// }
export async function GET() {
    const res = await fetch('http://localhost:3000/api/v1/users');
    const data = await res.json();
    return NextResponse.json({ data });
}


