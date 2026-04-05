import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/PatientDashBoard.css";
import NavBarLogout from "./NavBarLogout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const PatientDashBoard = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [, setWeb3] = useState(null);
  const [, setContract] = useState(null);
  const [, setError] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);

  // ✅ Consultation popup state
  const [consultations, setConsultations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const viewRecord = () => navigate("/patient/" + hhNumber + "/viewrecords");
  const viewprofile = () => navigate("/patient/" + hhNumber + "/viewprofile");
  const uploadRecords = () => navigate("/patient/" + hhNumber + "/uploadrecords");
  const grantPermission = () => navigate("/patient/" + hhNumber + "/grant");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);

        try {
          const result = await contractInstance.methods
            .getPatientDetails(hhNumber)
            .call();
          setPatientDetails(result);
        } catch (error) {
          console.error("Error retrieving patient details:", error);
          setError("Error retrieving patient details");
        }

        // ✅ Load unread consultations
        try {
          const records = await contractInstance.methods
            .getConsultancyRecords(hhNumber)
            .call();
          const unread = records.filter((c) => !c.isRead);
          if (unread.length > 0) {
            setConsultations(unread);
            setShowPopup(true);
          }
        } catch (error) {
          console.error("Error loading consultations:", error);
        }

      } else {
        console.log("Please install MetaMask extension");
        setError("Please install MetaMask extension");
      }
    };

    init();
  }, [hhNumber]);

  // ✅ Dismiss popup and mark all as read on-chain
  const handleDismiss = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[networkId];
      const contract = new web3.eth.Contract(
        PatientRegistration.abi,
        deployedNetwork.address
      );
      await contract.methods
        .markConsultanciesRead(hhNumber)
        .send({ from: accounts[0] });
    } catch (err) {
      console.error("Error marking consultations as read:", err);
    }
    setShowPopup(false);
  };

  return (
    <div>
      <NavBarLogout />
      <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-inter text-white h-screen flex flex-col justify-center items-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Patient Dashboard</h2>
        {patientDetails && (
          <p className="text-xl sm:text-2xl mb-24">
            Welcome{" "}
            <span className="font-bold text-yellow-500">{patientDetails.name}!</span>
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-5 w-full px-4 sm:px-0">
          <button
            onClick={viewprofile}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
          >
            View Profile
          </button>
          <button
            onClick={viewRecord}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
          >
            View Record
          </button>
          <button
            onClick={uploadRecords}
            className="my-2 px-4 sm:px-8 py-4 sm:py-5 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
          >
            Upload Past Records
          </button>
          <div className="w-full flex justify-center">
            <button
              onClick={grantPermission}
              className="my-2 px-8 py-4 w-full sm:w-1/4 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
            >
              Grant Permission
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Consultation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-teal-500 rounded-xl p-8 max-w-lg w-full mx-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-teal-400">
              🩺 New Consultation
            </h2>
            {consultations.map((c, i) => (
              <div
                key={i}
                className="border border-gray-600 rounded-lg p-4 space-y-2"
              >
                <p className="text-xs text-gray-500">Record ID: {c.recordId}</p>
                <p className="text-sm text-gray-400">
                  From Doctor HH:{" "}
                  <span className="text-white">{c.doctorHH}</span>
                </p>
                <p>
                  <span className="text-teal-400 font-semibold">Diagnosis: </span>
                  {c.diagnosis}
                </p>
                <p>
                  <span className="text-teal-400 font-semibold">Prescription: </span>
                  {c.prescription}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(Number(c.timestamp) * 1000).toLocaleString()}
                </p>
              </div>
            ))}
            <button
              onClick={handleDismiss}
              className="w-full py-3 bg-teal-500 hover:bg-gray-600 rounded-lg transition-colors duration-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashBoard;