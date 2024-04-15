import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyDatePicker = ({ startDate, setStartDate }) => {

    const handleHourChange = (date) => {
        const newDate = new Date(startDate);
        newDate.setHours(date.getHours());
        setStartDate(newDate);
    };

    const handleMinuteChange = (date) => {
        const newDate = new Date(startDate);
        newDate.setMinutes(date.getMinutes());
        setStartDate(newDate);
    };

    return (
        <div>
            <DatePicker
                selected={startDate}
                onChange={setStartDate}
                dateFormat="dd/MM/yyyy"
                showTimeInput
                timeInputLabel="Time:"
            />
        </div>
    );
};

export default MyDatePicker;
