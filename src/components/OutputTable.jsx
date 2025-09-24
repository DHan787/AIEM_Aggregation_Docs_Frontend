import React from "react";

export default function OutputTable({
    diagnoses,
    onInputChange,
    onCheckboxChange,
    onSubmit,
    onAddRow,
    differentDiagnoses,
    onDeleteRow,
    isLoading = false,
    onDiagnosisClick,
}) {
    return (
        <div style={{ overflowX: "auto", width: "100%" }}>
            <div className="container mt-4" style={{ maxWidth: "80%", minWidth: "60%", margin: "0 auto" }}>
                <h2 className="text-secondary mb-3">Diagnoses</h2>
                <p className="text-muted">
                    Check the boxes next to the diagnoses with which you agree. Add new diagnoses if any are missing.
                </p>
                <table className="table table-bordered text-center" style={{ fontSize: "0.9rem" }}>
                    <thead className="table-primary">
                        <tr>
                            <th>Diagnosis</th>
                            <th>Probability</th>
                            <th>Urgency</th>
                            <th>On-the-Spot Diagnosis (P)</th>
                        </tr>
                        <tr>
                            <th colSpan="4" className="text-end small pe-3">
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                    <span>Urgency Legend:</span>

                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                        <span style={{ width: "15px", height: "15px", backgroundColor: "red" }}></span>
                                        <span>High</span>
                                    </span>

                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                        <span style={{ width: "15px", height: "15px", backgroundColor: "yellow" }}></span>
                                        <span>Medium</span>
                                    </span>

                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                        <span style={{ width: "15px", height: "15px", backgroundColor: "white", border: "1px solid #ccc" }}></span>
                                        <span>Low</span>
                                    </span>
                                </span>
                            </th>
                        </tr>


                    </thead>
                    <tbody>
                        {[...diagnoses]
                            .map((diagnosis, i) => ({ ...diagnosis, originalIndex: i }))
                            .filter(d => Number(d.probability.toFixed(1)) !== 0)
                            .sort((a, b) => b.probability - a.probability)
                            .map((diagnosis) => (
                                <tr key={diagnosis.originalIndex}>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 text-decoration-underline"
                                            onClick={() => onDiagnosisClick?.(diagnosis.diagnosis)} // NEW
                                            aria-label={`View details for ${diagnosis.diagnosis}`}
                                        >
                                            {diagnosis.diagnosis}
                                        </button>
                                    </td>
                                    <td>{diagnosis.probability.toFixed(1)}</td>
                                    <td>
                                        <div style={{
                                            width: "20px",
                                            height: "20px",
                                            margin: "auto",
                                            // border: "1px solid #ccc",
                                            backgroundColor:
                                                diagnosis.urgency === 3 ? "red" :
                                                    diagnosis.urgency === 2 ? "yellow" :
                                                        "white"
                                        }}></div>
                                    </td>
                                    <td>
                                        {/* <input
                                            type="number"
                                            min="0.1"
                                            max="1"
                                            step="0.01"
                                            value={diagnosis.spotValue || ""}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value);
                                                if (!isNaN(value)) {
                                                    onInputChange(diagnosis.originalIndex, value, "spot");
                                                    onCheckboxChange(diagnosis.originalIndex);
                                                } else {
                                                    onInputChange(diagnosis.originalIndex, "", "spot");
                                                }
                                            }}
                                            className="form-control d-inline w-50 me-2"
                                        /> */}
                                        <input
                                            type="checkbox"
                                            checked={diagnosis.selected || false}
                                            onChange={() => onCheckboxChange(diagnosis.originalIndex)}
                                        />

                                        {/* Urgency selector (only visible when selected) */}
                                        {/* {diagnoses[diagnosis.originalIndex]?.selected && (
                                            <div style={{ display: "flex", marginTop: "5px", height: "20px", border: "1px solid #ccc", borderRadius: "3px", overflow: "hidden" }}>
                                                {[3, 2, 1].map((level) => {
                                                    const colors = {
                                                        3: "#8B0000",  // dark red
                                                        2: "#CCCC00",  // dark yellow
                                                        1: "#e0e0e0"   // dark white
                                                    };
                                                    const activeColors = {
                                                        3: "#FF4C4C",  // light red
                                                        2: "#FFFF66",  // light yellow
                                                        1: "#FFFFFF"   // bright white
                                                    };
                                                    const isActive = diagnosis.urgencyValue === level;
                                                    return (
                                                        <div
                                                            key={level}
                                                            onClick={() => onInputChange(diagnosis.originalIndex, level, "urgency")}
                                                            style={{
                                                                flex: 1,
                                                                cursor: "pointer",
                                                                backgroundColor: isActive ? activeColors[level] : colors[level],
                                                                borderRight: level !== 1 ? "1px solid #999" : "none"
                                                            }}
                                                            title={level === 3 ? "High" : level === 2 ? "Medium" : "Low"}
                                                        ></div>
                                                    );
                                                })}
                                            </div>
                                        )} */}
                                    </td>
                                </tr>
                            ))}
                    </tbody>

                </table>

                <h3 className="text-secondary mt-5">Add New Diagnoses</h3>
                <button className="btn btn-outline-success mb-3" onClick={onAddRow}>
                    + Add Row
                </button>
                <table className="table table-bordered text-center">
                    <thead className="table-secondary">
                        <tr>
                            <th>Diagnosis</th>
                            <th>Probability (0.1 - 1)</th>
                            <th>Urgency</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {differentDiagnoses.map((row, idx) => (
                            <tr key={idx}>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={row.diagnosis}
                                        onChange={(e) => onInputChange(idx, e.target.value, "diff")}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0.1"
                                        max="1"
                                        step="0.01"
                                        className="form-control"
                                        value={row.probability}
                                        onChange={(e) => onInputChange(idx, e.target.value, "prob")}
                                    />
                                </td>
                                <td>
                                    <div style={{ display: "flex", height: "20px", border: "1px solid #ccc", borderRadius: "3px", overflow: "hidden" }}>
                                        {[3, 2, 1].map((level) => {
                                            const colors = {
                                                3: "#8B0000",
                                                2: "#CCCC00",
                                                1: "#e0e0e0"
                                            };
                                            const activeColors = {
                                                3: "#FF4C4C",
                                                2: "#FFFF66",
                                                1: "#FFFFFF"
                                            };
                                            const isActive = row.urgencyValue === level;
                                            return (
                                                <div
                                                    key={level}
                                                    onClick={() => onInputChange(idx, level, "diff-urgency")}
                                                    style={{
                                                        flex: 1,
                                                        cursor: "pointer",
                                                        backgroundColor: isActive ? activeColors[level] : colors[level],
                                                        borderRight: level !== 1 ? "1px solid #999" : "none"
                                                    }}
                                                    title={level === 3 ? "High" : level === 2 ? "Medium" : "Low"}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => onDeleteRow(idx)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                <div className="text-center mt-4">
                    <button onClick={onSubmit} disabled={isLoading}>
                        {isLoading ? "Submitting..." : "Submit Feedback"}
                    </button>
                </div>
            </div>
        </div>
    );
}
