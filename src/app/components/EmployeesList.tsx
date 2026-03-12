import { Link } from "react-router";
import { useState } from "react";
import { mockEmployees } from "../data/mockData";
import { Plus, Search, Star, Download, Upload, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EmployeeWizard } from "./EmployeeWizard";

export function EmployeesList() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 4H17M3 10H17M3 16H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <h1 className="text-xl">Сотрудники</h1>
          </div>
        </div>

        {/* Tabs */}
        

        {/* Actions Bar */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              СОЗДАТЬ
            </button>
            <Link
              to="/bulk-import"
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Upload size={18} />
              ИМПОРТ
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded w-80"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Star size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Download size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Download size={16} />
              <span>50 / 141</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronDown size={20} className="text-gray-600 rotate-90" />
              </button>
              <span className="text-sm text-gray-600">1 2 3</span>
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronDown size={20} className="text-gray-600 -rotate-90" />
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L10 12L16 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7H17M3 13H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ФИО
                <ChevronDown size={14} className="inline ml-1" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Подразделение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Должность
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата приема на работу
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Логин
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Empty row */}
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <input type="checkbox" className="rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="#9CA3AF"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">1</span>
                </div>
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  Не работает
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">1.</td>
            </tr>

            {mockEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/employee/${employee.id}`}
                    className="flex items-center gap-3 hover:text-teal-600"
                  >
                    {employee.photo ? (
                      <img
                        src={employee.photo}
                        alt={employee.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm">
                      {employee.lastName} {employee.firstName}{" "}
                      {employee.middleName}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {employee.department}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {employee.position}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {employee.hireDate}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                      employee.status === "working"
                        ? "bg-teal-100 text-teal-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {employee.status === "working" ? "Работает" : "Не работает"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {employee.login}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Wizard */}
      <EmployeeWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => {
          // Refresh employee list or show success message
          console.log("Employee added successfully");
        }}
      />
    </div>
  );
}