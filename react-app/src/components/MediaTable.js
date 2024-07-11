import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import style from '../styles/Table.module.css';

//Function to render a table of shows/movies, taking in a title, a list of items, 
//and a boolean whether to render an image to the left of the table.
function MediaTable(props) {
    let rows = props.list;
    return (
        <div className = {style.display}>
            <TableContainer component={Paper} sx={{ maxWidth: 500, maxHeight: 440, overflowX: "auto", scrollbarColor: '#888 transparent'}} className = {style.table}>
            <h3 className = {style.tableTitle}>{props.tableTitle}</h3>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="right">{props.media} Name</TableCell>
                    <TableCell align="right">Rating</TableCell>
                    <TableCell align="right">Genre</TableCell>
                    <TableCell align="right">Description</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row, idx) => (
                    <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{idx}</TableCell>
                    <TableCell align="right"> <a href = {row.link}>{row.name}</a></TableCell>
                    <TableCell align="right">{row.rating}</TableCell>
                    <TableCell align="right">{row.genre}</TableCell>
                    <TableCell align="right">{row.description}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
      );
}

export default MediaTable;