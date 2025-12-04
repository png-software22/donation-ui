import { useState } from "react";
import Sidebar from "./Sidebar";
import DonorForm from "./DonorForm";
import "./Dashboard.css";

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button
} from "reactstrap";
import DonorFlow from "./donorFlow";

export default function Dashboard() {
  const [menu, setMenu] = useState("dashboard");

  return (
    <div className="layout-wrapper">
      <Sidebar onMenuSelect={setMenu} activeMenu={menu} />

      <div className="content-area">
        
        {/* TOP TITLE BAR */}
        <div className="topbar">
          <h3>{menu.charAt(0).toUpperCase() + menu.slice(1)}</h3>

          <div className="profile-box">
            <img src="https://i.pravatar.cc/120" alt="user" />
            <span>Admin Kumar ▼</span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        {menu === "dashboard" && (
          <Container fluid>
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
              <Button color="primary" className="me-2">View Reports</Button>
              <Button color="success" className="me-2">Add Donation</Button>
              <Button color="info">Add Expense</Button>
            </div>
          </Container>
        )}

        {menu === "donations" && <DonorFlow />}
        {menu === "expenses" && <h1>Expenses</h1>}
        {menu === "reports" && <h1>Reports</h1>}
      </div>
    </div>
  );
}
