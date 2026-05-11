"use client";

import { useEffect, useState } from "react";
import siteContent from "@/data/site-content.json";

function createSlug(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AdminContentTabs() {
  const [activeTab, setActiveTab] = useState("blogs");
  const [blogs, setBlogs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [blogForm, setBlogForm] = useState({ title: "", slug: "", description: "", content: "" });
  const [faqForm, setFaqForm] = useState({ category: "", question: "", answer: "" });
  const [status, setStatus] = useState("Upload JSON or add content manually, then export the updated file.");

  useEffect(() => {
    const saved = localStorage.getItem("aliwvide-site-content");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBlogs(parsed.blogs || []);
        setFaqs(parsed.faqs || []);
        return;
      } catch {
        localStorage.removeItem("aliwvide-site-content");
      }
    }

    setBlogs(siteContent.blogs || []);
    setFaqs(siteContent.faqs || []);
  }, []);

  function save(nextBlogs, nextFaqs) {
    localStorage.setItem(
      "aliwvide-site-content",
      JSON.stringify({ blogs: nextBlogs, faqs: nextFaqs }, null, 2)
    );
  }

  function addBlog() {
    if (!blogForm.title || !blogForm.description || !blogForm.content) {
      setStatus("Blog title, description and content are required.");
      return;
    }

    const slug = createSlug(blogForm.slug || blogForm.title);

    if (!slug) {
      setStatus("Please use a valid blog title or slug.");
      return;
    }

    if (blogs.some((blog) => blog.slug === slug)) {
      setStatus("That blog slug already exists. Use a different slug.");
      return;
    }

    const nextBlogs = [
      {
        id: `blog-${Date.now()}`,
        title: blogForm.title.trim(),
        slug,
        description: blogForm.description.trim(),
        date: new Date().toISOString().slice(0, 10),
        content: blogForm.content.trim()
      },
      ...blogs
    ];

    setBlogs(nextBlogs);
    save(nextBlogs, faqs);
    setBlogForm({ title: "", slug: "", description: "", content: "" });
    setStatus("Blog added. Download updated site-content.json before redeploying.");
  }

  function deleteBlog(id) {
    if (!window.confirm("Delete this blog?")) return;
    const nextBlogs = blogs.filter((blog) => blog.id !== id);
    setBlogs(nextBlogs);
    save(nextBlogs, faqs);
    setStatus("Blog deleted. Download updated site-content.json before redeploying.");
  }

  function uploadBlogJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const uploaded = JSON.parse(loadEvent.target.result);
        if (!uploaded.title || !uploaded.description || !uploaded.content) {
          setStatus("Invalid blog JSON. title, description and content are required.");
          return;
        }

        const slug = createSlug(uploaded.slug || uploaded.title);
        if (!slug) {
          setStatus("Invalid blog slug.");
          return;
        }

        if (blogs.some((blog) => blog.slug === slug)) {
          setStatus("That blog slug already exists. Use a different slug.");
          return;
        }

        const nextBlogs = [
          {
            id: uploaded.id || `blog-${Date.now()}`,
            title: String(uploaded.title).trim(),
            slug,
            description: String(uploaded.description).trim(),
            date: uploaded.date || new Date().toISOString().slice(0, 10),
            content: String(uploaded.content).trim()
          },
          ...blogs
        ];

        setBlogs(nextBlogs);
        save(nextBlogs, faqs);
        setStatus("Blog JSON uploaded. Download updated site-content.json before redeploying.");
      } catch {
        setStatus("Invalid blog JSON file.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function addFaq() {
    if (!faqForm.question || !faqForm.answer) {
      setStatus("FAQ question and answer are required.");
      return;
    }

    const nextFaqs = [
      {
        id: `faq-${Date.now()}`,
        category: faqForm.category.trim() || "General",
        question: faqForm.question.trim(),
        answer: faqForm.answer.trim()
      },
      ...faqs
    ];

    setFaqs(nextFaqs);
    save(blogs, nextFaqs);
    setFaqForm({ category: "", question: "", answer: "" });
    setStatus("FAQ added. Download updated site-content.json before redeploying.");
  }

  function deleteFaq(id) {
    if (!window.confirm("Delete this FAQ?")) return;
    const nextFaqs = faqs.filter((faq) => faq.id !== id);
    setFaqs(nextFaqs);
    save(blogs, nextFaqs);
    setStatus("FAQ deleted. Download updated site-content.json before redeploying.");
  }

  function uploadFaqJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const uploaded = JSON.parse(loadEvent.target.result);
        if (!uploaded.question || !uploaded.answer) {
          setStatus("Invalid FAQ JSON. question and answer are required.");
          return;
        }

        const nextFaqs = [
          {
            id: uploaded.id || `faq-${Date.now()}`,
            category: String(uploaded.category || "General").trim(),
            question: String(uploaded.question).trim(),
            answer: String(uploaded.answer).trim()
          },
          ...faqs
        ];

        setFaqs(nextFaqs);
        save(blogs, nextFaqs);
        setStatus("FAQ JSON uploaded. Download updated site-content.json before redeploying.");
      } catch {
        setStatus("Invalid FAQ JSON file.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify({ blogs, faqs }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "site-content.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("Updated site-content.json downloaded.");
  }

  function resetLocalData() {
    if (!window.confirm("Reset to the current deployed site-content.json file?")) return;
    localStorage.removeItem("aliwvide-site-content");
    setBlogs(siteContent.blogs || []);
    setFaqs(siteContent.faqs || []);
    setStatus("Local admin draft data reset.");
  }

  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-soft">
      <div className="flex flex-wrap gap-3">
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
        <button type="button" onClick={downloadJson} className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white">
          Download Updated JSON
        </button>
        <button type="button" onClick={resetLocalData} className="rounded-full bg-gray-100 px-6 py-3 font-bold text-gray-950">
          Reset Draft Data
        </button>
      </div>

      <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-gray-700">{status}</p>

      {activeTab === "blogs" && (
        <div className="mt-8">
          <h2 className="text-3xl font-black">Blog Manager</h2>

          <div className="mt-6 rounded-[1.5rem] border border-dashed border-emerald-300 bg-emerald-50 p-6">
            <h3 className="text-xl font-black">Upload one blog JSON file</h3>
            <p className="mt-2 text-gray-600">Required fields: title, description and content. slug and date are optional.</p>
            <input type="file" accept=".json,application/json" onChange={uploadBlogJson} className="mt-4 w-full rounded-2xl bg-white p-4" />
          </div>

          <div className="mt-8 grid gap-4">
            <h3 className="text-xl font-black">Add blog manually</h3>
            <input value={blogForm.title} onChange={(event) => setBlogForm({ ...blogForm, title: event.target.value })} placeholder="Blog title" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <input value={blogForm.slug} onChange={(event) => setBlogForm({ ...blogForm, slug: event.target.value })} placeholder="Optional slug, for example best-taxi-apps-india" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <input value={blogForm.description} onChange={(event) => setBlogForm({ ...blogForm, description: event.target.value })} placeholder="Short description" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <textarea value={blogForm.content} onChange={(event) => setBlogForm({ ...blogForm, content: event.target.value })} placeholder="Blog content" rows={8} className="rounded-2xl border border-gray-300 px-4 py-3" />
            <button type="button" onClick={addBlog} className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white">Post Blog</button>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-black">Current Blogs</h3>
            {blogs.map((blog) => (
              <article key={blog.id} className="rounded-[1.5rem] border border-gray-200 p-5">
                <h4 className="text-xl font-black">{blog.title}</h4>
                <p className="mt-1 text-sm text-gray-500">/blog/{blog.slug}</p>
                <p className="mt-3 text-gray-600">{blog.description}</p>
                <button type="button" onClick={() => deleteBlog(blog.id)} className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">Delete Blog</button>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="mt-8">
          <h2 className="text-3xl font-black">FAQ Manager</h2>

          <div className="mt-6 rounded-[1.5rem] border border-dashed border-emerald-300 bg-emerald-50 p-6">
            <h3 className="text-xl font-black">Upload one FAQ JSON file</h3>
            <p className="mt-2 text-gray-600">Required fields: question and answer. category is optional.</p>
            <input type="file" accept=".json,application/json" onChange={uploadFaqJson} className="mt-4 w-full rounded-2xl bg-white p-4" />
          </div>

          <div className="mt-8 grid gap-4">
            <h3 className="text-xl font-black">Add FAQ manually</h3>
            <input value={faqForm.category} onChange={(event) => setFaqForm({ ...faqForm, category: event.target.value })} placeholder="Category, for example Taxi & Transport" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <input value={faqForm.question} onChange={(event) => setFaqForm({ ...faqForm, question: event.target.value })} placeholder="FAQ question" className="rounded-2xl border border-gray-300 px-4 py-3" />
            <textarea value={faqForm.answer} onChange={(event) => setFaqForm({ ...faqForm, answer: event.target.value })} placeholder="FAQ answer" rows={5} className="rounded-2xl border border-gray-300 px-4 py-3" />
            <button type="button" onClick={addFaq} className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white">Post FAQ</button>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-black">Current FAQs</h3>
            {faqs.map((faq) => (
              <article key={faq.id} className="rounded-[1.5rem] border border-gray-200 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{faq.category || "General"}</p>
                <h4 className="mt-2 text-xl font-black">{faq.question}</h4>
                <p className="mt-3 text-gray-600">{faq.answer}</p>
                <button type="button" onClick={() => deleteFaq(faq.id)} className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">Delete FAQ</button>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-amber-50 p-5 text-amber-900">
        This project stays no-backend: after any blog or FAQ change, download the updated file, replace <b>src/data/site-content.json</b>, then redeploy.
      </div>
    </div>
  );
}
