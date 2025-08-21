// components/mergeUtils.js

// 诊断名归一（可按需扩展）
const synonymMap = {
    Influenza: "Viral Infection",
};

function canon(dx) {
    return synonymMap[dx] || dx;
}

// 规范化字符串：用于相似度/去重前清洗
function normalizeText(s) {
    return (s || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

// 极简相似度（Jaccard on tokens）
function jaccard(a, b) {
    const A = new Set(normalizeText(a).split(" "));
    const B = new Set(normalizeText(b).split(" "));
    const inter = [...A].filter(x => B.has(x)).length;
    const uni = new Set([...A, ...B]).size || 1;
    return inter / uni;
}

function dedupWithProvenance(items, threshold = 0.78) {
    const merged = [];
    items.forEach(({ text, engine }) => {
        const hit = merged.find(m => jaccard(m.text, text) >= threshold);
        if (hit) {
            if (!hit.engines.includes(engine)) hit.engines.push(engine);
        } else {
            merged.push({ text, engines: [engine] });
        }
    });
    // 多来源优先，其次更具体（长度略长）
    return merged.sort(
        (a, b) =>
            b.engines.length - a.engines.length || b.text.length - a.text.length
    );
}

/**
 * 将你后台的 Parsed data（多引擎）转为按诊断合并的结构。
 * 只合并 rationale / treatment；保留来源。
 */
export function buildConsensus(parsed) {
    // 把各引擎展开为统一数组
    const engines = Object.keys(parsed || {});
    const notes = [];
    engines.forEach(engine => {
        const pack = parsed[engine];
        if (!pack) return;
        const { diagnosis = [], icd11_code = [], details = [] } =
            pack;

        diagnosis.forEach((dx, i) => {
            const det = details[i] || {};
            notes.push({
                engine,
                diagnosis_raw: dx,
                diagnosis_canonical: canon(dx),
                rationale: det.rationale || "",
                treatments: Array.isArray(det.treatment) ? det.treatment : [],
                icd11: icd11_code[i] || undefined,
            });
        });
    });

    // 按诊断归一名分组
    const byDx = notes.reduce((acc, n) => {
        const k = n.diagnosis_canonical;
        acc[k] = acc[k] || [];
        acc[k].push(n);
        return acc;
    }, {});

    // 生成共识结构
    const consensus = Object.entries(byDx).map(([dx, arr]) => {
        const rationaleItems = arr
            .filter(n => n.rationale)
            .map(n => ({ text: n.rationale, engine: n.engine }));

        const treatmentItems = arr.flatMap(n =>
            (n.treatments || []).map(t => ({ text: t, engine: n.engine }))
        );

        return {
            diagnosis: dx,
            rationale: dedupWithProvenance(rationaleItems),
            treatments: dedupWithProvenance(treatmentItems),
            sources: arr.reduce((m, n) => {
                m[n.engine] = {
                    rationale: n.rationale,
                    treatments: n.treatments,
                    icd11: n.icd11,
                    diagnosis_raw: n.diagnosis_raw,
                };
                return m;
            }, {}),
            engines: [...new Set(arr.map(n => n.engine))],
        };
    });

    // 主表排序可按合并后来源数、或保持原顺序
    return consensus.sort((a, b) => b.engines.length - a.engines.length);
}
