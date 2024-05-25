// app/diarys/[id]/page.jsx

// 特定のポストの詳細情報を取得する関数
const fetchPostById = async (id) => {
  console.log(`Fetching post with id: ${id}`);
  const res = await fetch(`http://localhost:3000/api/v1/posts/${id}`, {
    withCredentials: true,
  });
  if (!res.ok) {
    console.error(`Error fetching post ${id}: ${res.status}`);
    throw new Error(`Failed to fetch post: ${res.status}`);
  }
  const post = await res.json();
  console.log(`Fetched post:`, post);
  return post;
};

// 動的パラメータを生成する関数
export async function generateStaticParams() {
  try {
    console.log("Fetching all posts for static params");
    const res = await fetch("http://localhost:3000/api/v1/posts");
    if (!res.ok) {
      console.error(`Error fetching posts: ${res.status}`);
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }
    const posts = await res.json();
    console.log(`Fetched posts:`, posts);
    return posts.map((post) => ({ id: post.id.toString() }));
  } catch (error) {
    console.error(`Error in generateStaticParams:`, error);
    return []; // エラー発生時は空の配列を返す
  }
}

// ページコンポーネントの実装
export default async function PostPage({ params }) {
  console.log(`Rendering PostPage for id: ${params.id}`);
  try {
    const post = await fetchPostById(params.id);
    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </div>
    );
  } catch (error) {
    console.error(`Error rendering PostPage:`, error);
    return (
      <div>
        <h1>Error: {error.message}</h1>
      </div>
    );
  }
}
