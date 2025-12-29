function FilterBar() {
    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <select className="border p-2 rounded">
                <option>City</option>
                <option>Bangalore</option>
                <option>Delhi</option>
            </select>

            <select className="border p-2 rounded">
                <option>Budget</option>
                <option>Below 10k</option>
                <option>10k - 20k</option>
            </select>

            <select className="border p-2 rounded">
                <option>Furnishing</option>
                <option>Fully Furnished</option>
                <option>Semi Furnished</option>
            </select>
        </div>
    );
}

export default FilterBar;
