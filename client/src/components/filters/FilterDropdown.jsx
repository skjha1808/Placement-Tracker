import "../../styles/components.css";

function FilterDropdown({

    value,

    onChange,

    options,

}) {

    return (

        <select

            className="filter-dropdown"

            value={value}

            onChange={(e)=>
                onChange(e.target.value)
            }

        >

            {

                options.map(option=>(

                    <option
                        key={option}
                        value={option}
                    >

                        {option}

                    </option>

                ))

            }

        </select>

    );

}

export default FilterDropdown;