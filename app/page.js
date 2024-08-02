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
} from "@mui/material";
import { firestore } from "@/firebase";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [Uopen, setUOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
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
    setUOpen(false);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUOpen = () => setUOpen(true);
  const handleUClose = () => setUOpen(false);
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleUClose}>
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

      {/* update Modal */}
      <Modal open={Uopen} onClose={handleClose}>
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

      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>

      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Item
          </Typography>
        </Box>

        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              bgcolor="#f0f0f0f0"
              justifyContent="space-between"
              alignItems="center"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  removeItem(name);
                }}
              >
                Remove item
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedItem(name);
                  handleUOpen();
                }}
              >
                Update Item
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
