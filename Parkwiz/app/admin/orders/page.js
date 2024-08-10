"use client";

import React, { useContext, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { FaSearch, FaChevronDown, FaEllipsisV } from "react-icons/fa";
import { capitalize } from "../data/utils";
import { DataContext } from "../../context/DataContext";
import axios from "axios";
import { useRouter } from "next/navigation";

const orderColumns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "SLOT NO", uid: "slotNo" },
  { name: "QUANTITY", uid: "quantity" },
  { name: "PRICE", uid: "price" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Booked", uid: "booked" },
  { name: "Used", uid: "used" },
  { name: "Expired", uid: "expired" },
];

const statusColorMap = {
  booked: "warning",
  expired: "danger",
  used: "success",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "status", "actions"];

export default function OrdersTable() {
  const { orders } = useContext(DataContext);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState(new Set());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const router = useRouter();

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`/api/order/${orderId}`);
        // Refresh orders list
        // Implement refresh logic if needed
      } catch (error) {
        console.error("Failed to delete order", error);
      }
    }
  };

  const deleteSelectedOrders = async () => {
    if (window.confirm("Are you sure you want to delete all selected orders?")) {
      try {
        for (const orderId of selectedKeys) {
          await axios.delete(`/api/order/${orderId}`);
        }
        setSelectedKeys(new Set([]));
        // Refresh orders list
        // Implement refresh logic if needed
      } catch (error) {
        console.error("Failed to delete selected orders", error);
      }
    }
  };

  const onStatusChange = async (selectedStatus) => {
    const status = selectedStatus;
    try {
      for (const orderId of selectedKeys) {
        await axios.put(`/api/order/${orderId}`, { status });
      }
      alert("Order updated successfully");
      setSelectedKeys(new Set([]));
      // Refresh orders list
      // Implement refresh logic if needed
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const pages = Math.ceil(orders.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return orderColumns;
    return orderColumns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredOrders = [...orders];
    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter.size > 0) {
      filteredOrders = filteredOrders.filter((order) =>
        statusFilter.has(order.status.toLowerCase())
      );
    }
    return filteredOrders;
  }, [orders, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (order, columnKey) => {
      const cellValue = order[columnKey];
      switch (columnKey) {
        case "name":
          return <span>{cellValue}</span>;
        case "status":
          return (
            <span className={`badge ${statusColorMap[cellValue]}`}>
              {capitalize(cellValue)}
            </span>
          );
        case "slotNo":
          return <span>{order.slotNos.join(", ")}</span>;
        case "price":
          return <span>${order.totalPrice.toFixed(2)}</span>;
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <FaEllipsisV className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => router.push(`/order/view/${order._id}`)}>View</DropdownItem>
                  <DropdownItem onClick={() => router.push(`/order/edit/${order._id}`)}>Edit</DropdownItem>
                  <DropdownItem onClick={() => deleteOrder(order._id)}>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [router]
  );

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{ base: "w-full sm:max-w-[44%]", inputWrapper: "border-1" }}
            placeholder="Search by name..."
            size="sm"
            startContent={<FaSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<FaChevronDown className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Order Status"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => setStatusFilter(new Set(keys))}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<FaChevronDown className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => setVisibleColumns(new Set(keys))}
              >
                {orderColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {selectedKeys.size > 0 && (
              <Button color="danger" size="sm" onPress={deleteSelectedOrders}>
                Delete ({selectedKeys.size})
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    selectedKeys,
    visibleColumns,
    deleteSelectedOrders,
    onSearchChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-default-400 text-small">Rows per page:</span>
          <select
            className="bg-transparent outline-none"
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
          >
            {[5, 10, 20, 50, 100].map((rows) => (
              <option key={rows} value={rows}>
                {rows}
              </option>
            ))}
          </select>
        </div>
        <Pagination
          isCompact
          page={page}
          size="sm"
          total={pages}
          onChange={setPage}
          showControls
          showShadow
        />
      </div>
    );
  }, [rowsPerPage, page, pages, onRowsPerPageChange]);

  return (
    <div className="w-full flex flex-col gap-4">
      {topContent}
      <Divider />
      <Table
        aria-label="Orders table"
        bottomContent={bottomContent}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
                                                       }
    
