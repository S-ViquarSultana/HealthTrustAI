import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import NavBarLogout from "./NavBarLogout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const DoctorViewRecords = () => {
  const { hhNumber, patientHH } = useParams(); 
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [, setShowConsultancy] = useState(false);
  const [recordId, ] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [consultancyRecords, setConsultancyRecords] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);
  const [, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const networkId = await web3.eth.net.getId();
          const deployedNetwork =
            PatientRegistration.networks[networkId];

          const contract = new web3.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork.address
          );

          const recordResult = await contract.methods
  .getMedicalRecords(patientHH)
  .call();

setRecords(recordResult);

const consultancyResult = await contract.methods
  .getConsultancyRecords(patientHH)
  .call();

setConsultancyRecords(consultancyResult);

          const result = await contract.methods
            .getPatientDetails(patientHH)
            .call();

          setPatientDetails(result);

        } catch (error) {
          console.error("Error retrieving patient details:", error);
          setError("Error retrieving patient details");
        }
      } else {
        setError("Please install MetaMask");
      }
    };

    init();
  }, [patientHH]);

  const handleViewRecords = () => {
    navigate(`/patient/${patientHH}/viewrecords`, {
      state: {
        fromDoctor: true,
        doctorHH: hhNumber
      }
    });
  };

const doctorForm = () => {
  navigate(`/doctor/${hhNumber}/doctorform`, {
    state: {
      patientHH: patientHH
    }
  });
};

const handleCreateRecord = async () => {
  if (!diagnosis || !prescription) {
    alert("Please fill all fields");
    return;
  }

  try {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const networkId = await web3.eth.net.getId();
    const deployedNetwork =
      PatientRegistration.networks[networkId];

    const contract = new web3.eth.Contract(
      PatientRegistration.abi,
      deployedNetwork.address
    );

    await contract.methods
  .addConsultancyRecord(
    patientHH,
    recordId,
    diagnosis,
    prescription
  )
  .send({ from: account });

    alert("Medical Record Created Successfully!");

    setShowConsultancy(false);
    setDiagnosis("");
    setPrescription("");

  } catch (error) {
    console.error(error);
    alert("Transaction Failed");
  }
};

  const handleClose = () => {
    navigate(`/doctor/${hhNumber}/patientlist`);
  };

  if (!patientDetails) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div>
      <NavBarLogout />

      <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center py-10 px-5">

        <h2 className="text-3xl sm:text-4xl font-bold mb-10">
          Patient's Profile
        </h2>

        <div className="bg-gray-900 border border-gray-600 rounded-lg p-8 w-full max-w-4xl text-lg space-y-4">

          <div className="flex justify-between">
            <p>Name : <span className="text-yellow-400">{patientDetails.name}</span></p>
            <p>DOB : <span className="text-yellow-400">{patientDetails.dateOfBirth}</span></p>
            <p>Gender : <span className="text-yellow-400">{patientDetails.gender}</span></p>
          </div>

          <div className="flex justify-between">
            <p>BloodGroup : <span className="text-yellow-400">{patientDetails.bloodGroup}</span></p>
            <p>Address : <span className="text-yellow-400">{patientDetails.homeAddress}</span></p>
          </div>

          <p>Email-Id : <span className="text-yellow-400">{patientDetails.email}</span></p>

        </div>

{records.map((record, index) => (
  <div key={index} className="mt-4 flex gap-3">

    <button
      onClick={() =>
        window.open(`https://gateway.pinata.cloud/ipfs/${record}`, "_blank")
      }
      className="bg-blue-500 px-4 py-2 rounded"
    >
      View Report {index + 1}
    </button>

    <button
      onClick={() =>
        window.open("https://healthtrustai.onrender.com/", "_blank")
      }
      className="bg-purple-500 px-4 py-2 rounded"
    >
      View AI Analysis
    </button>

  </div>
))}

{consultancyRecords.map((record, index) => (
  <div key={index} className="mt-4 bg-gray-800 p-4 rounded">
    <p className="text-yellow-400">
      Consultancy Record ID: {record.recordId}
    </p>
    <p>Diagnosis: {record.diagnosis}</p>
    <p>Prescription: {record.prescription}</p>
  </div>
))}

    <button
      onClick={doctorForm}
      className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600"
    >
      Prescription Consultancy
    </button>

    <button
      onClick={handleClose}
      className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600"
    >
      Close
    </button>
  </div>
      </div>
  );
};

export default DoctorViewRecords;