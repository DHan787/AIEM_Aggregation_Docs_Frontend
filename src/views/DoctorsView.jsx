import React, { useState } from "react";
import DiagnosisInputPanel from "../components/DiagnosisInputPanel";
import DiagnosisEditor from "../components/DiagnosisEditor";

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorsView() {
    const [inputText, setInputText] = useState("");
    const [diagnoses, setDiagnoses] = useState([]);
    const [differentDiagnoses, setDifferentDiagnoses] = useState([]);
    const [caseId, setCaseId] = useState(null);

    const handleFetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/initialize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input_text: inputText,
                    self_learning_rate: 0.1,
                    rein_learning_rate: 0.5
                }),
            });
            const data = await res.json();
            setCaseId(data.case_id);
            setDiagnoses(
                data.diagnoses.map(([diagnosis, probability]) => ({
                    diagnosis,
                    probability,
                    urgency: data.urgency?.[diagnosis] || 0
                }))
            );
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const handleDiagnosisInputChange = (idx, value, type) => {
        const updated =
            type === "diff" || type === "prob" || type === "diff-urgency"
                ? [...differentDiagnoses]
                : [...diagnoses];

        if (type === "diff") {
            updated[idx].diagnosis = value;
            setDifferentDiagnoses(updated);
        } else if (type === "prob") {
            updated[idx].probability = value;
            setDifferentDiagnoses(updated);
        } else if (type === "diff-urgency") {
            updated[idx].urgencyValue = value;
            setDifferentDiagnoses(updated);
        } else if (type === "urgency") {
            updated[idx].urgencyValue = value;
            setDiagnoses(updated);
        } else {
            updated[idx].spotValue = parseFloat(value);
            setDiagnoses(updated);
        }
    };


    const handleCheckboxChange = (idx) => {
        const updated = [...diagnoses];
        updated[idx].selected = !updated[idx].selected;
        setDiagnoses(updated);
    };

    const handleAddRow = () => {
        setDifferentDiagnoses([
            ...differentDiagnoses,
            { diagnosis: "", probability: "" },
        ]);
    };

    const handleDeleteRow = (idx) => {
        setDifferentDiagnoses(
            differentDiagnoses.filter((_, i) => i !== idx)
        );
    };

    const handleSubmit = async () => {
        const updatedDiagnoses = diagnoses.map((d) => ({
            ...d,
            probability: d.selected
                ? d.spotValue
                    ? parseFloat(d.spotValue)
                    : 1
                : 0,
            urgency: d.urgencyValue || 0
        }));

        const allProbs = [
            ...updatedDiagnoses.map((d) => d.probability),
            ...differentDiagnoses.map((d) =>
                d.probability ? parseFloat(d.probability) : 0
            ),
        ];

        const allUrgencies = [
            ...updatedDiagnoses.map((d) => d.urgency || 0),
            ...differentDiagnoses.map((d) => d.urgencyValue || 0)
        ];


        const differentLines = differentDiagnoses.map((d) => d.diagnosis);

        try {
            const res = await fetch(`${API_URL}/update_probability`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    case_id: caseId,
                    probabilities: allProbs,
                    urgencies: allUrgencies,
                    different: differentLines.join("\n"),
                }),
            });
            const data = await res.json();
            alert(data.success ? "Update successful!" : "Update failed!");
        } catch (error) {
            console.error("Failed to submit data:", error);
        }
    };


    return (
        <div className="page-container">
            <div className="center-panel">
                <h1 className="text-primary mb-4">AIEM</h1>

                <DiagnosisInputPanel
                    inputText={inputText}
                    onChange={setInputText}
                    onFetch={handleFetchData}
                />

                <DiagnosisEditor
                    diagnoses={diagnoses}
                    onInputChange={handleDiagnosisInputChange}
                    onCheckboxChange={handleCheckboxChange}
                    differentDiagnoses={differentDiagnoses}
                    onAddRow={handleAddRow}
                    onDeleteRow={handleDeleteRow}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
