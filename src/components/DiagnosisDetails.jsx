/*
 * @Author: Jiang Han
 * @Date: 2025-08-21 15:19:41
 * @Description: 
 */
// components/DiagnosisDetails.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./DiagnosisDetails.css"; // 记得新建这个样式文件

export default function DiagnosisDetails({ open, onClose, data }) {
    // 支持 Esc 关闭
    useEffect(() => {
        function onKey(e) { if (e.key === "Escape") onClose?.(); }
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!data) return null;

    const { diagnosis, rationale = [], treatments = [], sources = {} } = data;

    return createPortal(
        <>
            {/* 半透明遮罩 */}
            <div
                className={`drawer-backdrop ${open ? "show" : ""}`}
                onClick={onClose}
            />

            {/* 右侧抽屉 */}
            <div className={`drawer ${open ? "open" : ""}`}>
                <div className="drawer-header">
                    <h5>{diagnosis} · Details</h5>
                    <button className="btn-close" onClick={onClose} />
                </div>

                <div className="drawer-body">
                    <section>
                        <h6>Rationale (merged)</h6>
                        {rationale.length === 0 ? (
                            <p className="text-muted">None</p>
                        ) : (
                            <ul>
                                {rationale.map((r, i) => (
                                    <li key={i}>
                                        {r.text}
                                        <span className="src">Source: {r.engines.join(" / ")}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section>
                        <h6>Treatment (merged)</h6>
                        {treatments.length === 0 ? (
                            <p className="text-muted">None</p>
                        ) : (
                            <ul>
                                {treatments.map((t, i) => (
                                    <li key={i}>
                                        {t.text}
                                        <span className="src">Source: {t.engines.join(" / ")}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section>
                        <h6>Source view (original)</h6>
                        {Object.entries(sources).map(([engine, s]) => (
                            <div key={engine} className="source-block">
                                <div className="fw-bold">{engine}</div>
                                {s.icd11 && <div className="small">ICD-11: {s.icd11}</div>}
                                {s.rationale && <p>{s.rationale}</p>}
                                {Array.isArray(s.treatments) && s.treatments.length > 0 && (
                                    <ul>
                                        {s.treatments.map((t, i) => <li key={i}>{t}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </>,
        document.body
    );
}
