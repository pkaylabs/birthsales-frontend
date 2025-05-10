import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export interface TablesProps {
  payment_id: string;
  customer_name: string;
  created_at: string;
  what_was_paid_for: string;
  amount: number;
  payment_method: string;
  status: string;
}



const Tables = ({ rows }: { rows: TablesProps[] }) => {
  return (
    <TableContainer component={Paper} className="">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="">Tracking ID</TableCell>
            <TableCell className="">Customer</TableCell>
            <TableCell className="">Reason</TableCell>
            <TableCell className="">Date</TableCell>
            <TableCell className="">Amount</TableCell>
            <TableCell className="">Payment method</TableCell>
            <TableCell className="">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.payment_id}>
              <TableCell>{row.payment_id}</TableCell>
              <TableCell>{row.customer_name}</TableCell>
              <TableCell>{row.what_was_paid_for}</TableCell>
              <TableCell>
                {row.created_at.split(".")[0].replace("T", " ")}
              </TableCell>
              <TableCell>GHC{row.amount}</TableCell>
              <TableCell>{row.payment_method}</TableCell>
              <TableCell>
                <span
                  className={`p-[5px] rounded-md ${
                    row.status === "Approved"
                      ? "text-green-300 bg-green-950"
                      : "text-yellow-300 bg-yellow-950"
                  }`}
                >
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tables;
