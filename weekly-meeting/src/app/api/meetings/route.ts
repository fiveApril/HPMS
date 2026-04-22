import { NextRequest, NextResponse } from "next/server";
import { getWeekEntries, saveEntry, deleteEntry, MeetingEntry } from "@/lib/storage";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const weekKey = req.nextUrl.searchParams.get("weekKey");
  if (!weekKey) return NextResponse.json({ error: "weekKey required" }, { status: 400 });
  return NextResponse.json(getWeekEntries(weekKey));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry: MeetingEntry = {
    id: body.id ?? randomUUID(),
    name: body.name,
    weekKey: body.weekKey,
    thisWeek: body.thisWeek ?? "",
    nextWeek: body.nextWeek ?? "",
    shared: body.shared ?? "",
    updatedAt: new Date().toISOString(),
  };
  saveEntry(entry);
  return NextResponse.json(entry);
}

export async function DELETE(req: NextRequest) {
  const weekKey = req.nextUrl.searchParams.get("weekKey");
  const id = req.nextUrl.searchParams.get("id");
  if (!weekKey || !id) return NextResponse.json({ error: "weekKey and id required" }, { status: 400 });
  deleteEntry(weekKey, id);
  return NextResponse.json({ ok: true });
}
