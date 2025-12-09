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

  // Autofill when editing donor
  useEffect(() => {
    if (donor) {
      setForm({
        firstName: donor.firstName || "",
        lastName: donor.lastName || "",
        phoneNumber: donor.phoneNumber || "",
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

  // Fetch States
  useEffect(() => {
    fetchStates().then((res) => setStates(res.data));
  }, []);

  // Fetch Cities based on State
  useEffect(() => {
    if (form.stateId) {
      fetchCities(form.stateId).then((res) => setCities(res.data));
    }
  }, [form.stateId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleStateChange = (e) =>
    setForm({ ...form, stateId: e.target.value, cityId: "" });

  const handleSubmit = () => {
    const dataToSend = { ...form };

    if (domicile === "Foreigner") {
      delete dataToSend.stateId;
      delete dataToSend.cityId;
    }

    setLoading(true);

    if (isEdit) {
      // UPDATE Donor
      api
        .put(`/donors/${donor.id}/updateDonor`, dataToSend)
        .then(() => toast.success("Donor Updated Successfully"))
        .catch(() => toast.error("Failed to update donor"))
        .finally(() => {
          setLoading(false);
          goBack && goBack();
        });
    } else {
      // CREATE Donor
      api
        .post(`/donors`, dataToSend)
        .then(() => toast.success("Donor Created Successfully"))
        .catch(() => toast.error("Failed to create donor"))
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
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup>
                  <Label>Street Address</Label>
                  <Input
                    name="streetAddress"
                    value={form.streetAddress}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col xs={12} className="my-2">
                <strong>Donor Domicile:</strong> &nbsp;
                <Input
                  type="radio"
                  checked={domicile === "Indian"}
                  onChange={() => setDomicile("Indian")}
                />{" "}
                Indian &nbsp;
                <Input
                  type="radio"
                  checked={domicile === "Foreigner"}
                  onChange={() => setDomicile("Foreigner")}
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
                      >
                        <option value="">Select State</option>
                        {states.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </Input>
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
                      >
                        <option value="">Select City</option>
                        {cities.map((ct) => (
                          <option key={ct.id} value={ct.id}>
                            {ct.name}
                          </option>
                        ))}
                      </Input>
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
                    />
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
                  >
                    <option value="">Select</option>
                    <option value="ADHAAR">Aadhaar</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="VOTER_ID">Voter ID</option>
                    <option value="PAN_CARD">PAN Card</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>ID Proof Number</Label>
                  <Input
                    name="idProofNumber"
                    value={form.idProofNumber}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Buttons */}
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
