import { useState } from "react";
import { Button, Input, Table } from "reactstrap";
import DonorForm from "../DonorForm";
import { fetchDonors } from "../../../api/stateService";
import api from "../../../api/api";
import AddDonationForm from "./addDonationForm";

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
        console.log('res.data', res.data)
        setSelectedDonor(res.data);
        setDonationFlowStep("EDIT_DONOR");
      })
      .catch(err => console.log(err));
  };

  if (donationFlowStep === "EDIT_DONOR") {
    return <DonorForm donor={selectedDonor} isEdit />;
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
  if(donationFlowStep === 'ADD_DONATION') {
    return <AddDonationForm donorDetails={selectedDonor} />
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
                     <div className="d-flex justify-space-between gap-10">
                      <Button color="primary" onClick={() =>{setDonationFlowStep('ADD_DONATION')
                        setSelectedDonor(donorInfo)
                      }}>
                        Add a Donation
                      </Button>
                      <Button size="sm"  onClick={() => handleEdit(donorInfo)}>
                        Edit
                      </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <>No Donors Exists <Button onClick={() => {
                setDonationFlowStep('CREATE_NEW_DONOR')
            }}>Create a new Donor</Button></>
          )}
        </Table>
      </div>
    );
  }
};

export default DonorFlow;
