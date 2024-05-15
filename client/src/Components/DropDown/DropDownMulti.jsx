import React, { useState, useEffect } from "react";
import Select from "react-select";

const MultiSelect = ({ selectedTypes, setSelectedTypes, typesOfComes }) => {

    const options = typesOfComes.map((typeOfCome) => ({
        label: typeOfCome.name,
        value: typeOfCome.name,
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
