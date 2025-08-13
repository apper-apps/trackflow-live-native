import { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ placeholder = "Search issues...", onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className={cn("relative", className)}>
      <ApperIcon
        name="Search"
        className="absolute left-3 top-3 h-4 w-4 text-gray-500"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10 bg-gradient-to-r from-white to-gray-50 border-gray-300 focus:border-primary focus:bg-white"
      />
    </div>
  );
};

export default SearchBar;