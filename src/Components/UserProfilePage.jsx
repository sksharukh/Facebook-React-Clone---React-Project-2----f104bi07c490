// @ts-nocheck
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../Provider/hooks";
import AllUploadPost from "./AllUploadPost/AllUploadPost";
import Navbar from "./Navbar";
import InfoContainer from "./UserProfileComponents/InfoContainer/InfoContainer";
import style from "./UserProfilePage.module.css";

const UserProfilePage = () => {
  const userDetails = localStorage.getItem("userDetails");
  const parseUserDetails = JSON.parse(userDetails);
  const { user, setUser } = useAuth();
  const [fileInput, setFileInput] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const choseProfileImageRef = useRef();

  const handleProfileImage = async () => {
    if (profileImage) {
      const form = new FormData();
      form.append("profileImage", fileInput[0], "profileImage.jpg");

      if (parseUserDetails.data) {
        fetch(
          `https://academics.newtonschool.co/api/v1/user/updateProfileImage`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${parseUserDetails.token}`,
              projectId: "f104bi07c490",
            },
            body: form,
          }
        )
          .then((data) => data.json())
          .then((data) => setUser(data.data.user));
      }
    } else return;
  };

  useEffect(() => {
    handleProfileImage();
  }, [profileImage]);

  if (!user) {
    return null;
  }
  return (
    <section className={style.ProfileSection}>
      <Navbar />
      <section className={style.coverPage}>
        <div className={style.coverImg}>
          <img
            src="https://fontawesome.com/social/male?f=classic&s=&v=5"
            alt="Profile Image"
          />
        </div>
        <div className={style.profileWrapper}>
          <div className={style.profile}>
            <div className={style.profileImageWrapper}>
              <img
                src={
                  user.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                }
                alt="Profile Image"
              />
              <button
                className={style.addProfileImage}
                onClick={() => {
                  if (choseProfileImageRef.current && !fileInput?.length) {
                    choseProfileImageRef.current.click();
                    handleProfileImage();
                  }
                }}
              >
                <AddAPhotoRoundedIcon />
              </button>
              <input
                type="file"
                ref={choseProfileImageRef}
                className={style.choose_Profile_input}
                onChange={(e) => {
                  setFileInput(e.target.files ?? []);
                  setProfileImage(URL.createObjectURL(e.target.files[0]));
                }}
                accept="image/*"
              />
            </div>
            <div className={style.profileContainer}>
              <div className={style.profileUsername}>{user.name}</div>
              <div className={style.profileFollowerCount}>Followers 6.2k</div>
            </div>
            <hr></hr>
          </div>
          <div className={style.buttonBar}>
            <button>Posts</button>
            <button>About</button>
            <button>Mentions</button>
            <button>Reels</button>
            <button>Photos</button>
            <button>videos</button>
            {/* <select name="" id="">
              More
            </select> */}
          </div>
        </div>
      </section>
      <section className={style.ContentWrapper}>
        <InfoContainer user={user} />
        <div className={style.ContentContainer}>
          <div className={style.PreviousPost}>
            <AllUploadPost />
          </div>
        </div>
      </section>
    </section>
  );
};

export default UserProfilePage;
