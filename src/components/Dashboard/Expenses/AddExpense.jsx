import React, { useState } from "react";
import { Form, Label, Input, Button, Row, Col } from "reactstrap";
import api from "../../../api/api";
import { toast, ToastContainer } from "react-toastify";

const AddExpense = ({ goBack }) => {
  const now = new Date();
  const voucherDate = now.toLocaleDateString();
  const voucherTime = now.toLocaleTimeString();

  const [expense, setExpense] = useState({
    expenseName: "",
    expenseDescription: "",
    expenseAmount: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = () => {
    if (loading) return;

    if (
      !expense.expenseName ||
      !expense.expenseDescription ||
      !expense.expenseAmount
    ) {
      toast.error("All fields are required");
      return;
    }

    if (Number(expense.expenseAmount) <= 0) {
      toast.error("Invalid amount");
      return;
    }

    setLoading(true);

    api
      .post("/expenses", {
        expenseName: expense.expenseName,
        expenseDescription: expense.expenseDescription,
        expenseAmount: Number(expense.expenseAmount),
      })
      .then(async (res) => {
        toast.success("Expense added successfully");

        const pdf = await api.get("/expenses/receipt/" + res.data.id, {
          responseType: "arraybuffer",
        });
        const url = window.URL.createObjectURL(new Blob([pdf.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "VC00" + res.data.id + ".pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => {
          goBack?.(); // smooth exit after toast
        }, 400);
      })

      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="mt-4 px-4">
      <h4 className="mb-3">Expense Voucher</h4>
      <ToastContainer />
      <Form>
        <Row className="mb-3">
          <Col md={4}>
            <Label>Voucher Date</Label>
            <Input value={voucherDate} disabled />
          </Col>

          <Col md={4}>
            <Label>Time</Label>
            <Input value={voucherTime} disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Label>Name</Label>
            <Input value="Bhagwati Bhawan" disabled />
          </Col>

          <Col md={6}>
            <Label>Type</Label>
            <Input value="DR" disabled />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Label>Purpose</Label>
            <Input
              name="expenseName"
              value={expense.expenseName}
              onChange={handleChange}
              placeholder="Enter purpose"
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Label>Voucher Narration</Label>
            <Input
              type="textarea"
              name="expenseDescription"
              value={expense.expenseDescription}
              onChange={handleChange}
              placeholder="Enter voucher narration"
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Label>Amount</Label>
            <Input
              type="number"
              name="expenseAmount"
              value={expense.expenseAmount}
              onChange={handleChange}
              placeholder="Enter amount"
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
            {loading ? "Saving..." : "Save Expense"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddExpense;
