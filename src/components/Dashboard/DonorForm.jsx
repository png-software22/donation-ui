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

export default function DonorForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    phone2: "",
    street: "",
    state: "",
    city: "",
    amount: "",
    mode: "",
    notes: "",
  });

  const [states, setStates] = useState([]);  
  const [cities, setCities] = useState([]);   

 
useEffect(() => {
  fetchStates()
    .then((res) => setStates(res.data))
    .catch((err) => console.log(err));
}, []);


 
  const handleStateChange = (e) => {
  const selectedState = e.target.value;
  setForm({ ...form, state: selectedState, city: "" });

  fetchCities(selectedState)
    .then((res) => setCities(res.data))
    .catch((err) => console.log(err));
};


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(()=>{
    const  resp = axios.get(`${API_END_POINT_BASE_URL}/states`)
    console.log('response from api ', resp)
  }, [])

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
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Phone Number 2 (optional)</Label>
                  <Input
                    name="phone2"
                    value={form.phone2}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Street Address</Label>
                  <Input
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* STATE + CITY */}

            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>State</Label>
                  <Input
                    type="select"
                    name="state"
                    value={form.state}
                    onChange={handleStateChange}   // important
                  >
                    <option value="">Select State</option>

                    {states.map((st) => (
                      <option key={st} value={st}>
                        {st}
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
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  >
                    <option value="">Select City</option>

                    {cities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            {/* Donation Details */}
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
            </Row>

            <Button color="primary" className="mt-3 px-4">
              Save Donor
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
