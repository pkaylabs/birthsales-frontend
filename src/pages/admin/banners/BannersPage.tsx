import React, { ChangeEvent, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
  DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Banner,
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
  useUpdateBannerMutation,
} from "@/redux/features/banners/bannersApiSlice";
import { BASE_URL } from "@/constants";

export default function BannersPage() {
  const { data: banners = [], isLoading, isError } = useGetBannersQuery();
  const [addBanner, { isLoading: Adding }] = useAddBannerMutation();
  const [updateBanner, { isLoading: Updating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // local form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<{
    title: string;
    link: string;
    is_active: boolean;
    image: File | null;
    imagePreview: string | null;
  }>({
    title: "",
    image: null,
    link: "",
    is_active: false,
    imagePreview: "",
  });
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error";
  }>({ open: false, msg: "", sev: "success" });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        const objUrl = URL.createObjectURL(file);
        setForm((f) => ({ ...f, image: file, imagePreview: objUrl }));
        setUploading(false);
      }, 1000);
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm({
      title: "",
      image: null,
      link: "",
      is_active: true,
      imagePreview: "",
    });
    setDialogOpen(true);
  };
  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title,
      link: b.link,
      image: null,
      imagePreview: null,
      is_active: b.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const fd = new FormData();
    if (editing) fd.append("banner", String(editing.id));
    fd.append("title", form.title);
    fd.append("link", form.link);
    fd.append("is_active", String(form.is_active));
    if (form.image) {
      fd.append("image", form.image);
    }
    try {
      if (editing) {
        const res = await updateBanner(fd).unwrap();
        setToast({ open: true, msg: res.message, sev: "success" });
      } else {
        const res = await addBanner(fd).unwrap();
        setToast({ open: true, msg: res.message, sev: "success" });
      }
    } catch {
      setToast({
        open: true,
        msg: "Error Processing, make sure you pass correct data",
        sev: "error",
      });
    } finally {
      setDialogOpen(false);
    }
  };

  const requestDelete = (banner: Banner) => {
    setBannerToDelete(banner);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      const res = await deleteBanner(bannerToDelete.id).unwrap();
      setToast({
        open: true,
        msg: res.message,
        sev: "success",
      });
    } catch (err) {
      setToast({ open: true, msg: "Deletion failed", sev: "error" });
      console.log(err);
    } finally {
      setConfirmOpen(false);
      setBannerToDelete(null);
    }
  };

  if (isLoading) return <p>Loading banners…</p>;
  if (isError) return <p>Error loading banners</p>;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Manage Banners
      </Typography>
      <Button variant="contained" onClick={openNew} sx={{ mb: 2 }}>
        Add New Banner
      </Button>

      <Grid container spacing={2}>
        {banners.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Box
              sx={{
                border: 1,
                borderColor: "grey.300",
                borderRadius: 1,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={`${BASE_URL}${b.image}`}
                alt={b.title}
                style={{ width: "100%", height: 120, objectFit: "cover" }}
              />
              <Box p={1}>
                <Typography variant="subtitle1">{b.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {b.is_active ? "Active" : "Disabled"}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton size="medium" onClick={() => openEdit(b)}>
                  <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton size="medium" onClick={() => requestDelete(b)}>
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for add/edit */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit Banner" : "New Banner"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <TextField
            label="Link (URL)"
            fullWidth
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.is_active}
                onChange={(_, v) => setForm((f) => ({ ...f, is_active: v }))}
              />
            }
            label="Active"
          />

          <Button component="label" variant="outlined">
            {uploading ? "Uploading" : "Upload Image"}
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {uploading ? (
            <CircularProgress size={24} />
          ) : (
            form.imagePreview && (
              <Box
                component="img"
                src={form.imagePreview}
                alt="preview"
                sx={{
                  width: 120,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            )
          )}
        </DialogContent>
        <Box sx={{ p: 2, textAlign: "right" }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {Adding || Updating ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : editing ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the banner "{bannerToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.sev}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
