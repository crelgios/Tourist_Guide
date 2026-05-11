"use client";

import { useEffect, useMemo, useState } from "react";

const emptyBlogForm = {
  title: "",
  slug: "",
  description: "",
  content: "",
  cover_image: "",
  status: "published"
};

const emptyFaqForm = {
  category: "",
  question: "",
  answer: "",
  sort_order: 0
};

function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

export default function AdminContentTabs() {
  const [authState, setAuthState] = useState("checking");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("blogs");
  const [blogs, setBlogs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [faqForm, setFaqForm] = useState(emptyFaqForm);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [status, setStatus] = useState("Checking admin session...");
  const [loading, setLoading] = useState(false);

  const blogButtonLabel = useMemo(
    () => (editingBlogId ? "Update Blog" : "Publish Blog"),
    [editingBlogId]
  );

  const faqButtonLabel = useMemo(
    () => (editingFaqId ? "Update FAQ" : "Publish FAQ"),
    [editingFaqId]
  );

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const response = await fetch("/api/admin/me", { cache: "no-store" });
      if (response.ok) {
        setAuthState("authenticated");
        setStatus("Admin connected. Loading live content...");
        await loadContent();
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (response.status === 503) {
        setAuthState("not-configured");
        setStatus(data.error || "Admin login is not configured yet.");
        return;
      }

      setAuthState("logged-out");
      setStatus("Log in to manage live blogs and FAQs.");
    } catch {
      setAuthState("logged-out");
      setStatus("Could not check admin session.");
    }
  }

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("Logging in...");

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
      setStatus("Logged in. Loading live content...");
      await loadContent();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setBlogs([]);
    setFaqs([]);
    setAuthState("logged-out");
    setStatus("Logged out.");
  }

  async function loadContent() {
    setLoading(true);
    try {
      const [blogData, faqData] = await Promise.all([
        readJson(await fetch("/api/admin/blogs", { cache: "no-store" })),
        readJson(await fetch("/api/admin/faqs", { cache: "no-store" }))
      ]);

      setBlogs(blogData.blogs || []);
      setFaqs(faqData.faqs || []);
      setStatus("Live content loaded from Supabase.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function resetBlogForm() {
    setBlogForm(emptyBlogForm);
    setEditingBlogId(null);
  }

  function resetFaqForm() {
    setFaqForm(emptyFaqForm);
    setEditingFaqId(null);
  }

  async function submitBlog(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...blogForm,
        slug: blogForm.slug || createSlug(blogForm.title)
      };

      const wasEditing = Boolean(editingBlogId);
      const response = await fetch(
        wasEditing ? `/api/admin/blogs/${editingBlogId}` : "/api/admin/blogs",
        {
          method: wasEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      await readJson(response);
      resetBlogForm();
      await loadContent();
      setStatus(wasEditing ? "Blog updated live." : "Blog published live.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function editBlog(blog) {
    setEditingBlogId(blog.id);
    setBlogForm({
      title: blog.title || "",
      slug: blog.slug || "",
      description: blog.description || "",
      content: blog.content || "",
      cover_image: blog.cover_image || "",
      status: blog.status || "published"
    });
    setActiveTab("blogs");
    setStatus(`Editing: ${blog.title}`);
  }

  async function deleteBlog(blog) {
    if (!window.confirm(`Delete blog “${blog.title}”?`)) return;
    setLoading(true);

    try {
      await readJson(await fetch(`/api/admin/blogs/${blog.id}`, { method: "DELETE" }));
      await loadContent();
      setStatus("Blog deleted live.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadBlogJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      await readJson(response);
      await loadContent();
      setStatus("Blog JSON uploaded and published live.");
    } catch (error) {
      setStatus(error.message === "Unexpected end of JSON input" ? "Invalid blog JSON file." : error.message);
    } finally {
      event.target.value = "";
    }
  }

  async function submitFaq(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const wasEditing = Boolean(editingFaqId);
      const response = await fetch(
        wasEditing ? `/api/admin/faqs/${editingFaqId}` : "/api/admin/faqs",
        {
          method: wasEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqForm)
        }
      );

      await readJson(response);
      resetFaqForm();
      await loadContent();
      setStatus(wasEditing ? "FAQ updated live." : "FAQ published live.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  function editFaq(faq) {
    setEditingFaqId(faq.id);
    setFaqForm({
      category: faq.category || "",
      question: faq.question || "",
      answer: faq.answer || "",
      sort_order: faq.sort_order || 0
    });
    setActiveTab("faqs");
    setStatus(`Editing FAQ: ${faq.question}`);
  }

  async function deleteFaq(faq) {
    if (!window.confirm(`Delete FAQ “${faq.question}”?`)) return;
    setLoading(true);

    try {
      await readJson(await fetch(`/api/admin/faqs/${faq.id}`, { method: "DELETE" }));
      await loadContent();
      setStatus("FAQ deleted live.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadFaqJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const response = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      await readJson(response);
      await loadContent();
      setStatus("FAQ JSON uploaded and published live.");
    } catch (error) {
      setStatus(error.message === "Unexpected end of JSON input" ? "Invalid FAQ JSON file." : error.message);
    } finally {
      event.target.value = "";
    }
  }

  if (authState === "checking") {
    return (
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
        <p className="text-gray-700">Checking admin session...</p>
      </div>
    );
  }

  if (authState === "not-configured") {
    return (
      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-900 shadow-soft">
        <h2 className="text-2xl font-black">Admin login is not configured yet</h2>
        <p className="mt-3">Add ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Vercel Environment Variables, then redeploy.</p>
      </div>
    );
  }

  if (authState !== "authenticated") {
    return (
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
        <h2 className="text-3xl font-black">Admin Login</h2>
        <p className="mt-3 text-gray-600">Log in to post, edit and delete live blogs and FAQs.</p>
        <form onSubmit={login} className="mt-6 grid gap-4">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="rounded-2xl border border-gray-300 px-4 py-3"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="rounded-2xl border border-gray-300 px-4 py-3"
          />
          <button disabled={loading} className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-gray-700">{status}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("blogs")}
          className={`rounded-full px-6 py-3 font-bold ${activeTab === "blogs" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-950"}`}
        >
          Blogs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`rounded-full px-6 py-3 font-bold ${activeTab === "faqs" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-950"}`}
        >
          FAQs
        </button>
        <button type="button" onClick={loadContent} className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white">
          Refresh Live Data
        </button>
        <button type="button" onClick={logout} className="rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950">
          Logout
        </button>
      </div>

      <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-gray-700">{status}</p>

      {activeTab === "blogs" && (
        <div className="mt-8">
          <h2 className="text-3xl font-black">Live Blog Manager</h2>

          <div className="mt-6 rounded-[1.5rem] border border-dashed border-emerald-300 bg-emerald-50 p-6">
            <h3 className="text-xl font-black">Upload one blog JSON file</h3>
            <p className="mt-2 text-gray-600">Required fields: title, description and content. slug, cover_image, date and status are optional.</p>
            <input type="file" accept=".json,application/json" onChange={uploadBlogJson} className="mt-4 w-full rounded-2xl bg-white p-4" />
          </div>

          <form onSubmit={submitBlog} className="mt-8 grid gap-4">
            <h3 className="text-xl font-black">{editingBlogId ? "Edit blog" : "Add blog manually"}</h3>
            <input value={blogForm.title} onChange={(event) => setBlogForm({ ...blogForm, title: event.target.value })} placeholder="Blog title" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <input value={blogForm.slug} onChange={(event) => setBlogForm({ ...blogForm, slug: event.target.value })} placeholder="Optional slug, for example best-taxi-apps-india" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <input value={blogForm.description} onChange={(event) => setBlogForm({ ...blogForm, description: event.target.value })} placeholder="Short description" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <input value={blogForm.cover_image} onChange={(event) => setBlogForm({ ...blogForm, cover_image: event.target.value })} placeholder="Optional cover image URL" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <select value={blogForm.status} onChange={(event) => setBlogForm({ ...blogForm, status: event.target.value })} className="rounded-2xl border border-gray-300 px-4 py-3">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <textarea value={blogForm.content} onChange={(event) => setBlogForm({ ...blogForm, content: event.target.value })} placeholder="Blog content" rows={8} className="rounded-2xl border border-gray-300 px-4 py-3" />
            <div className="flex flex-wrap gap-3">
              <button disabled={loading} className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white disabled:opacity-60">{blogButtonLabel}</button>
              {editingBlogId && (
                <button type="button" onClick={resetBlogForm} className="rounded-2xl bg-gray-100 px-5 py-3 font-bold text-gray-950">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-black">Current Blogs</h3>
            {blogs.map((blog) => (
              <article key={blog.id} className="rounded-[1.5rem] border border-gray-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{blog.status || "published"}</p>
                    <h4 className="mt-2 text-xl font-black">{blog.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">/blog/{blog.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editBlog(blog)} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-950">Edit</button>
                    <button type="button" onClick={() => deleteBlog(blog)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">Delete</button>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">{blog.description}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="mt-8">
          <h2 className="text-3xl font-black">Live FAQ Manager</h2>

          <div className="mt-6 rounded-[1.5rem] border border-dashed border-emerald-300 bg-emerald-50 p-6">
            <h3 className="text-xl font-black">Upload one FAQ JSON file</h3>
            <p className="mt-2 text-gray-600">Required fields: question and answer. category and sort_order are optional.</p>
            <input type="file" accept=".json,application/json" onChange={uploadFaqJson} className="mt-4 w-full rounded-2xl bg-white p-4" />
          </div>

          <form onSubmit={submitFaq} className="mt-8 grid gap-4">
            <h3 className="text-xl font-black">{editingFaqId ? "Edit FAQ" : "Add FAQ manually"}</h3>
            <input value={faqForm.category} onChange={(event) => setFaqForm({ ...faqForm, category: event.target.value })} placeholder="Category, for example Taxi & Transport" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <input value={faqForm.question} onChange={(event) => setFaqForm({ ...faqForm, question: event.target.value })} placeholder="FAQ question" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <textarea value={faqForm.answer} onChange={(event) => setFaqForm({ ...faqForm, answer: event.target.value })} placeholder="FAQ answer" rows={5} className="rounded-2xl border border-gray-300 px-4 py-3" />
            <input type="number" value={faqForm.sort_order} onChange={(event) => setFaqForm({ ...faqForm, sort_order: Number(event.target.value) })} placeholder="Sort order" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <div className="flex flex-wrap gap-3">
              <button disabled={loading} className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white disabled:opacity-60">{faqButtonLabel}</button>
              {editingFaqId && (
                <button type="button" onClick={resetFaqForm} className="rounded-2xl bg-gray-100 px-5 py-3 font-bold text-gray-950">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-black">Current FAQs</h3>
            {faqs.map((faq) => (
              <article key={faq.id} className="rounded-[1.5rem] border border-gray-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{faq.category || "General"}</p>
                    <h4 className="mt-2 text-xl font-black">{faq.question}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => editFaq(faq)} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-950">Edit</button>
                    <button type="button" onClick={() => deleteFaq(faq)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">Delete</button>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-emerald-900">
        Live mode is ready: blog and FAQ changes are stored in Supabase and appear on the website after cache revalidation, without replacing JSON files or redeploying.
      </div>
    </div>
  );
}
