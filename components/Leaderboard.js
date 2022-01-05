import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import Avatar from '@mui/material/Avatar';
import TopRanking from "../components/TopRanking";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

function EnhancedTableHead(props) {
    const { uniqueSkills, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
    };

    const headCells = [
      {
          id: "id",
          numeric: false,
          disablePadding: true,
          label: "Name"
      },
      ];
    uniqueSkills.map(item => {
        headCells.push({
            id: item,
            numeric: true,
            disablePadding: false,
            label: item
            });
    });
    headCells.push({
        id: "total_points",
        numeric: true,
        disablePadding: false,
        label: "Total"
    });

    return (
    <TableHead >
        <TableRow >
        <TableCell padding="none" size="small">
        </TableCell>
        {headCells.map((headCell) => (
            <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            >
            <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
            >
                {headCell.label}
                {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
                ) : null}
            </TableSortLabel>
            </TableCell>
        ))}
        </TableRow>
    </TableHead>
    );
}
      
EnhancedTableHead.propTypes = {
onRequestSort: PropTypes.func.isRequired,
order: PropTypes.oneOf(["asc", "desc"]).isRequired,
orderBy: PropTypes.string.isRequired,
rowCount: PropTypes.number.isRequired,
uniqueSkills: PropTypes.array.isRequired,
};


export default function EnhancedTable({ children, ...props }) {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("total");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const rows = props.rows;
    const uniqueSkills = props.uniqueSkills;
  
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
      const styles = theme => ({
          tableRow: {
           hover: {
              backgroundColor: '#fc0000',
             }
          }
     });

    
  
    return (
      <>
        {/* <TopRanking /> */}
      <Container sx={{ width: "100%", }}>
          <TableContainer sx={{ marginLeft: "auto", marginRight: "auto",borderRadius: "20px 20px 0px 0px" }}>
            <Table
              sx={{
                minWidth: "100%",
              }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                uniqueSkills={uniqueSkills}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody >
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                   rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
  
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.id}
                        classes={styles.tableRow}
                      >
                      <TableCell padding="none" size="small">
                      <Avatar
                          sx={{
                            width: "35px",
                            height: "35px",
                            margin: "0px 0px 0px 15px",
                            borderRadius: "50%",
                            backgroundColor: "#BEAEE2",
                          }}
                          />
                      </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          key={row.id}
                          scope="row"
                          padding="normal"
                        >
                          {row.username}
                        </TableCell>
                        {uniqueSkills.map(item => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <TableCell align="right">
                                    {row[item]}
                                </TableCell>
                            )
                        })}
                        <TableCell align="right">{row.total_points}XP</TableCell>
                      </TableRow>
                    );
                  })}
                {/* {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={7} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ backgroundColor: "#BEAEE2",  borderRadius: "0px 0px 20px 20px" }}
          />
      </Container>
      </>
    );
  }
