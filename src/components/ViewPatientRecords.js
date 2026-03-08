import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useLocation } from "react-router-dom";

function ViewPatientRecords() {
  const navigate = useNavigate();
  const { hhNumber } = useParams();

  const [records, setRecords] = useState([]);
  const [contract, setContract] = useState(null);

  const location = useLocation();
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

        setContract(contractInstance);

        try {
          const fetchedRecords = await contractInstance.methods
            .getMedicalRecords(hhNumber)
            .call();

          setRecords(fetchedRecords);
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


  //// --- AI ANALYSIS ADDITION START ---
const handleAIAnalysis = (patientHH) => {
  try {
    // Temporary placeholder AI app URL
    // Replace this later with your friend's deployed frontend
    const aiAppUrl = `https://example-ai-app.com?patient=${encodeURIComponent(patientHH)}`;

    window.open(aiAppUrl, "_blank");

  } catch (error) {
    console.error("Error opening AI analysis:", error);
    alert("Unable to open AI analysis");
  }
};
//// --- AI ANALYSIS ADDITION END ---
  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center font-inter py-10 px-5">
        
        <h2 className="text-3xl sm:text-4xl font-bold mb-10">
          Record Viewer
        </h2>

        {records.length === 0 ? (
          <div className="flex flex-col items-center">
            <p className="mb-6 text-lg text-gray-300">
              No records uploaded yet.
            </p>

            <button
              onClick={goBack}
              className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-6">
            {records.map((record, index) => (
              console.log("PDF record:", record),
              <div
                key={index}
                className="border border-gray-600 rounded-lg p-4 flex justify-between items-center bg-gray-900"
              >
                <div>
                  <p className="text-yellow-400 font-semibold">
                    Record : {index + 1}
                  </p>
                  <p className="text-sm text-gray-400">
                    Uploaded : {new Date().toString()}
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
 onClick={() => handleAIAnalysis(record)}
 className="px-6 py-2 rounded-lg bg-purple-500 hover:bg-gray-600"
>
 AI Analysis
</button>

</div>
              </div>
            ))}

            <div className="flex justify-center mt-10">
              <button
                onClick={goBack}
                className="px-8 py-3 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPatientRecords;