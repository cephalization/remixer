import { useEffect, useState } from "react";
import { Form, useTransition } from "remix";
import { PostInput } from "~/post";

interface PostFormProps {
  values?: PostInput;
  errors: { [key in keyof PostInput]?: boolean };
  editing?: boolean;
}

export const PostForm = ({ errors, values, editing }: PostFormProps) => {
  const transition = useTransition();

  return (
    <Form method="post" key={values?.slug}>
      {values && (
        <input hidden readOnly value={values.slug} name="originalpostslug" />
      )}
      <p>
        <label>
          Post Title: {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" defaultValue={values?.title} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="slug" defaultValue={values?.slug} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>{" "}
        {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea
          id="markdown"
          rows={20}
          cols={30}
          name="markdown"
          defaultValue={values?.markdown}
        />
      </p>
      <p>
        <button type="submit">
          {transition.submission
            ? editing
              ? "Editing..."
              : "Creating..."
            : editing
            ? "Edit Post"
            : "Create Post"}
        </button>
      </p>
    </Form>
  );
};
