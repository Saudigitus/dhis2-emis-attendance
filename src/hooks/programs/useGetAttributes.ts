import { useRecoilValue } from 'recoil'
import { formatResponseTEI } from '../../utils/tei/formatResponseAttributes'
import { ProgramConfigState } from '../../schema/programSchema';

function useGetAttributes() {
    const programConfiVariables = useRecoilValue(ProgramConfigState)

    return {
        attributes: formatResponseTEI(programConfiVariables)
    }
}
export { useGetAttributes }
