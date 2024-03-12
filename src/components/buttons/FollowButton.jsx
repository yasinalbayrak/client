import React from 'react';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
const FollowButton = ({ isFollowing, addFollower, removeFollower, applicationId }) => {
    if (isFollowing == null || applicationId == null || addFollower == null || removeFollower == null) {
        return
    }


    return (
        <>
            {!isFollowing ? (

                <IconButton
                    title="Save"
                    onClick={() => addFollower(applicationId)}
                >
                    <StarBorderIcon
                        sx={{ color: "#FFC700", fontSize: "30px" }}
                    ></StarBorderIcon>
                </IconButton>

            ) : (
                <IconButton
                    title="Unsave"
                    onClick={() => removeFollower(applicationId)}
                >
                    <StarIcon
                        sx={{ color: "#FFC700", fontSize: "30px" }}
                    ></StarIcon>
                </IconButton>
            )}
        </>


    );
};

export default FollowButton;
