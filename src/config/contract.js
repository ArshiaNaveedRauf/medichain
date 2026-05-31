// Paste your deployed contract address here after deploying via Remix
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// Paste the ABI from Remix's compilation artifacts here
export const CONTRACT_ABI = [
  "event PatientRegistered(address indexed patient, string name)",
  "event DoctorRegistered(address indexed doctor, string name)",
  "event RecordAdded(uint256 indexed recordId, address indexed patient, address indexed doctor, string recordType)",
  "event AccessGranted(address indexed patient, address indexed doctor)",
  "event AccessRevoked(address indexed patient, address indexed doctor)",

  "function registerPatient(string name, uint256 dob) external",
  "function registerDoctor(string name, string specialization) external",
  "function grantAccess(address doctor) external",
  "function revokeAccess(address doctor) external",
  "function addRecord(address patient, string recordType, string details) external",
  "function getMyRecords() external view returns (tuple(uint256 id, address patient, address doctor, string recordType, string details, uint256 timestamp)[])",
  "function getPatientRecords(address patient) external view returns (tuple(uint256 id, address patient, address doctor, string recordType, string details, uint256 timestamp)[])",
  "function getGrantedDoctors() external view returns (address[])",
  "function isPatient(address addr) external view returns (bool)",
  "function isDoctor(address addr) external view returns (bool)",
  "function hasAccess(address patient, address doctor) external view returns (bool)",
  "function patients(address) external view returns (string name, uint256 dateOfBirth, bool isRegistered)",
  "function doctors(address) external view returns (string name, string specialization, bool isRegistered)"
];
