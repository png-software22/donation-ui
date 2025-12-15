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
      e.phoneNumber = "Phone number must be 10 digits";

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

    if (!form.idProofType.trim()) e.idProofType = "ID proof type is required";
    if (!form.idProofNumber.trim())
      e.idProofNumber = "ID proof number is required";

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("Please correct highlighted fields");
      return false;
    }

    return true;
  };

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
    setCities([]);
    setErrors({});
  };

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

  useEffect(() => {
    fetchStates().then((res) => setStates(res.data));
  }, []);

  useEffect(() => {
    if (form.stateId) {
      fetchCities(form.stateId).then((res) => setCities(res.data));
    }
  }, [form.stateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleStateChange = (e) => {
    setForm({ ...form, stateId: e.target.value, cityId: "" });
    setErrors({ ...errors, stateId: "", cityId: "" });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const dataToSend = { ...form };

    if (domicile === "Foreigner") {
      delete dataToSend.stateId;
      delete dataToSend.cityId;
    }

    setLoading(true);

    if (isEdit) {
      api
        .put(`/donors/${donor.id}/updateDonor`, dataToSend)
        .then(() => {
          toast.success("Donor Updated Successfully");
          resetForm();
        })
        .catch(() => toast.error("Failed to update donor"))
        .finally(() => {
          setLoading(false);
          goBack && goBack();
        });
    } else {
      api
        .post(`/donors`, dataToSend)
        .then(() => {
          toast.success("Donor Created Successfully");
          resetForm();
        })
        .catch((e) => {
          toast.error(e.response?.data?.message || "Failed to create donor");
        })
        .finally(() => {
          setLoading(false);
          goBack && goBack();
        });
    }
  };

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

              <Col md={6}>
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    invalid={!!errors.phoneNumber}
                  />
                  {errors.phoneNumber && (
                    <small className="text-danger">{errors.phoneNumber}</small>
                  )}
                </FormGroup>
              </Col>

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
                  <Col md={4}>
                    <FormGroup>
                      <Label>State</Label>
                      <Input
                        type="select"
                        name="stateId"
                        value={form.stateId}
                        onChange={handleStateChange}
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

                  <Col md={4}>
                    <FormGroup>
                      <Label>City</Label>
                      <Input
                        type="select"
                        name="cityId"
                        value={form.cityId}
                        onChange={handleChange}
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
