import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Col, Row } from "reactstrap";
import api from "../../../api/api";
import Loader from "../../../Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "./AddDonationForm.css";

const AddDonationForm = ({ donorDetails, goBack }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (name === "method" && value === "CASH") {
      setDonation({
        ...donation,
        method: value,
        referenceNo: "",
        bankName: "",
      });
      return;
    }

    setDonation({ ...donation, [name]: value });
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    let newErrors = {};

    if (!donation.method) newErrors.method = "Donation method is required";
    if (!donation.amount || donation.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!donation.date) newErrors.date = "Date is required";

    if (donation.method !== "CASH") {
      if (!donation.referenceNo)
        newErrors.referenceNo = "Reference Number is required";
      if (!donation.bankName) newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors!");
      return;
    }

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
      .post("/donations", finalDonation)
      .then(() => {
        toast.success("Donation Added Successfully");
        goBack();
      })
      .catch(() => toast.error("Failed to save donation"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="donation-wrapper mt-4 px-4">
      <ToastContainer />
      {loading && <Loader />}

      <h2 className="donation-title">Add Donation</h2>

      <p className="donor-info">
        Donor: <b>{donorDetails.firstName} {donorDetails.lastName}</b>
      </p>

      <Form>
        <Row>
          {/* METHOD */}
          <Col md={6}>
            <FormGroup>
              <Label>
                Donation Method <span className="required-star">*</span>
              </Label>

              <Input
                type="select"
                name="method"
                className={errors.method ? "input-error" : ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="CASH">Cash</option>
                <option value="ONLINE">Online</option>
                <option value="CHEQUE">Cheque</option>
                <option value="RTGS">RTGS</option>
              </Input>

              {errors.method && (
                <p className="error-text">{errors.method}</p>
              )}
            </FormGroup>
          </Col>

          {/* REFERENCE NUMBER */}
          <Col md={6}>
            <FormGroup>
              <Label>
                Reference Number{" "}
                {donation.method !== "CASH" && (
                  <span className="required-star">*</span>
                )}
              </Label>

              <Input
                name="referenceNo"
                disabled={!donation.method || donation.method === "CASH"}
                className={errors.referenceNo ? "input-error" : ""}
                value={donation.referenceNo}
                onChange={handleChange}
                placeholder={
                  donation.method === "CASH"
                    ? "Disabled for Cash / Select method"
                    : "Enter reference number"
                }
              />

              {errors.referenceNo && (
                <p className="error-text">{errors.referenceNo}</p>
              )}
            </FormGroup>
          </Col>

          {/* AMOUNT */}
          <Col md={6}>
            <FormGroup>
              <Label>
                Amount <span className="required-star">*</span>
              </Label>

              <div
                className={`amount-box ${
                  errors.amount ? "input-error" : ""
                }`}
              >
                <span className="amount-prefix">₹</span>

                <input
                  type="number"
                  name="amount"
                  value={donation.amount}
                  onChange={handleChange}
                  className="amount-input"
                  placeholder="Enter amount"
                />
              </div>

              {errors.amount && (
                <p className="error-text">{errors.amount}</p>
              )}
            </FormGroup>
          </Col>

          {/* DATE */}
          <Col md={6}>
            <FormGroup>
              <Label>
                Date <span className="required-star">*</span>
              </Label>

              <Input
                type="date"
                name="date"
                className={errors.date ? "input-error" : ""}
                onChange={handleChange}
              />

              {errors.date && (
                <p className="error-text">{errors.date}</p>
              )}
            </FormGroup>
          </Col>

          {/* BANK NAME */}
          {donation.method !== "CASH" && (
            <Col md={6}>
              <FormGroup>
                <Label>
                  Bank Name <span className="required-star">*</span>
                </Label>

                <Input
                  type="select"
                  name="bankName"
                  className={errors.bankName ? "input-error" : ""}
                  onChange={handleChange}
                >
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

                {errors.bankName && (
                  <p className="error-text">{errors.bankName}</p>
                )}
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
