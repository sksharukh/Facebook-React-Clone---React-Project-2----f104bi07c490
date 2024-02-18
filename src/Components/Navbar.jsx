// @ts-nocheck
import AddIcon from "@mui/icons-material/Add";
import FlagIcon from "@mui/icons-material/Flag";
import ForumIcon from "@mui/icons-material/Forum";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import style from "./Navbar.module.css";
import { Profile } from "./Profile";

function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userDetail = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const searchTerm = e.target.value;
    setSearchValue(searchTerm);

    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setShowModal(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://academics.newtonschool.co/api/v1/facebook/user?search={%22name%22%3A%22${searchTerm}%22}`,
        {
          method: "GET",
          headers: {
            projectId: "f104bi07c490",
            Authorization: `Bearer ${userDetail.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setSearchResults(responseData.data);
      console.log("responseData", responseData);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching search results", error);
      setSearchResults([]);
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (userId) => {
    // Handle the click on a search result, e.g., navigate to the user's details page
    // console.log("Clicked on user:", userName);
    setShowModal(false);
    navigate(`/UsersDetails/${userId}`);
  };
  

  const toHome = () => {
    navigate("/");
  };
  const toStore = () => {
    navigate("/store");
  };
  const toPage = () => {
    navigate("/pages");
  };
  const tofeatureUpdateSoon = () => {
    navigate("/page-not-found");
  };
  return (
    <nav className={style.navbar}>
      <div className={style.navbar_logo}>
        <Link to={"/"}>
          <img className={style.facebookLogoname} src="https://logos-world.net/wp-content/uploads/2020/05/Facebook-Logo-2019.png"/>
          <img
            className={style.logoicon}
            src="https://www.edigitalagency.com.au/wp-content/uploads/Facebook-logo-blue-circle-large-transparent-png.png"
            alt="facebook_Logo"
          />
        </Link>
        <div className={style.search_and_profile}>
          <div className={style.navbar_search}>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchChange}
            />
            {showModal && searchResults.length > 0 && (
              <div className={style.modal}>
                {loading && <p>Loading...</p>}

                <ul className={style.searchResults}>
                  {searchResults.map((result) => (
                    <li
                      key={result.id}
                      onClick={() => handleResultClick(result._id)}
                    >
                      <div className={style.serchList} key={result._id}>
                        <div className={style.userProfile}>
                          <img src={result.profileImage} />
                        </div>
                        <div>
                          <div className={style.username}>{result.name}</div>
                          <div className={style.friend}>friend</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className={style.navSearchIcon}>
            <SearchIcon  />
          </div>
          <div className={style.navbar_mobile_profile}>
            {" "}
            <Profile />
          </div>
        </div>
      </div>

      <div className={style.navbar_icons}>
        <NavLink to="/">
          <button onClick={toHome}>
            <HomeRoundedIcon />
          </button>
        </NavLink>
        <NavLink to="/pages">
          <button onClick={toPage}>
            <FlagIcon />
          </button>
        </NavLink>
        <NavLink to="/video">
          <button>
            <OndemandVideoIcon />
          </button>
        </NavLink>
        <NavLink to="/store">
          <button onClick={toStore}>
            <StorefrontIcon />
          </button>
        </NavLink>
        <NavLink to="/friends">
          <button>
            <PeopleIcon />
          </button>
        </NavLink>
      </div>
      <div className={style.navbar_buttons}>
        <NavLink to="/home">
          <button>
            <AddIcon />
          </button>
        </NavLink>
        <NavLink to="/forum">
          <button>
            <ForumIcon />
          </button>
        </NavLink>
        <NavLink to="/notifications">
          <button>
            <NotificationsActiveIcon />
          </button>
        </NavLink>

        <Profile />
      </div>
    </nav>
  );
}

export default Navbar;
