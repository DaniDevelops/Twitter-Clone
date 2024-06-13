import Post from "./Post";
import PostSkeleton from "../Skeletons/PostSkeleton";
import { useQuery } from "react-query";
import { getPosts } from "../../api-client";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  function generatePostsEndpoint() {
    switch (feedType) {
      case "forYou":
        return "api/posts/all";
      case "following":
        return "api/posts/following";
      default:
        return "api/posts/all";
    }
  }

  const POST_URL = generatePostsEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(POST_URL),
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {(!isLoading || !isRefetching) && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {(!isLoading || !isRefetching) && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
