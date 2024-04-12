import React, { useState, useEffect } from "react";
import Select from "react-select";

const SingleSelect = ({ typesOfComes, selectedType, setSelectedType, defaultOption }) => {
    const options = typesOfComes.map((typeOfCome) => ({
        label: typeOfCome.name,
        value: typeOfCome.id,
    }));

    const defaultOptionValue = options.find((option) => option.label === defaultOption);

    useEffect(() => {
        if (defaultOptionValue) {
            setSelectedType(defaultOptionValue);
        }
    }, [defaultOptionValue, setSelectedType]);

    const handleSelectedType = (selectedOptions) => {
        setSelectedType(selectedOptions);
    };

    return (
        <Select
            value={selectedType}
            onChange={handleSelectedType}
            options={options}
        />
    );
};

export default SingleSelect;
