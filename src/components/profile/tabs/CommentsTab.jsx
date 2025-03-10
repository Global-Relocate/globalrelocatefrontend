import { useComments } from "@/context/CommentContext";
import CommunityPostCard from "@/components/community/CommunityPostCard";

const CommentsTab = () => {
  const { comments } = useComments();

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg">
        <h3 className="text-xl font-semibold mb-2">There are no comments yet</h3>
        <p className="text-gray-600">Comments by you will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      {comments.map((comment, index) => (
        <CommunityPostCard key={index} {...comment} />
      ))}
    </div>
  );
};

export default CommentsTab; 