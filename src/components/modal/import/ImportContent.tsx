import React, { useState, useEffect } from "react";
import { ImportContentProps } from "../../../types/modal/ModalTypes";
import { CloudUpload } from "@material-ui/icons";
import { DropzoneDialog } from "material-ui-dropzone";
import { createStyles, createTheme, makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { read } from "xlsx";
import { excelValidate } from "../../../utils/bulkImport/excelValidator";
import ModalComponent from "../Modal";
import ModalSummaryContent from "./ModalSummaryContent";
import { getSheetData } from "../../../utils/bulkImport/generateEvents";
import { getSelectedKey } from "../../../utils/commons/dataStore/getSelectedKey";
import DropZone from "../../dropzone/DropZone";

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
  const [openSummaryModal, setOpenSummaryModal] = useState(false)
  const [errorDetails, setErrorDetails] = useState({})
  const [sheetData, setSheetData] = useState<{ attendanceEvents: any[], trackedEntityIds: { tei: string, enrollment: string }[], dateRange: { startDate: string, endDate: string } } | any>({})
  const classes = useStyles();
  const { getDataStoreData } = getSelectedKey()

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
      const allData = getSheetData(workbook.SheetNames.slice(0, -1), workbook.Sheets, getDataStoreData.program, getDataStoreData.attendance)
      setSheetData(allData)
      setOpenSummaryModal(true)
      setErrorDetails({ ...validation })
    };

    reader.readAsArrayBuffer(file[0]);
  }

  return (
    <>
      {!openSummaryModal ?
        <>
          {/* <MuiThemeProvider theme={theme}>
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
          </MuiThemeProvider> */}
          <ModalComponent title="Bulk Attendance" children={<DropZone onSave={handleFileChange}/>} open={open} setOpen={setOpen}/>

        </>
        : <ModalComponent title={`Bulk attendance summary`} open={openSummaryModal} setOpen={setOpenSummaryModal}>
          <ModalSummaryContent
            setOpen={setOpenSummaryModal}
            summaryData={errorDetails}
            sheetData={sheetData}
            setOpenDragNDrop={setOpen}
          />
        </ModalComponent>}
    </>
  );
}

export default ImportContent;
