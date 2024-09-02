import { useDataQuery } from "@dhis2/app-runtime";

const dataElementQuery: any = {
  dataElement: {
    resource: "dataElements",
    id: ({ dataElementID }: { dataElementID: string }) => dataElementID,
    params: {
      fields: "optionSet[options[code]]",
    },
  },
};

const useCheckIfAttendanceElement = () => {
  const { refetch } = useDataQuery(dataElementQuery, { lazy: true });

  const isAttendanceDataElement = async (dataElementID: string, code: string) => {
    try {
      const response: any = await refetch({ dataElementID });
      const options = response?.dataElement?.optionSet?.options || [];
      return options.map((op: { code: string }) => op.code).includes(code);
    } catch (err) {
      return false;
    }
  };
  return { isAttendanceDataElement };
};

export default useCheckIfAttendanceElement;
