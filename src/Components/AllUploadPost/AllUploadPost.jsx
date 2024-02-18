// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import NewPost from "../NewPost";
import SingleUplodedPost from "../UplodedPost/SingleUplodedPost";
import style from "./AllUploadPost.module.css";

const AllUploadPost = () => {
  const userDetails = localStorage.getItem("userDetails");
  const parseUserDetails = JSON.parse(userDetails);

  const [postDetail, setPostDetails] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [wasLastList, setWasLastList] = useState(false);
  const listInnerRef = useRef();

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setCurrPage(prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const handelPost = async () => {
      const responce = await fetch(
        `https://academics.newtonschool.co/api/v1/facebook/user/${parseUserDetails?.data?.user?._id}/posts?limit=10&page=${prevPage}`,
        {
          method: "GET",
          headers: {
            projectId: "f104bi07c490",
          },
        }
      );
      const parseData = await responce.json();
      if (responce.status >= 400) {
        console.log(parseData.message || "post not fetch");
        return;
      }
      if (parseData.data.length == 0) {
        setWasLastList(true);
        return;
      }
      setPostDetails([...postDetail, ...parseData.data]);
      setPrevPage(currPage);
    };
    if (currPage !== prevPage && !wasLastList) {
      handelPost();
    }
  }, [currPage, wasLastList, prevPage]);

  return (
    <div
      onScroll={onScroll}
      ref={listInnerRef}
      className={style.all_post_container}
    >
      <NewPost />
      {postDetail &&
        postDetail.map((post, index) => (
          <SingleUplodedPost key={index} item={post} />
        ))}
    </div>
  );
};

export default AllUploadPost;
