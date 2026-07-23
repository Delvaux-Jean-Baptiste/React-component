import { useMemo, useState } from "react";
import Pagination from "./Pagination.jsx";

export default function PaginationDemo() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // 237 éléments fictifs
    const items = useMemo(
        () =>
            Array.from({ length: 237 }, (_, i) => ({
                id: i + 1,
                name: `Élément ${i + 1}`,
            })),
        []
    );

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const displayedItems = items.slice(start, end);

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "40px auto",
                padding: "20px",
            }}
        >
            <h1>Démonstration de la Pagination</h1>

            <p>
                Affichage de <strong>{start + 1}</strong> à{" "}
                <strong>{Math.min(end, items.length)}</strong> sur{" "}
                <strong>{items.length}</strong> éléments.
            </p>

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    overflow: "hidden",
                }}
            >
                {displayedItems.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            padding: "16px",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <strong>#{item.id}</strong> — {item.name}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "30px" }}>
                <Pagination
                    currentPage={currentPage}
                    totalItems={items.length}
                    itemsPerPage={itemsPerPage}
                    itemsPerPageOptions={[5, 10, 20, 50]}

                    onPageChange={setCurrentPage}

                    onItemsPerPageChange={(value) => {
                        setItemsPerPage(value);
                        setCurrentPage(1);
                    }}
                />
            </div>
        </div>
    );
}