import { NextResponse } from "next/server";

export async function DELETE({ params }) {
  const { id } = params;

  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/relationships/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
