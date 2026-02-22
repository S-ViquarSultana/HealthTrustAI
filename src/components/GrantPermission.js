import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import Web3 from "web3";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

function GrantPermission() {
  const navigate = useNavigate();
  const { hhNumber } = useParams();
  const [patientName, setPatientName] = useState("");
  const [doctorHH, setDoctorHH] = useState("");

  const handleCancel = () => {
    navigate("/patient/" + hhNumber);
  };

const handleGrant = async () => {
  if (!doctorHH) {
    alert("Please enter Doctor HH Number");
    return;
  }

  if (window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[networkId];

      const contract = new web3.eth.Contract(
        PatientRegistration.abi,
        deployedNetwork.address
      );

await contract.methods
  .grantPermission(
      hhNumber,        // patient HH (string)
      doctorHH,        // doctor HH (string)
      patientName      // you must pass this
  ) 
  .send({ from: account });
      alert("Access Granted Successfully!");

      navigate("/patient/" + hhNumber);

    } catch (error) {
      console.error(error);
      alert("Transaction Failed");
    }
  } else {
    alert("Please install MetaMask");
  }
};
useEffect(() => {
  const loadPatientDetails = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[networkId];

      const contract = new web3.eth.Contract(
        PatientRegistration.abi,
        deployedNetwork.address
      );

      const details = await contract.methods
        .getPatientDetails(hhNumber)
        .call();

      setPatientName(details.name);
    }
  };

  loadPatientDetails();
}, []);
  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center justify-center font-inter px-6">

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
          Grant Permission to the Doctor
        </h2>

        <div className="w-full max-w-md flex flex-col items-center">

          {/* Subheading */}
          <p className="text-lg mb-3 text-gray-300">
            Doctor HH Number:
          </p>

          {/* Input */}
          <input
            type="text"
            placeholder="HH Number"
            value={doctorHH}
            onChange={(e) => setDoctorHH(e.target.value)}
            className="w-full px-4 py-3 mb-8 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Buttons */}
          <div className="flex gap-6">

            <button
              onClick={handleGrant}
              className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
            >
              Give Access
            </button>

            <button
              onClick={handleCancel}
              className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default GrantPermission;