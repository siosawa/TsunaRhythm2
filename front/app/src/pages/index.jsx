import styles from "../styles/Home.module.css";
import Link from 'next/link';

const HomePage = ({ posts }) => {
    return (
        <>
            <div className={styles.homeContainer}>
                <h1 className="text-3xl font-bold underline">
                    Hello world!
                </h1>
                <div>Welcome to the home page!</div>
                <Link href="/createPost" className={styles.createButton}>
                    Create new Post
                </Link>

                <div>
                    {posts.map((post) => (
                        <div key={post.id} className={styles.postCard}>
                            <Link href={`/posts/${post.id}`} className={styles.postCardBox}>
                                <h2>{post.title}</h2>
                            </Link>
                            <p>{post.content}</p>
                            <button className={styles.editButton}>編集</button>
                            <button className={styles.deleteButton}>削除</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

// export async function getStaticProps() {
//     const res = await fetch("http://localhost:3000/api/v1/posts");
//     const posts = await res.json();
//     console.log(posts);
//     return {
//         props: {
//             posts,
//         },
//         revalidate: 60 * 60 * 24, // 24時間
//     };
// }

export async function getStaticProps() {
    try {
        const res = await fetch("http://localhost:3000/api/v1/posts");

        if (!res.ok) {
            throw new Error(`Failed to fetch posts, received status ${res.status}`);
        }

        const posts = await res.json();
        return {
            props: {
                posts,
            },
            revalidate: 60 * 60 * 24, // 24時間
        };
    } catch (error) {
        console.error("Error fetching posts: ", error);
        return {
            props: {
                posts: [],
            },
        };
    }
}
export default HomePage;
