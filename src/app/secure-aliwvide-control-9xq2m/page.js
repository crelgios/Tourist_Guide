"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import AdminContentTabs from "@/components/AdminContentTabs";

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

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
  const [authState, setAuthState] = useState("checking");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState("Checking admin session...");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("country-data");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [status, setStatus] = useState("Upload your Excel file to preview and export JSON.");

  useEffect(() => {
    checkSession();

    function handleChildLogout() {
      setAuthState("logged-out");
      setAuthStatus("Logged out.");
      setActiveSection("country-data");
    }

    window.addEventListener("aliwvide-admin-logout", handleChildLogout);
    return () => window.removeEventListener("aliwvide-admin-logout", handleChildLogout);
  }, []);

  async function checkSession() {
    try {
      const response = await fetch("/api/admin/me", { cache: "no-store" });

      if (response.ok) {
        setAuthState("authenticated");
        setAuthStatus("Admin session active.");
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (response.status === 503) {
        setAuthState("not-configured");
        setAuthStatus(data.error || "Admin login is not configured yet.");
        return;
      }

      setAuthState("logged-out");
      setAuthStatus("Log in to manage country data, blogs and FAQs.");
    } catch {
      setAuthState("logged-out");
      setAuthStatus("Could not check admin session.");
    }
  }

  async function login(event) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthStatus("Logging in...");

    try {
      await readJson(
        await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        })
      );

      setPassword("");
      setAuthState("authenticated");
      setAuthStatus("Logged in. Country data, blogs and FAQs are now protected.");
    } catch (error) {
      setAuthStatus(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthState("logged-out");
    setAuthStatus("Logged out.");
    setActiveSection("country-data");
  }

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

  if (authState === "checking") {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
          <p className="text-gray-700">Checking admin session...</p>
        </div>
      </main>
    );
  }

  if (authState === "not-configured") {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-900 shadow-soft">
          <h1 className="text-3xl font-black">Admin login is not configured yet</h1>
          <p className="mt-3">Add ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Vercel Environment Variables, then redeploy.</p>
          <p className="mt-5 rounded-2xl bg-white/70 p-4">{authStatus}</p>
        </div>
      </main>
    );
  }

  if (authState !== "authenticated") {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
          <h1 className="text-4xl font-black tracking-[-0.05em]">Aliwvide Admin Login</h1>
          <p className="mt-3 text-gray-600">Log in to manage country data, blogs and FAQs.</p>
          <form onSubmit={login} className="mt-6 grid gap-4">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
              autoComplete="username"
              className="rounded-2xl border border-gray-300 px-4 py-3"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="rounded-2xl border border-gray-300 px-4 py-3"
            />
            <button disabled={authLoading} className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white disabled:opacity-60">
              {authLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-gray-700">{authStatus}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-[-0.07em] md:text-6xl">Aliwvide Secure Data Manager</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              Manage country app data, publish live blogs, upload blog JSON files, and update FAQs from one private password-protected admin area.
            </p>
          </div>
          <button type="button" onClick={logout} className="rounded-full bg-gray-950 px-6 py-3 font-bold text-white">
            Logout
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("country-data")}
            className={`rounded-full px-6 py-3 font-bold ${activeSection === "country-data" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-950"}`}
          >
            Country Data
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("content")}
            className={`rounded-full px-6 py-3 font-bold ${activeSection === "content" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-950"}`}
          >
            Blogs & FAQs
          </button>
        </div>

        {activeSection === "country-data" && (
          <>
            <div className="mt-8 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
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
                <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-amber-800">Selected file: {fileName}</p>
              )}

              <p className="mt-4 rounded-2xl bg-gray-50 p-4 text-gray-700">{status}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={downloadJson} className="rounded-full bg-gray-950 px-6 py-3 font-bold text-white">
                  Export JSON
                </button>
                <button onClick={copyJson} className="rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950">
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
                Country app data still exports as JSON. Blogs and FAQs now support live Supabase publishing from the Blogs & FAQs tab.
              </p>
            </div>
          </>
        )}

        {activeSection === "content" && (
          <div className="mt-8">
            <AdminContentTabs />
          </div>
        )}
      </div>
    </main>
  );
}
