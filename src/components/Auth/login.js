// import React, { useState } from "react";
// import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");

//     // Simple demo authentication
//     if (!email || !password) {
//       setError("Email aur password dono bharna zaroori hai.");
//       return;
//     }

//     if (email === "user@example.com" && password === "password123") {
//       alert("Login successful!");
//       // Yahan aap navigate ya dashboard redirect kar sakte ho
//     } else {
//       setError("Invalid credentials! Try: user@example.com / password123");
//     }
//   };

//   return (
//     <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
//       <Row>
//         <Col>
//           <Card style={{ width: "350px", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
//             <CardBody>
//               <h2 className="text-center mb-4" style={{ color: "#007bff" }}>Login</h2>
//               {error && <Alert color="danger">{error}</Alert>}
//               <Form onSubmit={handleSubmit}>
//                 <FormGroup>
//                   <Label for="email">Email</Label>
//                   <Input
//                     type="email"
//                     id="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label for="password">Password</Label>
//                   <Input
//                     type="password"
//                     id="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </FormGroup>
//                 <Button color="primary" className="w-100 mt-3">Login</Button>
//               </Form>
//               <div className="mt-3 text-center">
//                 <small className="text-muted">
//                   Demo credentials: <br />
//                   <strong>user@example.com</strong> / <strong>password123</strong>
//                 </small>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import '../../styles/App.css';

export default function Login() {
  const [UserId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!UserId || !password) {
      setError("User ID aur password dono required hai!");
      return;
    }

    // Demo login check
    if (UserId === "E000769" && password === "password123") {
      alert("Login successful!");
    } else {
      setError("Invalid credentials!");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col>
          <Card className="login-card" style={{ width: '360px' }}>
            <CardBody>
              <h2 className="primary-color mb-4">Sign In</h2>
              {error && <Alert color="danger">{error}</Alert>}
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
                <Button type="submit" className="w-100 bg-primary" style={{ padding: '16px 24px' }}>
                  Sign In
                </Button>
              </Form>
              <div className="mt-2 text-end">
                <small><a href="#">Forgot password?</a></small>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
