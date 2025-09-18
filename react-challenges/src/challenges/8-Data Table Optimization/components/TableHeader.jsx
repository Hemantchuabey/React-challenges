export default function TableHeader({sortAsc,onSort}){
    return (
        <thead className="w-[40vw]">
            <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1 cursor-pointer" onClick={onSort}>Title : {sortAsc ? "🔼" : "🔽"}</th>
                <th className="border px-2 py-1">Price</th>
            </tr>
        </thead>
    )
}