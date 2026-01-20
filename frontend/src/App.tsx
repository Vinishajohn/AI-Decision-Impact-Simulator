import { useState } from "react";

type AnalysisResult = {
  analysis: {
    decision_summary: string;
    risks: {
      risk: string;
      impact_level: string;
      explanation: string;
    }[];
    best_case: {
      title: string;
      description: string;
      likelihood: string;
      impact: string;
    };
    most_likely_case: {
      title: string;
      description: string;
      likelihood: string;
      impact: string;
    };
    worst_case: {
      title: string;
      description: string;
      likelihood: string;
      impact: string;
    };
    alternatives: {
      option: string;
      why_safer: string;
    }[];
    confidence_score: number;
    uncertainty_explanation: string;
  };
  model_used: string;
  fallback_used: boolean;
};

export default function App() {
  const [decision, setDecision] = useState("");
  const [constraints, setConstraints] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const addConstraint = () => {
    setConstraints([...constraints, ""]);
  };

  const updateConstraint = (index: number, value: string) => {
    const updated = [...constraints];
    updated[index] = value;
    setConstraints(updated);
  };

  const analyzeDecision = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "https://ai-decision-impact-simulator.onrender.com/analyze-decision",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            decision,
            constraints: constraints
              .filter((c) => c.trim() !== "")
              .map((c) => ({ constraint: c })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch {
      setError("Failed to analyze decision. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex justify-center p-6">
      <div className="w-full max-w-5xl space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">
            AI Decision Impact Simulator
          </h1>
          <p className="text-blue-200">
            Analyze risks, outcomes, and safer alternatives before deciding
          </p>
        </div>

        {/* INPUT CARD */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6 shadow-xl">

          {/* DECISION */}
          <div>
            <label className="block mb-2 font-semibold">
              Decision
            </label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="Describe the decision you are considering..."
              rows={4}
              className="w-full rounded-xl bg-white/20 border border-white/20 p-4 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* CONSTRAINTS */}
          <div>
            <label className="block mb-2 font-semibold">
              Constraints
            </label>

            <div className="space-y-3">
              {constraints.map((c, i) => (
                <input
                  key={i}
                  value={c}
                  onChange={(e) => updateConstraint(i, e.target.value)}
                  placeholder="Enter a constraint"
                  className="w-full rounded-xl bg-white/20 border border-white/20 p-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <button
              onClick={addConstraint}
              className="mt-3 text-sm text-blue-300 hover:underline"
            >
              + Add another constraint
            </button>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={analyzeDecision}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Analyzing decision..." : "Analyze Decision"}
          </button>

          {error && (
            <p className="text-red-400 font-medium text-center">
              {error}
            </p>
          )}
        </div>

        {/* RESULTS */}
        {result && (
          <div className="space-y-6">

            {/* SUMMARY */}
            <div className="bg-blue-500/20 rounded-xl p-5">
              <h2 className="text-xl font-semibold mb-2">
                Decision Summary
              </h2>
              <p className="text-blue-100">
                {result.analysis.decision_summary}
              </p>
            </div>

            {/* RISKS */}
            <div className="bg-red-500/20 rounded-xl p-5">
              <h2 className="text-xl font-semibold mb-2 text-red-300">
                Risks
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                {result.analysis.risks.map((r, i) => (
                  <li key={i}>
                    <b>{r.risk}</b> ({r.impact_level}) – {r.explanation}
                  </li>
                ))}
              </ul>
            </div>

            {/* OUTCOMES */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-500/20 rounded-xl p-4">
                <h3 className="font-semibold text-green-300">
                  Best Case
                </h3>
                <p className="text-sm mt-2">
                  {result.analysis.best_case.description}
                </p>
              </div>

              <div className="bg-yellow-500/20 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-300">
                  Most Likely
                </h3>
                <p className="text-sm mt-2">
                  {result.analysis.most_likely_case.description}
                </p>
              </div>

              <div className="bg-red-600/20 rounded-xl p-4">
                <h3 className="font-semibold text-red-300">
                  Worst Case
                </h3>
                <p className="text-sm mt-2">
                  {result.analysis.worst_case.description}
                </p>
              </div>
            </div>

            {/* ALTERNATIVES */}
            <div className="bg-indigo-500/20 rounded-xl p-5">
              <h2 className="text-xl font-semibold mb-2">
                Safer Alternatives
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                {result.analysis.alternatives.map((a, i) => (
                  <li key={i}>
                    <b>{a.option}</b> – {a.why_safer}
                  </li>
                ))}
              </ul>
            </div>

            {/* CONFIDENCE */}
            <div className="bg-white/10 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold">
                {result.analysis.confidence_score}%
              </p>
              <p className="text-sm text-blue-200 italic mt-2">
                {result.analysis.uncertainty_explanation}
              </p>
            </div>

            <p className="text-xs text-center text-blue-300">
              Model: {result.model_used} | Fallback:{" "}
              {result.fallback_used ? "Yes" : "No"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
