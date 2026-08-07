import { useEffect, useState } from "react";

export default function ResidentForm({ resident, onSubmit, onClose }) {

    const [nik, setNik] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("male");
    const [address, setAddress] = useState("");
    const [occupation, setOccupation] = useState("");
    const [residentStatus, setResidentStatus] = useState("permanent");
    const [isMarried, setIsMarried] = useState(false);
    const [ktpPhoto, setKtpPhoto] = useState(null);

    useEffect(() => {
        if (resident) {
            setNik(resident.nik);
            setName(resident.name);
            setPhone(resident.phone);
            setEmail(resident.email);
            setBirthDate(resident.birth_date);
            setResidentStatus(resident.resident_status);
            setIsMarried(!!resident.is_married);
        }
    }, [resident]);

    function submit(e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("nik", nik);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("birth_date", birthDate);
        formData.append("gender", gender);
        formData.append("address", address);
        formData.append("occupation", occupation);
        formData.append("resident_status", residentStatus);
        formData.append("is_married", isMarried ? 1 : 0);

        if (ktpPhoto) {
            formData.append("ktp_photo", ktpPhoto);
        }

        onSubmit(formData);
    }

    return (
        <div className="card mb-3">

            <div className="card-header">
                <strong>
                    {resident ? "Edit Resident" : "Add Resident"}
                </strong>
            </div>

            <div className="card-body">

                <form onSubmit={submit}>

                    <div className="mb-3">

                        <label>Full Name</label>

                        <input
                            className="form-control"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label>NIK</label>

                        <input
                            className="form-control"
                            value={nik}
                            onChange={(e) =>
                                setNik(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label>Phone</label>

                        <input
                            className="form-control"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label>Email</label>

                        <input
                            className="form-control"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label>Birth Date</label>

                        <input
                            type="date"
                            className="form-control"
                            value={birthDate}
                            onChange={(e) =>
                                setBirthDate(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label>Resident Status</label>

                        <select
                            className="form-select"
                            value={residentStatus}
                            onChange={(e) => setResidentStatus(e.target.value)}
                        >
                            <option value="permanent">Permanent</option>
                            <option value="contract">Contract</option>
                        </select>

                    </div>

                    <div className="mb-3">

                        <label>Marital Status</label>

                        <select
                            className="form-select"
                            value={isMarried ? "1" : "0"}
                            onChange={(e) => {
                                setIsMarried(e.target.value === "1");
                            }}
                        >
                            <option value="0">Single</option>
                            <option value="1">Married</option>
                        </select>

                    </div>


                    <div className="mb-3">

                        <label>KTP Photo</label>

                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) =>
                                setKtpPhoto(e.target.files[0])
                            }
                        />

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