import React, { useState, useEffect } from 'react';
import { useGetVendorProfileQuery, useUpdateVendorProfileMutation } from '@/redux/features/vendor/vendorApiSlice';
import {
  Box, Typography, TextField, Button, Grid, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { useAppSelector } from '@/redux';
import { RootState } from '@/app/store';
import { useNavigate } from 'react-location';

export default function VendorProfile() {
  const navigate = useNavigate();

  const user = useAppSelector((state: RootState) => state.auth.user);
  const isVendor = user?.user_type === 'VENDOR';
  
  // If not a vendor, redirect to dashboard
  useEffect(() => {
    if (!isVendor) {
      navigate({ to: '/' });
    }
  }, [isVendor, navigate]);

  const { data, isLoading } = useGetVendorProfileQuery(undefined, { skip: !isVendor });
  const [updateProfile, { isLoading: updating, isSuccess, isError }] = useUpdateVendorProfileMutation();
  const [form, setForm] = useState({
    vendor_name: '',
    vendor_email: '',
    vendor_phone: '',
    vendor_address: '',
  });
  const [toast, setToast] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (data) {
      setForm({
        vendor_name: data.vendor.vendor_name,
        vendor_email: data.vendor.vendor_email,
        vendor_phone: data.vendor.vendor_phone,
        vendor_address: data.vendor.vendor_address,
      });
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) setToast({ open: true, msg: 'Profile updated', severity: 'success' });
    if (isError) setToast({ open: true, msg: 'Update failed', severity: 'error' });
  }, [isSuccess, isError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(form);
  };

  if (!isVendor || isLoading) return <CircularProgress />;

  return (
    <Box maxWidth="md" mx="auto" p={4}>
      <Typography variant="h4" gutterBottom>Vendor Profile</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            name="vendor_name"
            label="Name"
            value={form.vendor_name}
            onChange={handleChange}
            fullWidth
            disabled={updating}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="vendor_email"
            label="Email"
            value={form.vendor_email}
            onChange={handleChange}
            fullWidth
            disabled={updating}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="vendor_phone"
            label="Phone"
            value={form.vendor_phone}
            onChange={handleChange}
            fullWidth
            disabled={updating}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="vendor_address"
            label="Address"
            value={form.vendor_address}
            onChange={handleChange}
            fullWidth
            disabled={updating}
          />
        </Grid>
      </Grid>
      <Box mt={4}>
        <Button variant="contained" onClick={handleSave} disabled={updating}>
          Save Changes
        </Button>
      </Box>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
