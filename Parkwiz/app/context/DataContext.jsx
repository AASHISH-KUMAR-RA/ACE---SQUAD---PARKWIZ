// context/DataContext.js
"use client";
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prices, setPrices] = useState(0);
  const [quantities, setQuantities] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await axios.get("/api/user");
      setUsers(usersData.users);

      const { data: ordersData } = await axios.get("/api/order");
      setOrders(ordersData.orders);

      // Calculate prices and quantities
      let totalPrice = 0;
      let totalQuantity = 0;
      ordersData.orders.forEach(order => {
        totalPrice += order.totalPrice;
        totalQuantity += order.quantity;
      });

      setPrices(totalPrice);
      setQuantities(totalQuantity);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ users, orders, prices, quantities }}>
      {children}
    </DataContext.Provider>
  );
};
