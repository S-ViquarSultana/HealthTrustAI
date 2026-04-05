import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBarLogout from "./NavBarLogout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

function ViewPatientRecords() {
  const navigate = useNavigate();
  const { hhNumber } = useParams();
  const location = useLocation();

  const [records, setRecords] = useState([]);
  const [consultancyRecords, setConsultancyRecords] = useState([]);

  const fromDoctor = location.state?.fromDoctor;
  const doctorHH = location.state?.doctorHH;

  useEffect(() => {
    const loadRecords = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];

        if (!deployedNetwork) {
          alert("Smart contract not deployed on this network");
          return;
        }

        const contractInstance = new web3.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork.address
        );

        try {
          // ✅ Fetch IPFS medical records
          const fetchedRecords = await contractInstance.methods
            .getMedicalRecords(hhNumber)
            .call();
          setRecords(fetchedRecords);

          // ✅ Fetch consultancy records separately
          const fetchedConsultancy = await contractInstance.methods
            .getConsultancyRecords(hhNumber)
            .call();
          setConsultancyRecords(fetchedConsultancy);

        } catch (error) {
          console.error("Error fetching records:", error);
        }
      }
    };

    loadRecords();
  }, [hhNumber]);

  const goBack = () => {
    if (fromDoctor) {
      navigate(`/doctor/${doctorHH}/view/${hhNumber}`);
    } else {
      navigate(`/patient/${hhNumber}`);
    }
  };

  const handleView = (cid) => {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    window.open(url, "_blank");
  };

  const handleAIAnalysis = () => {
    window.open("https://healthtrustai.onrender.com/", "_blank");
  };

  return (
    <div>
      <NavBarLogout />

      <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center font-inter py-10 px-5">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10">
          Record Viewer
        </h2>

        {/* ✅ IPFS Medical Records Section */}
        {records.length === 0 ? (
          <p className="mb-6 text-lg text-gray-300">No records uploaded yet.</p>
        ) : (
          <div className="w-full max-w-4xl space-y-6">
            <h3 className="text-xl font-semibold text-teal-400">Medical Records</h3>
            {records.map((record, index) => (
              <div
                key={index}
                className="border border-gray-600 rounded-lg p-4 flex justify-between items-center bg-gray-900"
              >
                <div>
                  <p className="text-yellow-400 font-semibold">
                    Record : {index + 1}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleView(record)}
                    className="px-6 py-2 rounded-lg bg-teal-500 hover:bg-gray-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAIAnalysis()}
                    className="px-6 py-2 rounded-lg bg-purple-500 hover:bg-gray-600"
                  >
                    AI Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Consultancy Records Section - shown separately, NOT mixed with IPFS records */}
        {consultancyRecords.length > 0 && (
          <div className="w-full max-w-4xl space-y-4 mt-10">
            <h3 className="text-xl font-semibold text-teal-400">
              Prescription Consultancies
            </h3>
            {consultancyRecords.map((record, index) => (
              <div
                key={index}
                className="border border-gray-600 rounded-lg p-6 bg-gray-900 space-y-2"
              >
                <p className="text-xs text-gray-500">
                  Record ID: {record.recordId}
                </p>
                <p className="text-sm text-gray-400">
                  Doctor HH: <span className="text-white">{record.doctorHH}</span>
                </p>
                <p>
                  <span className="text-teal-400 font-semibold">Diagnosis: </span>
                  {record.diagnosis}
                </p>
                <p>
                  <span className="text-teal-400 font-semibold">Prescription: </span>
                  {record.prescription}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(Number(record.timestamp) * 1000).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={goBack}
            className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default ViewPatientRecords;