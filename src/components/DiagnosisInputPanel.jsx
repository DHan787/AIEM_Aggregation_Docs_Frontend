/*
 * @Author: Jiang Han
 * @Date: 2025-07-13 14:49:35
 * @Description: 
 */
/*
 * @Author: Jiang Han
 * @Date: 2025-07-13 14:49:35
 * @Description: 
 */
export default function DiagnosisInputPanel({ inputText, onChange, onFetch, isLoading }) {
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
            <button className="fetch-btn" onClick={onFetch} disabled={isLoading}>
                {isLoading ? "Loading..." : "Get Diagnoses"}
            </button>
        </div>
    );
}
