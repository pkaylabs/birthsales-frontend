import React, {  } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Badge,

} from "@mui/material";
import { FaCircleUser } from "react-icons/fa6";
import { RiUser3Line } from "react-icons/ri";
import { FiShoppingBag } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-location";
import logo from "@/assets/images/logo.jpg";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const Navbar: React.FC = () => {
  // const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);


  // const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElUser(event.currentTarget);
  // };

 
  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };

  const dropdownTabs = [
    {
      title: "Manage My Account",
      link: "/account",
      icon: RiUser3Line,
    },
    {
      title: "My Order",
      link: "#",
      icon: FiShoppingBag,
    },
    {
      title: "My Cancellations",
      link: "#",
      icon: MdOutlineCancel,
    },
    {
      title: "My Reviews",
      link: "#",
      icon: IoIosStarOutline,
    },
    {
      title: "Logout",
      link: "#",
      icon: BiLogOut,
    },
  ];

 

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          backgroundColor: "white",
          color: "black",
          fontFamily: "Poppins",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          <img
            src={logo}
            alt="picture"
            className="h-8 w-auto cursor-pointer rounded-md mr-5 flex items-center"
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontFamily: "Poppins",
            }}
          >
            BirthSales
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ fontFamily: "Poppins" }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/services"
            sx={{ fontFamily: "Poppins" }}
          >
            Services
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/about"
            sx={{ fontFamily: "Poppins" }}
          >
            About
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/sign-up"
            sx={{ fontFamily: "Poppins" }}
          >
            Signup
          </Button>
        </Box>

        {/* Cart & Wishlist */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={2} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" component={Link} to="/wish-list">
            <Badge badgeContent={5} color="secondary">
              <FavoriteIcon />
            </Badge>
          </IconButton>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-hidden">
                <span className="sr-only">Open options</span>
                <FaCircleUser
                  aria-hidden="true"
                  className="size-8 text-black/20 "
                />
              </MenuButton>
            </div>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-black/30 ring-1 shadow-lg ring-black/5 backdrop-blur-md transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                {dropdownTabs.map((tab, index) => (
                  <MenuItem key={index}>
                    <Link
                      to={tab.link}
                      className="flex items-center space-x-2.5 px-4 py-2 text-sm text-white data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden hover:bg-black/10"
                    >
                      <tab.icon className="size-6" />
                      <span className=" text-sm ">{tab.title}</span>
                    </Link>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;


{/* <Tooltip title="Open settings">
<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
</IconButton>
</Tooltip>
<Menu
sx={{ mt: "45px" }}
id="menu-appbar"
anchorEl={anchorElUser}
anchorOrigin={{
  vertical: "top",
  horizontal: "right",
}}
keepMounted
transformOrigin={{
  vertical: "top",
  horizontal: "right",
}}
open={Boolean(anchorElUser)}
onClose={handleCloseUserMenu}
>
{dropdownTabs.map((tab) => (
  <MenuItem key={tab.title} onClick={handleCloseUserMenu}>
    <ListItemIcon>
      <tab.icon style={{ fontSize: "1.2rem", color: "white" }} />
    </ListItemIcon>
    <ListItemText primary={tab.title} />
  </MenuItem>
))}
</Menu> */}
