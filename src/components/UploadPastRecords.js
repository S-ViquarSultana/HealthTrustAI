import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import NavBar_Logout from "./NavBar_Logout";

const UploadPastRecords = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  // SHA-256 hashing
  const generateFileHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setIsLoading(true);

      const fileHash = await generateFileHash(selectedFile);

      // 👇 THIS will trigger MetaMask transaction popup
      await contract.methods
        .storeMedicalRecord(hhNumber, fileHash)
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
      <NavBar_Logout />
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