import { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";

export default function AgentPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAgent() {
    if (!prompt.trim()) {
      toast.error("Write an agent prompt");
      return;
    }

    setLoading(true);
    let d = await api("/api/agent/command", "POST", { prompt }, true);
    setLoading(false);

    if (d.error) toast.error(d.error);
    else toast.success("Agent Executed!");

    setOutput(d);
  }

  return (
    <div className="page">
      <h2 className="text-neon mb-4">🤖 AI Agent Command</h2>

      <textarea
        placeholder="Example: create a group called Goa Trip with users ..."
        className="form-control mb-3 neon-placeholder"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button className="btn btn-success mb-4" onClick={runAgent}>
        {loading ? "Running..." : "Run Agent"}
      </button>

      {output && (
        <div className="card p-3 mt-3">
          <h5 className="text-neon">Response</h5>
          <pre style={{ whiteSpace: "pre-wrap", color: "white" }}>
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
