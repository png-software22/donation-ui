import React, { useState, useEffect } from "react";
import { Form, Label, Input, Button, Row, Col } from "reactstrap";
import api from "../../../api/api";
import { fetchStates } from "../../../api/stateService";
import { toast, ToastContainer } from "react-toastify";

const AddCity = ({ goBack }) => {
  const [city, setCity] = useState({
    name: "",
    stateId: "",
    zipcode: "",
  });

  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(true);

  // Fetch states on component mount
  useEffect(() => {
    fetchStates()
      .then((res) => {
        setStates(res.data);
      })
      .catch(() => {
        toast.error("Failed to load states");
      })
      .finally(() => {
        setStatesLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCity({ ...city, [name]: value });
  };

  const generateAbbreviation = (cityName) => {
    return cityName.substring(0, 3).toLowerCase();
  };

  const handleCityNameChange = (e) => {
    const { value } = e.target;
    setCity({
      ...city,
      name: value,
    });
  };

  const handleSubmit = () => {
    if (loading) return;

    if (!city.name || !city.stateId || !city.zipcode) {
      toast.error("City name, state, and zipcode are required");
      return;
    }

    // Validate zipcode (basic validation - should be numeric)
    if (!/^\d+$/.test(city.zipcode)) {
      toast.error("Zipcode must contain only numbers");
      return;
    }

    setLoading(true);

    // Auto-generate abbreviation (first 3 letters in lowercase)
    const abbreviation = generateAbbreviation(city.name);

    api
      .post("/cities", {
        name: city.name,
        stateId: city.stateId,
        zipcode: city.zipcode,
        abbreviation: abbreviation,
      })
      .then(() => {
        toast.success("City added successfully");
        setTimeout(() => {
          goBack?.();
        }, 1000);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Failed to add city";
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-4 px-4">
      <h4 className="mb-3">Add City</h4>
      <ToastContainer />
      <Form>
        <Row className="mb-3">
          <Col md={6}>
            <Label>City Name *</Label>
            <Input
              name="name"
              value={city.name}
              onChange={handleCityNameChange}
              placeholder="Enter city name"
            />
          </Col>

          <Col md={6}>
            <Label>State *</Label>
            <Input
              type="select"
              name="stateId"
              value={city.stateId}
              onChange={handleChange}
              disabled={statesLoading}
            >
              <option value="">
                {statesLoading ? "Loading states..." : "Select a state"}
              </option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </Input>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Label>Zipcode *</Label>
            <Input
              name="zipcode"
              value={city.zipcode}
              onChange={handleChange}
              placeholder="Enter zipcode"
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button
            color="secondary"
            className="me-2"
            onClick={goBack}
            disabled={loading}
          >
            Back
          </Button>

          <Button color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add City"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCity;
