// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MediChain {
    struct Patient {
        string name;
        uint256 dateOfBirth;
        bool isRegistered;
    }

    struct Doctor {
        string name;
        string specialization;
        bool isRegistered;
    }

    struct Record {
        uint256 id;
        address patient;
        address doctor;
        string recordType;
        string details;
        uint256 timestamp;
    }

    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => Record[]) private patientRecords;
    mapping(address => mapping(address => bool)) public accessPermissions;
    mapping(address => address[]) private patientGrantedDoctors;
    uint256 private recordCounter;

    event PatientRegistered(address indexed patient, string name);
    event DoctorRegistered(address indexed doctor, string name);
    event RecordAdded(uint256 indexed recordId, address indexed patient, address indexed doctor, string recordType);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);

    modifier onlyRegisteredPatient() {
        require(patients[msg.sender].isRegistered, "Patient not registered");
        _;
    }

    modifier onlyRegisteredDoctor() {
        require(doctors[msg.sender].isRegistered, "Doctor not registered");
        _;
    }

    function registerPatient(string memory name, uint256 dob) external {
        require(!patients[msg.sender].isRegistered, "Address is already registered as a patient");
        require(!doctors[msg.sender].isRegistered, "Address is already registered as a doctor");
        patients[msg.sender] = Patient(name, dob, true);
        emit PatientRegistered(msg.sender, name);
    }

    function registerDoctor(string memory name, string memory specialization) external {
        require(!doctors[msg.sender].isRegistered, "Address is already registered as a doctor");
        require(!patients[msg.sender].isRegistered, "Address is already registered as a patient");
        doctors[msg.sender] = Doctor(name, specialization, true);
        emit DoctorRegistered(msg.sender, name);
    }

    function grantAccess(address doctor) external onlyRegisteredPatient {
        require(doctors[doctor].isRegistered, "Doctor not registered");
        require(!accessPermissions[msg.sender][doctor], "Access already granted to this doctor");
        accessPermissions[msg.sender][doctor] = true;
        patientGrantedDoctors[msg.sender].push(doctor);
        emit AccessGranted(msg.sender, doctor);
    }

    function revokeAccess(address doctor) external onlyRegisteredPatient {
        require(accessPermissions[msg.sender][doctor], "Access not currently granted to this doctor");
        accessPermissions[msg.sender][doctor] = false;
        address[] storage grantedDoctors = patientGrantedDoctors[msg.sender];
        for (uint256 i = 0; i < grantedDoctors.length; i++) {
            if (grantedDoctors[i] == doctor) {
                grantedDoctors[i] = grantedDoctors[grantedDoctors.length - 1];
                grantedDoctors.pop();
                break;
            }
        }
        emit AccessRevoked(msg.sender, doctor);
    }

    function addRecord(
        address patient,
        string memory recordType,
        string memory details
    ) external onlyRegisteredDoctor {
        require(patients[patient].isRegistered, "Patient not registered");
        require(accessPermissions[patient][msg.sender], "Doctor does not have access to this patient's records");
        recordCounter++;
        patientRecords[patient].push(Record({
            id: recordCounter,
            patient: patient,
            doctor: msg.sender,
            recordType: recordType,
            details: details,
            timestamp: block.timestamp
        }));
        emit RecordAdded(recordCounter, patient, msg.sender, recordType);
    }

    function getMyRecords() external view onlyRegisteredPatient returns (Record[] memory) {
        return patientRecords[msg.sender];
    }

    function getPatientRecords(address patient) external view onlyRegisteredDoctor returns (Record[] memory) {
        require(accessPermissions[patient][msg.sender], "Doctor does not have access to this patient's records");
        return patientRecords[patient];
    }

    function getGrantedDoctors() external view onlyRegisteredPatient returns (address[] memory) {
        return patientGrantedDoctors[msg.sender];
    }

    function isPatient(address addr) external view returns (bool) {
        return patients[addr].isRegistered;
    }

    function isDoctor(address addr) external view returns (bool) {
        return doctors[addr].isRegistered;
    }

    function hasAccess(address patient, address doctor) external view returns (bool) {
        return accessPermissions[patient][doctor];
    }
}
