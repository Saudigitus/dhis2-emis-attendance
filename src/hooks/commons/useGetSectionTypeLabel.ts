import {formatCamelToTitleCase} from "../../utils/commons/formatCamelCaseToWords";
import {useParams} from "./useQueryParams";

const useGetSectionTypeLabel = () => {
    const {urlParamiters} = useParams()
    const sectionType = urlParamiters().sectionType;

    return {sectionName: sectionType === 'student' ? 'student\'s' : 'employee\'s'};
}

export default useGetSectionTypeLabel;
