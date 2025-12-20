import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Col, Row } from "reactstrap";
import api from "../../../api/api";
import Loader from "../../../Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "./AddDonationForm.css";

let toastLock = false; // prevents duplicate toast

const AddDonationForm = ({ donorDetails, goBack }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const [donation, setDonation] = useState({
    donorId: donorDetails?.id,
    method: "",
    referenceNo: "",
    amount: "",
    date: today, // default today
    bankName: "IndusInd Bank",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" });

    if (name === "method" && value === "CASH") {
      setDonation({
        ...donation,
        method: value,
        referenceNo: "",
      });
      return;
    }

    setDonation({ ...donation, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!donation.method) newErrors.method = "Donation method is required";
    if (!donation.amount || donation.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";

    if (!donation.date) newErrors.date = "Date is required";

    if (donation.date > today) {
      newErrors.date = "Future dates are not allowed";
    }

    if (donation.method !== "CASH") {
      if (!donation.referenceNo)
        newErrors.referenceNo = "Reference Number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      if (!toastLock) {
        toast.error("Please fix the errors!");
        toastLock = true;
        setTimeout(() => (toastLock = false), 700);
      }
      return;
    }

    if (loading) return; // stop double-click

    setLoading(true);

    
    const formatDateToDDMMYYYY = (isoDate) => {
      if (!isoDate) return "";
      const [yyyy, mm, dd] = isoDate.split("-");
      return `${dd}-${mm}-${yyyy}`;
    };

    const finalDonation = {
      ...donation,
      date: formatDateToDDMMYYYY(donation.date),
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
        if (!toastLock) {
          toast.success("Donation Added Successfully");
          toastLock = true;
          setTimeout(() => (toastLock = false), 700);
        }

        setTimeout(() => {
          goBack(); // smooth exit after toast
        }, 400);
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
        Donor:{" "}
        <b>
          {donorDetails.firstName} {donorDetails.lastName}
        </b>
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
                value={donation.method}
                className={errors.method ? "input-error" : ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="CASH">Cash</option>
                <option value="ONLINE">Online</option>
                <option value="CHEQUE">Cheque</option>
                <option value="RTGS">RTGS</option>
              </Input>

              {errors.method && <p className="error-text">{errors.method}</p>}
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
                    ? "Disabled for Cash"
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
                className={`amount-wrapper ${
                  errors.amount ? "input-error" : ""
                }`}
              >
                <span className="rupee">₹</span>

                <input
                  type="number"
                  name="amount"
                  value={donation.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="amount-field"
                />
              </div>

              {errors.amount && <p className="error-text">{errors.amount}</p>}
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
                value={donation.date}
                max={today}
                className={errors.date ? "input-error" : ""}
                onChange={handleChange}
              />

              {errors.date && <p className="error-text">{errors.date}</p>}
            </FormGroup>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-3">
          <Button
            color="secondary"
            className="me-2"
            onClick={goBack}
            disabled={loading}
          >
            Back
          </Button>
          <Button color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Donation"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddDonationForm;
