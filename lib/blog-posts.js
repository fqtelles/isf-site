import { prisma } from "./prisma";

const LEGACY_BLOG_POST_SELECT = Object.freeze({
  id: true,
  date: true,
  title: true,
  excerpt: true,
  readTime: true,
  content: true,
  coverImage: true,
  slug: true,
  createdAt: true,
});

function isMissingPublishedAtColumn(error) {
  return (
    error?.code === "P2022" &&
    error?.meta?.modelName === "BlogPost" &&
    String(error?.meta?.column || "").includes("publishedAt")
  );
}

function normalizeBlogPost(post) {
  if (!post || typeof post !== "object" || Array.isArray(post)) return post;
  if ("publishedAt" in post || !("createdAt" in post)) return post;
  return { ...post, publishedAt: post.createdAt };
}

function normalizeBlogPostResult(result) {
  return Array.isArray(result) ? result.map(normalizeBlogPost) : normalizeBlogPost(result);
}

function stripPublishedAtFromOrderBy(orderBy) {
  if (!orderBy) return orderBy;

  if (Array.isArray(orderBy)) {
    const cleaned = orderBy
      .map(stripPublishedAtFromOrderBy)
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : [{ id: "desc" }];
  }

  if (typeof orderBy !== "object") return orderBy;

  const cleaned = { ...orderBy };
  delete cleaned.publishedAt;

  return Object.keys(cleaned).length > 0 ? cleaned : { id: "desc" };
}

function stripPublishedAtFromSelect(select) {
  if (!select) return LEGACY_BLOG_POST_SELECT;
  const cleaned = { ...select };
  delete cleaned.publishedAt;
  return cleaned;
}

function stripPublishedAtFromData(data) {
  if (!data || typeof data !== "object") return data;
  const cleaned = { ...data };
  delete cleaned.publishedAt;
  return cleaned;
}

function buildCompatibleReadArgs(args = {}) {
  const nextArgs = { ...args };

  if ("orderBy" in nextArgs) {
    nextArgs.orderBy = stripPublishedAtFromOrderBy(nextArgs.orderBy);
  }

  if ("select" in nextArgs && nextArgs.select) {
    nextArgs.select = stripPublishedAtFromSelect(nextArgs.select);
  } else if (!("include" in nextArgs)) {
    nextArgs.select = LEGACY_BLOG_POST_SELECT;
  }

  return nextArgs;
}

function buildCompatibleWriteArgs(args = {}) {
  const nextArgs = { ...args, data: stripPublishedAtFromData(args.data) };

  if ("select" in nextArgs && nextArgs.select) {
    nextArgs.select = stripPublishedAtFromSelect(nextArgs.select);
  } else if (!("include" in nextArgs)) {
    nextArgs.select = LEGACY_BLOG_POST_SELECT;
  }

  return nextArgs;
}

async function withPublishedAtFallback(runPrimary, runFallback) {
  try {
    return normalizeBlogPostResult(await runPrimary());
  } catch (error) {
    if (!isMissingPublishedAtColumn(error)) throw error;
    return normalizeBlogPostResult(await runFallback());
  }
}

export function getCompatibleBlogPostData(data = {}) {
  return stripPublishedAtFromData(data);
}

export async function findManyBlogPosts(args = {}) {
  return withPublishedAtFallback(
    () => prisma.blogPost.findMany(args),
    () => prisma.blogPost.findMany(buildCompatibleReadArgs(args)),
  );
}

export async function findFirstBlogPost(args = {}) {
  return withPublishedAtFallback(
    () => prisma.blogPost.findFirst(args),
    () => prisma.blogPost.findFirst(buildCompatibleReadArgs(args)),
  );
}

export async function findUniqueBlogPost(args = {}) {
  return withPublishedAtFallback(
    () => prisma.blogPost.findUnique(args),
    () => prisma.blogPost.findUnique(buildCompatibleReadArgs(args)),
  );
}

export async function createBlogPost(args = {}) {
  return withPublishedAtFallback(
    () => prisma.blogPost.create(args),
    () => prisma.blogPost.create(buildCompatibleWriteArgs(args)),
  );
}

export async function updateBlogPost(args = {}) {
  return withPublishedAtFallback(
    () => prisma.blogPost.update(args),
    () => prisma.blogPost.update(buildCompatibleWriteArgs(args)),
  );
}

export async function deleteBlogPost(args = {}) {
  return withPublishedAtFallback(
    () => prisma.blogPost.delete(args),
    () => prisma.blogPost.delete({
      ...args,
      select: args.select ?? { id: true },
    }),
  );
}
