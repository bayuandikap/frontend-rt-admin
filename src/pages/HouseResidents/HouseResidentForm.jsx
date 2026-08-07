import { useEffect, useState } from "react";

export default function HouseResidentForm({
    record,
    houses,
    residents,
    onSubmit,
    onClose,
}) {

    const [houseId, setHouseId] = useState("");
    const [residentId, setResidentId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {

        if (!record) {

            setHouseId("");
            setResidentId("");
            setStartDate("");
            setEndDate("");
            setIsActive(true);

            return;
        }

        setHouseId(record.house_id ?? "");

        setResidentId(record.resident_id ?? "");

        setStartDate(record.start_date ?? "");

        setEndDate(record.end_date ?? "");

        setIsActive(!!record.is_active);

    }, [record]);

    function submit(e) {

        e.preventDefault();

        onSubmit({

            house_id: houseId,

            resident_id: residentId,

            start_date: startDate,

            end_date: endDate || null,

            is_active: isActive,

        });

    }

    return (

        <div className="card mb-3">

            <div className="card-header">

                <strong>

                    {record
                        ? "Edit House Resident"
                        : "Assign Resident"}

                </strong>

            </div>

            <div className="card-body">

                <form onSubmit={submit}>

                    <div className="mb-3">

                        <label>House</label>

                        <select
                            className="form-select"
                            value={houseId}
                            onChange={(e) =>
                                setHouseId(e.target.value)
                            }
                            required
                        >

                            <option value="">
                                Select House
                            </option>

                            {houses.map((house) => (

                                <option
                                    key={house.id}
                                    value={house.id}
                                >

                                    {house.house_number} ({house.block})

                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="mb-3">

                        <label>Resident</label>

                        <select
                            className="form-select"
                            value={residentId}
                            onChange={(e) =>
                                setResidentId(e.target.value)
                            }
                            required
                        >

                            <option value="">
                                Select Resident
                            </option>

                            {residents.map((resident) => (

                                <option
                                    key={resident.id}
                                    value={resident.id}
                                >

                                    {resident.name}

                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="mb-3">

                        <label>Move In Date</label>

                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label>Move Out Date</label>

                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-4">

                        <label>Status</label>

                        <select
                            className="form-select"
                            value={isActive ? "1" : "0"}
                            onChange={(e) =>
                                setIsActive(e.target.value === "1")
                            }
                        >

                            <option value="1">
                                Active
                            </option>

                            <option value="0">
                                Inactive
                            </option>

                        </select>

                    </div>

                    <button className="btn btn-primary me-2">

                        Save

                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >

                        Cancel

                    </button>

                </form>

            </div>

        </div>

    );

}