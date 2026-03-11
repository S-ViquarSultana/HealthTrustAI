import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import NavBarLogout from "./NavBarLogout";

const UploadPastRecords = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];

        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3Instance);
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask");
      }
    };

    init();
  }, []);


  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setIsLoading(true);

      // Send file to backend
const formData = new FormData();
formData.append("file", selectedFile);

const response = await fetch("http://localhost:5000/upload", {
  method: "POST",
  body: formData,
});

const data = await response.json();

console.log("CID from backend:", data.cid);

const cid = data.cid;

// Store CID in blockchain
await contract.methods
  .storeMedicalRecord(hhNumber, cid)
  .send({ from: account });

      alert("Record uploaded successfully!");

      navigate("/patient/" + hhNumber + "/viewrecords");

    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    }

    setIsLoading(false);
  };

  const cancelOperation = () => {
    navigate("/patient/" + hhNumber);
  };

  return (
    <div>
      <NavBarLogout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white h-screen flex flex-col justify-center items-center font-inter">

        <h2 className="text-3xl sm:text-4xl font-bold mb-10">
          Upload your Past Records
        </h2>

        <div className="flex flex-col items-center gap-6">

          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="bg-gray-700 text-white p-2 rounded"
          />

          <div className="flex gap-5">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>

            <button
              onClick={cancelOperation}
              className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadPastRecords;