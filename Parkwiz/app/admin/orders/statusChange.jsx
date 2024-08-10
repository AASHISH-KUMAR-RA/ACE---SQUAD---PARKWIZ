// StatusSelector.js
import React, { useState } from "react";
import { Modal,ModalHeader,ModalBody,ModalFooter, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Text } from "@nextui-org/react";


const StatusSelector = ({ visible, onClose, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const statusOptions = [
    {name: "Booked", uid: "booked"},
    {name: "Used", uid: "used"},
    {name: "Expired", uid: "expired"},
  ];

  const handleStatusChange = () => {
    if (selectedStatus) {
      onUpdateStatus(selectedStatus);
      onClose();
    }
  };

  return (
    <Modal closeButton open={visible} onClose={onClose}>
      <ModalHeader>
        <Text h4>Select Status</Text>
      </ModalHeader>
      <ModalBody>
        <Dropdown>
          <DropdownTrigger>
            <Button flat size="sm">Select Status</Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Change Status"
            selectedKeys={selectedStatus ? [selectedStatus] : []}
            onSelectionChange={setSelectedStatus}
          >
            {statusOptions.map((status) => (
              <DropdownItem
                key={status.uid}
                className={`capitalize text-${status.color}`}
                color={status.color}
              >
                {status.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </ModalBody>
      <ModalFooter>
        <Button flat color="error" onClick={onClose}>Cancel</Button>
        <Button onClick={handleStatusChange}>Update Status</Button>
      </ModalFooter>
    </Modal>
  );
};

export default StatusSelector;
