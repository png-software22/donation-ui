import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import api from "../../../api/api";
import Loader from "../../../Loader/Loader";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import { fetchStates, fetchCities } from "../../../api/stateService";
import "./DonationReport.css";

let toastLock = false;

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

  const debounceRef = useRef(null);

  const formatDate = (val) => {
    if (!val) return undefined;
    const [y, m, d] = val.split("-");
    return `${d}-${m}-${y}`;
  };

  const validateFilters = () => {
    if (filters.to && !filters.from) {
      toast.error("Please select From date first");
      return false;
    }

    if (filters.from && filters.to) {
      if (new Date(filters.from) > new Date(filters.to)) {
        toast.error("From date cannot be greater than To date");
        return false;
      }
    }

    if (filters.cityId && !filters.stateId) {
      toast.error("Please select State first");
      return false;
    }

    if (filters.amountFilter && !filters.amount) {
      toast.error("Please enter amount");
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
          startDate: formatDate(filters.from),
          endDate: formatDate(filters.to),
          amount: filters.amount || undefined,
          amountFilter: filters.amountFilter || undefined,
          page: 1,
          pageSize: 500,
        },
      })
      .then((res) => setRows(res.data.data || []))
      .catch(() => {
        toast.error("Failed to load report");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStates()
      .then((res) => setStates(res.data))
      .catch(() => toast.error("something went wrong"));
  }, []);

  useEffect(() => {
    if (filters.stateId) {
      fetchCities(filters.stateId)
        .then((res) => setCities(res.data))
        .catch(() => toast.error("something went wrong"));
    } else {
      setCities([]);
    }
  }, [filters.stateId]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchDonations, 500);
    return () => clearTimeout(debounceRef.current);
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
      name: "Donation Date",
      selector: (row) => moment(row.donationDate).format("DD/MM/YYYY hh:mm A"),
      sortable: true,
      width: "190px",
    },
    {
      name: "Donor Name",
      selector: (row) =>
        `${row.donorFirstName || "-"} ${row.donorLastName || ""}`,
      width: "180px",
    },
    {
      name: "Mobile",
      selector: (row) => row.donorPhoneNumber || "-",
      width: "140px",
    },
    {
      name: "Address",
      selector: (row) =>
        `${row.donorStreetAddress || ""}, ${row?.city?.name || ""}, ${
          row?.state?.name || ""
        }`,
      wrap: true,
      width: "320px",
    },
    {
      name: "Method",
      selector: (row) => row.method,
      width: "120px",
    },
    {
      name: "Amount (₹)",
      selector: (row) => row.amount,
      width: "130px",
    },
  ];

  return (
    <div className="p-4">
      <ToastContainer />
      {loading && <Loader />}

      <h2 className="fw-bold mb-3">Donation Reports</h2>

      {/* FILTER BAR */}
      <div className="report-filters">
        <div className="filter-item">
          <label>From Date</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </div>

        <div className="filter-item">
          <label>To Date</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>

        <div className="filter-item">
          <label>Method</label>
          <select
            value={filters.method}
            onChange={(e) => setFilters({ ...filters, method: e.target.value })}
          >
            <option value="">All</option>
            <option value="CASH">Cash</option>
            <option value="ONLINE">Online</option>
            <option value="CHEQUE">Cheque</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div className="filter-item">
          <label>State</label>
          <select
            value={filters.stateId}
            onChange={(e) =>
              setFilters({
                ...filters,
                stateId: e.target.value,
                cityId: "",
              })
            }
          >
            <option value="">All</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>City</label>
          <select
            value={filters.cityId}
            disabled={!filters.stateId}
            onChange={(e) => setFilters({ ...filters, cityId: e.target.value })}
          >
            <option value="">All</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔥 SINGLE AMOUNT BOX */}
        <div className="filter-item">
          <label>Amount</label>
          <div className="amount-box">
            <select
              value={filters.amountFilter}
              onChange={(e) =>
                setFilters({ ...filters, amountFilter: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="lt">&lt;</option>
              <option value="gt">&gt;</option>
              <option value="eq">=</option>
            </select>

            <input
              type="number"
              placeholder="Enter amount"
              value={filters.amount}
              onChange={(e) =>
                setFilters({ ...filters, amount: e.target.value })
              }
            />
          </div>
        </div>

        <div className="filter-action">
          <button onClick={clearFilters}>Clear</button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        pagination
        highlightOnHover
        defaultSortAsc={false}
      />
    </div>
  );
}
