import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const DoctorForm = () => {
  const { hhNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [patientDetails, setPatientDetails] = useState(null);
  const patientHH = location.state?.patientHH;

  const [recordId, setRecordId] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

useEffect(() => {
  const init = async () => {
    if (!window.ethereum) return;

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    setDoctorAddress(accounts[0]);

    const id = "EHR-" + Math.random().toString(36).substring(2, 12);
    setRecordId(id);

    const networkId = await web3.eth.net.getId();
    const deployedNetwork =
      PatientRegistration.networks[networkId];

    const contract = new web3.eth.Contract(
      PatientRegistration.abi,
      deployedNetwork.address
    );

    const result = await contract.methods
      .getPatientDetails(patientHH)
      .call();

    setPatientDetails(result);
  };

  init();
}, [patientHH]);

const handleCreateRecord = async () => {
  if (!diagnosis || !prescription) {
    alert("Please fill all fields");
    return;
  }

  try {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }

    // 🔥 THIS LINE IS IMPORTANT
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();

    if (!accounts.length) {
      alert("No MetaMask account found");
      return;
    }

    const account = accounts[0];
    console.log("Using account:", account);

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = PatientRegistration.networks[networkId];

    if (!deployedNetwork) {
      alert("Smart contract not deployed on this network");
      return;
    }

    const contract = new web3.eth.Contract(
      PatientRegistration.abi,
      deployedNetwork.address
    );

    console.log("Sending transaction...");

const recordData = `
Record ID: ${recordId}
Doctor: ${doctorAddress}
Diagnosis: ${diagnosis}
Prescription: ${prescription}
`;

await contract.methods
  .storeMedicalRecord(patientHH, recordData)
  .send({ from: account });
    alert("Medical Record Created Successfully!");

    navigate(`/doctor/${hhNumber}/patientlist`);

  } catch (error) {
    console.error("FULL ERROR:", error);
    alert(error.message);
  }
};

  return (
    <div>
      <NavBar_Logout />

      <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center py-10">

        <h2 className="text-3xl font-bold mb-10">Consultancy</h2>

        <div className="bg-gray-900 border border-gray-600 rounded-lg p-8 w-full max-w-2xl space-y-4">

          <div>
            <label>Record Id</label>
            <input value={recordId} disabled className="w-full p-2 bg-gray-800 rounded"/>
          </div>

          <div>
            <label>Doctor Wallet Address</label>
            <input value={doctorAddress} disabled className="w-full p-2 bg-gray-800 rounded"/>
          </div>

        <div>
  <label>Patient Name</label>
  <input
    value={patientDetails?.name || ""}
    disabled
    className="w-full p-2 bg-gray-800 rounded"
  />
</div>

<div>
  <label>Gender</label>
  <input
    value={patientDetails?.gender || ""}
    disabled
    className="w-full p-2 bg-gray-800 rounded"
  />
</div>
          <div>
            <label>Diagnosis</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>

          <div>
            <label>Prescription</label>
            <textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>

          <button
            onClick={handleCreateRecord}
            className="w-full py-3 bg-teal-500 rounded hover:bg-gray-600"
          >
            Create Record
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-teal-500 rounded hover:bg-gray-600"
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
};

export default DoctorForm;