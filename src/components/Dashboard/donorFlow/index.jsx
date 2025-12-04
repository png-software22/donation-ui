import { useState } from "react";
import { Button, Input, Table } from "reactstrap";
import DonorForm from "../DonorForm";
import { fetchDonors } from "../../../api/stateService";

const DonorFlow = () => {
  const [donationFlowStep, setDonationFlowStep] = useState("SEARCH_EXISTING");
  const [searchByAndValue, setSearchByAndValue] = useState({
    filterBy: "phoneNumber",
    value: "",
  });
  const [donors, setDonors] = useState([]);

  if (donationFlowStep === "ASK") {
    return (
      <div className=" d-flex justify-content-center flex-column align-center">
        <Button
          variant="primary"
          onClick={() => {
            setDonationFlowStep("SEARCH_EXISTING");
          }}
          className="button-primary text-center"
        >
          Search Existing Donor
        </Button>
        <span className="text-center">Or</span>
        <Button
          onClick={() => {
            setDonationFlowStep("CREATE_NEW_DONOR");
          }}
        >
          Create New Donor
        </Button>
      </div>
    );
  }
  if (donationFlowStep === "CREATE_NEW_DONOR") {
    return <DonorForm />;
  }
  if (donationFlowStep === "SEARCH_EXISTING") {
    return (
      <div
        className="d-flex flex-column justify-center align-center"
        style={{ gap: 10 }}
      >
        <span>search by:</span>
        <Input
          placeholder="Phone Number"
          onChange={(e) => {
            setSearchByAndValue({
              filterBy: "phoneNumber",
              value: e.target.value,
            });
          }}
        />
        <Input
          placeholder="Donor Identification Number"
          onChange={(e) => {
            setSearchByAndValue({
              filterBy: "idProofNumber",
              value: e.target.value,
            });
          }}
        />
        <Button
          onClick={() => {
            fetchDonors(searchByAndValue.filterBy, searchByAndValue.value)
              .then((res) => {
                console.log("response", res);
                setDonors(res.data);
              })
              .catch((res) => {
                console.log("err", res);
              });
          }}
        >
          Search
        </Button>
        <Table>
          {donors.count ? (
            <>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>phoneNumber</th>
                  <th>idProofNumber</th>
                </tr>
              </thead>
              <tbody>
                {donors.data?.map((donorInfo, index) => {
                    return <tr>
                        <td>{index+1}</td>
                        <td>{donorInfo.firstName}</td>
                        <td>{donorInfo.lastName}</td>
                        <td>{donorInfo.phoneNumber}</td>
                        <td>{donorInfo.idProofNumber}</td>
                    </tr>
                })}
              </tbody>
            </>
          ) : (
            <>No Donors Exists</>
          )}
        </Table>
      </div>
    );
  }
};
export default DonorFlow;
