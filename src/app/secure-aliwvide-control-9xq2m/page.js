"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function makeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^_+|_+$/g, "");
}

function getField(row, names) {
  const entries = Object.entries(row);
  for (const name of names) {
    const target = normalizeKey(name);
    const found = entries.find(([key]) => normalizeKey(key) === target);
    if (found) return found[1];
  }
  return "";
}

function buildJsonFromWorkbook(workbook) {
  const output = {};

  workbook.SheetNames.forEach((sheetName) => {
    if (sheetName.toLowerCase() === "readme") return;

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    rows.forEach((row) => {
      const countryFromRow = getField(row, ["Country"]);
      const countryName = countryFromRow || sheetName;
      const countrySlug = makeSlug(countryName);

      const category = String(getField(row, ["Category"]) || "").trim().toLowerCase();
      const name = String(getField(row, ["Name"]) || "").trim();

      if (!countrySlug || !category || !name) return;

      if (!output[countrySlug]) output[countrySlug] = {};
      if (!output[countrySlug][category]) output[countrySlug][category] = [];

      output[countrySlug][category].push({
        name,
        type: String(getField(row, ["Type", "Short Type"]) || "").trim(),
        description: String(getField(row, ["Description"]) || "").trim(),
        web: String(getField(row, ["Website", "Web"]) || "").trim(),
        android: String(getField(row, ["Android", "Android Link"]) || "").trim(),
        ios: String(getField(row, ["iOS", "IOS", "Apple", "Apple Link"]) || "").trim(),
        badges: [
          String(getField(row, ["Badge1", "Badge 1"]) || "").trim(),
          String(getField(row, ["Badge2", "Badge 2"]) || "").trim(),
          String(getField(row, ["Badge3", "Badge 3"]) || "").trim()
        ].filter(Boolean),
        docs: [
          String(getField(row, ["Instruction1", "Instruction 1"]) || "").trim(),
          String(getField(row, ["Instruction2", "Instruction 2"]) || "").trim(),
          String(getField(row, ["Instruction3", "Instruction 3"]) || "").trim()
        ].filter(Boolean)
      });
    });
  });

  return output;
}

export default function AdminPage() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [status, setStatus] = useState("Upload your Excel file to preview and export JSON.");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("Reading Excel file...");

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      setSheetNames(workbook.SheetNames);

      const converted = buildJsonFromWorkbook(workbook);
      setJsonData(converted);

      const previewRows = [];
      workbook.SheetNames.forEach((sheetName) => {
        if (sheetName.toLowerCase() === "readme") return;
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        json.forEach((row) => {
          const name = getField(row, ["Name"]);
          const category = getField(row, ["Category"]);
          if (name || category) previewRows.push({ Country: getField(row, ["Country"]) || sheetName, ...row });
        });
      });

      setRows(previewRows.slice(0, 100));
      setStatus("Excel converted successfully. You can now export JSON.");
    } catch (error) {
      console.error(error);
      setStatus("Error reading Excel file. Please check the format and try again.");
    }
  }

  function downloadJson() {
    if (!jsonData) {
      setStatus("Please upload Excel first.");
      return;
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "countries-data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setStatus("JSON downloaded. You can use it to update your website data.");
  }

  function copyJson() {
    if (!jsonData) {
      setStatus("Please upload Excel first.");
      return;
    }

    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    setStatus("JSON copied to clipboard.");
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-6xl font-black tracking-[-0.07em]">Aliwvide Secure Data Manager</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
          Secure data manager for uploading your Excel workbook, previewing rows, and exporting JSON.
        </p>

        <div className="mt-10 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black">Upload Excel File</h2>
          <p className="mt-3 text-gray-500">
            Supported columns: Category, Name, Type/Short Type, Description, Website, Android, iOS, Badge1-3, Instruction1-3.
          </p>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            className="mt-6 w-full rounded-3xl border border-dashed border-gray-400 p-6"
          />

          {fileName && (
            <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-amber-800">
              Selected file: {fileName}
            </p>
          )}

          <p className="mt-4 rounded-2xl bg-gray-50 p-4 text-gray-700">{status}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={downloadJson}
              className="rounded-full bg-gray-950 px-6 py-3 font-bold text-white"
            >
              Export JSON
            </button>

            <button
              onClick={copyJson}
              className="rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950"
            >
              Copy JSON
            </button>
          </div>
        </div>

        {sheetNames.length > 0 && (
          <div className="mt-8 rounded-[2rem] border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-xl font-black">Detected sheets</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {sheetNames.map((sheet) => (
                <span key={sheet} className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
                  {sheet}
                </span>
              ))}
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="mt-8 overflow-auto rounded-[2rem] border border-gray-200 bg-white shadow-soft">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-950 text-white">
                <tr>
                  {Object.keys(rows[0]).map((key) => (
                    <th key={key} className="whitespace-nowrap px-4 py-3">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t">
                    {Object.keys(rows[0]).map((key) => (
                      <td key={key} className="max-w-[280px] whitespace-nowrap px-4 py-3 text-gray-600">
                        {String(row[key] || "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {jsonData && (
          <div className="mt-8 rounded-[2rem] bg-gray-950 p-8 text-white">
            <h3 className="text-2xl font-black">Export complete</h3>
            <p className="mt-3 text-gray-300">
              Your Excel data is converted. Download or copy the JSON, then use it to update your data file.
            </p>
            <pre className="mt-5 max-h-[360px] overflow-auto rounded-2xl bg-white/10 p-5 text-xs text-gray-200">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 rounded-[2rem] bg-blue-50 p-8 text-blue-950">
          <h3 className="text-2xl font-black">Important</h3>
          <p className="mt-3">
            This is still a no-backend project. Export JSON works in your browser, but live website data updates after you replace the data file and redeploy.
          </p>
        </div>
      </div>
    </main>
  );
}
