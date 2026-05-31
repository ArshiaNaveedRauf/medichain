export const CONTRACT_ADDRESS = "0xeA4Bc07276063A5eEb0024e05fD92B8C81A7ffaa";

export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
			{ "indexed": true, "internalType": "address", "name": "doctor", "type": "address" }
		],
		"name": "AccessGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "doctor", "type": "address" },
			{ "indexed": true, "internalType": "address", "name": "patient", "type": "address" }
		],
		"name": "AccessRequestDenied",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "doctor", "type": "address" },
			{ "indexed": true, "internalType": "address", "name": "patient", "type": "address" }
		],
		"name": "AccessRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
			{ "indexed": true, "internalType": "address", "name": "doctor", "type": "address" }
		],
		"name": "AccessRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "doctor", "type": "address" },
			{ "indexed": false, "internalType": "string", "name": "name", "type": "string" }
		],
		"name": "DoctorRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "doctor", "type": "address" },
			{ "indexed": false, "internalType": "string", "name": "name", "type": "string" }
		],
		"name": "DoctorUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
			{ "indexed": false, "internalType": "string", "name": "name", "type": "string" }
		],
		"name": "PatientRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
			{ "indexed": false, "internalType": "string", "name": "name", "type": "string" }
		],
		"name": "PatientUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "uint256", "name": "recordId", "type": "uint256" },
			{ "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
			{ "indexed": true, "internalType": "address", "name": "doctor", "type": "address" },
			{ "indexed": false, "internalType": "string", "name": "recordType", "type": "string" }
		],
		"name": "RecordAdded",
		"type": "event"
	},
	{
		"inputs": [
			{ "internalType": "address", "name": "patient", "type": "address" },
			{ "internalType": "string", "name": "recordType", "type": "string" },
			{ "internalType": "string", "name": "details", "type": "string" }
		],
		"name": "addRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "doctor", "type": "address" }],
		"name": "approveAccessRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "doctor", "type": "address" }],
		"name": "denyAccessRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "doctor", "type": "address" }],
		"name": "grantAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "string", "name": "name", "type": "string" },
			{ "internalType": "string", "name": "specialization", "type": "string" }
		],
		"name": "registerDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "string", "name": "name", "type": "string" },
			{ "internalType": "uint256", "name": "dob", "type": "uint256" }
		],
		"name": "registerPatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "patient", "type": "address" }],
		"name": "requestAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "doctor", "type": "address" }],
		"name": "revokeAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "string", "name": "name", "type": "string" },
			{ "internalType": "string", "name": "specialization", "type": "string" }
		],
		"name": "updateDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "string", "name": "name", "type": "string" },
			{ "internalType": "uint256", "name": "dob", "type": "uint256" }
		],
		"name": "updatePatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "address", "name": "", "type": "address" },
			{ "internalType": "address", "name": "", "type": "address" }
		],
		"name": "accessPermissions",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "address", "name": "", "type": "address" },
			{ "internalType": "address", "name": "", "type": "address" }
		],
		"name": "accessRequests",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "", "type": "address" }],
		"name": "doctors",
		"outputs": [
			{ "internalType": "string", "name": "name", "type": "string" },
			{ "internalType": "string", "name": "specialization", "type": "string" },
			{ "internalType": "bool", "name": "isRegistered", "type": "bool" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGrantedDoctors",
		"outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyRecords",
		"outputs": [
			{
				"components": [
					{ "internalType": "uint256", "name": "id", "type": "uint256" },
					{ "internalType": "address", "name": "patient", "type": "address" },
					{ "internalType": "address", "name": "doctor", "type": "address" },
					{ "internalType": "string", "name": "recordType", "type": "string" },
					{ "internalType": "string", "name": "details", "type": "string" },
					{ "internalType": "uint256", "name": "timestamp", "type": "uint256" }
				],
				"internalType": "struct MediChain.Record[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "patient", "type": "address" }],
		"name": "getPatientRecords",
		"outputs": [
			{
				"components": [
					{ "internalType": "uint256", "name": "id", "type": "uint256" },
					{ "internalType": "address", "name": "patient", "type": "address" },
					{ "internalType": "address", "name": "doctor", "type": "address" },
					{ "internalType": "string", "name": "recordType", "type": "string" },
					{ "internalType": "string", "name": "details", "type": "string" },
					{ "internalType": "uint256", "name": "timestamp", "type": "uint256" }
				],
				"internalType": "struct MediChain.Record[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPendingRequests",
		"outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "address", "name": "patient", "type": "address" },
			{ "internalType": "address", "name": "doctor", "type": "address" }
		],
		"name": "hasAccess",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "address", "name": "doctor", "type": "address" },
			{ "internalType": "address", "name": "patient", "type": "address" }
		],
		"name": "hasRequestedAccess",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "addr", "type": "address" }],
		"name": "isDoctor",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "addr", "type": "address" }],
		"name": "isPatient",
		"outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "", "type": "address" }],
		"name": "patients",
		"outputs": [
			{ "internalType": "string", "name": "name", "type": "string" },
			{ "internalType": "uint256", "name": "dateOfBirth", "type": "uint256" },
			{ "internalType": "bool", "name": "isRegistered", "type": "bool" }
		],
		"stateMutability": "view",
		"type": "function"
	}
];
