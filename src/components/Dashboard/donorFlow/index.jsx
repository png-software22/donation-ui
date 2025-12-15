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
  const [phone, setPhone] = useState("");
  const [donorId, setDonorId] = useState("");

  const [donors, setDonors] = useState({ count: 0, data: [] });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateSearch = () => {
    if (!phone.trim() && !donorId.trim()) {
      toast.error("Enter Phone Number or Donor Identification Number");
      return false;
    }

    if (phone.trim() && !/^[0-9]{10}$/.test(phone.trim())) {
      toast.error("Phone number must be 10 digits");
      return false;
    }

    if (!phone.trim() && donorId.trim().length < 4) {
      toast.error("Donor Identification Number must be at least 4 characters");
      return false;
    }

    return true;
  };

  const refreshList = () => {
    if (!validateSearch()) return;

    setLoading(true);

    const filterBy = phone ? "phoneNumber" : "idProofNumber";
    const value = phone || donorId;

    fetchDonors(filterBy, value)
      .then((res) => {
        if (!res.data.count) {
          toast.error("No donor found");
        }
        setDonors(res.data);
      })
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
    setPhone("");
    setDonorId("");
    setDonors({ count: 0, data: [] });
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
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setDonorId(""); // Reset donorID if phone is typed
        }}
      />

      <Input
        placeholder="Donor Identification Number"
        value={donorId}
        onChange={(e) => {
          setDonorId(e.target.value);
          setPhone(""); // Reset phone if donorID is typed
        }}
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
