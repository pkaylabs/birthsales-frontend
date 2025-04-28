// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { useNavigate } from "react-location";
// import { useServices } from "../utils/ServiceContext";
// import ShimmerTable from "../components/Shimmer";

// interface Service {
//   id?: number;
//   name: string;
//   description: string;
//   price: number | string;
//   image?: string;
//   bookings?: number;
//   provider: string;
//   category: string;
// }

// export default function ServicesPage() {
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const globalServices = useServices();

//   // Available categories consistent with the product page
//   const availableCategories = [
//     { id: 1, name: "Electronics" },
//     { id: 2, name: "Clothing" },
//     { id: 3, name: "Accessories" },
//     { id: 4, name: "Beauty" },
//     { id: 5, name: "Wellness" },
//   ];
//   // Available categories consistent with the product page
//   const availableServiceProviders = [
//     { id: 1, name: "Jamal" },
//     { id: 2, name: "Prince" },
//     { id: 3, name: "Isaac" },
//   ];

//   // Sample data for services
//   const [services, setServices] = useState<Service[]>(globalServices);

//   // State for adding a new service
//   const [newService, setNewService] = useState<Service>({
//     name: "",
//     description: "",
//     price: "",
//     image: "",
//     bookings: 0,
//     provider: "",
//     category: "", // Will be selected from dropdown
//   });
//   const [openAdd, setOpenAdd] = useState(false);

//   // State for editing a service
//   const [openEdit, setOpenEdit] = useState(false);
//   const [editService, setEditService] = useState<Service | null>(null);

//   const [searchTerm, setSearchTerm] = useState("");

//   // Upload state for adding service image
//   const [serviceImageUploading, setServiceImageUploading] = useState(false);
//   // Upload state for editing service image
//   const [editServiceImageUploading, setEditServiceImageUploading] =
//     useState(false);

//   // Handler for adding a new service image
//   const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files && e.target.files[0];
//     if (file) {
//       setServiceImageUploading(true);
//       setTimeout(() => {
//         setNewService((prev) => ({
//           ...prev,
//           image: URL.createObjectURL(file),
//         }));
//         setServiceImageUploading(false);
//       }, 1000);
//     }
//   };

//   // Handler for editing a service image
//   const handleEditServiceImageChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files && e.target.files[0];
//     if (file && editService) {
//       setEditServiceImageUploading(true);
//       setTimeout(() => {
//         setEditService({ ...editService, image: URL.createObjectURL(file) });
//         setEditServiceImageUploading(false);
//       }, 1000);
//     }
//   };

//   const handleAddService = () => {
//     const price = parseFloat(newService.price.toString()) || 0;
//     setServices([
//       ...services,
//       { ...newService, id: services.length + 1, price },
//     ]);
//     setOpenAdd(false);
//   };

//   const handleEditServiceSave = () => {
//     if (!editService) return;
//     const price = parseFloat(editService.price.toString()) || 0;

//     setServices(
//       services.map((s) =>
//         s.id === editService.id ? { ...editService, price } : s
//       )
//     );
//     setOpenEdit(false);
//     setEditService(null);
//   };

//   const handleDeleteService = (id: number | undefined) => {
//     setServices(services.filter((s) => s.id !== id));
//   };

//   const filteredServices = services.filter(
//     (service) =>
//       service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       service.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     setTimeout(()=>{
//       setLoading(false)
//     },1500)
//   },[])

//   return (
//     <div className="p-6 space-y-6">
//       {/* Dashboard Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent>Total Services: {services.length}</CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             Total Bookings:{" "}
//             {services.reduce((sum, s) => sum + (s.bookings ?? 0), 0)}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             Total Revenue: $
//             {/* {services.reduce((sum, s) => sum + s.bookings * s.price, 0)} */}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Service Management Area */}
//       <div className="bg-white shadow rounded p-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
//           <h2 className="text-xl font-bold mb-2 md:mb-0">Manage Services</h2>
//           <div className="flex gap-2 flex-wrap">
//             <TextField
//               variant="outlined"
//               size="small"
//               placeholder="Search services..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => setOpenAdd(true)}
//             >
//               Add New Service
//             </Button>
//           </div>

//           {/* Add New Service Dialog */}
//           <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
//             <DialogTitle>Add New Service</DialogTitle>
//             <DialogContent>
//               <TextField
//                 fullWidth
//                 margin="dense"
//                 label="Service Name"
//                 variant="outlined"
//                 onChange={(e) =>
//                   setNewService({ ...newService, name: e.target.value })
//                 }
//               />
//               <TextField
//                 fullWidth
//                 margin="dense"
//                 label="Description"
//                 variant="outlined"
//                 onChange={(e) =>
//                   setNewService({ ...newService, description: e.target.value })
//                 }
//               />
//               <TextField
//                 fullWidth
//                 margin="dense"
//                 label="Price"
//                 variant="outlined"
//                 type="number"
//                 onChange={(e) =>
//                   setNewService({ ...newService, price: e.target.value })
//                 }
//               />
//               {/* Provider Dropdown */}
//               <FormControl fullWidth margin="dense">
//                 <InputLabel id="service-provider-label">Provider</InputLabel>
//                 <Select
//                   labelId="service-provider-label"
//                   label="Provider"
//                   value={newService.provider || ""}
//                   onChange={(e) =>
//                     setNewService({ ...newService, provider: e.target.value })
//                   }
//                 >
//                   {availableServiceProviders.map((provider) => (
//                     <MenuItem key={provider.id} value={provider.name}>
//                       {provider.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               {/* Category Dropdown */}
//               <FormControl fullWidth margin="dense">
//                 <InputLabel id="service-category-label">Category</InputLabel>
//                 <Select
//                   labelId="service-category-label"
//                   label="Category"
//                   value={newService.category || ""}
//                   onChange={(e) =>
//                     setNewService({ ...newService, category: e.target.value })
//                   }
//                 >
//                   {availableCategories.map((cat) => (
//                     <MenuItem key={cat.id} value={cat.name}>
//                       {cat.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <div
//                 style={{
//                   marginTop: 16,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 16,
//                 }}
//               >
//                 <Button variant="contained" component="label">
//                   Upload Image
//                   <input
//                     hidden
//                     type="file"
//                     accept="image/*"
//                     onChange={handleServiceImageChange}
//                   />
//                 </Button>
//                 {serviceImageUploading ? (
//                   <CircularProgress size={24} />
//                 ) : newService.image ? (
//                   <img
//                     src={newService.image}
//                     alt="Service"
//                     width="50"
//                     height="50"
//                   />
//                 ) : null}
//               </div>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{ mt: 2, display: "block" }}
//                 onClick={handleAddService}
//               >
//                 Save
//               </Button>
//             </DialogContent>
//           </Dialog>

//           {/* Edit Service Dialog */}
//           <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
//             <DialogTitle>Edit Service</DialogTitle>
//             <DialogContent>
//               {editService && (
//                 <>
//                   <TextField
//                     fullWidth
//                     margin="dense"
//                     label="Service Name"
//                     variant="outlined"
//                     value={editService.name}
//                     onChange={(e) =>
//                       setEditService({ ...editService, name: e.target.value })
//                     }
//                   />
//                   <TextField
//                     fullWidth
//                     margin="dense"
//                     label="Description"
//                     variant="outlined"
//                     value={editService.description}
//                     onChange={(e) =>
//                       setEditService({
//                         ...editService,
//                         description: e.target.value,
//                       })
//                     }
//                   />
//                   <TextField
//                     fullWidth
//                     margin="dense"
//                     label="Price"
//                     variant="outlined"
//                     type="number"
//                     value={editService.price}
//                     onChange={(e) =>
//                       setEditService({ ...editService, price: e.target.value })
//                     }
//                   />

//                   <TextField
//                     fullWidth
//                     margin="dense"
//                     label="Provider"
//                     variant="outlined"
//                     value={editService.provider}
//                     onChange={(e) =>
//                       setEditService({
//                         ...editService,
//                         provider: e.target.value,
//                       })
//                     }
//                   />
//                   {/* Category Dropdown for Edit */}
//                   <FormControl fullWidth margin="dense">
//                     <InputLabel id="edit-service-category-label">
//                       Category
//                     </InputLabel>
//                     <Select
//                       labelId="edit-service-category-label"
//                       label="Category"
//                       value={editService.category || ""}
//                       onChange={(e) =>
//                         setEditService({
//                           ...editService,
//                           category: e.target.value,
//                         })
//                       }
//                     >
//                       {availableCategories.map((cat) => (
//                         <MenuItem key={cat.id} value={cat.name}>
//                           {cat.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <div
//                     style={{
//                       marginTop: 16,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 16,
//                     }}
//                   >
//                     <Button variant="contained" component="label">
//                       Upload Image
//                       <input
//                         hidden
//                         type="file"
//                         accept="image/*"
//                         onChange={handleEditServiceImageChange}
//                       />
//                     </Button>
//                     {editServiceImageUploading ? (
//                       <CircularProgress size={24} />
//                     ) : editService.image ? (
//                       <img
//                         src={editService.image}
//                         alt="Service"
//                         width="50"
//                         height="50"
//                       />
//                     ) : null}
//                   </div>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     sx={{ mt: 2, display: "block" }}
//                     onClick={handleEditServiceSave}
//                   >
//                     Save Changes
//                   </Button>
//                 </>
//               )}
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Services Table */}
//         {loading ? (
//           <ShimmerTable />
//         ) : (
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Service</TableCell>
//                   <TableCell>Description</TableCell>
//                   <TableCell>Price ($)</TableCell>

//                   <TableCell>Provider</TableCell>
//                   <TableCell>Category</TableCell>
//                   <TableCell>Bookings</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredServices.map((service) => (
//                   <TableRow key={service.id} className="">
//                     <TableCell
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       <img
//                         src={service.image}
//                         alt={service.name}
//                         style={{ marginRight: 10 }}
//                         className="w-[3rem] h-[3rem] rounded-full object-cover"
//                       />
//                       {service.name}
//                     </TableCell>
//                     <TableCell>{service.description}</TableCell>
//                     <TableCell>{service.price}</TableCell>

//                     <TableCell>{service.provider}</TableCell>
//                     <TableCell>{service.category}</TableCell>
//                     <TableCell>{service.bookings}</TableCell>
//                     <TableCell style={{}}>
//                       <Button
//                         color="primary"
//                         onClick={() =>
//                           navigate({ to: `/admin-services/${service.id}` })
//                         }
//                       >
//                         View
//                       </Button>
//                       <Button
//                         color="secondary"
//                         onClick={() => {
//                           setEditService(service);
//                           setOpenEdit(true);
//                         }}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         color="error"
//                         onClick={() => handleDeleteService(service.id)}
//                       >
//                         Delete
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </div>

//       {/* Service Bookings Analytics Chart */}
//       {/* <div className="bg-white shadow rounded p-4">
//         <h2 className="text-xl font-bold mb-4">Service Bookings</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={bookingsData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="bookings"
//               stroke="#3b82f6"
//               strokeWidth={2}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div> */}
//     </div>
//   );
// }

// src/pages/ServicesPage.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-location";
import {
  useGetServicesQuery,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  ServiceDto,
} from "@/redux/features/services/servicesApi";
import type { Service } from "@/redux/type";
import ShimmerTable from "../components/Shimmer";

export default function ServicesPage() {
  const navigate = useNavigate();
  const { data: services = [], isLoading, isFetching, refetch } = useGetServicesQuery();
  const [addService] = useAddServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  // Local state for dialogs & form
  const [openAdd, setOpenAdd] = useState(false);
  const [newService, setNewService] = useState<ServiceDto>({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    provider: 0,
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const availableCategories = ["Electronics", "Clothing", "Accessories", "Beauty", "Wellness"];
  const availableProviders = services.map(s => s.provider).filter((v, i, a) => a.indexOf(v) === i);

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(s.provider).toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleAdd = async () => {
    await addService(newService).unwrap();
    setOpenAdd(false);
    refetch();
  };

  const handleEditSave = async () => {
    if (editService) {
      await updateService(editService).unwrap();
      setOpenEdit(false);
      setEditService(null);
      refetch();
    }
  };

  const handleDelete = async (id?: number) => {
    if (id) await deleteService(id).unwrap();
    refetch();
  };

  if (isLoading) return <ShimmerTable />;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent>Total Services: {services.length}</CardContent></Card>
        <Card><CardContent>Total Bookings: {services.reduce((sum, s) => sum + (s.bookings || 0), 0)}</CardContent></Card>
        <Card><CardContent>Total Revenue: $0</CardContent></Card>
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between mb-4">
          <TextField
            size="small"
            placeholder="Search…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" onClick={() => setOpenAdd(true)}>Add Service</Button>
        </div>

        {/* Add Dialog */}
        <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
          <DialogTitle>Add Service</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Name" onChange={e => setNewService({ ...newService, name: e.target.value })} />
            <TextField fullWidth label="Description" onChange={e => setNewService({ ...newService, description: e.target.value })} />
            <TextField fullWidth label="Price" type="number" onChange={e => setNewService({ ...newService, price: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}>
                {availableCategories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select value={newService.provider} onChange={e => setNewService({ ...newService, provider: Number(e.target.value) })}>
                {availableProviders.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
            <Button onClick={handleAdd} variant="contained" sx={{ mt: 2 }}>Save</Button>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogContent>
            {editService && (
              <>
                <TextField fullWidth label="Name" value={editService.name} onChange={e => setEditService({ ...editService, name: e.target.value })} />
                <TextField fullWidth label="Description" value={editService.description} onChange={e => setEditService({ ...editService, description: e.target.value })} />
                <TextField fullWidth label="Price" type="number" value={editService.price} onChange={e => setEditService({ ...editService, price: e.target.value })} />
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={editService.category} onChange={e => setEditService({ ...editService, category: e.target.value })}>
                    {availableCategories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Provider</InputLabel>
                  <Select value={editService.provider} onChange={e => setEditService({ ...editService, provider: e.target.value })}>
                    {availableProviders.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </FormControl>
                <Button onClick={handleEditSave} variant="contained" sx={{ mt: 2 }}>Save Changes</Button>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead><TableRow>
              <TableCell>Name</TableCell><TableCell>Description</TableCell><TableCell>Price</TableCell><TableCell>Provider</TableCell><TableCell>Category</TableCell><TableCell>Bookings</TableCell><TableCell>Actions</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.description}</TableCell>
                  <TableCell>{s.price}</TableCell>
                  <TableCell>{s.provider}</TableCell>
                  <TableCell>{s.category}</TableCell>
                  <TableCell>{s.bookings}</TableCell>
                  <TableCell>
                    <Button onClick={() => { setEditService(s); setOpenEdit(true); }}>Edit</Button>
                    <Button color="error" onClick={() => handleDelete(s.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
