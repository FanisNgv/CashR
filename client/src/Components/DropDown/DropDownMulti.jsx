import React, { useState, useEffect } from "react";
import Select from "react-select";

const MultiSelect = ({selectedTypes, setSelectedTypes}) => {

    const[typesOfComes, setTypesOfComes] = useState(["Еда", "Здоровье", "Спорт", "Жилье", "Зарплата", "Стипендия"]);

    const options = typesOfComes.map((typeOfCome) => ({
        label: typeOfCome,
        value: typeOfCome,
    }));

    const handleSelectedTypes = (selectedOptions) => {
        setSelectedTypes(selectedOptions);
    };

    return (
        <Select
            value={selectedTypes}
            onChange={handleSelectedTypes}
            options={options}
            isMulti
        />
    );
};

export default MultiSelect;
