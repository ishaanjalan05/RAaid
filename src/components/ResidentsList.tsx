import type { Resident } from '../types/resident';

interface ResidentsListProps {
  residents: Resident[];
}

export const ResidentsList = ({ residents }: ResidentsListProps) => {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Residents</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Name</th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Room</th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Preferred</th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Contact</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 text-sm text-gray-900">{resident.name}</td>
                <td className="py-3 px-3 text-sm text-gray-600">{resident.room}</td>
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
                    <span className="ml-1 capitalize">{resident.preferredChannel}</span>
                  </span>
                </td>
                <td className="py-3 px-3 text-sm text-gray-600">
                  {resident.preferredChannel === 'email' && resident.email}
                  {resident.preferredChannel === 'sms' && resident.phone}
                  {resident.preferredChannel === 'groupme' && resident.groupme}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
