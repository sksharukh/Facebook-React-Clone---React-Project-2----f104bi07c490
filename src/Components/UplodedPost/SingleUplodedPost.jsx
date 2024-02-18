// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Provider/hooks";
import CommentIcon from "../../assets/comment.svg";
import LikeIcon from "../../assets/like.svg";
import LikedIcon from "../../assets/liked.svg";
import ShareIcon from "../../assets/share.svg";
import { timePassedFromTimestamp } from "../../utils/time";
import style from "./SingleUplodedPost.module.css";

const SingleUplodedPost = ({ item }) => {
  const userDetail = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const [like, setLike] = useState(item?.likeCount || 0);
  const [selfLike, setSelfLike] = useState(false);
  const [userDetails , setUserDetails] = useState();
  const { user } = useAuth();
  const navigate = useNavigate();
  const getUserDetails= async() => {
    const responce = await fetch(
      `https://academics.newtonschool.co/api/v1/facebook/user/${item.author}`,
      {
        method: "GET",
        headers: {
          projectId: "f104bi07c490",
          Authorization: `Bearer ${userDetail.token}`,
        },
      }
    );
    const parseData = await responce.json();
    if (responce.status >= 400) {
      console.log(parseData.message || "post not fetch");
      return;
    }
    setUserDetails(parseData.data);
    console.log("parseData.data", parseData.data);
  }
  const handleLike = async () => {
    const responce = await fetch(
      `https://academics.newtonschool.co/api/v1/facebook/like/${item?._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userDetail.token}`,
          projectId: "f104bi07c490",
        },
      }
    );
    const parseData = await responce.json();
    if (responce.status >= 400) {
      console.log(parseData.message || "like Failed");
      if (parseData.message === "You already liked this post") {
        setLike(like + 1);
        setSelfLike(true);
      }
      return;
    }
    setLike(like + 1);
    setSelfLike(true);
  };
  const handleRemoveLike = async () => {
    const responce = await fetch(
      `https://academics.newtonschool.co/api/v1/facebook/like/${item?._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userDetail.token}`,
          projectId: "f104bi07c490",
        },
      }
    );
    const parseData = await responce.json();
    if (responce.status >= 400) {
      console.log(parseData.message || "like Failed");
      return;
    }
    setLike(like - 1);
    setSelfLike(false);
  };
  const handleComment = () => {
    navigate(`/post/${item._id}/`);
  };
  useEffect(()=>{
    getUserDetails();
  },[])

  return (
    <div className={style.SinglePost_container}>
      <>
        <div className={style.profile}>
          <span>
            <img
              src={
                userDetails?.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
              }
              alt="pofile"
            ></img>
          </span>
          <span>
            <div>{userDetails?.name}</div>
            <div className={style.CreatedTime}>
              {timePassedFromTimestamp(item.createdAt)}
            </div>
          </span>
        </div>
        <Link to={`/post/${item?._id}/`}>
          <p>{item.content}</p> 
          {item.images?.length && (
            <img src={item.images[0]} alt="image" className={style.PostImage} />
          )}
        </Link>
      </>

      <div className={style.LikeCommentShareCount}></div>
      <div className={style.LikeCommentShare}>
        <button
          className={style.postBottomButton}
          onClick={selfLike ? handleRemoveLike : handleLike}
          style={{ color: selfLike ? "blue" : "black" }}
        >
          {selfLike ? (
            <img src={LikedIcon} alt="like" />
          ) : (
            <img src={LikeIcon} alt="like" />
          )}
          <span>Like</span> {like}
        </button>
        {/* <Link to={`/post/${item?.data?._id}/`}> */}
        <button onClick={handleComment} className={style.postBottomButton}>
          <img src={CommentIcon} alt="comment" />
          <span>Comments</span>
        </button>
        {/* </Link> */}
        <button className={style.postBottomButton}>
          <img src={ShareIcon} alt="Share" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default SingleUplodedPost;
