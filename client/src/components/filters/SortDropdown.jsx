import "../../styles/components.css";

function SortDropdown({
    value,
    onChange,
}) {

    return (

        <select

            className="filter-dropdown"

            value={value}

            onChange={(e)=>
                onChange(e.target.value)
            }

        >

            <option value="default">

                Sort

            </option>

            <option value="packageHigh">

                Package High → Low

            </option>

            <option value="packageLow">

                Package Low → High

            </option>

            <option value="deadline">

                Deadline

            </option>

            <option value="az">

                Company A-Z

            </option>

        </select>

    );

}

export default SortDropdown;