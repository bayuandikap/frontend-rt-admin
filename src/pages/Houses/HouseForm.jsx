import { useEffect, useState } from "react";

export default function HouseForm({ house, onSubmit, onClose }) {

    const [houseNumber, setHouseNumber] = useState("");
    const [block, setBlock] = useState("");
    const [status, setStatus] = useState("vacant");

    useEffect(() => {
        if (house) {
            setHouseNumber(house.house_number);
            setBlock(house.block);
            setStatus(house.status);
        }
    }, [house]);

    function submit(e) {
        e.preventDefault();

        onSubmit({
            house_number: houseNumber,
            block,
            status,
        });
    }

    return (
        <div className="card mb-3">

            <div className="card-header">
                <strong>
                    {house ? "Edit House" : "Add House"}
                </strong>
            </div>

            <div className="card-body">

                <form onSubmit={submit}>

                    <div className="mb-3">

                        <label>House Number</label>

                        <input
                            className="form-control"
                            value={houseNumber}
                            onChange={(e) =>
                                setHouseNumber(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label>Block</label>

                        <input
                            className="form-control"
                            value={block}
                            onChange={(e) =>
                                setBlock(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label>Status</label>

                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >
                            <option value="occupied">
                                Occupied
                            </option>

                            <option value="vacant">
                                Vacant
                            </option>

                        </select>

                    </div>

                    <button
                        className="btn btn-primary me-2"
                    >
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