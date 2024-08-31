import React, { useState } from "react";
import { ImportContentProps } from "../../../types/modal/ModalTypes";
import { CloudUpload } from "@material-ui/icons";
import { DropzoneDialog } from "material-ui-dropzone";
import { createStyles, createTheme, makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { read } from "xlsx";
import { excelValidate } from "../../../utils/bulkImport/excelValidator";
import ModalComponent from "../Modal";
import ModalSummaryContent from "./ModalSummaryContent";

const useStyles = makeStyles(() => createStyles({
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  }
}));

const theme = createTheme({
  overrides: {},
});


function ImportContent(props: ImportContentProps): React.ReactElement {
  const { setOpen, open } = props;
  const [openErrorModal, setOpenErrorModal] = useState(false)
  const [errorDetails, setErrorDetails] = useState({})
  const classes = useStyles();

  const handleFileChange = (file: any) => {
    const reader: FileReader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const data: Uint8Array = new Uint8Array(e.target?.result as any);
      const workbook = read(data, {
        type: 'array',
        cellDates: true,
        cellNF: false,
        dateNF: "YYYY-MM-DD",
        cellText: true
      });

      const validation = excelValidate(workbook.SheetNames, workbook.Sheets)

      if (validation?.invalid) {
        setOpenErrorModal(true)
        setErrorDetails({ ...validation })
      }
    };

    reader.readAsArrayBuffer(file[0]);
  }

  return (
    <>
      {!openErrorModal ?
        <MuiThemeProvider theme={theme}>
          <DropzoneDialog
            dialogTitle={"Bulk Attendance"}
            submitButtonText={"Start Import"}
            dropzoneText={"Drag and drop a file here or Browse"}
            Icon={CloudUpload as any}
            filesLimit={1}
            showPreviews={false}
            showPreviewsInDropzone={true}
            previewGridProps={{
              container: {
                spacing: 1,
                direction: 'row'
              }
            }}
            previewChipProps={{ classes: { root: classes.previewChip } }}
            previewText="Selected file:"
            showFileNames={true}
            showFileNamesInPreview={true}
            acceptedFiles={[".xlsx"]}
            open={open}
            onClose={() => {
              setOpen(false)
            }}
            onSave={(file: any) => handleFileChange(file)}
            clearOnUnmount={true}
          />
        </MuiThemeProvider>
        : <ModalComponent title={`Bulk attendance summary`} open={openErrorModal} setOpen={setOpenErrorModal}>
          <ModalSummaryContent
            setOpen={setOpenErrorModal}
             summaryData={errorDetails}
          />
        </ModalComponent>}
    </>
  );
}

export default ImportContent;
