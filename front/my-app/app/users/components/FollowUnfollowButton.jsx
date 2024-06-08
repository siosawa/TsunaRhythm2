// UserCardで使用
import { Button } from "@/components/ui/button";
import axios from "axios";

const FollowUnfollowButton = ({
  userId,
  isFollowing,
  followStates,
  setFollowStates,
  setFollowings,
}) => {
  const updateFollowState = (followed, relationshipId = null) => {
    setFollowStates({
      ...followStates,
      [userId]: followed,
      [`relationship_${userId}`]: relationshipId,
    });
    setFollowings((prev) => {
      const updated = new Set(prev);
      followed ? updated.add(userId) : updated.delete(userId);
      return updated;
    });
  };

  const handleUnfollow = async () => {
    const relationshipId = followStates[`relationship_${userId}`];
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/relationships/${relationshipId}`,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        updateFollowState(false);
      } else {
        console.error("フォロー解除に失敗しました");
      }
    } catch (error) {
      console.error("フォロー解除に失敗しました:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/relationships",
        { followed_id: userId },
        {
          withCredentials: true,
        },
      );
      if (response.status === 201) {
        const data = response.data;
        updateFollowState(true, data.relationship_id);
      } else {
        console.error("フォローに失敗しました");
      }
    } catch (error) {
      console.error("フォローに失敗しました:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      className="bg-emerald-500 text-white rounded-3xl hover:bg-emerald-600 hover:text-white w-28"
      onClick={() => (isFollowing ? handleUnfollow() : handleFollow())}
    >
      {isFollowing ? "フォロー解除" : "フォロー"}
    </Button>
  );
};

export default FollowUnfollowButton;
