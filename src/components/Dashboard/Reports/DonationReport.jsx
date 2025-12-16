import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../../../api/api";
import Loader from "../../../Loader/Loader";
import moment from "moment";
import { toast } from "react-toastify";
import { fetchStates, fetchCities } from "../../../api/stateService";

export default function DonationReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    method: "",
    stateId: "",
    cityId: "",
    amount: "",
    amountFilter: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const validateFilters = () => {
    if (filters.to && !filters.from) {
      toast.error("Please select From date first");
      return false;
    }

    if (filters.from && filters.to) {
      const from = new Date(filters.from);
      const to = new Date(filters.to);
      if (from > to) {
        toast.error("From date cannot be greater than To date");
        return false;
      }
    }

    if (filters.cityId && !filters.stateId) {
      toast.error("Please select State before selecting City");
      return false;
    }

    if (filters.amountFilter && !filters.amount) {
      toast.error("Please enter Amount");
      return false;
    }

    if (filters.amount && Number(filters.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return false;
    }

    return true;
  };

  const fetchDonations = () => {
    if (!validateFilters()) return;

    setLoading(true);

    api
      .get("/donations/list", {
        params: {
          stateId: filters.stateId || undefined,
          cityId: filters.cityId || undefined,
          method: filters.method || undefined,

          startDate: filters.from ? formatDate(filters.from) : undefined,
          endDate: filters.to ? formatDate(filters.to) : undefined,

          amount: filters.amount || undefined,
          amountFilter: filters.amountFilter || undefined,

          page: 1,
          pageSize: 500,
        },
      })
      .then((res) => {
        setRows(res.data.data);
      })
      .catch(() => toast.error("Failed to load report"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStates().then((res) => setStates(res.data));
  }, []);

  useEffect(() => {
    if (filters.stateId) {
      fetchCities(filters.stateId).then((res) => setCities(res.data));
    } else {
      setCities([]);
    }
  }, [filters.stateId]);

  useEffect(() => {
    fetchDonations();
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      from: "",
      to: "",
      method: "",
      stateId: "",
      cityId: "",
      amount: "",
      amountFilter: "",
    });
  };

  const columns = [
    {
      id: 1,
      name: "Donation Date",
      selector: (row) =>
        moment(row.donationDate).format("DD/MM/YYYY hh:mm A"),
      sortable: true,
      width: "200px",
    },
    {
      name: "Donor Name",
      selector: (row) =>
        `${row.donorFirstName || ""} ${row.donorLastName || ""}`,
      sortable: true,
      width: "180px",
    },
    {
      name: "Mobile",
      selector: (row) => row?.donorPhoneNumber || "—",
      width: "130px",
    },
    {
      name: "Address",
      selector: (row) =>
        `${row.donorStreetAddress || ""}, CityID:${row.donorCityId}, StateID:${row.donorStateId}`,
      wrap: true,
      width: "350px",
    },
    {
      name: "Method",
      selector: (row) => row.method || "—",
      sortable: true,
      width: "120px",
    },
    {
      name: "Amount (₹)",
      selector: (row) => row.amount || 0,
      sortable: true,
      width: "140px",
    },
    {
      name: "Bank",
      selector: () => "IndusInd Bank",
      width: "150px",
    },
  ];

  return (
    <div className="p-4">
      {loading && <Loader />}

      <h2 className="fw-bold mb-3">Donation Reports</h2>

      {/* FILTERS SECTION */}
      <div
        className="d-flex align-items-center mb-3"
        style={{ gap: "10px", flexWrap: "wrap" }}
      >
        {/* DATE FROM */}
        <input
          type="date"
          className="form-control"
          style={{ width: 160 }}
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />

        {/* DATE TO */}
        <input
          type="date"
          className="form-control"
          style={{ width: 160 }}
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />

        {/* METHOD */}
        <select
          className="form-select"
          style={{ width: 160 }}
          value={filters.method}
          onChange={(e) => setFilters({ ...filters, method: e.target.value })}
        >
          <option value="">Method</option>
          <option value="CASH">Cash</option>
          <option value="CHEQUE">Cheque</option>
          <option value="ONLINE">Online</option>
          <option value="UPI">UPI</option>
        </select>

        {/* STATE (DYNAMIC) */}
        <select
          className="form-select"
          style={{ width: 160 }}
          value={filters.stateId}
          onChange={(e) =>
            setFilters({
              ...filters,
              stateId: e.target.value,
              cityId: "",
            })
          }
        >
          <option value="">State</option>
          {states.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>

        {/* CITY (DYNAMIC) */}
        <select
          className="form-select"
          style={{ width: 160 }}
          value={filters.cityId}
          onChange={(e) => setFilters({ ...filters, cityId: e.target.value })}
          disabled={!filters.stateId}
        >
          <option value="">City</option>
          {cities.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.name}
            </option>
          ))}
        </select>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          className="form-control"
          style={{ width: 150 }}
          value={filters.amount}
          onChange={(e) => setFilters({ ...filters, amount: e.target.value })}
        />

        {/* AMOUNT FILTER */}
        <select
          className="form-select"
          style={{ width: 150 }}
          value={filters.amountFilter}
          onChange={(e) =>
            setFilters({ ...filters, amountFilter: e.target.value })
          }
        >
          <option value="">Amount Filter</option>
          <option value="1">Less Than</option>
          <option value="2">Greater Than</option>
          <option value="3">Equal To</option>
        </select>

        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={rows}
        pagination
        highlightOnHover
        defaultSortFieldId={1}
        defaultSortAsc={false}
      />
    </div>
  );
}
