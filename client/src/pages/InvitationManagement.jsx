import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/apiService";

export default function InvitationManagement() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invites");
      setCodes(res.data);
    } catch (err) {
      setError("Failed to fetch invitation codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleGenerateCode = async () => {
    try {
      await api.post("/invites/generate");
      alert("New teacher invitation code generated successfully!");
      fetchCodes(); // Refresh the list
    } catch (err) {
      alert("Failed to generate code.");
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code "${code}" copied to clipboard!`);
  };

  return (
    <DashboardLayout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Manage Invitations
          </h1>
          <p className="text-slate-600">
            Generate and view active codes for new teachers.
          </p>
        </div>
        <button
          onClick={handleGenerateCode}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Generate New Code
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Active Teacher Codes
        </h2>
        {loading && <p>Loading codes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-3">
          {codes.length > 0 ? (
            codes.map((invite) => (
              <div
                key={invite._id}
                className="p-3 bg-slate-50 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-mono font-bold text-lg text-slate-800">
                    {invite.code}
                  </p>
                  <p className="text-sm text-slate-500">
                    Expires on:{" "}
                    {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(invite.code)}
                  className="bg-slate-200 hover:bg-slate-300 text-sm text-slate-700 font-semibold py-1 px-3 rounded-md"
                >
                  Copy
                </button>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-slate-500">
              No active invitation codes found.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
