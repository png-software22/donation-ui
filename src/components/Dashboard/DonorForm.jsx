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
import axios from "axios";

export default function DonorForm({ donor, isEdit }) {
  const [form, setForm] = useState(
    donor ?? {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      streetAddress: "",
      stateId: "",
      cityId: "",
      idProofType: "",
      idProofNumber: "",
      customAddress: "",
    }
  );
  const [domicile, setDomicile] = useState(form.customAddress ? 'Foreigner' :"Indian");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchStates()
      .then((res) => setStates(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (form.stateId) {
      fetchCities(form.stateId)
        .then((res) => {
          setCities(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [form.stateId]);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setForm({ ...form, stateId: selectedState, cityId: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    api
      .get(`/states`)
      .then((data) => setStates(data.data))
      .catch((err) => console.log("err is", err));
  }, []);

  return (
    <div className="mt-4 px-4">
      <h2 className="fw-bold mb-3">Add New Donor</h2>

      <Card className="shadow-sm border-0">
        <CardBody>
          <Form>
            {/* Personal Details */}
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
                  <Label>Phone</Label>
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
              <Col xs={12}>
                Donor Domicile:
                <input
                  onChange={(e) =>
                    setDomicile(e.target.value ? "Indian" : "Foreigner")
                  }
                  value="Indian"
                  type="radio"
                  name="addressType"
                />{" "}
                Indian
                <input
                  onChange={(e) =>
                    setDomicile(e.target.value ? "Foreigner" : "Indian")
                  }
                  value="Foreigner"
                  type="radio"
                  name="addressType"
                />{" "}
                Foreigner
              </Col>
              {/* STATE + CITY */}

              {domicile === "Indian" ? (
                <>
                  <Col md={4}>
                    <FormGroup>
                      <Label>State</Label>
                      <Input
                        type="select"
                        name="stateId"
                        value={form.stateId}
                        onChange={handleStateChange} // important
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
                        {cities?.map((ct) => (
                          <option key={ct.id} value={ct.id}>
                            {ct.name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </>
              ) : (
                <Col xs={12}>
                  <FormGroup>
                    <Label>Address</Label>
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

            {/* Donation Details
            <h5 className="fw-semibold mt-4 mb-3">Donation Details</h5>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Mode</Label>
                  <Input
                    type="select"
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>Cash</option>
                    <option>Online</option>
                    <option>Cheque</option>
                    <option>UPI</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Notes</Label>
                  <Input
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row> */}
            <div className="d-flex justify-content-end">
            <Button color="primary" className="mt-3 px-4" onClick={() => {
              if(isEdit) {
                // create an PUT API call to update donor
              } else {
                const dataToSend = {...form};
                if(domicile === 'Foreigner') {
                  delete dataToSend.stateId;
                  delete dataToSend.cityId;
                }
                axios.post('http://localhost:8080/donors', {
                   ...dataToSend
                }).then((res) => {
                  console.log('res from api is', res);
                }).catch((err) => {
                  console.log('api ne rror ditta')
                })
                // call create donor api to create a new donor
              }
            }}>
             {isEdit ? 'Update' :'Save Donor'}
            </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
