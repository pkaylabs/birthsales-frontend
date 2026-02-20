import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Paper,
  Skeleton,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  useAddVideoAdMutation,
  useDeleteVideoAdMutation,
  useGetVideoAdsQuery,
  useUpdateVideoAdMutation,
} from "@/redux/features/videoAds/videoAdsApi";
import type { VideoAd } from "@/redux/type";

const MAX_VIDEO_SECONDS = 5 * 60;

function formatDate(iso: unknown): string {
  const value = typeof iso === "string" ? iso : String(iso ?? "");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getApiErrorMessage(err: unknown): string {
  if (!err) return "Failed to fetch video ads";
  if (typeof err === "string") return err;

  if (typeof err === "object") {
    const maybe = err as { data?: unknown; error?: unknown; message?: unknown };

    if (typeof maybe.message === "string" && maybe.message.trim()) return maybe.message;

    if (typeof maybe.data === "string" && maybe.data.trim()) return maybe.data;

    if (typeof maybe.data === "object" && maybe.data !== null) {
      const dataObj = maybe.data as { message?: unknown; detail?: unknown };
      if (typeof dataObj.message === "string" && dataObj.message.trim()) return dataObj.message;
      if (typeof dataObj.detail === "string" && dataObj.detail.trim()) return dataObj.detail;
    }

    if (typeof maybe.error === "string" && maybe.error.trim()) return maybe.error;
  }

  return "Failed to fetch video ads";
}

async function getVideoDurationSeconds(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = Number(video.duration);
      cleanup();
      if (!Number.isFinite(duration)) reject(new Error("Invalid video duration"));
      else resolve(duration);
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("Failed to read video metadata"));
    };

    video.src = url;
  });
}

export default function VideoAdsPage() {
  const {
    data: videoAdsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetVideoAdsQuery();

  const videoAds = useMemo(
    () => (Array.isArray(videoAdsData) ? videoAdsData : []),
    [videoAdsData]
  );

  const [addVideoAd, { isLoading: adding }] = useAddVideoAdMutation();
  const [updateVideoAd, { isLoading: updating }] = useUpdateVideoAdMutation();
  const [deleteVideoAd] = useDeleteVideoAdMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VideoAd | null>(null);

  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [validatingVideo, setValidatingVideo] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewAd, setPreviewAd] = useState<VideoAd | null>(null);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return videoAds;
    return videoAds.filter(
      (v) =>
        String(v.title ?? "")
          .toLowerCase()
          .includes(term) || String(v.id).includes(term)
    );
  }, [videoAds, searchTerm]);

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const resetForm = () => {
    setTitle("");
    setIsActive(true);
    setVideoFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl("");
  };

  const openAdd = () => {
    setEditing(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (ad: VideoAd) => {
    setEditing(ad);
    setTitle(ad.title);
    setIsActive(Boolean(ad.is_active));
    setVideoFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl("");
    setDialogOpen(true);
  };

  const openPreview = (ad: VideoAd) => {
    setPreviewAd(ad);
    setPreviewOpen(true);
  };

  const onPickVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    setValidatingVideo(true);
    try {
      const duration = await getVideoDurationSeconds(file);
      if (duration > MAX_VIDEO_SECONDS) {
        setToastSeverity("error");
        setToastMessage("Video must be 5 minutes or less");
        setToastOpen(true);
        e.target.value = "";
        return;
      }

      setVideoFile(file);
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(URL.createObjectURL(file));
    } catch {
      setToastSeverity("error");
      setToastMessage("Could not validate video duration");
      setToastOpen(true);
      e.target.value = "";
    } finally {
      setValidatingVideo(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateVideoAd({
          id: editing.id,
          title,
          is_active: isActive,
        }).unwrap();
        setToastMessage("Video ad updated successfully");
      } else {
        if (!videoFile) {
          setToastSeverity("error");
          setToastMessage("Please select a video file");
          setToastOpen(true);
          return;
        }

        await addVideoAd({
          title,
          is_active: isActive,
          video: videoFile,
        }).unwrap();
        setToastMessage("Video ad created successfully");
      }

      setToastSeverity("success");
      setDialogOpen(false);
      setEditing(null);
      resetForm();
      refetch();
    } catch (err: unknown) {
      setToastSeverity("error");
      setToastMessage(getApiErrorMessage(err) || "Failed to save video ad");
    } finally {
      setToastOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteVideoAd(id).unwrap();
      setToastSeverity("success");
      setToastMessage("Video ad deleted");
      refetch();
    } catch (err: unknown) {
      setToastSeverity("error");
      setToastMessage(getApiErrorMessage(err) || "Delete failed");
    } finally {
      setDeletingId(null);
      setToastOpen(true);
    }
  };

  useEffect(() => {
    if (!isError || !error) return;

    const message = getApiErrorMessage(error);

    setToastSeverity("error");
    setToastMessage(message);
    setToastOpen(true);
  }, [isError, error]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  if (isLoading) {
    return (
      <Box p={6}>
        <Box mb={2} display="flex" gap={2}>
          {[1, 2].map((i) => (
            <Skeleton variant="rectangular" width="100%" height={80} key={i} />
          ))}
        </Box>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Video Ads</Typography>
        <Button variant="contained" onClick={openAdd}>
          Add Video Ad
        </Button>
      </Box>

      <Box mb={2} display="flex" gap={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Search video ads…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 320 }}
        />
        <Button variant="outlined" onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </Button>
      </Box>

      {isFetching && <LinearProgress sx={{ mb: 2 }} />}

      {!filtered || filtered.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={8}
          m={4}
          borderRadius={2}
          boxShadow={3}
          bgcolor="background.paper"
        >
          <Typography variant="h6" gutterBottom>
            No Video Ads Found
          </Typography>
          <Typography color="text.secondary" mb={2}>
            There are no video ads to display right now.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>{ad.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(ad.created_at)}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openPreview(ad)}>
                      Preview
                    </Button>
                    <Button size="small" onClick={() => openEdit(ad)}>
                      Edit
                    </Button>
                    {deletingId === ad.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Button color="error" onClick={() => handleDelete(ad.id)}>
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit Video Ad" : "Add Video Ad"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Active"
            />

            {!editing && (
              <Box>
                <Button variant="outlined" component="label" disabled={validatingVideo}>
                  {validatingVideo ? "Validating…" : "Choose Video"}
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={onPickVideo}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Max duration: 5 minutes
                </Typography>
                {videoFile && (
                  <Typography variant="body2" mt={1}>
                    Selected: {videoFile.name}
                  </Typography>
                )}
                {videoPreviewUrl && (
                  <Box mt={2}>
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full max-h-80"
                    />
                  </Box>
                )}
              </Box>
            )}

            {editing && (
              <Typography variant="body2" color="text.secondary">
                Video file cannot be replaced from this screen.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              adding ||
              updating ||
              validatingVideo ||
              !title.trim() ||
              (!editing && !videoFile)
            }
          >
            {adding || updating ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{previewAd?.title || "Preview"}</DialogTitle>
        <DialogContent>
          {previewAd?.video ? (
            <video
              src={previewAd.video}
              controls
              className="w-full max-h-[520px]"
            />
          ) : (
            <Typography color="text.secondary">No video URL available.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
