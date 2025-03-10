import { usePosts } from "@/context/PostContext";
import CommunityPostCard from "@/components/community/CommunityPostCard";

const PostsTab = () => {
  const { posts } = usePosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg">
        <h3 className="text-xl font-semibold mb-2">There are no posts yet</h3>
        <p className="text-gray-600">Posts by this member will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      {posts.map((post, index) => (
        <CommunityPostCard key={index} {...post} />
      ))}
    </div>
  );
};

export default PostsTab; 