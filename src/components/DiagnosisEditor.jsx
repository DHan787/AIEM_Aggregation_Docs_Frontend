import OutputTable from "./OutputTable";

export default function DiagnosisEditor({
    diagnoses,
    onInputChange,
    onCheckboxChange,
    differentDiagnoses,
    onAddRow,
    onDeleteRow,
    onSubmit,
    isLoading = false, // 默认值为 false
}) {
    if (diagnoses.length === 0) return <p className="text-muted">No data yet. Please input and fetch.</p>;

    return (
        <div className="mt-5 w-100 d-flex justify-content-center">
            <OutputTable
                diagnoses={diagnoses}
                onInputChange={onInputChange}
                onCheckboxChange={onCheckboxChange}
                differentDiagnoses={differentDiagnoses}
                onAddRow={onAddRow}
                onDeleteRow={onDeleteRow}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>

    );
}
