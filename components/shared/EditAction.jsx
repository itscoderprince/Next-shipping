import { MenuItem, ListItemIcon } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import React from "react";

// A reusable "Edit" menu item for DataTable row action menus.
// Pass the `href` prop with the full edit page URL.
const EditAction = ({ href }) => {
  return (
    <MenuItem>
      <Link href={href} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ListItemIcon sx={{ minWidth: "auto" }}>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        Edit
      </Link>
    </MenuItem>
  );
};

export default EditAction;
