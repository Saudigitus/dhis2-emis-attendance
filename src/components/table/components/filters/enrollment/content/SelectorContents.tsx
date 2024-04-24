import React from 'react'
import { Button } from '@dhis2/ui';
import FilterComponents from '../../fields/FilterComponents';
import { makeStyles, createStyles, type Theme } from '@material-ui/core/styles';
import { SelectorContentsProps } from '../../../../../../types/table/ContentFiltersTypes';
import { TableDataLoadingState } from '../../../../../../schema/tableDataLoadingSchema';
import { useRecoilValue } from 'recoil';

const getStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonsContainer: {
            paddingTop: theme.typography.pxToRem(8)
        },
        buttonContainer: {
            paddingRight: theme.typography.pxToRem(8),
            display: 'inline-block'
        }
    })
);


function SelectorContents(props: SelectorContentsProps) {
    const { onClose, disabledReset, colum, onQuerySubmit, disabled: disabledUpdate, value, filled } = props;
    const loading = useRecoilValue(TableDataLoadingState)
    const classes = getStyles()

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter" && !(disabledUpdate || !value?.replace(/\s/g, '').length || loading)) {
            onQuerySubmit();
        }
    };

    return (
        <form onKeyDown={handleKeyDown}>
            <FilterComponents
                {...props}
                column={colum}
                type={colum.valueType}
                options={colum.options}
            />
            <div
                className={classes.buttonsContainer}
            >
                <div
                    className={classes.buttonContainer}
                >
                    <Button
                        primary
                        onClick={onQuerySubmit}
                        disabled={disabledUpdate || !value?.replace(/\s/g, '').length || loading}
                    >
                        {('Update')}
                    </Button>
                </div>
                <div
                    className={classes.buttonContainer}
                >
                    <Button
                        dataTest="list-view-filter-cancel-button"
                        secondary
                        onClick={onClose}
                        disabled={disabledReset || !filled || loading}

                    >
                        {('Restore')}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default SelectorContents
