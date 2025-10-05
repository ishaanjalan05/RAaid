import { useState } from 'react';
import type { Resident } from '../types/Resident';
import { useResidents } from './ResidentProvider';
import { ResidentModal } from './ResidentModal';

export const ResidentsList = () => {
  const { residents, addResident, updateResident, deleteResident } =
    useResidents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );

  const handleAdd = () => {
    setSelectedResident(null);
    setIsModalOpen(true);
  };

  const handleEdit = (resident: Resident) => {
    setSelectedResident(resident);
    setIsModalOpen(true);
  };

  const handleSave = (resident: Resident | Omit<Resident, 'id'>) => {
    if ('id' in resident) {
      updateResident(resident);
    } else {
      addResident(resident);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Residents</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Resident
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">
                Room
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">
                Preferred
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">
                Contact
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident) => (
              <tr
                key={resident.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-3 text-sm text-gray-900">
                  {resident.name}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">
                  {resident.room}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      resident.preferredChannel === 'email'
                        ? 'bg-blue-100 text-blue-800'
                        : resident.preferredChannel === 'sms'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {resident.preferredChannel === 'email' && '📧'}
                    {resident.preferredChannel === 'sms' && '💬'}
                    {resident.preferredChannel === 'groupme' && '👥'}
                    <span className="ml-1 capitalize">
                      {resident.preferredChannel}
                    </span>
                  </span>
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">
                  {resident.preferredChannel === 'email' && resident.email}
                  {resident.preferredChannel === 'sms' && resident.phone}
                  {resident.preferredChannel === 'groupme' && resident.groupme}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600 space-x-2">
                  <button
                    onClick={() => handleEdit(resident)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteResident(resident.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <ResidentModal
          resident={selectedResident}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
