import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import usePagination from "../customeHooks/usePagination";

export const Dashboard = () => {
  const [userArr, setUserArr] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State variable for search query
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1); // State to track the page number entered by the user

  const {
    dataFromHook,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    jumpToPage,
  } = usePagination();

  useEffect(() => {
    //  setIsLoading(false);
    console.log("changed");
    console.log("dataFromHook:", dataFromHook);
    setUserArr(dataFromHook);
  }, [dataFromHook]);

  const getAllData = async () => {
    setIsLoading(true);
    let { data } = await axios.get("http://localhost/kartik.php?page=1");
    console.log("res:", data.data);
    setIsLoading(false);
    setUserArr(data.data);
  };

  const postData = (index) => {
    console.log("index:", userArr[index]);
    const data = userArr[index];
    setIsLoading(true);
    axios
      .post("http://localhost/kartik.php/", JSON.stringify(data))
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          // no need for this timeout in real application
          // just for testing the loader only
        }
        console.log(res);
      });
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleChange = (index, value, flag) => {
    // Update the value in userArr
    const updatedUserArr = [...userArr];
    console.log("updatedUserArr:", updatedUserArr[index]);
    updatedUserArr[index][flag] = value;
    setUserArr(updatedUserArr);
  };

  const handleSearch = () => {
    // Filter userArr based on the searchQuery
    // Assuming user_number is the field to be searched
    const filteredUsers = userArr.filter((user) =>
      user.user_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUserArr(filteredUsers);
  };

  const handlePageChange = (e) => {
    console.log("e:", e.target);
    e.preventDefault();
    // Update the current page to the value entered by the user
    // Ensure the page number is within valid range (between 1 and totalPages)
    // let pageNumber = e.target.value;
    let jumpTo = Math.min(Math.max(pageNumber, 1), totalPages);
    console.log("jumpTo:", jumpTo);
    jumpToPage(jumpTo)
  };
  return (
    <>
      {/* {isLoading ? (
        <div class="spinner-border spinner-overlay" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      ) : null} */}
      <div className="container border">
        {isLoading && (
          <div className="spinner-overlay">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <h2>Success App Dashboard</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by mobile number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
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
              <th>assigment</th>
              <th>Books</th>
              <th>Previous Ques</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userArr?.map((user, i) => {
              return (
                <tr key={i} className="text-center">
                  <td>{i + 1}</td>
                  <td>{user.user_name}</td>
                  <td>{user.user_number}</td>
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
                      value={user.assigment || "No"}
                      style={{
                        backgroundColor:
                          user.assigment === "Yes" ? "#C5EBAA" : "#FFFAB7",
                      }}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    {/* Dropdown */}
                    <select
                      className="form-select m-2"
                      onChange={(e) => handleChange(i, e.target.value, "books")}
                      value={user.books || "No"}
                      style={{
                        backgroundColor:
                          user.books === "Yes" ? "#C5EBAA" : "#FFFAB7",
                      }}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    {/* Dropdown */}
                    <select
                      className="form-select"
                      onChange={(e) =>
                        handleChange(i, e.target.value, "previous_question")
                      }
                      value={user.previous_question || "No"}
                      style={{
                        backgroundColor:
                          user.previous_question === "Yes"
                            ? "#C5EBAA"
                            : "#FFFAB7",
                      }}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
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

        <div className="container border">
          <form onSubmit={handlePageChange}>
            <input
              type="number"
              value={pageNumber}
              onChange={(e) => setPageNumber(parseInt(e.target.value))}
              min={1}
              max={totalPages}
            />
            {/* <button className="info">Go</button> */}
            <button
              type="button"
              class="btn btn-dark"
              onClick={(e) => handlePageChange(e)}
            >
              Go
            </button>
          </form>

          {/* Pagination controls */}
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
      {/* <div className="container border">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <a className="page-link" href="#" onClick={prevPage}>
                Previous
              </a>
            </li>
            {[...Array(totalPages).keys()].map((page) => (
              <li
                key={page}
                className={`page-item ${
                  currentPage === page + 1 ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </a>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <a className="page-link" href="#" onClick={nextPage}>
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div> */}
    </>
  );
};
