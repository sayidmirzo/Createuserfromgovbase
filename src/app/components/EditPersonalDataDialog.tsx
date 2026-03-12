import { X } from "lucide-react";
import { Employee } from "../data/mockData";
import { useState } from "react";

interface EditPersonalDataDialogProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPersonalDataDialog({
  employee,
  isOpen,
  onClose,
}: EditPersonalDataDialogProps) {
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    middleName: employee.middleName,
    nationality: employee.nationality,
    birthDate: employee.birthDate,
    gender: employee.gender,
    pinfl: employee.pinfl,
    inps: employee.inps,
    inn: employee.inn,
    note: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium">
            Персональные данные (изменение)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фамилия
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Отчество
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Национальность
              </label>
              <input
                type="text"
                placeholder="Поиск..."
                value={formData.nationality}
                onChange={(e) =>
                  setFormData({ ...formData, nationality: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата рождения
              </label>
              <input
                type="text"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пол
              </label>
              <div className="flex items-center gap-6 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "male" | "female",
                      })
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Мужской</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as "male" | "female",
                      })
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Женский</span>
                </label>
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ПИНФЛ
              </label>
              <input
                type="text"
                value={formData.pinfl}
                onChange={(e) =>
                  setFormData({ ...formData, pinfl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ИНПС
              </label>
              <input
                type="text"
                value={formData.inps}
                onChange={(e) =>
                  setFormData({ ...formData, inps: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ИНН
              </label>
              <input
                type="text"
                value={formData.inn}
                onChange={(e) =>
                  setFormData({ ...formData, inn: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Примечание
            </label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Закрыть
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
