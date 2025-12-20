import { fetchStates, fetchCities } from "../../api/stateService";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import api from "../../api/api";
import Loader from "../../Loader/Loader";
import { toast } from "react-toastify";

export default function DonorForm({ donor, isEdit, goBack }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    stateId: "",
    cityId: "",
    idProofType: "",
    idProofNumber: "",
    customAddress: "",
  });

  const [domicile, setDomicile] = useState("Indian");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // -------------------------------------------------------------------
  // LIVE VALIDATION (NEW)
  // -------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case "firstName":
        if (!value.trim()) newErrors.firstName = "First name is required";
        else if (!nameRegex.test(value))
          newErrors.firstName = "Only alphabets allowed";
        else newErrors.firstName = "";
        break;

      case "lastName":
        if (!value.trim()) newErrors.lastName = "Last name is required";
        else if (!nameRegex.test(value))
          newErrors.lastName = "Only alphabets allowed";
        else newErrors.lastName = "";
        break;

      case "phoneNumber":
        if (!value.trim()) newErrors.phoneNumber = "Phone number is required";
        else if (!/^[0-9]*$/.test(value))
          newErrors.phoneNumber = "Only digits allowed";
        else if (!phoneRegex.test(value))
          newErrors.phoneNumber = "Phone must be 10 digits";
        else newErrors.phoneNumber = "";
        break;

      case "email":
        if (!value.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(value))
          newErrors.email = "Invalid email format";
        else newErrors.email = "";
        break;

      case "streetAddress":
        if (!value.trim())
          newErrors.streetAddress = "Street address is required";
        else newErrors.streetAddress = "";
        break;

      case "stateId":
        if (!value) newErrors.stateId = "State is required";
        else newErrors.stateId = "";
        break;

      case "cityId":
        if (!value) newErrors.cityId = "City is required";
        else newErrors.cityId = "";
        break;

      case "idProofType":
        if (!value) newErrors.idProofType = "ID proof type is required";
        else newErrors.idProofType = "";
        break;

      case "idProofNumber":
        if (!value.trim())
          newErrors.idProofNumber = "ID proof number required";
        else newErrors.idProofNumber = "";
        break;

      case "customAddress":
        if (!value.trim()) newErrors.customAddress = "Full address required";
        else newErrors.customAddress = "";
        break;

      default:
        break;
    }

    setErrors(newErrors);
    setForm({ ...form, [name]: value });
  };

  // -------------------------------------------------------------------
  // FINAL VALIDATE FOR SUBMIT
  // -------------------------------------------------------------------
  const validate = () => {
    let e = {};

    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.firstName.trim()) e.firstName = "First name is required";
    else if (!nameRegex.test(form.firstName))
      e.firstName = "Only alphabets allowed";

    if (!form.lastName.trim()) e.lastName = "Last name is required";
    else if (!nameRegex.test(form.lastName))
      e.lastName = "Only alphabets allowed";

    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(form.phoneNumber))
      e.phoneNumber = "Phone must be 10 digits";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(form.email))
      e.email = "Invalid email format";

    if (!form.streetAddress.trim())
      e.streetAddress = "Street address is required";

    if (domicile === "Indian") {
      if (!form.stateId) e.stateId = "State is required";
      if (!form.cityId) e.cityId = "City is required";
    } else {
      if (!form.customAddress.trim())
        e.customAddress = "Full address is required";
    }

    if (!form.idProofType.trim()) e.idProofType = "ID proof type required";
    if (!form.idProofNumber.trim())
      e.idProofNumber = "ID proof number required";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  // -------------------------------------------------------------------
  // RESET FORM
  // -------------------------------------------------------------------
  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      streetAddress: "",
      stateId: "",
      cityId: "",
      idProofType: "",
      idProofNumber: "",
      customAddress: "",
    });
    setDomicile("Indian");
    setErrors({});
    setCities([]);
  };

  // -------------------------------------------------------------------
  // LOAD DATA IN EDIT MODE
  // -------------------------------------------------------------------
  useEffect(() => {
    if (donor) {
      setForm({
        firstName: donor.firstName || "",
        lastName: donor.lastName || "",
        phoneNumber: donor.phoneNumber || "",
        email: donor.email || "",
        streetAddress: donor.streetAddress || "",
        stateId: donor.stateId || "",
        cityId: donor.cityId || "",
        idProofType: donor.idProofType || "",
        idProofNumber: donor.idProofNumber || "",
        customAddress: donor.customAddress || "",
      });

      setDomicile(donor.customAddress ? "Foreigner" : "Indian");
    }
  }, [donor]);

  // LOAD STATES
  useEffect(() => {
    fetchStates().then((res) => setStates(res.data));
  }, []);

  // LOAD CITIES WHEN STATE CHANGES
  useEffect(() => {
    if (form.stateId) {
      fetchCities(form.stateId).then((res) => setCities(res.data));
    } else {
      setCities([]);
    }
  }, [form.stateId]);

  // -------------------------------------------------------------------
  // SUBMIT FORM
  // -------------------------------------------------------------------
  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Please correct highlighted fields");
      return;
    }

    const sendData = { ...form };

    if (domicile === "Foreigner") {
      delete sendData.stateId;
      delete sendData.cityId;
    }

    setLoading(true);

    const apiCall = isEdit
      ? api.put(`/donors/${donor.id}/updateDonor`, sendData)
      : api.post(`/donors`, sendData);

    apiCall
      .then(() => {
        toast.success(
          isEdit ? "Donor Updated Successfully" : "Donor Created Successfully"
        );
        resetForm();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
        goBack && goBack();
      });
  };

  // -------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------
  return (
    <div className="mt-4 px-4">
      {loading && <Loader />}

      <h2 className="fw-bold mb-3">
        {isEdit ? "Edit Donor" : "Add New Donor"}
      </h2>

      <Card className="shadow-sm border-0">
        <CardBody>
          <Form>
            <h5 className="fw-semibold mb-3">Personal Details</h5>

            <Row>
              {/* FIRST NAME */}
              <Col md={6}>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <small className="text-danger">{errors.firstName}</small>
                  )}
                </FormGroup>
              </Col>

              {/* LAST NAME */}
              <Col md={6}>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <small className="text-danger">{errors.lastName}</small>
                  )}
                </FormGroup>
              </Col>

              {/* PHONE */}
              <Col md={6}>
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    maxLength={10}
                    onChange={handleChange}
                    invalid={!!errors.phoneNumber}
                  />
                  {errors.phoneNumber && (
                    <small className="text-danger">{errors.phoneNumber}</small>
                  )}
                </FormGroup>
              </Col>

              {/* EMAIL */}
              <Col md={6}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    invalid={!!errors.email}
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                </FormGroup>
              </Col>

              {/* STREET ADDRESS */}
              <Col md={12}>
                <FormGroup>
                  <Label>Street Address</Label>
                  <Input
                    name="streetAddress"
                    value={form.streetAddress}
                    onChange={handleChange}
                    invalid={!!errors.streetAddress}
                  />
                  {errors.streetAddress && (
                    <small className="text-danger">
                      {errors.streetAddress}
                    </small>
                  )}
                </FormGroup>
              </Col>

              {/* DOMICILE */}
              <Col xs={12} className="my-2">
                <strong>Donor Domicile:</strong> &nbsp;
                <Input
                  type="radio"
                  checked={domicile === "Indian"}
                  onChange={() => {
                    setDomicile("Indian");
                    setErrors({ ...errors, customAddress: "" });
                  }}
                />{" "}
                Indian &nbsp;
                <Input
                  type="radio"
                  checked={domicile === "Foreigner"}
                  onChange={() => {
                    setDomicile("Foreigner");
                    setErrors({ ...errors, stateId: "", cityId: "" });
                  }}
                />{" "}
                Foreigner
              </Col>

              {domicile === "Indian" ? (
                <>
                  {/* STATE */}
                  <Col md={4}>
                    <FormGroup>
                      <Label>State</Label>
                      <Input
                        type="select"
                        name="stateId"
                        value={form.stateId}
                        onChange={handleChange}
                        invalid={!!errors.stateId}
                      >
                        <option value="">Select State</option>
                        {states.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </Input>
                      {errors.stateId && (
                        <small className="text-danger">{errors.stateId}</small>
                      )}
                    </FormGroup>
                  </Col>

                  {/* CITY */}
                  <Col md={4}>
                    <FormGroup>
                      <Label>City</Label>
                      <Input
                        type="select"
                        name="cityId"
                        value={form.cityId}
                        onChange={handleChange}
                        disabled={!form.stateId}
                        invalid={!!errors.cityId}
                      >
                        <option value="">Select City</option>
                        {cities.map((ct) => (
                          <option key={ct.id} value={ct.id}>
                            {ct.name}
                          </option>
                        ))}
                      </Input>
                      {errors.cityId && (
                        <small className="text-danger">{errors.cityId}</small>
                      )}
                    </FormGroup>
                  </Col>
                </>
              ) : (
                <Col md={12}>
                  <FormGroup>
                    <Label>Full Address</Label>
                    <Input
                      name="customAddress"
                      value={form.customAddress}
                      onChange={handleChange}
                      invalid={!!errors.customAddress}
                    />
                    {errors.customAddress && (
                      <small className="text-danger">
                        {errors.customAddress}
                      </small>
                    )}
                  </FormGroup>
                </Col>
              )}

              {/* ID PROOF TYPE */}
              <Col md={6}>
                <FormGroup>
                  <Label>ID Proof Type</Label>
                  <Input
                    type="select"
                    name="idProofType"
                    value={form.idProofType}
                    onChange={handleChange}
                    invalid={!!errors.idProofType}
                  >
                    <option value="">Select</option>
                    <option value="ADHAAR">Aadhaar</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="VOTER_ID">Voter ID</option>
                    <option value="PAN_CARD">PAN Card</option>
                  </Input>
                  {errors.idProofType && (
                    <small className="text-danger">{errors.idProofType}</small>
                  )}
                </FormGroup>
              </Col>

              {/* ID PROOF NUMBER */}
              <Col md={6}>
                <FormGroup>
                  <Label>ID Proof Number</Label>
                  <Input
                    name="idProofNumber"
                    value={form.idProofNumber}
                    onChange={handleChange}
                    invalid={!!errors.idProofNumber}
                  />
                  {errors.idProofNumber && (
                    <small className="text-danger">
                      {errors.idProofNumber}
                    </small>
                  )}
                </FormGroup>
              </Col>
            </Row>

            {/* SUBMIT BUTTONS */}
            <div className="d-flex justify-content-end mt-3">
              <Button
                color="secondary"
                className="me-2"
                onClick={goBack}
                disabled={loading}
              >
                Back
              </Button>

              <Button
                color="primary"
                className="px-4"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Please wait..." : isEdit ? "Update" : "Save Donor"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
