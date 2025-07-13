export default function DiagnosisInputPanel({ inputText, onChange, onFetch }) {
    const handleChange = (e) => {
        e.target.style.height = 'auto'; // 先重置高度
        e.target.style.height = `${e.target.scrollHeight}px`; // 设置为内容高度
        onChange(e.target.value); // 更新 state
    };

    return (
        <div className="input-panel">
            <label htmlFor="patient-input">Patient's condition:</label>
            <textarea
                id="patient-input"
                className="input-box"
                value={inputText}
                onChange={handleChange}
                placeholder="Describe the condition..."
                rows={1}
            />
            <button className="fetch-btn" onClick={onFetch}>
                Get Diagnoses
            </button>
        </div>
    );
}
