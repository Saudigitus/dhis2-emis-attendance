import React from "react";
import { useParams } from "../../hooks";
import { Table, InfoPage } from "../../components";

function TableComponent() {
  const { urlParamiters } = useParams()
  const school = urlParamiters().school as unknown as string

  return (
    <>
      {(school !== null)
        ? <Table />
        : <InfoPage />
      }
    </>
  )
}

export default TableComponent;
