// import React, { useState } from "react";
// import DashboardLayout from "@/components/layouts/DashboardLayout";
// import { Link } from "react-router-dom";
// import { BsArrowLeft, BsChevronDown } from "react-icons/bs";
// import { BiEdit } from "react-icons/bi";
// import { LuUserRound } from "react-icons/lu";
// import { AiOutlineQuestion } from "react-icons/ai";
// import { MdOutlineSpeakerNotes } from "react-icons/md";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import DeleteAccountModal from '@/components/modals/DeleteAccountModal';

// function Settings() {
//   const { user, setUser } = useContext(AuthContext);
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [isEditingUsername, setIsEditingUsername] = useState(false);
//   const [editedName, setEditedName] = useState(user?.name || "");
//   const [editedUsername, setEditedUsername] = useState(user?.username || "");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const handleSaveName = () => {
//     setUser(prev => ({ ...prev, name: editedName }));
//     setIsEditingName(false);
//   };

//   const handleSaveUsername = () => {
//     setUser(prev => ({ ...prev, username: editedUsername }));
//     setIsEditingUsername(false);
//   };

//   const displayName = user?.username || user?.name || "User";
//   const email = user?.email || "user@example.com";

//   return (
//     <DashboardLayout>
//       <div className={showDeleteModal ? 'blur-md' : ''}>
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center mb-8">
//             <Link to="/user/countries" className="mr-4">
//               <BsArrowLeft className="h-6 w-6" />
//             </Link>
//             <h1 className="text-3xl font-medium">Settings</h1>
//           </div>

//           {/* General Section */}
//           <section className="mb-8">
//             <h2 className="text-xl font-medium mb-4">General</h2>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">Language</span>
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center bg-white border rounded-lg px-3 py-2">
//                     <span className="text-sm mr-2">English</span>
//                     <BsChevronDown className="h-4 w-4 text-gray-500" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Account Section */}
//           <section className="mb-8">
//             <h2 className="text-xl font-medium mb-4">Account</h2>
//             <div className="bg-gray-50 p-4 rounded-lg divide-y divide-gray-200">
//               <div className="pb-6">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">Avatar</span>
//                   <div className="relative">
//                     <div 
//                       className="h-16 w-16 rounded-full bg-[#8F8F8F] flex items-center justify-center hover:bg-[#7F7F7F] transition-colors duration-200"
//                     >
//                       <LuUserRound className="h-8 w-8 text-white" />
//                     </div>
//                     <div className="absolute -right-1 -bottom-1">
//                       <button className="p-1 bg-white rounded-md shadow-md border hover:bg-gray-50">
//                         <BiEdit className="h-3 w-3 text-black" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="py-6 divide-y divide-gray-200">
//                 <div className="pb-6">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">Full Name</span>
//                     <div className="flex items-center">
//                       {isEditingName ? (
//                         <div className="flex flex-col gap-2 w-[250px]">
//                           <div className="flex items-center bg-white border rounded-lg px-3 py-2">
//                             <input
//                               type="text"
//                               value={editedName}
//                               onChange={(e) => setEditedName(e.target.value)}
//                               className="text-sm outline-none w-full"
//                             />
//                           </div>
//                           <div className="flex justify-end gap-2">
//                             <button 
//                               onClick={handleSaveName}
//                               className={`px-4 py-1.5 rounded-lg text-sm text-white ${
//                                 editedName !== user?.name ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400'
//                               }`}
//                             >
//                               Save
//                             </button>
//                             <button 
//                               className="px-4 py-1.5 rounded-lg text-sm border hover:bg-gray-50"
//                               onClick={() => {
//                                 setIsEditingName(false);
//                                 setEditedName(user?.name || "");
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           <span className="text-sm mr-2">{user?.name || "Add name"}</span>
//                           <button 
//                             className="p-2 hover:bg-gray-200 rounded-full"
//                             onClick={() => setIsEditingName(true)}
//                           >
//                             <BiEdit className="h-4 w-4" />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="pt-6">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">Username</span>
//                     <div className="flex items-center">
//                       {isEditingUsername ? (
//                         <div className="flex flex-col gap-2 w-[250px]">
//                           <div className="flex items-center bg-white border rounded-lg px-3 py-2">
//                             <input
//                               type="text"
//                               value={editedUsername}
//                               onChange={(e) => setEditedUsername(e.target.value)}
//                               className="text-sm outline-none w-full"
//                             />
//                           </div>
//                           <div className="flex justify-end gap-2">
//                             <button 
//                               onClick={handleSaveUsername}
//                               className={`px-4 py-1.5 rounded-lg text-sm text-white ${
//                                 editedUsername !== user?.username ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400'
//                               }`}
//                             >
//                               Save
//                             </button>
//                             <button 
//                               className="px-4 py-1.5 rounded-lg text-sm border hover:bg-gray-50"
//                               onClick={() => {
//                                 setIsEditingUsername(false);
//                                 setEditedUsername(user?.username || "");
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           <span className="text-sm mr-2">{user?.username || "Add username"}</span>
//                           <button 
//                             className="p-2 hover:bg-gray-200 rounded-full"
//                             onClick={() => setIsEditingUsername(true)}
//                           >
//                             <BiEdit className="h-4 w-4" />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="py-6">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm">Email</span>
//                   <span className="text-sm">{email}</span>
//                 </div>
//               </div>

//               <div className="pt-6">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1 pr-4">
//                     <span className="text-sm text-red-600">Delete account</span>
//                     <p className="text-xs text-gray-900">
//                       Permanently delete your account and data
//                     </p>
//                   </div>
//                   <button 
//                     onClick={() => setShowDeleteModal(true)}
//                     className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg text-sm"
//                   >
//                     Delete account
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Global Relocate Section */}
//           <section className="mb-8">
//             <h2 className="text-xl font-medium mb-4">Global Relocate</h2>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <div className="flex items-center justify-between">
//                 <div className="pr-4">
//                   <span className="text-sm text-gray-900 block mb-1">Subscription</span>
//                   <p className="text-xs text-gray-900">
//                     You are currently in free plan valid for 3 days. Upgrade now to
//                     keep using Global Relocate.
//                   </p>
//                 </div>
//                 <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 flex-shrink-0">
//                   Learn More
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* Footer */}
//           <footer className="bg-gray-50 p-4 rounded-lg mb-8">
//             <div className="flex items-center justify-between text-sm text-gray-900">
//               <div className="flex items-center space-x-4">
//                 <button className="hover:text-gray-700 flex items-center gap-2">
//                   <AiOutlineQuestion className="h-4 w-4" />
//                   Help
//                 </button>
//                 <button className="hover:text-gray-700 flex items-center gap-2">
//                   <MdOutlineSpeakerNotes className="h-4 w-4" />
//                   Give us feedback
//                 </button>
//               </div>
//               <span>© 2025 Global Relocate</span>
//             </div>
//           </footer>
//         </div>
//       </div>

//       <DeleteAccountModal 
//         isOpen={showDeleteModal} 
//         onClose={() => setShowDeleteModal(false)} 
//       />
//     </DashboardLayout>
//   );
// }

// export default Settings;
