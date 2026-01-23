import { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./Autocomplete.css";

const Autocomplete = ({
  options = [],
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  maxResults = 10,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value) {
      const selectedOption = options.find((opt) => opt.value === value);
      setSearchTerm(selectedOption ? selectedOption.label : value);
    } else {
      setSearchTerm("");
    }
  }, [value, options]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = options
        .filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, maxResults);
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options.slice(0, maxResults));
    }
    setHighlightedIndex(-1);
  }, [searchTerm, options, maxResults]);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);

    // Clear selection if user is typing and current value doesn't match
    if (value && term !== searchTerm) {
      onChange("");
    }
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option.label);
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className={`autocomplete-container ${className}`}>
      <span className="autocomplete-icon" aria-hidden>
        <SearchIcon fontSize="small" />
      </span>
      <input
        disabled={disabled}
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="autocomplete-input"
        autoComplete="off"
      />

      {isOpen && filteredOptions.length > 0 && (
        <div ref={dropdownRef} className="autocomplete-dropdown">
          {filteredOptions.map((option, index) => (
            <div
              key={option.id}
              className={`autocomplete-option ${
                index === highlightedIndex ? "highlighted" : ""
              } ${option.value === value ? "selected" : ""}`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </div>
          ))}

          {options?.length > maxResults && (
            <div className="autocomplete-info">
              Showing {Math.min(filteredOptions.length, maxResults)} of{" "}
              {options.length} results
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
