import { ButtonProps } from "../../../../types/table/MultipleButtonsTypes";
import MultipleButtons from "./multipleButtom/MultipleButtons";
import SingleSelect from "./selectComponent/selectReason";

export default function ReasonOfAbsence(props: ButtonProps) {
    const {
        items,
        selectedTerm,
        setSelectedTerm,
        disabled
    } = props;

    return <>
        {
            items?.length > 3 ? <SingleSelect disabled={disabled ?? false} options={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
                : <MultipleButtons id="" disabled={disabled} items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
        }
    </>
}