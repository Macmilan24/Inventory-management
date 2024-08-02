"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
} from "firebase/firestore";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import { firestore } from "@/firebase";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [Uopen, setUOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const searchItems = async (searchTerm) => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const searchResults = [];
    docs.forEach((doc) => {
      const data = doc.data();
      const docIdIncludesTerm = doc.id.includes(searchTerm);
      const dataNameIncludesTerm = data.name && data.name.includes(searchTerm);

      if (searchTerm === "" || docIdIncludesTerm || dataNameIncludesTerm) {
        searchResults.push({ id: doc.id, ...data });
      }
    });
    setInventory(searchResults);
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ id: doc.id, ...doc.data() });
    });

    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docsnap = await getDoc(docRef);

    if (docsnap.exists()) {
      const { quantity } = docsnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else await setDoc(docRef, { quantity: quantity - 1 });
    }
    updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docsnap = await getDoc(docRef);

    if (docsnap.exists()) {
      const { quantity } = docsnap.data();
      setDoc(docRef, { quantity: quantity + 1 });
    } else {
      setDoc(docRef, { quantity: 1 });
    }
    updateInventory();
  };

  const updateItems = async (item, updateData) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    await setDoc(docRef, updateData, { merge: true });
    updateInventory();
  };

  const handleUpdate = () => {
    updateItems(selectedItem, { name: updatedName, quantity: updatedQuantity });
    setUpdatedName("");
    setUpdatedQuantity("");
    setUOpen(false);
  };

  useEffect(() => {
    searchItems("");
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUOpen = () => setUOpen(true);
  const handleUClose = () => setUOpen(false);

  const chartData = {
    labels: inventory.map((item) => item.id),
    datasets: [
      {
        label: "Quantity",
        data: inventory.map((item) => item.quantity),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        widht: "60%",
        height: "100px",
      },
    ],
  };

  return (
    <Box
      width="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        background: "rgb(0,42,255)",
        background:
          " radial-gradient(circle, rgba(0,42,255,1) 0%, rgba(4,15,111,1) 36%, rgba(1,4,33,1) 62%, rgba(0,0,0,1) 94%)",
      }}
    >
      <Typography variant="h2" color="white" align="left" m={4}>
        Inventory Management
      </Typography>

      <Box
        width="80%"
        height="80%"
        display="flex"
        flexDirection="column"
        alignItems="baseline"
        gap={2}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            searchItems(e.target.value);
          }}
          sx={{
            backgroundColor: "#fff",
            marginBottom: 2,
            borderRadius: "15px",
          }}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Box width="70%">
            <DataGrid
              rows={inventory}
              columns={[
                { field: "id", headerName: "Name", width: 150 },
                { field: "quantity", headerName: "Quantity", width: 150 },
                {
                  field: "actions",
                  headerName: "Actions",
                  width: 300,
                  renderCell: (params) => (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => {
                          removeItem(params.row.id);
                        }}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSelectedItem(params.row.id);
                          handleUOpen();
                        }}
                        sx={{ marginLeft: 2 }}
                      >
                        Update
                      </Button>
                    </>
                  ),
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              sx={{
                "& .MuiDataGrid-cell": {
                  color: "white",
                },
                "& .MuiDataGrid-columnHeaders": {
                  color: "#000",
                },
                "& .MuiDataGrid-footerContainer": {
                  color: "white",
                },
              }}
            />
          </Box>

          <IconButton
            color="primary"
            sx={{
              backgroundColor: "#007bff",
              color: "white",
              "&:hover": { backgroundColor: "#0056b3" },
              width: 60,
              height: 60,
            }}
            onClick={handleOpen}
          >
            <AddIcon fontSize="large" />
          </IconButton>
        </Box>

        <Bar width="80%" height="19px" data={chartData} />
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>

      <Modal open={Uopen} onClose={handleUClose}>
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Typography variant="h6">Update Item</Typography>
            <TextField
              variant="outlined"
              label="Name"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <TextField
              variant="outlined"
              label="Quantity"
              type="number"
              value={updatedQuantity}
              onChange={(e) => setUpdatedQuantity(e.target.value)}
            />
            <Button variant="outlined" onClick={handleUpdate}>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
