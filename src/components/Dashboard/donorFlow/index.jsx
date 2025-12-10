import { useState } from "react";
import { Button, Input, Table } from "reactstrap";
import DonorForm from "../DonorForm";
import { fetchDonors } from "../../../api/stateService";
import api from "../../../api/api";
import AddDonationForm from "./addDonationForm";
import Loader from "../../../Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DonorFlow = () => {
  const [donationFlowStep, setDonationFlowStep] = useState("SEARCH_EXISTING");
  const [searchByAndValue, setSearchByAndValue] = useState({
    filterBy: "phoneNumber",
    value: "",
  });
  const [donors, setDonors] = useState({ count: 0, data: [] });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshList = () => {
    setLoading(true);
    fetchDonors(searchByAndValue.filterBy, searchByAndValue.value)
      .then((res) => setDonors(res.data))
      .catch(() => toast.error("Failed to load donors"))
      .finally(() => setLoading(false));
  };

  const handleEdit = (donor) => {
    setLoading(true);
    api
      .get(`/donors/${donor.id}`)
      .then((res) => {
        setSelectedDonor(res.data);
        setDonationFlowStep("EDIT_DONOR");
      })
      .catch(() => toast.error("Failed to load donor details"))
      .finally(() => setLoading(false));
  };

  const handleAddDonation = (donor) => {
    setLoading(true);
    api
      .get(`/donors/${donor.id}`)
      .then((res) => {
        setSelectedDonor(res.data);
        setDonationFlowStep("ADD_DONATION");
      })
      .catch(() => toast.error("Failed to fetch donor details"))
      .finally(() => setLoading(false));
  };

  const handleGoBack = () => {
    setDonationFlowStep("SEARCH_EXISTING");
    refreshList();
  };

  if (donationFlowStep === "EDIT_DONOR")
    return <DonorForm donor={selectedDonor} isEdit goBack={handleGoBack} />;

  if (donationFlowStep === "CREATE_NEW_DONOR")
    return <DonorForm goBack={handleGoBack} />;

  if (donationFlowStep === "ADD_DONATION")
    return <AddDonationForm donorDetails={selectedDonor} goBack={handleGoBack} />;

  return (
    <div className="d-flex flex-column justify-center align-center" style={{ gap: 10 }}>
      <ToastContainer />
      {loading && <Loader />}

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

      <Button onClick={refreshList}>Search</Button>

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
                      <Button color="primary" onClick={() => handleAddDonation(donorInfo)}>
                        Add Donation
                      </Button>
                      <Button size="sm" onClick={() => handleEdit(donorInfo)}>
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <>
            No Donors Exists{" "}
            <Button onClick={() => setDonationFlowStep("CREATE_NEW_DONOR")}>
              Create a new Donor
            </Button>
          </>
        )}
      </Table>
    </div>
  );
};

export default DonorFlow;
