import { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
    const [removeKtpPhoto, setRemoveKtpPhoto] = useState(false);

    function formatDateForInput(value) {
        if (!value) {
            return "";
        }

        return String(value).slice(0, 10);
    }

    useEffect(() => {
        if (resident) {
            setNik(resident.nik || "");
            setName(resident.name || "");
            setPhone(resident.phone || "");
            setEmail(resident.email || "");

            setBirthDate(
                formatDateForInput(resident.birth_date)
            );

            setGender(resident.gender || "male");
            setAddress(resident.address || "");
            setOccupation(resident.occupation || "");

            setResidentStatus(
                resident.resident_status || "permanent"
            );

            setIsMarried(!!resident.is_married);

            // Existing photo is not automatically
            // sent back to the server.
            setKtpPhoto(null);

            // Reset removal state whenever
            // another resident is opened.
            setRemoveKtpPhoto(false);
        } else {
            setNik("");
            setName("");
            setPhone("");
            setEmail("");
            setBirthDate("");
            setGender("male");
            setAddress("");
            setOccupation("");
            setResidentStatus("permanent");
            setIsMarried(false);
            setKtpPhoto(null);
            setRemoveKtpPhoto(false);
        }
    }, [resident]);

    function handleKtpPhotoChange(e) {
        const file = e.target.files?.[0] || null;

        if (!file) {
            setKtpPhoto(null);
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
        ];

        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: "warning",
                title: "Invalid file",
                text: "KTP photo must be JPG, JPEG, or PNG.",
            });

            e.target.value = "";
            setKtpPhoto(null);

            return;
        }

        const maxFileSize = 2 * 1024 * 1024;

        if (file.size > maxFileSize) {
            Swal.fire({
                icon: "warning",
                title: "File too large",
                text: "KTP photo size must not exceed 2 MB.",
            });

            e.target.value = "";
            setKtpPhoto(null);

            return;
        }

        setKtpPhoto(file);

        // Selecting a new photo means
        // we no longer want to remove the photo.
        setRemoveKtpPhoto(false);
    }

    async function handleRemoveKtpPhoto() {
        const result = await Swal.fire({
            icon: "warning",
            title: "Remove KTP photo?",
            text: "The existing KTP photo will be permanently removed when you save.",
            showCancelButton: true,
            confirmButtonText: "Remove",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d63939",
        });

        if (!result.isConfirmed) {
            return;
        }

        setRemoveKtpPhoto(true);
        setKtpPhoto(null);
    }

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
        formData.append(
            "is_married",
            isMarried ? "1" : "0"
        );

        /*
         * Tell Laravel whether the existing
         * KTP photo should be removed.
         */
        formData.append(
            "remove_ktp_photo",
            removeKtpPhoto ? "1" : "0"
        );

        /*
         * Only send a new actual File.
         */
        if (ktpPhoto instanceof File) {
            formData.append(
                "ktp_photo",
                ktpPhoto,
                ktpPhoto.name
            );
        }

        onSubmit(formData);
    }

    return (
        <div className="card mb-3">

            <div className="card-header">
                <strong>
                    {resident
                        ? "Edit Resident"
                        : "Add Resident"}
                </strong>
            </div>

            <div className="card-body">

                <form onSubmit={submit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Full Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            NIK
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={nik}
                            onChange={(e) =>
                                setNik(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Phone
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Birth Date
                        </label>

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

                        <label className="form-label">
                            Gender
                        </label>

                        <select
                            className="form-select"
                            value={gender}
                            onChange={(e) =>
                                setGender(e.target.value)
                            }
                        >

                            <option value="male">
                                Male
                            </option>

                            <option value="female">
                                Female
                            </option>

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Address
                        </label>

                        <textarea
                            className="form-control"
                            rows="3"
                            value={address}
                            onChange={(e) =>
                                setAddress(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Occupation
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={occupation}
                            onChange={(e) =>
                                setOccupation(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Resident Status
                        </label>

                        <select
                            className="form-select"
                            value={residentStatus}
                            onChange={(e) =>
                                setResidentStatus(
                                    e.target.value
                                )
                            }
                        >

                            <option value="permanent">
                                Permanent
                            </option>

                            <option value="contract">
                                Contract
                            </option>

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Marital Status
                        </label>

                        <select
                            className="form-select"
                            value={
                                isMarried
                                    ? "1"
                                    : "0"
                            }
                            onChange={(e) =>
                                setIsMarried(
                                    e.target.value === "1"
                                )
                            }
                        >

                            <option value="0">
                                Single
                            </option>

                            <option value="1">
                                Married
                            </option>

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            KTP Photo
                        </label>

                        {resident?.ktp_photo &&
                            !removeKtpPhoto && (
                                <div className="mb-2">

                                    <img
                                        src={resident.ktp_photo}
                                        alt="Existing KTP"
                                        className="img-thumbnail mb-2"
                                        style={{
                                            maxWidth: "240px",
                                            maxHeight: "160px",
                                            objectFit: "contain",
                                        }}
                                    />

                                    <div className="d-flex align-items-center gap-2">

                                        <span className="text-muted small">
                                            Existing KTP photo
                                        </span>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={
                                                handleRemoveKtpPhoto
                                            }
                                        >
                                            Remove Photo
                                        </button>

                                    </div>

                                </div>
                            )}

                        {removeKtpPhoto && (
                            <div className="alert alert-warning py-2">

                                <div className="d-flex justify-content-between align-items-center">

                                    <span>
                                        Existing KTP photo will be removed when you save.
                                    </span>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() =>
                                            setRemoveKtpPhoto(false)
                                        }
                                    >
                                        Undo
                                    </button>

                                </div>

                            </div>
                        )}

                        {!removeKtpPhoto && (
                            <>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                                    onChange={
                                        handleKtpPhotoChange
                                    }
                                />

                                <div className="form-hint">
                                    JPG, JPEG, or PNG only.
                                    Maximum file size: 2 MB.
                                </div>
                            </>
                        )}

                    </div>

                    <button
                        type="submit"
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