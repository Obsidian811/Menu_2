"use client";

import Papa from "papaparse";
import { useEffect, useState } from "react";

export async function fetchMenuFromGoogleSheet(sheetUrl: string) {
  const res = await fetch("Sheet url", { cache: "no-store" }); // always fetch latest
  const csv = await res.text();

  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return data; // returns array of objects
}