import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Col, Row } from "reactstrap";
import api from "../../../api/api";
import Loader from "../../../Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "./AddDonationForm.css";

const AddDonationForm = ({ donorDetails, goBack }) => {
  const [loading, setLoading] = useState(false);

  const [donation, setDonation] = useState({
    donorId: donorDetails?.id,
    method: "",
    referenceNo: "",
    amount: "",
    date: "",
    bankName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "method") {
      if (value === "CASH") {
        setDonation({
          ...donation,
          method: value,
          referenceNo: "",
          bankName: "",
        });
        return;
      }
    }

    setDonation({ ...donation, [name]: value });
  };

  const handleSubmit = () => {
    setLoading(true);

    const finalDonation = {
      ...donation,

      donorFirstName: donorDetails.firstName,
      donorLastName: donorDetails.lastName,
      donorPhoneNumber: donorDetails.phoneNumber,
      donorIdProofType: donorDetails.idProofType,
      donorIdProofNumber: donorDetails.idProofNumber,
      donorStreetAddress: donorDetails.streetAddress,
      donorCustomAddress: donorDetails.customAddress,
      donorStateId: donorDetails.stateId,
      donorCityId: donorDetails.cityId,
    };

    api
      .post(`/donations`, finalDonation)
      .then(() => toast.success("Donation Added Successfully"))
      .catch(() => toast.error("Failed to save donation"))
      .finally(() => {
        setLoading(false);
        goBack();
      });
  };

  return (
    <div className="donation-wrapper mt-4 px-4">
      <ToastContainer />
      {loading && <Loader />}

      <h2 className="donation-title">Add Donation</h2>
      <p className="donor-info">
        Donor:
        <b>
          {" "}
          {donorDetails?.firstName} {donorDetails?.lastName}
        </b>
      </p>

      <Form>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Donation Method</Label>
              <Input type="select" name="method" onChange={handleChange}>
                <option value="">Select</option>
                <option value="CASH">Cash</option>
                <option value="ONLINE">Online</option>
                <option value="CHEQUE">Cheque</option>
                <option value="RTGS">RTGS</option>
              </Input>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label>Reference Number</Label>
              <Input
                name="referenceNo"
                disabled={!donation.method || donation.method === "CASH"}
                value={donation.referenceNo}
                onChange={handleChange}
                placeholder={
                  donation.method === "CASH" || !donation.method
                    ? "Disabled for Cash / select method"
                    : "Enter reference number"
                }
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label>Amount</Label>
              <div className="amount-box">
                <span className="amount-prefix">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={donation.amount}
                  onChange={handleChange}
                  className="amount-input"
                  required
                />
              </div>
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label>Date</Label>
              <Input type="date" name="date" onChange={handleChange} />
            </FormGroup>
          </Col>

          {donation.method && donation.method !== "CASH" && (
            <Col md={6}>
              <FormGroup>
                <Label>Bank Name</Label>
                <Input type="select" name="bankName" onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="SBI">SBI</option>
                  <option value="HDFC">HDFC</option>
                  <option value="ICICI">ICICI</option>
                  <option value="AXIS">AXIS</option>
                  <option value="PNB">PNB</option>
                  <option value="BOI">BOI</option>
                  <option value="BOB">BOB</option>
                  <option value="Other">Other</option>
                </Input>
              </FormGroup>
            </Col>
          )}
        </Row>

        <div className="d-flex justify-content-end mt-3">
          <Button color="secondary" className="me-2" onClick={goBack}>
            Back
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            Save Donation
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddDonationForm;
