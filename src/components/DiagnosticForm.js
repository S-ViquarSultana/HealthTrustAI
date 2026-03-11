import React, { useState } from "react";
import NavBarLogout from "./NavBarLogout";
import Web3 from "web3";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useNavigate } from "react-router-dom";

function DiagnosticForm() {
  const navigate = useNavigate();
  const [patientHH, setPatientHH] = useState("");
  const [recordId] = useState(
    "EHR-" + Math.random().toString(36).substring(2, 10)
  );
  const [, setDoctorName] = useState("");
  const [, setPatientName] = useState("");
  const [, setAge] = useState("");
  const [, setGender] = useState("");
  const [, setBloodGroup] = useState("");
  const [, setDiagnosticWallet] = useState("");
  const [file, setFile] = useState(null);

 const handleUpload = async () => {
  try {
    if (!file) {
      alert("Select file first");
      return;
    }

    if (!patientHH) {
      alert("Enter Patient HH number");
      return;
    }

    // 1️⃣ Upload to backend (Infura)
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const cid = data.cid;

    const fileUrl = `https://ipfs.io/ipfs/${cid}`;

    // 2️⃣ Connect MetaMask
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const networkId = await web3.eth.net.getId();
    const deployedNetwork =
      PatientRegistration.networks[networkId];

    const contract = new web3.eth.Contract(
      PatientRegistration.abi,
      deployedNetwork.address
    );

    // 3️⃣ Store on blockchain
    await contract.methods
      .storeMedicalRecord(patientHH, fileUrl)
      .send({ from: account });

    alert("Report uploaded successfully!");

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};

  return (
    <div>
      <NavBarLogout />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex justify-center items-center text-white">

        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[600px]">

          <h2 className="text-2xl mb-6 text-center">
            Create Lab Report
          </h2>

          <div className="space-y-4">

            <div>
              <label>Record ID</label>
              <input value={recordId} disabled className="w-full p-2 bg-gray-800 rounded"/>
            </div>

            <div>
              <label>Doctor Name</label>
              <input onChange={(e)=>setDoctorName(e.target.value)} className="w-full p-2 bg-gray-800 rounded"/>
            </div>

            <div>
              <label>Patient Name</label>
              <input onChange={(e)=>setPatientName(e.target.value)} className="w-full p-2 bg-gray-800 rounded"/>
            </div>

            <div>
              <label>Age</label>
              <input onChange={(e)=>setAge(e.target.value)} className="w-full p-2 bg-gray-800 rounded"/>
            </div>

            <div>
              <label>Gender</label>
              <select onChange={(e)=>setGender(e.target.value)} className="w-full p-2 bg-gray-800 rounded">
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label>Blood Group</label>
              <select onChange={(e)=>setBloodGroup(e.target.value)} className="w-full p-2 bg-gray-800 rounded">
                <option>Select Blood Group</option>
                <option>A+</option>
                <option>B+</option>
                <option>O+</option>
                <option>AB+</option>
                <option>A-</option>
                <option>B-</option>
                <option>O-</option>
                <option>AB-</option>
              </select>
            </div>

<div>
  <label>Patient HH Number</label>
  <input
    type="text"
    value={patientHH}
    onChange={(e) => setPatientHH(e.target.value)}
    className="w-full p-2 bg-gray-800 rounded"
  />
</div>

            <div>
              <label>Diagnostic Wallet Address</label>
              <input onChange={(e)=>setDiagnosticWallet(e.target.value)} className="w-full p-2 bg-gray-800 rounded"/>
            </div>

            <div>
              <label>Upload Final Report</label>
              <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleUpload}
                className="bg-teal-500 px-6 py-2 rounded hover:bg-teal-600"
              >
                Upload Report
              </button>

              <button
                onClick={()=>navigate(-1)}
                className="bg-red-500 px-6 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticForm;