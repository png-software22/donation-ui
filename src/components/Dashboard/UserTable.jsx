import React, { useState } from "react";
import { Table, Input, Button } from "reactstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function UsersTable() {
  const [search, setSearch] = useState("");

  // Dummy data (later we connect to backend)
  const users = [
    { id: 1, name: "Aman Sharma", phone: "9876543210", city: "Amritsar" },
    { id: 2, name: "Simran Kaur", phone: "9001234567", city: "Ludhiana" },
    { id: 3, name: "Rohit Verma", phone: "8765432109", city: "Jalandhar" },
    { id: 4, name: "Neha Singh", phone: "8007654321", city: "Delhi" },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h3 className="fw-bold mb-3">Users List</h3>

      {/* SEARCH FIELD */}
      <Input
        placeholder="Search user by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      {/* TABLE */}
      <Table striped bordered hover responsive>
        <thead style={{ background: "#4B49AC", color: "white" }}>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u, index) => (
            <tr key={u.id}>
              <td>{index + 1}</td>
              <td>{u.name}</td>
              <td>{u.phone}</td>
              <td>{u.city}</td>
              <td>
                <Button color="warning" size="sm" className="me-2">
                  <FiEdit size={16} />
                </Button>

                <Button color="danger" size="sm">
                  <FiTrash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
