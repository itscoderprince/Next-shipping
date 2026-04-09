import React from "react";
import Link from "next/link";
import { MenuItem, ListItemIcon } from "@mui/material";
import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

// A reusable "Delete" menu item for DataTable row action menus.
export const DeleteAction = ({ handleDelete, row, deleteType }) => {
  return (
    <MenuItem
      key="delete"
      onClick={() => handleDelete([row.original._id], deleteType)}
    >
      <ListItemIcon sx={{ minWidth: "auto" }}>
        <Delete fontSize="small" />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
};

// A reusable "Edit" menu item for DataTable row action menus.
// Pass the `href` prop with the full edit page URL.
export const EditAction = ({ href }) => {
  return (
    <MenuItem key="edit">
      <Link href={href} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ListItemIcon sx={{ minWidth: "auto" }}>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        Edit
      </Link>
    </MenuItem>
  );
};
