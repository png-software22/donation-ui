import { useState } from "react";
import { Button, Input, Table } from "reactstrap";
import DonorForm from "../DonorForm";
import { fetchDonors } from "../../../api/stateService";
import api from "../../../api/api";

const DonorFlow = () => {
  const [donationFlowStep, setDonationFlowStep] = useState("SEARCH_EXISTING");
  const [searchByAndValue, setSearchByAndValue] = useState({
    filterBy: "phoneNumber",
    value: "",
  });
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);

  const handleEdit = (donor) => {
    api.get(`/donors/${donor.id}`)
      .then(res => {
        setSelectedDonor(res.data); // Full detail from backend
        setDonationFlowStep("EDIT_DONOR");
      })
      .catch(err => console.log(err));
  };

  if (donationFlowStep === "EDIT_DONOR") {
    return <DonorForm donor={selectedDonor} />;
  }

  if (donationFlowStep === "ASK") {
    return (
      <div className=" d-flex justify-content-center flex-column align-center">
        <Button
          onClick={() => setDonationFlowStep("SEARCH_EXISTING")}
        >
          Search Existing Donor
        </Button>
        <span className="text-center">Or</span>
        <Button onClick={() => setDonationFlowStep("CREATE_NEW_DONOR")}>
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
      <div className="d-flex flex-column justify-center align-center" style={{ gap: 10 }}>
        <span>search by:</span>
        <Input
          placeholder="Phone Number"
          onChange={(e) =>
            setSearchByAndValue({
              filterBy: "phoneNumber",
              value: e.target.value,
            })
          }
        />
        <Input
          placeholder="Donor Identification Number"
          onChange={(e) =>
            setSearchByAndValue({
              filterBy: "idProofNumber",
              value: e.target.value,
            })
          }
        />

        <Button
          onClick={() => {
            fetchDonors(searchByAndValue.filterBy, searchByAndValue.value)
              .then((res) => setDonors(res.data))
              .catch((res) => console.log(res));
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
                  <th>Phone Number</th>
                  <th>ID Proof Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donors.data?.map((donorInfo, index) => (
                  <tr key={donorInfo.id}>
                    <td>{index + 1}</td>
                    <td>{donorInfo.firstName}</td>
                    <td>{donorInfo.lastName}</td>
                    <td>{donorInfo.phoneNumber}</td>
                    <td>{donorInfo.idProofNumber}</td>
                    <td>
                      <Button size="sm" color="primary" onClick={() => handleEdit(donorInfo)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
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
