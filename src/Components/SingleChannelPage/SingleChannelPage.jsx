// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import SinglePost from "../SinglePost/SinglePost";

const SingleChannelPage = () => {
  let params = useParams();
  const channelID = params.channelID;
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
        `https://academics.newtonschool.co/api/v1/facebook/channel/${channelID}/posts/?limit=10&page=${prevPage}`,
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
      console.log("postDetail", parseData.data);
      setPrevPage(currPage);
    };
    if (currPage !== prevPage && !wasLastList) {
      handelPost();
    }
  }, [currPage, wasLastList, prevPage]);

  return (
    <>
      <Navbar />
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{
          width: "100%",
          justifyContent: "center",
          alignContent: "center",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          // height: "calc(100% - 68px)",
          margin: "auto",
          overflow: "scroll",
          overscrollBehavior: "contain",
        }}
      >
        {postDetail &&
          postDetail.map((post, index) => (
            <SinglePost item={post} key={index} index={index} />
          ))}
      </div>
    </>
  );
};

export default SingleChannelPage;
