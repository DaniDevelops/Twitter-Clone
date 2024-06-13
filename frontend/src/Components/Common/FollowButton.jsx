import React from "react";
import { useMutation, useQueryClient } from "react-query";
import LoadingSpinner from "./LoadingSpinner"

export default function FollowButton({ user }) {
  const queryClient = useQueryClient();
  const { mutate: toggleFollow, isLoading } = useMutation({
    mutationFn: 
  });
  function handleFollow(e){
    e.preventDefault()
    toggleFollow(user)
  }
  return (
    <button
      className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
      onClick={handleFollow}
    >
      {isLoading ? <LoadingSpinner size="sm"/> : Follow}
    </button>
  );
}
