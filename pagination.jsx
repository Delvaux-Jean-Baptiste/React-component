import "./Pagination.css";
import SpecialButton from "./SpecialButton.jsx";

export default function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    itemsPerPageOptions = [5, 10, 25, 50],

    onPageChange,
    onItemsPerPageChange,
}) {

    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / itemsPerPage)
    );

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        onPageChange?.(page);
    };

    const handleItemsPerPage = (event) => {
        onItemsPerPageChange?.(
            Number(event.target.value)
        );
    };

    const pages = [];

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        end = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination">

            <div className="pagination-info">
                {totalItems} élément{totalItems > 1 ? "s" : ""}
            </div>

            <div className="pagination-buttons">

                <SpecialButton
                    label="⏮"
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(1)}
                />

                <SpecialButton
                    label="◀"
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                />

                {pages.map((page) => (
                    <SpecialButton
                        key={page}
                        label={page.toString()}
                        variant={
                            page === currentPage
                                ? "primary"
                                : "secondary"
                        }
                        onClick={() => goToPage(page)}
                    />
                ))}

                <SpecialButton
                    label="▶"
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                />

                <SpecialButton
                    label="⏭"
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(totalPages)}
                />

            </div>

            <div className="pagination-select">

                <span>Éléments / page</span>

                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPage}
                >
                    {itemsPerPageOptions.map((value) => (
                        <option
                            key={value}
                            value={value}
                        >
                            {value}
                        </option>
                    ))}
                </select>

            </div>

        </div>
    );
}