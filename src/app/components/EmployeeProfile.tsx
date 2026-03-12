import { useParams, Link } from "react-router";
import { useState } from "react";
import { getEmployeeById } from "../data/mockData";
import {
  ArrowLeft,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  Briefcase,
  FileText,
  MessageCircle,
} from "lucide-react";
import { EditPersonalDataDialog } from "./EditPersonalDataDialog";

export function EmployeeProfile() {
  const { id } = useParams();
  const employee = getEmployeeById(Number(id));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!employee) {
    return <div>Сотрудник не найден</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="flex flex-col items-center mb-6">
          {employee.photo ? (
            <img
              src={employee.photo}
              alt={employee.firstName}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
              <svg
                width="64"
                height="64"
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
          <h2 className="text-lg font-medium text-center">
            {employee.lastName} {employee.firstName} {employee.middleName}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <span>Бариста, TEAM2</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="7" fill="#10B981" />
              <path
                d="M6 8L7.5 9.5L10 6.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="inline-block mt-2 px-3 py-1 bg-teal-500 text-white text-xs rounded">
            Работает
          </span>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <FileText size={16} />
              <span>Паспортные данные</span>
            </div>
            <div className="ml-6 text-gray-900">{employee.passport}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Phone size={16} />
              <span>Номер телефона</span>
            </div>
            <div className="ml-6 text-gray-900">{employee.phone}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Mail size={16} />
              <span>E-mail</span>
            </div>
            <div className="ml-6 text-gray-900">{employee.email}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <User size={16} />
              <span>Руководитель</span>
            </div>
            <div className="ml-6 text-gray-900">—</div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Calendar size={16} />
              <span>График работы</span>
            </div>
            <div className="ml-6 text-gray-900">Многосменный график</div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <MapPin size={16} />
              <span>Локация</span>
            </div>
            <div className="ml-6 text-gray-900">GWS office, PLATINUM OFFICE</div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Briefcase size={16} />
              <span>Зарплата</span>
            </div>
            <div className="ml-6 text-gray-900">4 063 272</div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <FileText size={16} />
              <span>Тип оплаты труда</span>
            </div>
            <div className="ml-6 text-gray-900 space-y-1">
              <div>- Месячная</div>
              <div>- СреднеЧасовойОклад</div>
              <div>- Бонус от продажи 2.5%</div>
              <div>- Ночное время</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <MoreHorizontal size={20} className="text-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-600" />
              <span className="text-sm text-gray-600">Локации</span>
              <button className="ml-4 text-sm text-gray-600 hover:text-gray-900">
                Дополнительно ▼
              </button>
            </div>
            <MoreHorizontal size={20} className="text-gray-600" />
          </div>

          <div className="flex items-center gap-6 text-sm border-b border-gray-200 -mb-[1px]">
            <button className="px-4 py-3 border-b-2 border-blue-500 text-blue-600 font-medium flex items-center gap-2">
              <FileText size={16} />
              Основная информация
            </button>
            <button className="px-4 py-3 text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Calendar size={16} />
              Календарь
            </button>
            <button className="px-4 py-3 text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Briefcase size={16} />
              Информация о работе
            </button>
            <button className="px-4 py-3 text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <FileText size={16} />
              История документов
            </button>
            <button className="px-4 py-3 text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <MapPin size={16} />
              Локации
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Personal Data Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Персональные данные</h3>
              <div className="flex items-center gap-4">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  История изменений
                </button>
                <button
                  onClick={() => setIsEditDialogOpen(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Изменить
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Имя</label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.firstName}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Национальность
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.nationality || "—"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">ПИНФЛ</label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.pinfl}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Фамилия
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.lastName}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Дата рождения
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.birthDate}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">ИНПС</label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.inps}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Отчество
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.middleName}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Пол</label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.gender === "male" ? "Мужской" : "Женский"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">ИНН</label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.inn}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Контакты и адресы</h3>
              <div className="flex items-center gap-4">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  История изменений
                </button>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Изменить
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Номер телефона
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.phone}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">E-mail</label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.email}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Регион</label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.region || "—"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Дополнительный номер телефона
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded">—</div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Корпоративный E-mail
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded">—</div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Адрес</label>
                <div className="px-4 py-2 bg-gray-50 rounded">—</div>
              </div>
              <div className="col-span-3">
                <label className="block text-sm text-gray-600 mb-2">
                  Адрес по прописке
                </label>
                <div className="px-4 py-2 bg-gray-50 rounded">
                  {employee.address}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">
                Статистика посещений за период (Ноябрь 2025 - Март 2026)
              </h3>
              <select className="px-4 py-2 border border-gray-300 rounded text-sm">
                <option>Последние 12 месяцев</option>
              </select>
            </div>

            {/* Chart placeholder */}
            <div className="h-64 border border-gray-200 rounded mb-6 flex items-center justify-center text-gray-400">
              График статистики посещений
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-400 rounded"></div>
                <span className="text-sm">Вовремя</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm">Опоздание</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm">Ранний уход</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-sm">Отсутствие</span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    №
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Месяц
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">
                    Вовремя
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">
                    Опоздания
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">
                    Ранние уходы
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">
                    Отсутствия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm">1</td>
                  <td className="px-4 py-3 text-sm">Дек.</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">3</td>
                  <td className="px-4 py-3 text-sm text-blue-600">1</td>
                  <td className="px-4 py-3 text-sm text-blue-600">6</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">2</td>
                  <td className="px-4 py-3 text-sm">Нояб.</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">18</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">3</td>
                  <td className="px-4 py-3 text-sm">Март</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">3</td>
                  <td className="px-4 py-3 text-sm text-blue-600">30</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">4</td>
                  <td className="px-4 py-3 text-sm">Февр.</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">2</td>
                  <td className="px-4 py-3 text-sm text-blue-600">15</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">5</td>
                  <td className="px-4 py-3 text-sm">Янв.</td>
                  <td className="px-4 py-3 text-sm text-blue-600">2</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">0</td>
                  <td className="px-4 py-3 text-sm text-blue-600">22</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditPersonalDataDialog
        employee={employee}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </div>
  );
}
