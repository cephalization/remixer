import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";

export interface PostInput {
  title: string;
  markdown: string;
  slug: string;
}

export interface Post extends PostInput {
  html: string;
}

export interface PostFrontMatter {
  title: string;
}

const isPostAttributes = (attributes: any): attributes is PostFrontMatter => {
  return attributes?.title;
};

const postsPath = path.join(__dirname, "..", "posts");

export const getPosts = async (): Promise<Post[]> => {
  const dir = await fs.readdir(postsPath);

  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes, body } = parseFrontMatter(file.toString());
      invariant(
        isPostAttributes(attributes),
        `${filename} is missing attributes (front-matter)`
      );
      const html = marked(body);

      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
        html,
        markdown: body,
      };
    })
  );
};

export const getPost = async (slug: string) => {
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );
  const html = marked(body);
  return { slug, title: attributes.title, html, markdown: body };
};

export const createPost = async (postInput: PostInput) => {
  const md = `---\ntitle: ${postInput.title}\n---\n\n${postInput.markdown}`;
  await fs.writeFile(path.join(postsPath, postInput.slug + ".md"), md);

  return getPost(postInput.slug);
};

export const editPost = async (
  originalPostSlug: string,
  postInput: PostInput
) => {
  const md = `---\ntitle: ${postInput.title}\n---\n\n${postInput.markdown}`;
  if (originalPostSlug === postInput.slug) {
    await fs.writeFile(path.join(postsPath, postInput.slug + ".md"), md);
  } else {
    await fs.rename(
      path.join(postsPath, originalPostSlug + ".md"),
      path.join(postsPath, postInput.slug + ".md")
    );
    await fs.writeFile(path.join(postsPath, postInput.slug + ".md"), md);
  }

  return getPost(postInput.slug);
};

export const validatePostInput = (formData: FormData) => {
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: { title?: boolean; slug?: boolean; markdown?: boolean } = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  return errors;
};
