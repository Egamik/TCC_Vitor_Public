package ehr_contract

import (
	"ehr_asset"
	"encoding/json"
	"fmt"
	"time"

	chaincodeErrors "chaincodeErrors"

	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

type EHRContract struct {
	contractapi.Contract
}

// Create Record on ledger. Users can only create their own records
func (s *EHRContract) CreateRecord(ctx contractapi.TransactionContextInterface, patientID string, publicEHRJSON string) error {
	funcName := "CreateRecord"

	allowed, err := isClientInAllowedList(ctx, patientID)

	if !allowed {
		return chaincodeErrors.NewForbiddenAccessError(funcName, patientID, err)
	}

	// Get Private data from transient map
	transientMap, err := ctx.GetStub().GetTransient()
	if err != nil {
		return err
	}

	privateBytes := transientMap["ehrPrivate"]

	if privateBytes == nil {
		return chaincodeErrors.NewGenericError(funcName, nil)
	}

	exists, err := s.recordExists(ctx, patientID)

	if err != nil {
		return chaincodeErrors.NewGenericError(funcName, err)
	}

	if exists {
		return nil
	}

	var publicAsset ehr_asset.EHR_PublicAsset

	if publicEHRJSON == "" {
		publicAsset = ehr_asset.EHR_PublicAsset{
			PatientID:     patientID,
			Prescriptions: []ehr_asset.Prescription{},
			Appointments:  []ehr_asset.Appointment{},
			Procedures:    []ehr_asset.Procedure{},
		}
	} else {
		// Validate against struct schema
		err = json.Unmarshal([]byte(publicEHRJSON), &publicAsset)
		if err != nil {
			return chaincodeErrors.NewMarshallingError(funcName, "EHRPublicAsset", err)
		}
	}

	// Validate transient private data
	var privateAsset ehr_asset.EHR_PrivateAsset

	err = json.Unmarshal(privateBytes, &privateAsset)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "EHRPrivateAsset", err)
	}

	if privateAsset.Birthday.After(time.Now()) {
		return chaincodeErrors.NewValidationError(funcName, "Data de nascimento inválida. Não pode ser no futuro.", nil)
	}

	err = ctx.GetStub().PutPrivateData("ehrPrivateCollection", patientID, privateBytes)

	// Marshal to remove unneeded characters
	publicBytes, err := json.Marshal(publicAsset)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "EHRPublicAsset", err)
	}

	err = ctx.GetStub().PutState(patientID, publicBytes)

	if err != nil {
		return chaincodeErrors.NewUpdateWorldStateError(funcName, err)
	}

	return nil
}

func (s *EHRContract) AddPrescription(ctx contractapi.TransactionContextInterface, patientID string, prescriptionJSON string) error {
	funcName := "AddPrescription"

	allowed, err := isClientInAllowedList(ctx, patientID)

	if err != nil {
		return err
	}

	if !allowed {
		return chaincodeErrors.NewForbiddenAccessError(funcName, patientID, nil)
	}

	exists, err := s.recordExists(ctx, patientID)

	if err != nil {
		return err
	}

	if !exists {
		return chaincodeErrors.NewReadWorldStateError(funcName, nil)
	}

	// Read record from world state
	recordBytes, err := ctx.GetStub().GetState(patientID)

	if err != nil {
		return chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	var ehrRecord ehr_asset.EHR_PublicAsset

	err = json.Unmarshal(recordBytes, &ehrRecord)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "EHRPublicAsset", err)
	}

	// Unmarshal prescription data
	var prescription ehr_asset.Prescription
	err = json.Unmarshal([]byte(prescriptionJSON), &prescription)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "Prescription", err)
	}

	ehrRecord.Prescriptions = append(ehrRecord.Prescriptions, prescription)

	ehrRecordJSON, err := json.Marshal(ehrRecord)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "EHRRecord", err)
	}

	err = ctx.GetStub().PutState(patientID, ehrRecordJSON)

	if err != nil {
		return chaincodeErrors.NewUpdateWorldStateError(funcName, err)
	}

	return nil
}

func (s *EHRContract) AddAppointment(ctx contractapi.TransactionContextInterface, patientID string, appointmentJSON string) error {
	// Check if record exists
	funcName := "AddAppointment"

	allowed, err := isClientInAllowedList(ctx, patientID)

	if err != nil {
		return chaincodeErrors.NewForbiddenAccessError(funcName, patientID, err)
	}

	if !allowed {
		return chaincodeErrors.NewForbiddenAccessError(funcName, patientID, nil)
	}

	exists, err := s.recordExists(ctx, patientID)

	if err != nil {
		return err
	}

	if !exists {
		return nil
	}

	var appointment ehr_asset.Appointment
	var record ehr_asset.EHR_PublicAsset

	// Read record from world state
	recordBytes, err := ctx.GetStub().GetState(patientID)

	if err != nil {
		return chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	err = json.Unmarshal(recordBytes, &record)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "EHRRecord", err)
	}

	err = json.Unmarshal(([]byte)(appointmentJSON), &appointment)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "Appointment", err)
	}

	record.Appointments = append(record.Appointments, appointment)

	resultJSON, err := json.Marshal(record)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "EHRResult", err)
	}

	err = ctx.GetStub().PutState(patientID, resultJSON)

	if err != nil {
		return chaincodeErrors.NewUpdateWorldStateError(funcName, err)
	}

	return nil
}

func (s *EHRContract) AddProcedure(ctx contractapi.TransactionContextInterface, patientID string, procedureJSON string) error {
	funcName := "AddProcedure"

	allowed, err := isClientInAllowedList(ctx, patientID)

	if err != nil {
		return err
	}

	if !allowed {
		return chaincodeErrors.NewForbiddenAccessError(funcName, patientID, nil)
	}

	exists, err := s.recordExists(ctx, patientID)

	if err != nil {
		return err
	}

	if !exists {
		return nil
	}

	var procedure ehr_asset.Procedure
	var record ehr_asset.EHR_PublicAsset

	// Read record from world state
	recordBytes, err := ctx.GetStub().GetState(patientID)

	if err != nil {
		return chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	err = json.Unmarshal(recordBytes, &record)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "EHRRecord", err)
	}

	err = json.Unmarshal([]byte(procedureJSON), &procedure)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "Appointment", err)
	}

	record.Procedures = append(record.Procedures, procedure)

	resultJSON, err := json.Marshal(record)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "EHRResult", err)
	}

	err = ctx.GetStub().PutState(patientID, resultJSON)

	if err != nil {
		return chaincodeErrors.NewUpdateWorldStateError(funcName, err)
	}

	return nil
}

func (s *EHRContract) ReadRecordPrivate(ctx contractapi.TransactionContextInterface, ownerID string) (*ehr_asset.EHR_PrivateAsset, error) {
	funcName := "ReadRecordPrivate"

	allowed, err := isClientInAllowedList(ctx, ownerID)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, chaincodeErrors.NewForbiddenAccessError(funcName, ownerID, nil)
	}

	privateBytes, err := ctx.GetStub().GetPrivateData("ehrPrivateCollection", ownerID)

	if err != nil {
		return nil, chaincodeErrors.NewAssetNotFoundError(funcName, ownerID, err)
	}

	if privateBytes == nil {
		return nil, fmt.Errorf("Private data for %s does not exist.", ownerID)
	}

	var privateAsset ehr_asset.EHR_PrivateAsset

	err = json.Unmarshal(privateBytes, &privateAsset)

	if err != nil {
		return nil, chaincodeErrors.NewMarshallingError(funcName, "PrivateAsset", err)
	}

	return &privateAsset, nil
}

// Read owner's complete record
func (s *EHRContract) ReadRecord(ctx contractapi.TransactionContextInterface, patientID string) (*ehr_asset.EHR_PublicAsset, error) {
	funcName := "ReadRecord"

	allowed, err := isClientInAllowedList(ctx, patientID)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, chaincodeErrors.NewForbiddenAccessError(funcName, patientID, nil)
	}

	var record ehr_asset.EHR_PublicAsset

	recordBytes, err := ctx.GetStub().GetState(patientID)

	if err != nil {
		return nil, chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	err = json.Unmarshal(recordBytes, &record)

	if err != nil {
		return nil, chaincodeErrors.NewMarshallingError(funcName, "Record", err)
	}

	return &record, nil
}

// Read all prescriptions given by specified professional
func (s *EHRContract) ReadPrescriptions(ctx contractapi.TransactionContextInterface, patientID string, professionalID string) ([]ehr_asset.Prescription, error) {
	funcName := "ReadPrescription"

	allowed, err := isClientInAllowedList(ctx, patientID)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, chaincodeErrors.NewForbiddenAccessError(funcName, patientID, nil)
	}

	asset, err := s.ReadRecord(ctx, patientID)

	if err != nil {
		return nil, chaincodeErrors.NewGenericError(funcName, err)
	}

	var resultPrescriptions []ehr_asset.Prescription

	for _, element := range asset.Prescriptions {
		if element.ProfessionalID == professionalID {
			resultPrescriptions = append(resultPrescriptions, element)
		}
	}

	return resultPrescriptions, nil
}

// Read all appointments by specified professional
func (s *EHRContract) ReadAppointments(ctx contractapi.TransactionContextInterface, patientID string, professionalID string) ([]ehr_asset.Appointment, error) {
	funcName := "ReadAppointments"

	allowed, err := isClientInAllowedList(ctx, patientID)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, chaincodeErrors.NewForbiddenAccessError(funcName, patientID, nil)
	}

	asset, err := s.ReadRecord(ctx, patientID)

	if err != nil {
		return nil, chaincodeErrors.NewGenericError(funcName, err)
	}

	var resultAppointments []ehr_asset.Appointment

	for _, element := range asset.Appointments {
		if element.ProfessionalID == professionalID {
			resultAppointments = append(resultAppointments, element)
		}
	}

	return resultAppointments, nil
}

// Real all procedures by specified professional
func (s *EHRContract) ReadProcedures(ctx contractapi.TransactionContextInterface, patientID string, professionalID string) ([]ehr_asset.Procedure, error) {
	funcName := "ReadProcedures"

	allowed, err := isClientInAllowedList(ctx, patientID)

	if err != nil {
		return nil, err
	}

	if !allowed {
		return nil, chaincodeErrors.NewForbiddenAccessError(funcName, patientID, nil)
	}

	asset, err := s.ReadRecord(ctx, patientID)

	if err != nil {
		return nil, chaincodeErrors.NewGenericError(funcName, err)
	}

	var resultProcedures []ehr_asset.Procedure

	for _, element := range asset.Procedures {
		if element.ProfessionalID == professionalID {
			resultProcedures = append(resultProcedures, element)
		}
	}

	return resultProcedures, nil
}

// Check if asset exists in world state
func (s *EHRContract) recordExists(ctx contractapi.TransactionContextInterface, ownerID string) (bool, error) {
	funcName := "recordExists"
	response, err := ctx.GetStub().GetState(ownerID)

	if err != nil {
		return false, chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	return response != nil, nil
}

// Checks if transaction issuer's ID is in owner's allowed list
func isClientInAllowedList(ctx contractapi.TransactionContextInterface, ownerID string) (bool, error) {
	funcName := "isClientInAllowedList"

	clientID := ctx.GetClientIdentity()

	certID, foundID, err := clientID.GetAttributeValue("personId")
	certRole, foundRole, err := clientID.GetAttributeValue("role")

	if err != nil {
		return false, chaincodeErrors.NewGenericError(funcName, err)
	}

	if !foundID || !foundRole {
		return false, chaincodeErrors.NewGenericError(funcName, err)
	}

	// Only professionals should be able to create records
	if certRole != "professional" {
		return false, chaincodeErrors.NewForbiddenAccessError(funcName, certID, nil)
	}

	alResponse := ctx.GetStub().InvokeChaincode("accesslist", toChaincodeArgs("IsIdentityApproved", ownerID, certID), "jornada-channel")

	if alResponse.Status != 200 {
		return false, chaincodeErrors.NewGenericError(funcName, nil)
	}

	var isAllowed bool
	err = json.Unmarshal(alResponse.Payload, &isAllowed)

	if err != nil {
		return false, chaincodeErrors.NewMarshallingError(funcName, "IsAllowed", err)
	}

	return isAllowed, nil
}

func toChaincodeArgs(args ...string) [][]byte {
	bargs := make([][]byte, len(args))
	for i, arg := range args {
		bargs[i] = []byte(arg)
	}

	return bargs
}
