import React, { useState, useEffect, useCallback } from "react";
import logo from "../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Dropdown from "../components/Dropdown";
import InfiniteScroll from "react-infinite-scroll-component";

const UserListing = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // API call for get users
  const getUsersViaAPI = async (page) => {
    const response = await axios.get(
      `https://dummyjson.com/users?limit=10&page=${page}`
    );
    return response ? response.data : [];
  };

  // fetching users using API
  const getUser = useCallback(async () => {
    try {
      const res = await getUsersViaAPI(page);
      setUsersData((prevUsers) => [...prevUsers, ...res.users]);
      if (res.users.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.log("error fetching data:", error);
    }
  }, [page]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  // sorting
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedData =
    usersData &&
    [...usersData].sort((a, b) => {
      if (sortConfig.key === "name") {
        const nameA = `${a.firstName} ${
          a.maidenName ? a.maidenName + " " : ""
        }${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${
          b.maidenName ? b.maidenName + " " : ""
        }${b.lastName}`.toLowerCase();
        if (nameA < nameB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (nameA > nameB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      }
    });

  // gender filter
  const users =
    selectedGender && selectedGender !== "All"
      ? sortedData.filter(
          (user) => user.gender.toLowerCase() === selectedGender.toLowerCase()
        )
      : sortedData;

  return (
    <div className="main">
      <div className="header">
        <img className="logo-img" src={logo} alt="Logo" />
        <FontAwesomeIcon className="bars-icon" icon={faBars} />
      </div>

      <div className="data">
        <div className="data-title">
          <span className="title">Employees</span>

          {/* filters */}
          <div className="filters">
            <Dropdown
              title={"Country"}
              options={[]}
              selectedValue={selectedCountry}
              setSelectedValue={setSelectedCountry}
            />

            <Dropdown
              title={"Gender"}
              options={["All", "Male", "Female"]}
              selectedValue={selectedGender}
              setSelectedValue={setSelectedGender}
            />
          </div>
        </div>

        {/* User listing */}
        <div className="data-table">
          <div className="table-title">
            <div className="id" onClick={() => handleSort("id")}>
              <span>ID</span>
              <FontAwesomeIcon className="arrowUp-icon" icon={faArrowUp} />
              <FontAwesomeIcon className="arrowDown-icon" icon={faArrowDown} />
            </div>
            <span className="image">Image</span>
            <div className="name" onClick={() => handleSort("name")}>
              <span>Full Name</span>
              <FontAwesomeIcon className="arrowUp-icon" icon={faArrowUp} />
              <FontAwesomeIcon className="arrowDown-icon" icon={faArrowDown} />
            </div>
            <span className="Demography">Demography</span>
            <span className="Designation">Designation</span>
            <span className="Location">Location</span>
          </div>

          <InfiniteScroll
            dataLength={users.length}
            next={() => setPage((prevPage) => prevPage + 1)}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>No more users to show</b>
              </p>
            }
          >
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <div className="table-data" key={index}>
                  <span className="id-span">
                    {user.id < 10 ? `0${user.id}` : user.id}
                  </span>
                  <img className="data-image" src={user.image} alt="User" />
                  <span className="name-span">
                    {user.firstName}{" "}
                    {user.maidenName ? user.maidenName + " " : ""}
                    {user.lastName}
                  </span>
                  <span className="Demography-span">
                    {user.gender === "female" ? "F" : "M"}/{user.age}
                  </span>
                  <span className="Designation-span">{user.company.title}</span>
                  <span className="Location-span">
                    {user.address.state}, USA
                  </span>
                </div>
              ))
            ) : (
              <div
                className="table-data"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                }}
              >
                <h3>No Users Found!</h3>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default UserListing;
