// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import UsersPagination from "@/app/users/components/UsersPagination";
// const FollowerList = () => {
//   const [followers, setFollowers] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1); // 現在のページ
//   const [totalPages, setTotalPages] = useState(1); // 総ページ数
//   const [followings, setFollowings] = useState(new Set()); // フォロー中のユーザーIDセット
//   const [followStates, setFollowStates] = useState({}); // フォロー状態と relationship_id を保存

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:3000/api/v1/current_user",
//           {
//             credentials: "include",
//           }
//         );
//         const userData = await response.json();
//         setUserId(userData.id); // 現在のユーザーIDを設定
//       } catch (error) {
//         console.error("現在のユーザー情報の取得に失敗しました:", error);
//       }
//     };

//     fetchCurrentUser();
//   }, []);

//   useEffect(() => {
//     const fetchFollowers = async () => {
//       if (userId) {
//         try {
//           const response = await fetch(
//             `http://localhost:3000/api/v1/users/${userId}/followers?page=${currentPage}`,
//             {
//               credentials: "include",
//             }
//           );
//           const data = await response.json();
//           setFollowers(data.users);
//           setTotalPages(data.total_pages); // 総ページ数を設定
//         } catch (error) {
//           console.error("フォロワーの取得に失敗しました:", error);
//         }
//       }
//     };

//     const fetchFollowing = async () => {
//       if (userId) {
//         try {
//           const response = await fetch(
//             `http://localhost:3000/api/v1/users/${userId}/following`,
//             {
//               credentials: "include",
//             }
//           );
//           const data = await response.json();

//           const followingSet = new Set(data.users.map((user) => user.id));
//           const followingStates = {};
//           data.users.forEach((user) => {
//             followingStates[user.id] = true;
//             followingStates[`relationship_${user.id}`] = user.relationship_id;
//           });

//           setFollowings(followingSet);
//           setFollowStates(followingStates);
//         } catch (error) {
//           console.error("フォロー中のユーザーの取得に失敗しました:", error);
//         }
//       }
//     };

//     if (userId) {
//       fetchFollowers();
//       fetchFollowing();
//     }
//   }, [userId, currentPage]);

//   const handleUnfollow = async (followedId) => {
//     const relationshipId = followStates[`relationship_${followedId}`];
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/v1/relationships/${relationshipId}`,
//         {
//           method: "DELETE",
//           credentials: "include",
//         }
//       );
//       if (response.ok) {
//         setFollowStates({
//           ...followStates,
//           [followedId]: false,
//           [`relationship_${followedId}`]: null, // relationship_id をリセット
//         });
//         setFollowings((prev) => {
//           const updated = new Set(prev);
//           updated.delete(followedId);
//           return updated;
//         });
//       } else {
//         console.error("フォロー解除に失敗しました");
//       }
//     } catch (error) {
//       console.error("フォロー解除に失敗しました:", error);
//     }
//   };

//   const handleFollow = async (followedId) => {
//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/v1/relationships",
//         {
//           method: "POST",
//           credentials: "include",
//           body: JSON.stringify({ followed_id: followedId }),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.ok) {
//         const data = await response.json();
//         console.log("New relationship ID:", data.relationship_id); // 新しい relationship_id をコンソールに出力
//         setFollowStates({
//           ...followStates,
//           [followedId]: true,
//           [`relationship_${followedId}`]: data.relationship_id, // 新しい relationship_id を更新
//         });
//         setFollowings((prev) => new Set(prev).add(followedId));
//       } else {
//         console.error("フォローに失敗しました");
//       }
//     } catch (error) {
//       console.error("フォローに失敗しました:", error);
//     }
//   };

//   const handlePageClick = (page) => {
//     if (page !== currentPage && typeof page === "number") {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">フォロワーリスト</h2>
//       <ul>
//         {followers.length > 0 ? (
//           followers.map((user) => (
//             <li
//               key={user.id}
//               className="bg-white shadow-md rounded-lg p-6 mb-4 flex justify-between items-center"
//             >
//               <div>
//                 <p className="text-lg font-semibold mb-2">{user.name}</p>
//                 <p className="text-gray-600 mb-1">ID: {user.id}</p>
//                 <p className="text-gray-600 mb-1">
//                   メールアドレス: {user.email}
//                 </p>
//               </div>
//               {followings.has(user.id) ? (
//                 <Button variant="ghost" onClick={() => handleUnfollow(user.id)}>
//                   フォロー解除
//                 </Button>
//               ) : (
//                 <Button variant="ghost" onClick={() => handleFollow(user.id)}>
//                   フォロー
//                 </Button>
//               )}
//             </li>
//           ))
//         ) : (
//           <li>フォロワーがいません。</li>
//         )}
//       </ul>
//       <UsersPagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageClick}
//       />
//     </div>
//   );
// };

// export default FollowerList;
