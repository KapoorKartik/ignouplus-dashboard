import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import usePagination from "../customeHooks/usePagination";
import { url } from "../constant";
import FilterForm from "./Filter";
// import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [userArr, setUserArr] = useState([]);
  const [mobileNumber, setmobileNumber] = useState(""); // State variable for search query
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1); // State to track the page number entered by the user
  const [filterData, setFilterData] = useState({});

  const {
    dataFromHook,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    jumpToPage,
    changeTotalPages,
    setData,
  } = usePagination();

  useEffect(() => {
    //  setIsLoading(false);
    setUserArr(dataFromHook);
  }, [dataFromHook]);

   useEffect(() => {
     //  setIsLoading(false);
    //  setUserArr(dataFromHook);
    console.log('page is changed:', currentPage)
    handleLoading(fetchData);
   }, [currentPage]);

  const getAllData = () => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  };

  const handleLoading = (fxn) => {
    setIsLoading(true);
    setTimeout(() => {
      fxn();
      setIsLoading(false);
    }, 200);
    // no need of this timeout jsut for testing
  };

  const postData = (index) => {
    // console.log("index:", userArr[index]);
    const data = {
      ...userArr[index],
      action: "updateDataByMobileNumber",
    };
    setIsLoading(true);
    axios.post(url, data).then((res) => {
      if (res.status === 200) {
        const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        setTimeout(() => {
          setIsLoading(false);
          setUserArr((prevUserArr) => {
            const updatedUserArr = [...prevUserArr];
            updatedUserArr[index]["updated_at"] = currentDate;
            return updatedUserArr;
          });
        }, 200);
        // no need for this timeout in real application
        // just for testing the loader only
      }
      // console.log(res);
    });
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleChange = (index, value, flag) => {
    // Update the value in userArr
    const updatedUserArr = [...userArr];
    // console.log("updatedUserArr:", updatedUserArr[index]);
    updatedUserArr[index][flag] = value;
    setUserArr(updatedUserArr);
  };

  const handleNumberChange = (val) => {
    console.log("val:", val);
    if (val.length > 10) return;
    let regex = /^\d*$/;
    if (regex.test(val)) {
      // If val is empty or contains only numbers, update the mobileNumber state
      setmobileNumber(val);
    }
    // setmobileNumber(val);
  };
  const handleSearch = () => {
    // Filter userArr based on the mobileNumber
    // Assuming user_number is the field to be searched
    console.log("mobileNumber", mobileNumber.length);
    if (mobileNumber.length !== 10) return;
    let postData = { mobileNumber, action: "searchByMobileNumber" };
    setIsLoading(true);
    axios
      .post(url, postData)
      .then((response) => {
        console.log("res:", response.data.data);
        changeTotalPages(1);
        setUserArr(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleReset = () => {
    // setPageNumber(1);
    setFilterData({
      previous_question: "",
      books: "",
      assigment: "",
    });
    setmobileNumber("");
    fetchData("reset");
    // getAllData();
  };
  const handleWhatsappOpen = (mob) => {
    const message = "Hello, this is a predefined message."; // Replace with your predefined message
    const url = `https://wa.me/${7018096573}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url);
  };

  const handlePageChange = (e) => {
    e.preventDefault();
   
    let jumpTo = Math.min(Math.max(pageNumber, 1), totalPages);
    console.log("jumpTo:", jumpTo);
    jumpToPage(jumpTo);
  };

  const handleBg = (selectedValue) => {
    switch (selectedValue) {
      case "0":
        return "#C5EBAA"; // Not Approach
      case "1":
        return "#8DECB4"; // Successful
      case "2":
        return "#F2A8A8"; // User Denied
      case "3":
        return "#D1BB9E"; // Waiting
      default:
        return "#C5EBAA"; // Default background color
    }
  };

  const removeTime = (dateTime) => {
    const [date, time] = dateTime?.split(" ");
    return date;
  };

  const onFilter = (data) => {
    data = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== "")
    );
    console.log("data on filter:", data);
    setFilterData(data);
    fetchData();
    // const postData = { ...data, action: "filterData" };
    // axios.post(`${url}`, JSON.stringify(postData)).then((res) => {
    //   console.log("res on filter:", res.data);
    //   setData(res.data.data);
    //   changeTotalPages(res.data.totalPages);
    // });
  };

  const fetchData = async (flag = "") => {
    console.log('new fetch data')
    let postData = {
      filterData,
      action: "getAllData",
      page: currentPage,
    };
    if (flag === "reset"){
      console.log('wow')
      postData = {
        filterData : {},
        action: "getAllData",
        page: currentPage,
      };

    }else {
      console.log('no flag')
    }
    console.log('postData:', postData)
    axios.post(`${url}`, JSON.stringify(postData)).then((res) => {
      console.log("res on filter:", res.data);
      setData(res.data.data);
      changeTotalPages(res.data.totalPages);
      console.log('res.data.totalPages:', res.data.totalPages)
    });
  };

  return (
    <>
      <div className="border w-98">
        {isLoading && (
          <div className="spinner-overlay">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <div class="container text-center">
          <h1 class="fw-bold mt-4">Success App Dashboard</h1>
        </div>

        <FilterForm
          onFilter={onFilter}
          filterData={filterData}
          setFilterData={setFilterData}
        />
        <div className="w-20 d-flex justify-content-start">
          <input
            type="text"
            class="form-control me-2 ms-2"
            placeholder="9876543210"
            value={mobileNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleLoading(handleSearch)}
          >
            Search
          </button>
          <button
            type="button"
            className="btn btn-primary ms-2"
            onClick={() => handleLoading(handleReset)}
          >
            Reset
          </button>
        </div>
        <table className="table table-striped">
          <thead className="sticky-header text-center">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Mobile Number</th>
              <th>Regional Center</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Assigment</th>
              <th>Books</th>
              <th>Previous Ques</th>
              <th>Remarks</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userArr?.length === 0 ? (
              <tr>
                <td colSpan={"12"} className="text-center">
                  Opps!! No Data Found
                </td>
              </tr>
            ) : null}

            {userArr?.map((user, i) => {
              return (
                <tr key={i} className="text-center">
                  <td>{i + 1}</td>
                  <td>{user.user_name}</td>
                  <td>
                    {user.user_number}

                    <a
                      href="#"
                      class="link-secondary ms-2"
                      onClick={(user) => handleWhatsappOpen(user?.user_number)}
                    >
                      <img src="/whatsapp.svg" alt="whatsapp" width={"25px"} />
                    </a>
                  </td>
                  <td>{user.user_regional_center}</td>
                  <td>{user.user_course}</td>
                  <td>{user.user_semester}</td>
                  <td>
                    {/* Dropdown */}
                    <select
                      className="form-select"
                      onChange={(e) =>
                        handleChange(i, e.target.value, "assigment")
                      }
                      value={user.assigment}
                      style={{
                        backgroundColor: handleBg(user.assigment || "0"),
                      }}
                    >
                      <option value="0">Not Approach</option>
                      <option value="1">Successful</option>
                      <option value="2">User Denied</option>
                      <option value="3">Waiting</option>
                    </select>
                  </td>
                  <td>
                    {/* Dropdown */}
                    <select
                      className="form-select"
                      onChange={(e) => handleChange(i, e.target.value, "books")}
                      value={user.books}
                      style={{ backgroundColor: handleBg(user.books || "0") }}
                    >
                      <option value="0">Not Approach</option>
                      <option value="1">Successful</option>
                      <option value="2">User Denied</option>
                      <option value="3">Waiting</option>
                    </select>
                  </td>
                  <td>
                    {/* Dropdown */}
                    <select
                      className="form-select"
                      onChange={(e) =>
                        handleChange(i, e.target.value, "previous_question")
                      }
                      value={user.previous_question}
                      style={{
                        backgroundColor: handleBg(
                          user.previous_question || "0"
                        ),
                      }}
                    >
                      <option value="0">Not Approach</option>
                      <option value="1">Successful</option>
                      <option value="2">User Denied</option>
                      <option value="3">Waiting</option>
                    </select>
                  </td>
                  <td>
                    <div className="">
                      <textarea
                        className="form-control"
                        placeholder="Leave a comment here"
                        id="floatingTextarea"
                        rows="1"
                        onChange={(e) =>
                          handleChange(i, e.target.value, "remarks")
                        }
                        value={user?.remarks}
                      ></textarea>
                      {/* <label htmlFor="floatingTextarea">Comments</label> */}
                    </div>
                  </td>
                  <td>{removeTime(user.updated_at)}</td>

                  <td>
                    <button
                      type="button"
                      class="btn btn-dark"
                      onClick={() => postData(i)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="d-flex justify-content-center">
          <div className="">
            <form onSubmit={handlePageChange}>
              <input
                type="number"
                onChange={(e) => setPageNumber(parseInt(e.target.value))}
                min={1}
                max={totalPages}
                value={currentPage}
              />
              {/* <button className="info">Go</button> */}
              <button
                type="button"
                class="btn btn-dark mx-2"
                onClick={(e) => handlePageChange(e)}
              >
                Go
              </button>
            </form>

            {/* Pagination controls */}
            <div className="my-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-2">
                {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
