export default async function Test() {
  const users = await fetch("http://localhost:3000/api/v1/users", {
    next: { revalidate: 10 },
  }).then((res) => res.json());

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
