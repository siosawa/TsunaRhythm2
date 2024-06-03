// import FollowUnfollowButton from "@/app/users/components/FollowUnfollowButton";
// import UsersPagination from "@/app/users/components/UsersPagination";
// import { usePathname } from 'next/navigation'; // usePathnameフックをインポート

// const UsersList = ({ fetchData, setFetchData }) => {
//   const { following, followStates, currentPage, totalPages } = fetchData;
//   const pathname = usePathname();
//   console.log(pathname)

//   // useEffectを使用してfetchDataが更新されたときにデータをコンソールにログ出力
//   const handlePageClick = (page) => {
//     if (page !== currentPage && typeof page === "number") {
//       setFetchData((prevData) => ({
//         ...prevData,
//         currentPage: page,
//       }));
//     }
//   };

//   // タイトルを動的に切り替える関数
//   const renderTitle = () => {
//   const lastSegment = pathname.split('/').pop(); // パスの最後のセグメントを取得
//   return lastSegment === 'following' ? "Following" 
//   : lastSegment === 'followers' ? "Followers" : "";
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">{renderTitle()}</h2>
//       <ul>
//         {following.length > 0 ? (
//           following.map((user) => (
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
//               <FollowUnfollowButton
//                 userId={user.id}
//                 isFollowing={followStates[user.id]}
//                 followStates={followStates}
//                 setFollowStates={(newStates) =>
//                   setFetchData((prevData) => ({
//                     ...prevData,
//                     followStates: newStates,
//                   }))
//                 }
//                 setFollowings={(newFollowings) =>
//                   setFetchData((prevData) => ({
//                     ...prevData,
//                     following: [...newFollowings],
//                   }))
//                 }
//               />
//             </li>
//           ))
//         ) : (
//           <li>フォローしているユーザーがいません。</li>
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

// export default UsersList;
