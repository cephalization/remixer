import { Link } from "remix";

const AdminIndex = () => {
  return (
    <p>
      <Link to="new">Create a new post</Link>
    </p>
  );
};

export default AdminIndex;
