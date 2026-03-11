import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import NavBarLogout from "./NavBarLogout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";


function ViewPatientList() {
  const navigate = useNavigate();
  const { hhNumber } = useParams(); // Doctor HH Number

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    loadPatients();
  }, [hhNumber]);

  const loadPatients = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const networkId = await web3.eth.net.getId();
        const deployedNetwork =
          PatientRegistration.networks[networkId];

        if (!deployedNetwork) {
          console.log("Contract not deployed on this network");
          return;
        }

        const contract = new web3.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork.address
        );

        const patientList = await contract.methods
          .getPatientList(hhNumber)
          .call();

        console.log("Doctor HH:", hhNumber);
        console.log("Fetched Patient List:", patientList);

        setPatients(patientList);

      } catch (error) {
        console.error("Error loading patients:", error);
      }
    }
  };
  
  const handleView = (patientHH) => {
    navigate(`/doctor/${hhNumber}/view/${patientHH}`);
  };

  const handleRemove = async (patientHH) => {
  if (window.ethereum) {
    try {

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const networkId = await web3.eth.net.getId();

      const doctorNetwork = DoctorRegistration.networks[networkId];
      const patientNetwork = PatientRegistration.networks[networkId];

      const doctorContract = new web3.eth.Contract(
        DoctorRegistration.abi,
        doctorNetwork.address
      );

      const patientContract = new web3.eth.Contract(
        PatientRegistration.abi,
        patientNetwork.address
      );

      // revoke in doctor contract
      await doctorContract.methods
        .revokePermission(patientHH, hhNumber)
        .send({ from: account });

      // revoke in patient contract
      await patientContract.methods
        .revokePermission(patientHH, hhNumber)
        .send({ from: account });

      alert("Access Revoked Successfully!");
      setPatients(prev => 
        prev.filter(p => p.patient_number !== patientHH)
      );

    } catch (error) {
      console.error(error);
      alert("Transaction Failed");
    }
  }
};
  const goBack = () => {
    navigate("/doctor/" + hhNumber);
  };

  return (
    <div>
      <NavBarLogout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center font-inter py-10 px-5">

        <h2 className="text-3xl sm:text-4xl font-bold mb-10">
          Patient's List
        </h2>

        {patients.length === 0 ? (
          <p className="text-gray-400">
            No patients have granted access yet.
          </p>
        ) : (
          <div className="w-full max-w-4xl space-y-6">
            {patients.map((patient, index) => (
              <div
                key={index}
                className="border border-gray-600 rounded-lg p-4 flex justify-between items-center bg-gray-900"
              >
                <div>
                  <p className="text-yellow-400 font-semibold">
                    Patient : {index + 1}
                  </p>
                  <p className="text-sm text-gray-400">
                    Name : {patient.patient_name}
                  </p>
                </div>

              <div className="flex gap-4">

  <button
    onClick={() => handleView(patient.patient_number)}
    className="px-6 py-2 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
  >
    View
  </button>

  <button
    onClick={() => handleRemove(patient.patient_number)}
    className="px-6 py-2 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
  >
    Remove
  </button>

                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={goBack}
          className="mt-10 px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
        >
          Back
        </button>

      </div>
    </div>
  );
}

export default ViewPatientList;