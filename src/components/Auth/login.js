import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "../../styles/App.css";
import api from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { USER_KEY } from "../../constant";

export default function Login() {
  const [UserId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await api.post("/users/login", {
        userName: UserId,
        password,
      });
      localStorage.setItem(USER_KEY, JSON.stringify(user.data));

      navigate("/dashboard"); // Redirect to dashboard
    } catch (e) {
      if (e.status === 401) {
        toast.error("Invalid user or password");
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer />
      <Row>
        <Col>
          <Card className="login-card" style={{ width: "360px" }}>
            <CardBody>
              <h2 className="primary-color mb-4">Sign In</h2>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="UserId">User ID</Label>
                  <Input
                    id="UserId"
                    type="text"
                    placeholder="Enter your User ID"
                    value={UserId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <Button
                  type="submit"
                  className="w-100 bg-primary"
                  style={{ padding: "16px 24px" }}
                >
                  Sign In
                </Button>
              </Form>
              <div className="mt-2 text-end">
                <small></small>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
