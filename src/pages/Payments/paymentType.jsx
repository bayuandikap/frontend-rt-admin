const [houseId, setHouseId] = useState("");
const [paymentTypeId, setPaymentTypeId] = useState("");

const [month, setMonth] = useState("");
const [year, setYear] = useState(new Date().getFullYear());

const [amount, setAmount] = useState("");

const [paidAt, setPaidAt] = useState("");

const [status, setStatus] = useState("unpaid");

const [notes, setNotes] = useState("");

useEffect(() => {

    if (!payment) return;

    setHouseId(payment.house_id);

    setPaymentTypeId(payment.payment_type_id);

    setMonth(payment.month);

    setYear(payment.year);

    setAmount(payment.amount);

    setPaidAt(payment.paid_at ?? "");

    setStatus(payment.status);

    setNotes(payment.notes ?? "");

}, [payment]);

<select
    className="form-select"
    value={houseId}
    onChange={(e) => setHouseId(e.target.value)}
>

    <option value="">
        Choose House
    </option>

    {houses.map(h => (
        <option key={h.id} value={h.id}>
            {h.house_number}
        </option>
    ))}

</select>