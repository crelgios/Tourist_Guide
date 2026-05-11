export function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function normalizeBlogPayload(input = {}) {
  const title = String(input.title || "").trim();
  const slug = createSlug(input.slug || title);
  const description = String(input.description || "").trim();
  const content = String(input.content || "").trim();
  const cover_image = String(input.cover_image || "").trim();
  const status = input.status === "draft" ? "draft" : "published";
  const published_at = input.published_at || input.date || new Date().toISOString();

  return {
    title,
    slug,
    description,
    content,
    cover_image,
    status,
    published_at
  };
}

export function validateBlogPayload(blog) {
  const errors = [];
  if (!blog.title) errors.push("title is required");
  if (!blog.slug) errors.push("slug is required");
  if (!blog.description) errors.push("description is required");
  if (!blog.content) errors.push("content is required");
  return errors;
}
