// import { useEffect} from "react";
// import axios from "axios";
// import { useParams } from 'next/navigation';

// const FetchUserPosts = ({ currentPage, setPosts, setTotalPages, reload }) => {
//   const { userId } = useParams();
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/v1/posts/user/${userId}`,
//           {
//             withCredentials: true,
//           }
//         );

//         setPosts(response.data.posts);
//         setTotalPages(response.data.total_pages);
//       } catch (error) {
//         console.error("データの取得に失敗しました:", error);
//       }
//     };
//     fetchPosts();
//   }, [currentPage]);

//   return null;
// };

// export default FetchUserPosts;