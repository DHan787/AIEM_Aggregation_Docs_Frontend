import React from "react";

export default function OutputTable({
    diagnoses,
    onInputChange,
    onCheckboxChange,
    onSubmit,
    onAddRow,
    differentDiagnoses,
    onDeleteRow,
}) {
    return (
        <div style={{ overflowX: "auto", width: "100%" }}>
            <div className="container mt-4" style={{ maxWidth: "80%", minWidth: "60%", margin: "0 auto" }}>
                <h2 className="text-secondary mb-3">Aggregated Diagnoses</h2>
                <table className="table table-bordered text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Diagnosis</th>
                            <th>Aggregated Probability</th>
                            <th>On-the-Spot Diagnosis (P)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...diagnoses]
                            .map((diagnosis, i) => ({ ...diagnosis, originalIndex: i }))
                            .sort((a, b) => b.probability - a.probability)
                            .map((diagnosis, idx) => (
                                <tr key={idx}>
                                    <td>{diagnosis.diagnosis}</td>
                                    <td>{diagnosis.probability.toFixed(1)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0.1"
                                            max="1"
                                            step="0.01"
                                            value={diagnosis.spotValue || ""}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value);
                                                if (!isNaN(value)) {
                                                    onInputChange(diagnosis.originalIndex, value, "spot");
                                                    onCheckboxChange(diagnosis.originalIndex, true, "selected");
                                                } else {
                                                    onInputChange(diagnosis.originalIndex, "", "spot");
                                                }
                                            }}
                                            className="form-control d-inline w-50 me-2"
                                        />
                                        <input
                                            type="checkbox"
                                            checked={diagnoses[diagnosis.originalIndex]?.selected || false}
                                            onChange={() => onCheckboxChange(diagnosis.originalIndex)}
                                        />
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
                    <button className="btn btn-primary px-5" onClick={onSubmit}>
                        Submit All
                    </button>
                </div>
            </div>
        </div>
    );
}
