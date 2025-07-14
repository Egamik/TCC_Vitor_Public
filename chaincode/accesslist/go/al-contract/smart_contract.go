package al_contract

import (
	"al_asset"
	"encoding/json"
	"fmt"

	chaincodeErrors "chaincodeErrors"

	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

type AccessListContract struct {
	contractapi.Contract
}

func (s *AccessListContract) CreateAsset(ctx contractapi.TransactionContextInterface, ownerID string) error {
	funcName := "CreateAsset"

	if err := verifyOwner(ctx, ownerID); err != nil {
		return chaincodeErrors.NewForbiddenAccessError(funcName, ownerID, err)
	}

	exists, err := s.OwnerExists(ctx, ownerID)
	if err != nil {
		return err
	}

	if exists {
		return nil
	}

	asset := al_asset.AccessList{
		OwnerID:    ownerID,
		AllowedIDs: []string{},
	}

	assetJSON, err := json.Marshal(asset)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "Asset", err)
	}

	err = ctx.GetStub().PutState(ownerID, assetJSON)

	if err != nil {
		return chaincodeErrors.NewUpdateWorldStateError(funcName, err)
	}

	return nil
}

func (s *AccessListContract) AddIdentity(ctx contractapi.TransactionContextInterface, ownerID string, professionalID string) error {
	funcName := "AddIdentity"

	if err := verifyOwner(ctx, ownerID); err != nil {
		return chaincodeErrors.NewForbiddenAccessError(funcName, ownerID, err)
	}

	alBytes, err := ctx.GetStub().GetState(ownerID)

	if err != nil {
		return chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	var accessList al_asset.AccessList

	err = json.Unmarshal(alBytes, &accessList)

	if err != nil {
		return nil
	}

	for _, id := range accessList.AllowedIDs {
		if id == professionalID {
			return nil
		}
	}

	accessList.AllowedIDs = append(accessList.AllowedIDs, professionalID)

	accessListJSON, err := json.Marshal(accessList)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "AccessList", err)
	}

	err = ctx.GetStub().PutState(ownerID, accessListJSON)

	if err != nil {
		return chaincodeErrors.NewUpdateWorldStateError(funcName, err)
	}

	return nil
}

func (s *AccessListContract) RemoveIdentity(ctx contractapi.TransactionContextInterface, ownerID string, professionalID string) error {
	funcName := "RemoveIdentity"

	if err := verifyOwner(ctx, ownerID); err != nil {
		return chaincodeErrors.NewForbiddenAccessError(funcName, ownerID, err)
	}

	var accessList al_asset.AccessList
	accessListJSON, err := ctx.GetStub().GetState(ownerID)

	if err != nil {
		return chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	err = json.Unmarshal(accessListJSON, &accessList)

	if err != nil {
		return chaincodeErrors.NewMarshallingError(funcName, "AccessList", err)
	}

	for i, item := range accessList.AllowedIDs {

		if item == professionalID {
			accessList.AllowedIDs = append(accessList.AllowedIDs[:i], accessList.AllowedIDs[i+1:]...)
			updatedALJSON, err := json.Marshal(accessList)

			if err != nil {
				return chaincodeErrors.NewMarshallingError(funcName, "AccessList", err)
			}

			err = ctx.GetStub().PutState(ownerID, updatedALJSON)

			if err != nil {
				return chaincodeErrors.NewUpdateWorldStateError(funcName, err)
			}

			return nil
		}
	}

	return nil
}

func (s *AccessListContract) IsIdentityApproved(ctx contractapi.TransactionContextInterface, ownerID string, professionalID string) (bool, error) {
	funcName := "IsIdentityApproved"

	exists, err := s.OwnerExists(ctx, ownerID)
	if !exists {
		return false, nil
	}

	var accessList al_asset.AccessList
	accessListJSON, err := ctx.GetStub().GetState(ownerID)

	if err != nil {
		return false, chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	err = json.Unmarshal(accessListJSON, &accessList)

	if err != nil {
		return false, chaincodeErrors.NewMarshallingError(funcName, "AccessList", err)
	}

	for _, item := range accessList.AllowedIDs {
		if item == professionalID {
			return true, nil
		}
	}

	return false, nil
}

func (s *AccessListContract) GetIdentityList(ctx contractapi.TransactionContextInterface, ownerID string) ([]string, error) {
	funcName := "GetIdentityList"

	if err := verifyOwner(ctx, ownerID); err != nil {
		return nil, chaincodeErrors.NewForbiddenAccessError(funcName, ownerID, err)
	}

	var accessList al_asset.AccessList
	accessListJSON, err := ctx.GetStub().GetState(ownerID)

	if err != nil {
		return nil, chaincodeErrors.NewGenericError(funcName, err)
	}

	err = json.Unmarshal(accessListJSON, &accessList)

	if err != nil {
		return nil, chaincodeErrors.NewMarshallingError(funcName, "AccessList", err)
	}

	return accessList.AllowedIDs, nil
}

func (s *AccessListContract) OwnerExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	funcName := "ownerExists"

	response, err := ctx.GetStub().GetState(id)

	if err != nil {
		return false, chaincodeErrors.NewReadWorldStateError(funcName, err)
	}

	return response != nil, nil
}

// Verifies
func verifyOwner(ctx contractapi.TransactionContextInterface, expectedOwnerID string) error {
	clientIdentity := ctx.GetClientIdentity()

	actualOwnerID, found, err := clientIdentity.GetAttributeValue("personId")

	if err != nil {
		return fmt.Errorf("error reading 'personId' attribute: %v", err)
	}
	if !found {
		return fmt.Errorf("'personId' attribute not found in certificate")
	}

	if actualOwnerID != expectedOwnerID {
		return fmt.Errorf("caller is not authorized: identity mismatch")
	}

	return nil
}
