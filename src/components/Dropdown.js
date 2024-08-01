import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const Dropdown = ({ title, options, selectedValue, setSelectedValue }) => {
  return (
    <div className="filter-box2">
      <button className="filter-button">
        <span>{selectedValue ? selectedValue : title}</span>
        <FontAwesomeIcon className="arrow-icon" icon={faAngleDown} />
      </button>
      <div className="filter-content">
        {options && options.length > 0 ? (
          options.map((option, index) => (
            <h1
              className="filter-item"
              onClick={() => setSelectedValue(option)}
            >
              {option}
            </h1>
          ))
        ) : (
          <h1 className="filter-item" onClick={() => setSelectedValue(null)}>
            No options found!
          </h1>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
