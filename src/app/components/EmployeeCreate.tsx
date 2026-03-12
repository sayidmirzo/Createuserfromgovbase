import { Link } from "react-router";
import { Upload } from "lucide-react";

export function EmployeeCreate() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl">Сотрудник (создание)</h1>
        </div>

        {/* Actions */}
        <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            СОХРАНИТЬ
          </button>
          <Link
            to="/"
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            ЗАКРЫТЬ
          </Link>
        </div>

        <div className="p-6">
          {/* Personal Data Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-6">Персональные данные</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата рождения
                </label>
                <input
                  type="text"
                  placeholder="Выбрать дату"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="row-span-3 flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                      fill="#D1D5DB"
                    />
                  </svg>
                </div>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <Upload size={16} />
                </button>
                <label className="flex items-center gap-2 mt-3 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Использовать для растонирования лица</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фамилия
                </label>
                <input
                  type="text"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Отчество
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ИНПС
                </label>
                <input
                  type="text"
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
                      defaultChecked
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Мужской</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Женский</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ИНН
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Серия и номер паспорта <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Upload size={20} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ПИНФЛ
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-6">Контакты и адресы</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер телефона
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded bg-gray-50">
                    <span className="text-2xl">🇺🇿</span>
                    <span className="text-sm">+998</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="91 234 56 78"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес
                </label>
                <button className="w-full px-3 py-2 border border-gray-300 rounded text-left text-gray-400 hover:bg-gray-50 flex items-center justify-between">
                  <span></span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Регион
                </label>
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес по прописке
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-6">Пользователь</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Логин
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Поиск..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">@integration</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Локация
                </label>
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 4C5.5 4 2 10 2 10C2 10 5.5 16 10 16C14.5 16 18 10 18 10C18 10 14.5 4 10 4Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-6">Прием на работу</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата приема
                </label>
                <input
                  type="text"
                  placeholder="Выбрать дату"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Подразделение
                </label>
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Позиция
                </label>
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Табельный номер
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Отдел
                </label>
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип занятости
                </label>
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Должность
                </label>
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  График работы
                </label>
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
