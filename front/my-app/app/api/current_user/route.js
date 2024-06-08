import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:3000/api/v1/current_user", {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
