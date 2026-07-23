import { useState } from "react";

export default function SearchBar(
    {
        placeholderSearch = "Search...",
        onSearch = (search) => {console.log("Current value:", search)}
    }
) {
    const [searchTerm, setSearchTerm] = useState("")

    const handleSubmit = () => {
        onSearch(searchTerm);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <>
            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholderSearch}
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </>
    )
}
  