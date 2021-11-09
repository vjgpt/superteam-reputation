import { Link } from "@mui/material";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const Navbar = () => {
    return (
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3} sx={{ paddingBlockStart: '30px', paddingRight: '20px'}}>
        <Button size='medium' startIcon variant="outlined" href="/">Leaderboard</Button>
        <Button size='medium' variant="outlined" href="/dashboard">Dashboard</Button>
        <Button size='medium' variant="outlined" href="/project/7c10df77534f43399203609b0d2ae5c2">Reputation</Button>
        <Button size='medium' endIcon variant="outlined" href="/project/d2c8414f2b014c32840f9aa80bce6d08">Mission 100k</Button>
      </Stack>
    );
};

export default Navbar;