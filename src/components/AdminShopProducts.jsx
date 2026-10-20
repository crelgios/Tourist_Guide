"use client";

import { useEffect, useMemo, useState } from "react";

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function variantsToText(variants) {
  return (variants || [])
    .map((item) => `${item.name}: ${(item.values || []).join(", ")}`)
    .join("\n");
}

function parseVariants(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split(":");
      return {
        name: String(name || "").trim(),
        values: rest.join(":").split(",").map((v) => v.trim()).filter(Boolean)
      };
    })
    .filter((item) => item.name && item.values.length);
}

function offersToText(offers) {
  return (offers || []).map((offer) => [
    offer.label || `Buy ${offer.quantity || 1}`,
    offer.quantity || 1,
    offer.price ?? "",
    offer.compare_at_price ?? "",
    offer.badge || ""
  ].join(" | ")).join("\n");
}

function parseOffers(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label, quantity, price, compareAtPrice, badge] = line.split("|").map((part) => part.trim());
      return {
        id: slugify(label || `offer-${index + 1}`),
        label: label || `Buy ${quantity || 1}`,
        quantity: Math.max(1, Number(quantity) || 1),
        price: price === "" ? null : Number(price),
        compare_at_price: compareAtPrice === "" ? null : Number(compareAtPrice),
        badge: badge || ""
      };
    })
    .filter((offer) => Number.isFinite(offer.price) && offer.price >= 0);
}

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  category: "General",
  description: "",
  price: "",
  compare_at_price: "",
  currency: "USD",
  images: [],
  video_url: "",
  variants_text: "",
  offers_text: "",
  shipping_text: "",
  supplier_url: "",
  supplier_cost: "",
  source_note: "",
  status: "draft"
};

export default function AdminShopProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("Loading products...");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  const isEditing = Boolean(form.id);
  const previewPath = form.slug ? `/shop/${form.slug}` : "";

  async function loadProducts() {
    try {
      const data = await readJson(await fetch("/api/admin/shop-products", { cache: "no-store" }));
      setProducts(data.products || []);
      setStatus(`${(data.products || []).length} products loaded.`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setStatus("Ready to add a new product.");
  }

  function editProduct(product) {
    setForm({
      id: product.id,
      name: product.name || "",
      slug: product.slug || slugify(product.name),
      category: product.category || "General",
      description: product.description || "",
      price: product.price ?? "",
      compare_at_price: product.compare_at_price ?? "",
      currency: product.currency || "USD",
      images: Array.isArray(product.images) ? product.images : [],
      video_url: product.video_url || "",
      variants_text: variantsToText(product.variants),
      offers_text: offersToText(product.offers),
      shipping_text: product.shipping_text || "",
      supplier_url: product.supplier_url || "",
      supplier_cost: product.supplier_cost ?? "",
      source_note: product.source_note || "",
      status: product.status === "active" ? "active" : "draft"
    });
    setStatus(`Editing ${product.name}.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImages(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setStatus(`Uploading ${files.length} image${files.length > 1 ? "s" : ""}...`);
    try {
      const urls = [];
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const data = await readJson(await fetch("/api/admin/shop-products/upload", {
          method: "POST",
          body
        }));
        urls.push(data.url);
      }
      setForm((current) => ({ ...current, images: [...current.images, ...urls].slice(0, 12) }));
      setStatus("Images uploaded. The first image will be the main product image.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      event.target.value = "";
      setUploading(false);
    }
  }

  function moveImage(index, direction) {
    setForm((current) => {
      const images = [...current.images];
      const next = index + direction;
      if (next < 0 || next >= images.length) return current;
      [images[index], images[next]] = [images[next], images[index]];
      return { ...current, images };
    });
  }

  function removeImage(index) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index)
    }));
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setStatus(isEditing ? "Saving product..." : "Creating product...");

    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        variants: parseVariants(form.variants_text),
        offers: parseOffers(form.offers_text)
      };
      delete payload.variants_text;
      delete payload.offers_text;

      const data = await readJson(await fetch("/api/admin/shop-products", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }));

      await loadProducts();
      if (isEditing) {
        setStatus(`${form.name} updated successfully.`);
      } else {
        setStatus(`${data.product?.name || form.name} created successfully.`);
        setForm(emptyForm);
      }
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    try {
      setStatus(`Deleting ${product.name}...`);
      await readJson(await fetch("/api/admin/shop-products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id })
      }));
      if (form.id === product.id) resetForm();
      await loadProducts();
      setStatus(`${product.name} deleted.`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [products]
  );

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Aliwvide Dropshipping</p>
            <h2 className="mt-1 text-3xl font-black">{isEditing ? "Edit Product" : "Add New Product"}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
              Upload product images, set your selling price and keep the AliExpress supplier link private in admin.
            </p>
          </div>
          {isEditing && (
            <button type="button" onClick={resetForm} className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-bold">
              + New Product
            </button>
          )}
        </div>

        <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">{status}</p>

        <form onSubmit={saveProduct} className="mt-6 grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Product name
              <input required value={form.name} onChange={(e) => {
                const name = e.target.value;
                setForm((current) => ({
                  ...current,
                  name,
                  slug: current.id || current.slug ? current.slug : slugify(name)
                }));
              }} className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="Portable Mini Fan" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              URL slug
              <input required value={form.slug} onChange={(e) => setField("slug", slugify(e.target.value))} className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="portable-mini-fan" />
              {previewPath && <span className="text-xs font-normal text-gray-500">aliwvide.com{previewPath}</span>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="grid gap-2 text-sm font-bold md:col-span-1">
              Category
              <input value={form.category} onChange={(e) => setField("category", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="Home, Travel, Gadgets..." />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Selling price
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="29.99" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Compare price
              <input type="number" min="0" step="0.01" value={form.compare_at_price} onChange={(e) => setField("compare_at_price", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="39.99" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Currency
              <select value={form.currency} onChange={(e) => setField("currency", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-emerald-500">
                <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold">
            Product description
            <textarea rows={6} value={form.description} onChange={(e) => setField("description", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-normal leading-6 outline-none focus:border-emerald-500" placeholder="Explain what the product does, key features and who it is for." />
          </label>

          <div className="rounded-2xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-black">Product images</div>
                <p className="text-xs text-gray-500">Upload up to 12 images. The first image becomes the cover.</p>
              </div>
              <label className="cursor-pointer rounded-xl bg-gray-950 px-5 py-3 text-sm font-black text-white">
                {uploading ? "Uploading..." : "Upload Images"}
                <input disabled={uploading} multiple accept="image/*" type="file" onChange={uploadImages} className="hidden" />
              </label>
            </div>

            {form.images.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {form.images.map((url, index) => (
                  <div key={url + index} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <div className="relative aspect-square">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      {index === 0 && <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-black text-white">COVER</span>}
                    </div>
                    <div className="grid grid-cols-3 border-t bg-white text-xs font-bold">
                      <button type="button" onClick={() => moveImage(index, -1)} className="p-2" aria-label="Move image left">←</button>
                      <button type="button" onClick={() => removeImage(index)} className="p-2 text-red-600" aria-label="Remove image">×</button>
                      <button type="button" onClick={() => moveImage(index, 1)} className="p-2" aria-label="Move image right">→</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">No images uploaded yet.</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Product video URL (optional)
              <input type="url" value={form.video_url} onChange={(e) => setField("video_url", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="https://..." />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Shipping message
              <input value={form.shipping_text} onChange={(e) => setField("shipping_text", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-normal outline-none focus:border-emerald-500" placeholder="Estimated delivery: 7–15 business days" />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold">
            Variants
            <textarea rows={3} value={form.variants_text} onChange={(e) => setField("variants_text", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm font-normal outline-none focus:border-emerald-500" placeholder={"Color: Black, White, Blue\nSize: S, M, L"} />
            <span className="text-xs font-normal text-gray-500">One option per line. Example: Color: Black, White</span>
          </label>

          <label className="grid gap-2 text-sm font-bold">
            Bundle pricing offers
            <textarea
              rows={4}
              value={form.offers_text}
              onChange={(e) => setField("offers_text", e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm font-normal outline-none focus:border-emerald-500"
              placeholder={"Buy 1 | 1 | 29.99 | 39.99 | Starter\nBuy 2 | 2 | 49.99 | 79.98 | Most Popular\nBuy 3 | 3 | 64.99 | 119.97 | Best Value"}
            />
            <span className="text-xs font-normal text-gray-500">
              Format: Label | Quantity | Total price | Compare price | Badge. Leave blank to use the normal product price.
            </span>
          </label>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-4">
              <div className="font-black text-amber-950">Private supplier information</div>
              <p className="mt-1 text-xs text-amber-800">These fields are stored separately and are not available through the public shop API.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-bold text-amber-950 md:col-span-2">
                AliExpress supplier URL
                <input type="url" value={form.supplier_url} onChange={(e) => setField("supplier_url", e.target.value)} className="rounded-xl border border-amber-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-500" placeholder="https://www.aliexpress.com/item/..." />
              </label>
              <label className="grid gap-2 text-sm font-bold text-amber-950">
                Supplier cost
                <input type="number" min="0" step="0.01" value={form.supplier_cost} onChange={(e) => setField("supplier_cost", e.target.value)} className="rounded-xl border border-amber-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-500" placeholder="8.50" />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-bold text-amber-950">
              Internal note
              <input value={form.source_note} onChange={(e) => setField("source_note", e.target.value)} className="rounded-xl border border-amber-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-500" placeholder="Supplier color mapping, shipping notes, etc." />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="grid gap-1 text-sm font-bold">
              Product status
              <select value={form.status} onChange={(e) => setField("status", e.target.value)} className="rounded-xl border border-gray-300 px-4 py-3 font-normal">
                <option value="draft">Draft — hidden from customers</option>
                <option value="active">Active — visible in shop</option>
              </select>
            </label>
            <button disabled={saving || uploading} className="mt-auto rounded-xl bg-emerald-600 px-7 py-3 text-sm font-black text-white disabled:opacity-60">
              {saving ? "Saving..." : isEditing ? "Save Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Catalog</p>
            <h3 className="mt-1 text-2xl font-black">Your Products</h3>
          </div>
          <button type="button" onClick={loadProducts} className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-bold">Refresh</button>
        </div>

        <div className="mt-5 grid gap-3">
          {sortedProducts.map((product) => (
            <div key={product.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-center">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {product.images?.[0] ? <img src={product.images[0]} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-black text-gray-950">{product.name}</div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${product.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {product.status || "draft"}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">{product.currency || "USD"} {product.price ?? "—"} · /shop/{product.slug || "no-slug"}</div>
                {product.supplier_url && <div className="mt-1 truncate text-xs text-amber-700">Supplier saved privately</div>}
              </div>
              <div className="flex gap-2">
                {product.status === "active" && product.slug && (
                  <a href={`/shop/${product.slug}?src=admin-preview`} target="_blank" className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold">Preview</a>
                )}
                <button type="button" onClick={() => editProduct(product)} className="rounded-xl bg-gray-950 px-4 py-2 text-sm font-bold text-white">Edit</button>
                <button type="button" onClick={() => deleteProduct(product)} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-700">Delete</button>
              </div>
            </div>
          ))}
          {!sortedProducts.length && <div className="rounded-2xl bg-gray-50 p-8 text-center text-sm text-gray-500">No products yet. Create your first product above.</div>}
        </div>
      </div>
    </section>
  );
}
