import axios from "axios";

export default async function Test() {
  let users = [];
  try {
    const response = await axios.get("/api/users");
    users = response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message || error);
    return <div>Error fetching users: {error.message || "Unknown error"}</div>;
  }

  return (
    <>
      <div>SSR Page</div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>ID: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Created At: {new Date(user.created_at).toLocaleString()}</p>
            <p>Posts Count: {user.posts_count}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
