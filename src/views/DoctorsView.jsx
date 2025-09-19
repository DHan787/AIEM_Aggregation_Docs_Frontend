/*
 * @Author: Jiang Han
 * @Date: 2025-07-17 01:10:12
 * @Description: 
 */
import React, { useState, useMemo } from "react";
import DiagnosisInputPanel from "../components/DiagnosisInputPanel";
import DiagnosisEditor from "../components/DiagnosisEditor";
import { buildConsensus } from "../components/mergeUtils";
import DiagnosisDetails from "../components/DiagnosisDetails";

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorsView() {
    const [inputText, setInputText] = useState("");
    const [diagnoses, setDiagnoses] = useState([]);
    const [differentDiagnoses, setDifferentDiagnoses] = useState([]);
    const [caseId, setCaseId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [parsedData, setParsedData] = useState(null);
    const consensus = useMemo(() => parsedData ? buildConsensus(parsedData) : [], [parsedData]);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedConsensus, setSelectedConsensus] = useState(null);

    const handleFetchData = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setLoadingMessage("Loading data, please wait...");
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
            setParsedData(data.parsed_data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
            setLoadingMessage("");
        }
    };
    const handleDiagnosisClick = (diagnosisName) => {
        if (!consensus.length) return;
        const hit = consensus.find(c => c.diagnosis === diagnosisName) || consensus[0];
        setSelectedConsensus(hit || null);
        setDetailsOpen(!!hit);
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
            // updated[idx].urgencyValue = value;
            // setDifferentDiagnoses(updated);
        } else if (type === "urgency") {
            // updated[idx].urgencyValue = value;
            // setDiagnoses(updated);
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
        if (isLoading) return;
        setIsLoading(true);
        setLoadingMessage("Submitting data, please wait...");
        const updatedDiagnoses = diagnoses.map((d) => ({
            ...d,
            probability: d.selected
                ? d.spotValue
                    ? parseFloat(d.spotValue)
                    : 1
                : 0,
            // urgency: d.urgencyValue || 0
        }));

        const allProbs = [
            ...updatedDiagnoses.map((d) => d.probability),
            ...differentDiagnoses.map((d) =>
                d.probability ? parseFloat(d.probability) : 0
            ),
        ];

        // const allUrgencies = [
        //     ...updatedDiagnoses.map((d) => d.urgency || 0),
        //     ...differentDiagnoses.map((d) => d.urgencyValue || 0)
        // ];


        const differentLines = differentDiagnoses.map((d) => d.diagnosis);

        try {
            const res = await fetch(`${API_URL}/update_probability`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    case_id: caseId,
                    probabilities: allProbs,
                    // urgencies: allUrgencies,
                    different: differentLines.join("\n"),
                }),
            });
            const data = await res.json();
            alert(data.success ? "Update successful!" : "Update failed!");
        } catch (error) {
            console.error("Failed to submit data:", error);
        } finally {
            setIsLoading(false);
            setLoadingMessage("");
        }
    };


    return (
        <>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner" />
                    <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{loadingMessage}</p>
                </div>
            )}

            <div className="page-container">
                <div className="center-panel">
                    <h1 className="text-primary mb-4">AI Super-Learner Diagnostic System</h1>

                    <DiagnosisInputPanel
                        inputText={inputText}
                        onChange={setInputText}
                        onFetch={handleFetchData}
                        isLoading={isLoading}
                    />

                    <DiagnosisEditor
                        diagnoses={diagnoses}
                        onInputChange={handleDiagnosisInputChange}
                        onCheckboxChange={handleCheckboxChange}
                        differentDiagnoses={differentDiagnoses}
                        onAddRow={handleAddRow}
                        onDeleteRow={handleDeleteRow}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        onDiagnosisClick={handleDiagnosisClick}
                    />
                    <DiagnosisDetails
                        open={detailsOpen}
                        data={selectedConsensus}
                        onClose={() => setDetailsOpen(false)}
                    />
                </div>
            </div>
        </>
    );

}
