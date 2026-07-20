
import { NextResponse } from "next/server";

const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID!;
const API_KEY = process.env.UMAMI_API_KEY!;
const BASE_URL = process.env.UMAMI_API_URL!;

function getDateRange() {
  return {
    startAt:
      Date.now() - 1000 * 60 * 60 * 24 * 7,
    endAt: Date.now(),
  };
}

async function fetchUmami(endpoint: string) {
  const { startAt, endAt } = getDateRange();

  const res = await fetch(
    `${BASE_URL}/websites/${WEBSITE_ID}/${endpoint}?startAt=${startAt}&endAt=${endAt}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },

      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.log(
      `Failed endpoint: ${endpoint}`,
      res.status
    );

    return null;
  }

  const text = await res.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}


async function fetchMetrics(type: string) {
  const { startAt, endAt } = getDateRange();

  const res = await fetch(
    `${BASE_URL}/websites/${WEBSITE_ID}/metrics?type=${type}&startAt=${startAt}&endAt=${endAt}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },

      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.log(
      `Failed metrics: ${type}`,
      res.status
    );

    return null;
  }


  const text = await res.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);

  // return res.json();
}


export async function GET() {
  try {
    const [
      stats,
      pageviews,
      pages,
      referrers,
      countries,
      devices,
      browsers,
      os,
      events,
      active,
    ] = await Promise.all([
      fetchUmami("stats"),
      fetchUmami("pageviews"),
      fetchUmami("pages"),

      fetchMetrics("referrer"),
      fetchMetrics("country"),
      fetchMetrics("device"),
      fetchMetrics("browser"),
      fetchMetrics("os"),

      fetchUmami("events"),
      fetchUmami("active"),
    ]);

    return NextResponse.json({
      stats,
      pageviews,
      pages,
      referrers,
      countries,
      devices,
      browsers,
      os,
      events,
      active,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
      },
      {
        status: 500,
      }
    );
  }
}