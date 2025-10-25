import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true",
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 }, // cache for 1 minute
      }
    );

    if (!res.ok) throw new Error("Failed to fetch CoinGecko data");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("CoinGecko API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
