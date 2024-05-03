import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../constant";
// import fetchData from "../components/Dashboard";
const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dataFromHook, setData] = useState([]);

  // useEffect(() => {
  
  //   fetchData();
  // }, [currentPage]);

  // const fetchData = async (filterData) => {
  //   try {
  //     const response = await axios.get(`${url}?page=${currentPage}`);
  //     setData(response.data.data);
  //     setTotalPages(response.data.totalPages);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const jumpToPage = (val) =>{
    if (val > 0 && val <= totalPages) {
      console.log('bla bla bla')
      setCurrentPage(val);
    }
  }

  const changeTotalPages = (n) => {
    setTotalPages(n);
  };


  return {
    dataFromHook,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    jumpToPage,
    changeTotalPages,
    // fetchData,
    setData,
  };
};

export default usePagination;
