"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    setSheetNames(workbook.SheetNames);

    const previewRows = [];
    workbook.SheetNames.forEach((sheetName) => {
      if (sheetName.toLowerCase() === "readme") return;
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      json.forEach((row) => {
        if (row.Name || row.Category) {
          previewRows.push({ Country: sheetName, ...row });
        }
      });
    });

    setRows(previewRows.slice(0, 100));
  }

  return (
    <>
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-6xl font-black tracking-[-0.07em]">Admin Data Manager</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
            Upload your Excel workbook. Each country should be one sheet. This admin page previews the data locally in your browser.
          </p>

          <div className="mt-10 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
            <h2 className="text-3xl font-black">Upload Excel File</h2>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFile}
              className="mt-6 w-full rounded-3xl border border-dashed border-gray-400 p-6"
            />
            {fileName && <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-amber-800">Selected file: {fileName}</p>}
          </div>

          {sheetNames.length > 0 && (
            <div className="mt-8 rounded-[2rem] border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-black">Detected country sheets</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {sheetNames.map((sheet) => (
                  <span key={sheet} className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">{sheet}</span>
                ))}
              </div>
            </div>
          )}

          {rows.length > 0 && (
            <div className="mt-8 overflow-auto rounded-[2rem] border border-gray-200 bg-white shadow-soft">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-950 text-white">
                  <tr>
                    {Object.keys(rows[0]).map((key) => <th key={key} className="whitespace-nowrap px-4 py-3">{key}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} className="border-t">
                      {Object.keys(rows[0]).map((key) => <td key={key} className="max-w-[280px] whitespace-nowrap px-4 py-3 text-gray-600">{String(row[key] || "")}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 rounded-[2rem] bg-gray-950 p-8 text-white">
            <h3 className="text-2xl font-black">Next step</h3>
            <p className="mt-3 text-gray-300">
              This preview works without backend. Later we can add “Export JSON” so your uploaded Excel converts into your website data automatically.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
