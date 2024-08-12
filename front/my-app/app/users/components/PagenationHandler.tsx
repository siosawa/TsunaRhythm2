"use client";
import UsersPagination from "@/app/users/components/UsersPagination";
import { useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  work: string;
  profile_text: string;
  avatar: {
    url: string;
  };
  posts_count: number;
  followers_count: number;
  following_count: number;
}

interface FollowingUser extends User {
  relationship_id: number;
}

interface FetchUsersResponse {
  users: User[];
  total_pages: number;
}

interface FetchFollowingResponse {
  users: FollowingUser[];
}

interface FollowStates {
  [key: string]: boolean | number;
  [key: number]: boolean;
}

const fetchUsersAndFollowing = (
  currentPage: number,
  userId: number | null,
  setUsers: (users: User[]) => void,
  setTotalPages: (totalPages: number) => void,
  setFollowings: (followings: Set<number>) => void,
  setFollowStates: (followStates: FollowStates) => void,
  setError: (error: string) => void
) => {
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<FetchUsersResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?page=${currentPage}`,
          {
            withCredentials: true,
          }
        );

        if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
          setTotalPages(res.data.total_pages);
        } else {
          console.error("APIレスポンスは正しくありません:", res.data);
          setError("データの取得に失敗しました。");
        }
      } catch (err) {
        console.error("API呼び出しに失敗しました:", err);
        setError("データの取得に失敗しました。");
      }
    };

    fetchUsers();
  }, [currentPage, setUsers, setTotalPages, setError]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (userId) {
        try {
          const response = await axios.get<FetchFollowingResponse>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/following`,
            {
              withCredentials: true,
            }
          );
          const data = response.data;

          const followingSet = new Set(data.users.map((user) => user.id));
          const followingStates: FollowStates = {};
          data.users.forEach((user) => {
            followingStates[user.id] = true;
            followingStates[`relationship_${user.id}`] = user.relationship_id;
          });

          setFollowings(followingSet);
          setFollowStates(followingStates);
        } catch (error) {
          console.error("フォロー中のユーザーの取得に失敗しました:", error);
          setError("フォロー中のユーザーの取得に失敗しました。");
        }
      }
    };

    if (userId) {
      fetchFollowing();
    }
  }, [userId, setFollowings, setFollowStates, setError]);
};

interface PaginationHandlerProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const PaginationHandler = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationHandlerProps) => {
  const handlePageClick = (page: number) => {
    if (page !== currentPage && typeof page === "number") {
      setCurrentPage(page);
    }
  };

  return (
    <UsersPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageClick}
    />
  );
};

export { fetchUsersAndFollowing };
export default PaginationHandler;
