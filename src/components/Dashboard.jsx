import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export const Dashboard = () => {
  const [userArr, setUserArr] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State variable for search query
  const [isLoading, setIsLoading] = useState(true);
  const getAllData = async () => {
    setIsLoading(true);
    let res = await axios.get("http://localhost/kartik.php/");
    console.log("res:", res.data[0]);
    setIsLoading(false);
    setUserArr(res.data);
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
            }, 20000);
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
      </div>
    </>
  );
};
