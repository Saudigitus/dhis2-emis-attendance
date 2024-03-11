import React from 'react'
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { RowCell, RowTable } from '../components';
import AttendanceViewMode from './AttendanceViewMode';
import AttendanceEditMode from './AttendanceEditMode';
import { RenderRowsProps } from '../../../types/table/TableContentTypes';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { VariablesTypes } from '../../../types/variables/AttributeColumns';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        row: { width: "100%" },
        dataRow: {
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#F1FBFF'
            }
        },
        cell: {
            padding: `${theme.spacing(1) / 2}px ${theme.spacing(1) * 7}px ${theme.spacing(1) /
                2}px ${theme.spacing(1) * 3}px`,
            '&:last-child': {
                paddingRight: theme.spacing(1) * 3
            },
            borderBottomColor: "rgba(224, 224, 224, 1)"
        },
        bodyCell: {
            fontSize: theme.typography.pxToRem(13),
            color: theme.palette.text.primary
        }
    })
);

function RenderRows(props: RenderRowsProps): React.ReactElement {
    const { headerData, rowsData, attendanceMode, setTableData } = props
    const classes = useStyles()

    if (rowsData.length === 0) {
        return (
            <RowTable
                className={classes.row}
            >
                <RowCell
                    className={classNames(classes.cell, classes.bodyCell)}
                    colspan={headerData?.filter(x => x.visible)?.length}
                >
                    {i18n.t('No data to display')}
                </RowCell>
            </RowTable>
        );
    }

    return (
        <React.Fragment>
            {
                rowsData.map((row, index) => {
                    const cells = headerData?.filter(x => (x.visible && x.type !== VariablesTypes.DataElement))?.map(column => (
                        <RowCell
                            key={column.id}
                            className={classNames(classes.cell, classes.bodyCell)}
                            cellClass={column?.class}
                        >
                            {attendanceMode === "view"
                                ? <AttendanceViewMode column={column} value={row[column.id]} />
                                : <AttendanceEditMode column={column} value={row} rowsData={rowsData} setTableData={setTableData} />
                            }
                        </RowCell>
                    ));

                    return (
                        <RowTable
                            key={index}
                            className={classNames(classes.row, classes.dataRow)}
                        >
                            {cells}
                        </RowTable>
                    );
                })
            }
        </React.Fragment>
    )
}

export default RenderRows
