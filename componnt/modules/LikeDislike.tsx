import { IComment } from "@/app/item/[id]/page";
import { useState } from "react";

interface CommentProps {
  comment: IComment;
  currentUser: string; 
  handleLikeDislike: (id: string, action: "like" | "dislike") => Promise<void>;
}

export default function Comment({
  comment,
  currentUser,
  handleLikeDislike,
}: CommentProps) {
  const [loadingAction, setLoadingAction] = useState<"like" | "dislike" | null>(
    null
  );
  const [animate, setAnimate] = useState<"like" | "dislike" | null>(null);

  const hasLiked = comment.likedBy.some((u) => u === currentUser);
  const hasDisliked = comment.dislikedBy.some((u) => u === currentUser);

  const onClick = async (action: "like" | "dislike") => {
    setLoadingAction(action);
    setAnimate(action); // شروع انیمیشن عدد
    await handleLikeDislike(comment._id, action);
    setLoadingAction(null);

    // پایان انیمیشن بعد از 300ms
    setTimeout(() => setAnimate(null), 100);
  };

console.log(hasLiked);


  return (
    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-end gap-6">
      {/* LIKE */}
      <button
        onClick={() => onClick("like")}
        className={`group flex items-center gap-1.5 cursor-pointer transition-colors duration-300
          ${
            hasLiked
              ? "text-emerald-500"
              : "text-gray-400 hover:text-emerald-500"
          }`}
      >
        <span
          className={`text-[10px] font-bold text-Yekan transform transition-all duration-300 
            ${
              animate === "like"
                ? "scale-125 text-emerald-600"
                : hasLiked
                ? "text-emerald-600"
                : "group-hover:text-emerald-600"
            }`}
        >
          {loadingAction === "like" ? (
            <span className="animate-pulse">--</span>
          ) : (
            comment.Like
          )}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 
            ${hasLiked ? "text-emerald-600" : "group-hover:text-emerald-600"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M14.25 9h2.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.551.446.918a6.011 6.011 0 0 0-1.074 1.581c-.235.537-.372 1.138-.372 1.77 0 .857.18 1.671.503 2.408"
          />
        </svg>
      </button>

      {/* DISLIKE */}
      <button
        onClick={() => onClick("dislike")}
        className={`group flex items-center gap-1.5 cursor-pointer transition-colors duration-300
          ${hasDisliked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
      >
        <span
          className={`text-[10px] font-bold text-Yekan transform transition-all duration-300 
            ${
              animate === "dislike"
                ? "scale-125 text-red-600"
                : hasDisliked
                ? "text-red-600"
                : "group-hover:text-red-600"
            }`}
        >
          {loadingAction === "dislike" ? (
            <span className="animate-pulse">--</span>
          ) : (
            comment.Dislike
          )}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 md:w-5 md:h-5 rotate-180 transition-colors duration-300 
            ${hasDisliked ? "text-red-600" : "group-hover:text-red-600"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M14.25 9h2.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.551.446.918a6.011 6.011 0 0 0-1.074 1.581c-.235.537-.372 1.138-.372 1.77 0 .857.18 1.671.503 2.408"
          />
        </svg>
      </button>
    </div>
  );
}
