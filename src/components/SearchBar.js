import React from "react";
import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div>
      <form className="header-search">
        <IoSearch className="ms-3" />
        <input type="text" placeholder="Search Here..." />
      </form>
    </div>
  );
};

export default SearchBar;
