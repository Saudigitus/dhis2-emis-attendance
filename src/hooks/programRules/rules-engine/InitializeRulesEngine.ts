import { useRecoilState } from "recoil"
import { FormattedPRulesType } from "../../../types/programRules/FormattedPRules"
import { useFormatProgramRules } from "../useFormatProgramRules"
import { getFunctionExpression, removeSpecialCharacters, replaceConditionVariables } from "./RulesEngine"
import { useFormatProgramRulesVariables } from "../useFormatProgramRulesVariables"
import { ProgramRulesFormatedState } from "../../../schema/programRulesFormated"

export const initializeRulesEngine = () => {
    const { programRules } = useFormatProgramRules()
    const { programRulesVariables } = useFormatProgramRulesVariables()
    const [newProgramRules, setnewProgramRules] = useRecoilState(ProgramRulesFormatedState)

    function initialize() {
        if (programRules?.length > 0 && Object.keys(programRulesVariables)?.length > 0 && newProgramRules?.length === 0) {
            const newProgramR: FormattedPRulesType[] = programRules
                .map((programRule: FormattedPRulesType) => {
                    return {
                        ...programRule,
                        functionName: getFunctionExpression(programRule.condition),
                        condition: replaceConditionVariables(removeSpecialCharacters(programRule?.condition), programRulesVariables),
                        data: replaceConditionVariables(removeSpecialCharacters(programRule?.data), programRulesVariables),
                    }
                })
            setnewProgramRules(newProgramR)
        }
    }

    return {
        initialize
    }

}