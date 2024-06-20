// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";

// export function EditTimer({ editRecords, handleSave, handleClose, projects }) {
//   const [localRecords, setLocalRecords] = useState([]);
//   const [originalRecords, setOriginalRecords] = useState([]);
//   const [recordsToDelete, setRecordsToDelete] = useState([]);

//   useEffect(() => {
//     setLocalRecords(editRecords);
//     setOriginalRecords(editRecords); // 初期値を保存しておく
//   }, [editRecords]);

//   const handleLocalDateChange = (index, value) => {
//     const newRecords = [...localRecords];
//     newRecords[index].date = new Date(value);
//     setLocalRecords(newRecords);
//   };

//   const handleLocalTimeChange = (index, key, value) => {
//     const newRecords = [...localRecords];
//     newRecords[index][key] = value;
//     setLocalRecords(newRecords);
//   };

//   const handleLocalEdit = (index, key, value) => {
//     const newRecords = [...localRecords];
//     newRecords[index][key] = value;
//     setLocalRecords(newRecords);
//   };

//   const handleDelete = (index) => {
//     setRecordsToDelete([...recordsToDelete, localRecords[index]]);
//     setLocalRecords(localRecords.filter((_, i) => i !== index));
//   };

//   const handleSaveWithDelete = () => {
//     handleSave(localRecords, recordsToDelete);
//     setRecordsToDelete([]);
//     setOriginalRecords(localRecords); // 保存後の値を元の値として保持
//   };

//   const handleCancel = () => {
//     setLocalRecords(originalRecords); // 元のデータにリセット
//     setRecordsToDelete([]);
//     handleClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-3xl p-6 w-1/2 relative">
//         <div className="absolute top-4 right-4 flex space-x-2">
//           <Button onClick={handleSaveWithDelete} variant="primary">
//             保存
//           </Button>
//           <Button onClick={handleCancel} variant="secondary">
//             閉じる
//           </Button>
//         </div>
//         <h2 className="text-xl mb-4">編集画面</h2>
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead>
//             <tr>
//               <th className="w-1/4">日付</th>
//               <th className="w-1/6">分</th>
//               <th className="w-1/3">案件名</th>
//               <th className="w-1/6">操作</th>
//             </tr>
//           </thead>
//           <tbody>
//             {localRecords.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="text-center py-4">
//                   記録がありません
//                 </td>
//               </tr>
//             ) : (
//               localRecords.map((record, index) => (
//                 <tr key={index}>
//                   <td className="w-1/4">
//                     <input
//                       type="datetime-local"
//                       value={record.date.toISOString().slice(0, 16)}
//                       onChange={(e) =>
//                         handleLocalDateChange(index, e.target.value)
//                       }
//                       className="border p-1 w-full"
//                     />
//                   </td>
//                   <td className="w-1/6">
//                     <input
//                       type="number"
//                       value={record.minutes}
//                       min="0"
//                       onChange={(e) =>
//                         handleLocalTimeChange(index, "minutes", e.target.value)
//                       }
//                       className="border p-1 w-full"
//                     />
//                   </td>
//                   <td className="w-1/3">
//                     <select
//                       value={record.project}
//                       onChange={(e) =>
//                         handleLocalEdit(index, "project", e.target.value)
//                       }
//                       className="border p-1 w-full"
//                     >
//                       {projects.map((project, i) => (
//                         <option key={i} value={project}>
//                           {project}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="w-1/6">
//                     <Button
//                       onClick={() => handleDelete(index)}
//                       variant="danger"
//                     >
//                       削除
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
