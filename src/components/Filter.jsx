import React, { useState } from "react";

function FilterForm({ onFilter, filterData, setFilterData }) {
  const [filterValues, setFilterValues] = useState({
    previous_question: "",
    books: "",
    assigment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filterData);
  };

  return (
    <>
      <form className="d-flex ms-2">
        <div className="mb-3">
          <label
            htmlFor="assigment"
            className="form-label fw-bold text-center px-4"
          >
            Assigment
          </label>
          <select
            className="form-select"
            id="assigment"
            name="assigment"
            value={filterData.assigment}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="0">Not Approach</option>
            <option value="1">Successful</option>
            <option value="2">User Denied</option>
            <option value="3">Waiting</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="mb-3 mx-4">
          <label
            htmlFor="books"
            className="form-label fw-bold text-center px-4"
          >
            Books:
          </label>
          <select
            className="form-select"
            id="books"
            name="books"
            value={filterData.books}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="0">Not Approach</option>
            <option value="1">Successful</option>
            <option value="2">User Denied</option>
            <option value="3">Waiting</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div className="mb-3">
          <label
            htmlFor="previous_question"
            className="form-label fw-bold text-center px-4"
          >
            Previous Question:
          </label>
          <select
            className="form-select"
            id="previous_question"
            name="previous_question"
            value={filterData.previous_question}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="0">Not Approach</option>
            <option value="1">Successful</option>
            <option value="2">User Denied</option>
            <option value="3">Waiting</option>
            {/* Add more options as needed */}
          </select>
        </div>
      </form>
      <button onClick={handleSubmit} className="btn btn-primary mb-4 ms-2">
        Apply Filter
      </button>
    </>
  );
}


export default FilterForm;
