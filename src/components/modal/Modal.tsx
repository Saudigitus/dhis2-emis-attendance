import React from "react";
import styles from "./modal.module.css";
import { ModalProps } from "../../types/modal/ModalTypes";
import { Modal, ModalTitle, ModalContent } from "@dhis2/ui";


function ModalComponent(props: ModalProps): React.ReactElement {
  const { title, children, setOpen} = props

  return (
    <Modal
      className={styles.modalContainer}
      open={open}
      position={"middle"}
      onClose={() => {
        setOpen(false);
      }}
    >
      <ModalTitle>{title}</ModalTitle>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}

export default ModalComponent;
