import React, { useState } from "react";
import fire from "../asserts/fireimage.jpg";

const ProfileImageCard = ({ post, setSelectedPost }) => {
    const img = new Image();
    img.src = post.imageUrl;

    return (
        <div
            className={`${
                img.naturalWidth > img.naturalHeight
                    ? "max-w-[25rem] "
                    : "max-w-[17rem] "
            }`}
            onClick={() => setSelectedPost(post)}
        >
            <div>
                <img src={post.imageUrl} className="object-cover" />
            </div>
            <div className="p-1 text-sm text-right">
                <p>{post.tipedAmount} Eth</p>
            </div>
        </div>
    );
};

export default ProfileImageCard;
