import { useState } from "react";
import Sidebar from "./Sidebar";
import DonorForm from "./DonorForm";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button
} from "reactstrap";

export default function Dashboard() {
  const [menu, setMenu] = useState("dashboard");

  return (
    
    <div style={{ display: "flex" }}>
    <Sidebar onMenuSelect={setMenu} activeMenu={menu} />


      <div style={{ marginLeft: "240px", width: "100%", padding: "30px" }}>
        {menu === "dashboard" && (
          <Container fluid>
            <h2 className="mb-4">Dashboard</h2>

            <Row>
              <Col md="4">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Upcoming Events</CardTitle>
                    <p>No events scheduled.</p>
                  </CardBody>
                </Card>
              </Col>

              <Col md="4">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Donations Summary</CardTitle>
                    <p>View total donations.</p>
                  </CardBody>
                </Card>
              </Col>

              <Col md="4">
                <Card>
                  <CardBody>
                    <CardTitle tag="h5">Expenses Summary</CardTitle>
                    <p>Check latest expenses.</p>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <div className="mt-4">
              <Button color="primary" className="me-2">
                View Reports
              </Button>
              <Button color="success" className="me-2">
                Add Donation
              </Button>
              <Button color="info">Add Expense</Button>
            </div>
          </Container>
        )}
        {menu === "donations" && <DonorForm />}
        {menu === "expenses" && <h1>Expenses</h1>}
        {menu === "reports" && <h1>Reports</h1>}
      </div>
    </div>
  );
}
