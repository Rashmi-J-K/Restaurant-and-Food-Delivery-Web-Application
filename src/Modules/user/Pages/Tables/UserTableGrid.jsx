import React, { useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import Table from './UserTable';
import UserTableModal from './TableModal';
import theme from '../../../../Theme/theme';
import moment from 'moment';
import { AuthContext } from '../../../GlobalContext';

const TableGrid = ({ reservation }) => {
    const { token, handleAuthModalOpen, tables, openuserTable, setOpenuserTable, setSelectedTable, acceptedreq } = useContext(AuthContext);

    // Parse reservation time as a timestamp
    const parseTime = (time, date) => {
        return moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').valueOf();
    };

    const getDisabledTables = () => {
        const reservationTime = parseTime(reservation.time, reservation.date);
        return acceptedreq
            .filter(req => {
                const reqTime = parseTime(req.reservation.time, req.reservation.date);
                const timeDifference = Math.abs(reqTime - reservationTime);
                const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
                // Check if the reservation is on the same date and within 1-hour range
                return req.reservation.date === reservation.date && timeDifference <= oneHourInMs;
            })
            .map(req => req.table._id); // Access the table ID directly from the object
    };
    

    const disabledTableIds = getDisabledTables();
    const onTableClick = (selectedTable) => {
        if (token) {
            setSelectedTable(selectedTable);
            setOpenuserTable(true);
        } else {
            handleAuthModalOpen();
        }
    };

    const handleClose = () => {
        setOpenuserTable(false);
        setSelectedTable(null);
    };

    return (
        <>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {tables?.length === 0 ? (
                    <Typography variant="h2" sx={{ color: "grey", pl: 4 }}>
                        No table found
                    </Typography>
                ) : (
                    tables?.map((table, index) => {
                        const createdDate = moment(table?.createdAt).format('ddd DD YYYY');
                        const isDisabled = disabledTableIds.includes(table._id);
                        return (
                            <Grid item xs={10} sm={3} md={3} lg={3} key={index}>
                                <Table
                                    name={table?.name}
                                    seats={table?.seats}
                                    theme={theme}
                                    onClick={() => !isDisabled && onTableClick(table)}
                                    createDate={createdDate}
                                    disabled={isDisabled}
                                />
                            </Grid>
                        );
                    })
                )}
            </Grid>
            <UserTableModal
                open={openuserTable}
                onClose={handleClose}
                reservation={reservation}
            />
        </>
    );
};

export default TableGrid;
