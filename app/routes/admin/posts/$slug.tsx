import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";
import { PostForm } from "~/components/PostForm";
import { editPost, getPost, Post } from "~/post";

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");
  const originalPostSlug = formData.get("originalpostslug");

  const errors: { title?: boolean; slug?: boolean; markdown?: boolean } = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string", "Expected title formData");
  invariant(typeof slug === "string", "Expected slug formData");
  invariant(typeof markdown === "string", "Expected markdown formData");
  invariant(
    typeof originalPostSlug === "string",
    "Expected original post slug"
  );

  await editPost(originalPostSlug, { title, slug, markdown });

  return redirect(`/posts/${slug}`);
};

export const loader: LoaderFunction = ({ params: { slug } }) => {
  invariant(slug);

  const post = getPost(slug);

  return post;
};

const EditPost = () => {
  const post = useLoaderData<Post>();
  const errors = useActionData();

  return <PostForm editing errors={errors} values={post} />;
};

export default EditPost;
