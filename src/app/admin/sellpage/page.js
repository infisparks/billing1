"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { ref, get, update } from "firebase/database";
import {
  Spinner,
  Alert,
  Table,
  Button,
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import { Search, TrashFill, Download } from "react-bootstrap-icons";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

/**
 * SalesListPage
 *
 * Displays a comprehensive list of all sales transactions.
 * Shows total sales amount, total number of sales, and top customer.
 * Includes search, date range filtering, and "Today" filter functionalities.
 * Allows deletion of sales with corresponding inventory updates.
 * Features an Export to Excel option.
 * Designed with a professional and responsive UI.
 */
const SalesListPage = () => {
  // State variables
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // State for summaries
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalNumberOfSales, setTotalNumberOfSales] = useState(0);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  // State for "Today" filter
  const [isTodayFilterActive, setIsTodayFilterActive] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for deletion feedback
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  //--------------------------------------------------
  // 1. Fetch Sales Data
  //--------------------------------------------------
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesRef = ref(db, "sales");
        const snapshot = await get(salesRef);
        if (snapshot.exists()) {
          const salesData = snapshot.val();
          const salesList = Object.entries(salesData).map(
            ([saleId, saleObj]) => ({
              saleId,
              ...saleObj,
            })
          );
          setSales(salesList);
        } else {
          setSales([]);
        }
        setLoadingSales(false);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setFetchError("Failed to load sales data. Please try again later.");
        setLoadingSales(false);
      }
    };

    fetchSales();
  }, []);

  //--------------------------------------------------
  // 2. Fetch Products Data (for productPrice)
  //--------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const vendorsRef = ref(db, "vendors");
        const snapshot = await get(vendorsRef);
        if (snapshot.exists()) {
          const vendorsData = snapshot.val();
          const productsArray = [];

          // Gather all products from all vendors
          Object.entries(vendorsData).forEach(([vendorId, vendorObj]) => {
            if (vendorObj.products) {
              Object.entries(vendorObj.products).forEach(
                ([productId, productObj]) => {
                  productsArray.push({
                    vendorId, // Needed for matching
                    productId,
                    name: productObj.name,
                    mrpPrice: productObj.mrpPrice,
                    productPrice: productObj.productPrice || 0, // Assuming productPrice is stored
                    quantityAvailable: productObj.quantity || 0, // Assuming quantity is stored
                  });
                }
              );
            }
          });

          setProducts(productsArray);
        } else {
          setProducts([]);
        }
        setLoadingProducts(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setFetchError("Failed to load products data. Please try again later.");
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  //--------------------------------------------------
  // 3. Calculate Summaries
  //--------------------------------------------------
  useEffect(() => {
    if (!loadingSales && !loadingProducts && sales.length > 0) {
      let totalAmount = 0;

      sales.forEach((sale) => {
        Object.values(sale.products).forEach((product) => {
          totalAmount += product.totalPrice;
        });
      });

      setTotalSalesAmount(totalAmount);
      setTotalNumberOfSales(sales.length);
    } else {
      setTotalSalesAmount(0);
      setTotalNumberOfSales(0);
    }
  }, [loadingSales, loadingProducts, sales]);

  //--------------------------------------------------
  // 4. Handle Search and Filters
  //--------------------------------------------------
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
    setIsTodayFilterActive(false); // Reset "Today" filter when searching
    setDateRange({ from: "", to: "" }); // Reset date range
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter
    setIsTodayFilterActive(false); // Reset "Today" filter when selecting date range
  };

  // Handle "Today" filter
  const handleTodayFilter = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setDateRange({ from: today, to: today });
    setIsTodayFilterActive(true);
    setCurrentPage(1); // Reset to first page on filter
    setSearchQuery(""); // Reset search query
  };

  // Handle "Clear Filters"
  const handleClearFilters = () => {
    setSearchQuery("");
    setDateRange({ from: "", to: "" });
    setIsTodayFilterActive(false);
    setCurrentPage(1);
  };

  // Filter sales based on search and date range
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const saleDate = dayjs(sale.date);

    const matchesFromDate = dateRange.from
      ? saleDate.isAfter(dayjs(dateRange.from).subtract(1, "day"))
      : true;
    const matchesToDate = dateRange.to
      ? saleDate.isBefore(dayjs(dateRange.to).add(1, "day"))
      : true;

    return matchesSearch && matchesFromDate && matchesToDate;
  });

  //--------------------------------------------------
  // 5. Pagination Calculations
  //--------------------------------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  //--------------------------------------------------
  // 6. Handle Delete Functionality
  //--------------------------------------------------
  const handleDeleteClick = async (sale) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the sale for ${sale.customerName}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    const saleId = sale.saleId;

    // Prepare updates object
    const updates = {};

    // Iterate through each product in the sale to restore quantities and remove sellhistory
    Object.values(sale.products).forEach((product) => {
      const { vendorId, productId, quantity } = product;

      // Restore the sold quantity
      const productQuantityPath = `vendors/${vendorId}/products/${productId}/quantity`;
      const currentQuantity = products.find(
        (p) => p.productId === productId && p.vendorId === vendorId
      )?.quantityAvailable || 0;
      updates[productQuantityPath] = currentQuantity + quantity;

      // Remove the sellhistory entry associated with this sale
      const sellHistoryPath = `vendors/${vendorId}/products/${productId}/sellhistory/${saleId}`;
      updates[sellHistoryPath] = null;
    });

    // Remove the sale entry
    updates[`sales/${saleId}`] = null;

    try {
      await update(ref(db), updates);

      // Update local state to remove the deleted sale
      setSales((prevSales) =>
        prevSales.filter((currentSale) => currentSale.saleId !== saleId)
      );

      // Update summaries
      setTotalNumberOfSales((prev) => prev - 1);
      setTotalSalesAmount((prev) =>
        prev - Object.values(sale.products).reduce(
          (acc, product) => acc + product.totalPrice,
          0
        )
      );

      // Update products state to reflect restored quantities
      const updatedProducts = products.map((product) => {
        const matchedSaleProduct = Object.values(sale.products).find(
          (sp) =>
            sp.productId === product.productId &&
            sp.vendorId === product.vendorId
        );
        if (matchedSaleProduct) {
          return {
            ...product,
            quantityAvailable: product.quantityAvailable + matchedSaleProduct.quantity,
          };
        }
        return product;
      });
      setProducts(updatedProducts);

      setDeleteSuccess("Sale deleted successfully.");
      // Optionally, you can show a temporary success message
      setTimeout(() => {
        setDeleteSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting sale:", error);
      setDeleteError("Failed to delete sale. Please try again.");
      // Optionally, you can show a temporary error message
      setTimeout(() => {
        setDeleteError("");
      }, 5000);
    }
  };

  //--------------------------------------------------
  // 7. Handle Export to Excel
  //--------------------------------------------------
  const handleExportToExcel = () => {
    if (filteredSales.length === 0) {
      alert("No sales data available to export.");
      return;
    }

    // Prepare data for Excel
    const excelData = filteredSales.map((sale, index) => {
      const saleDate = dayjs(sale.date).format("DD MMM YYYY, h:mm A");
      const productsSold = Object.values(sale.products)
        .map(
          (product) =>
            `${product.productName} (Qty: ${product.quantity}, MRP: ₹${product.mrpPrice.toLocaleString()}, Total: ₹${product.totalPrice.toLocaleString()})`
        )
        .join("\n");

      const saleTotalAmount = Object.values(sale.products).reduce(
        (acc, product) => acc + product.totalPrice,
        0
      );

      return {
        "S.No": indexOfFirstItem + index + 1,
        "Customer Name": sale.customerName,
        "Customer Number": sale.customerNumber,
        Date: saleDate,
        "Products Sold": productsSold,
        "Total Amount (₹)": saleTotalAmount,
      };
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create blob and trigger download
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Sales_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  //--------------------------------------------------
  // 8. Render Loading and Error States
  //--------------------------------------------------
  if (loadingSales || loadingProducts) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading data...</span>
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{fetchError}</Alert>
      </Container>
    );
  }

  //--------------------------------------------------
  // 9. Render Sales List and Summaries
  //--------------------------------------------------
  return (
    <Container className="mt-5 mb-5">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 text-center">Sales Overview</h1>
          <p className="text-center text-muted">
            View and manage all sales transactions.
          </p>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={6} lg={4} className="mb-3">
          <Card className="text-white bg-primary shadow-sm">
            <Card.Body>
              <Card.Title>Total Sales Amount</Card.Title>
              <Card.Text style={{ fontSize: "1.5rem", color: "white" }}>
                ₹{totalSalesAmount.toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-3">
          <Card className="text-white bg-info shadow-sm">
            <Card.Body>
              <Card.Title>Total Number of Sales</Card.Title>
              <Card.Text style={{ fontSize: "1.5rem", color: "white" }}>
                {totalNumberOfSales}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-3">
          <Card className="text-white bg-warning shadow-sm">
            <Card.Body>
              <Card.Title>Top Customer</Card.Title>
              <Card.Text style={{ fontSize: "1.5rem", color: "white" }}>
                {/* Calculate top customer */}
                {(() => {
                  if (sales.length === 0) return "N/A";
                  const customerMap = {};
                  sales.forEach((sale) => {
                    if (customerMap[sale.customerName]) {
                      customerMap[sale.customerName] += 1;
                    } else {
                      customerMap[sale.customerName] = 1;
                    }
                  });
                  const topCustomer = Object.entries(customerMap).reduce(
                    (prev, current) =>
                      current[1] > prev[1] ? current : prev,
                    ["N/A", 0]
                  );
                  return topCustomer[0];
                })()}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row className="mb-3">
        <Col md={6} className="mb-2 mb-md-0">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by Customer Name..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search Sales by Customer Name"
            />
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={6}>
          <Row>
            <Col md={4} className="mb-2 mb-md-0">
              <Form.Control
                type="date"
                name="from"
                value={dateRange.from}
                onChange={handleDateChange}
                placeholder="From Date"
                aria-label="From Date"
              />
            </Col>
            <Col md={4} className="mb-2 mb-md-0">
              <Form.Control
                type="date"
                name="to"
                value={dateRange.to}
                onChange={handleDateChange}
                placeholder="To Date"
                aria-label="To Date"
              />
            </Col>
            <Col
              md={4}
              className="d-flex justify-content-start justify-content-md-end"
            >
              <Button
                variant={isTodayFilterActive ? "success" : "outline-success"}
                className="me-2"
                onClick={handleTodayFilter}
                aria-label="Filter Today Sales"
              >
                Today
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleClearFilters}
                aria-label="Clear All Filters"
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-end">
          <Button
            variant="outline-primary"
            onClick={handleExportToExcel}
            aria-label="Export Sales to Excel"
          >
            <Download className="me-2" />
            Export to Excel
          </Button>
        </Col>
      </Row>

      {/* Deletion Feedback */}
      {deleteError && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{deleteError}</Alert>
          </Col>
        </Row>
      )}
      {deleteSuccess && (
        <Row className="mb-3">
          <Col>
            <Alert variant="success">{deleteSuccess}</Alert>
          </Col>
        </Row>
      )}

      {/* Sales Table */}
      {filteredSales.length === 0 ? (
        <Alert variant="warning" className="text-center">
          No sales found matching your criteria.
        </Alert>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className="shadow-sm"
            style={{ backgroundColor: "#ffffff" }}
          >
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Customer Number</th>
                <th>Date</th>
                <th>Products Sold</th>
                <th>Total Amount (₹)</th>
                <th>Action</th> {/* Delete Column */}
              </tr>
            </thead>
            <tbody>
              {currentSales.map((sale, index) => {
                // Calculate total amount for each sale
                let saleTotalAmount = 0;

                Object.values(sale.products).forEach((product) => {
                  saleTotalAmount += product.totalPrice;
                });

                return (
                  <tr key={sale.saleId}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{sale.customerName}</td>
                    <td>{sale.customerNumber}</td>
                    <td>
                      {dayjs(sale.date).format("DD MMM YYYY, h:mm A")}
                    </td>
                    <td>
                      <ul className="list-unstyled mb-0">
                        {Object.values(sale.products).map((product) => (
                          <li
                            key={product.productId + product.vendorId}
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            <strong>{product.productName}</strong> - Quantity:{" "}
                            {product.quantity} | MRP: ₹
                            {product.mrpPrice.toLocaleString()} | Total: ₹
                            {product.totalPrice.toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>₹{saleTotalAmount.toLocaleString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(sale)}
                        title="Delete Sale"
                        aria-label={`Delete sale for ${sale.customerName}`}
                      >
                        <TrashFill />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="justify-content-center">
              <Pagination>{paginationItems}</Pagination>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default SalesListPage;
