import { useState, useEffect } from "react";
import axios from "axios";

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dataFromHook, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost/ignouplus-admin/kartik.php?page=${currentPage}`
        );
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

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
    if (currentPage > 0 && currentPage < totalPages) {
      setCurrentPage(Number(val));
    }
  }

  return {
    dataFromHook,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    jumpToPage,
  };
};

export default usePagination;
