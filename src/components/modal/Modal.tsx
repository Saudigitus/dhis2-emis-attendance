import React from "react";
import styles from "./modal.module.css";
import { ModalProps } from "../../types/modal/ModalTypes";
import { Modal, ModalTitle, ModalContent } from "@dhis2/ui";
import { useRecoilValue } from "recoil";
import { ProgressState } from "../../schema/linearProgress";


function ModalComponent(props: ModalProps): React.ReactElement {
  const { title, children, setOpen } = props
  const updateProgress = useRecoilValue(ProgressState)

  return (
    <Modal
      className={styles.modalContainer}
      open={open}
      position={"middle"}
      onClose={() => {
        setOpen(false);
      }}
    >
      {updateProgress.progress == null && <ModalTitle>{title}</ModalTitle>}
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}

export default ModalComponent;
