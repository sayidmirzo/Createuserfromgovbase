import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Settings as SettingsIcon,
  Users,
  Building2,
  Clock,
  CreditCard,
  Shield,
  ChevronRight,
  Search,
  Plus,
  Trash2,
  UserPlus,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  MoreVertical,
  Eye,
  Download,
  Info,
} from "lucide-react";
import { motion } from "motion/react";

type SettingsTab = "quota" | "audit" | "access" | "branches";

// Mock data
const mockAuditLogs = [
  {
    id: 1,
    user: "Иван Петров",
    action: "Добавление сотрудника",
    target: "Алексей Сидоров",
    timestamp: "2026-03-10 14:32:15",
    status: "success",
    ip: "192.168.1.10",
  },
  {
    id: 2,
    user: "Мария Иванова",
    action: "Бесплатный поиск в госбазе",
    target: "Тестовый Сотрудник (базовые данные)",
    timestamp: "2026-03-10 14:15:30",
    status: "info",
    ip: "192.168.1.15",
  },
  {
    id: 3,
    user: "Мария Иванова",
    action: "Обновление данных",
    target: "Елена Смирнова",
    timestamp: "2026-03-10 13:15:42",
    status: "success",
    ip: "192.168.1.15",
  },
  {
    id: 4,
    user: "Анна Николаева",
    action: "Бесплатный поиск в госбазе",
    target: "ПИНФЛ: 11111111111111 (частичные данные)",
    timestamp: "2026-03-10 12:50:18",
    status: "info",
    ip: "192.168.1.8",
  },
  {
    id: 5,
    user: "Петр Васильев",
    action: "Попытка удаления",
    target: "Дмитрий Козлов",
    timestamp: "2026-03-10 12:48:23",
    status: "error",
    ip: "192.168.1.22",
  },
  {
    id: 6,
    user: "Анна Николаева",
    action: "Поиск в госбазе",
    target: "ПИНФЛ: 12345678901234",
    timestamp: "2026-03-10 11:20:11",
    status: "success",
    ip: "192.168.1.8",
  },
  {
    id: 7,
    user: "Сергей Орлов",
    action: "Бесплатный поиск в госбазе",
    target: "Иван Иванов (без расхода квоты)",
    timestamp: "2026-03-10 10:35:22",
    status: "info",
    ip: "192.168.1.30",
  },
  {
    id: 8,
    user: "Сергей Орлов",
    action: "Изменение прав доступа",
    target: "Ольга Кузнецова",
    timestamp: "2026-03-10 10:05:37",
    status: "warning",
    ip: "192.168.1.30",
  },
];

const mockAccessUsers = [
  {
    id: 1,
    name: "Иван Петров",
    email: "ivan.petrov@verifix.uz",
    role: "Администратор",
    status: "active",
    lastActive: "2026-03-10 14:32",
    permissions: ["read", "write", "delete", "admin"],
  },
  {
    id: 2,
    name: "Мария Иванова",
    email: "maria.ivanova@verifix.uz",
    role: "HR Менеджер",
    status: "active",
    lastActive: "2026-03-10 13:15",
    permissions: ["read", "write"],
  },
  {
    id: 3,
    name: "Петр Васильев",
    email: "petr.vasilev@verifix.uz",
    role: "Оператор",
    status: "active",
    lastActive: "2026-03-10 12:48",
    permissions: ["read"],
  },
  {
    id: 4,
    name: "Анна Николаева",
    email: "anna.nikolaeva@verifix.uz",
    role: "HR Менеджер",
    status: "inactive",
    lastActive: "2026-03-08 16:20",
    permissions: ["read", "write"],
  },
];

const mockBranches = [
  {
    id: 1,
    name: "Главный офис",
    address: "г. Ташкент, ул. Амира Темура 15",
    employees: 156,
    status: "active",
    manager: "Иван Петров",
  },
  {
    id: 2,
    name: "Филиал Чиланзар",
    address: "г. Ташкент, Чиланзарский р-н, ул. Бунёдкор 45",
    employees: 87,
    status: "active",
    manager: "Мария Иванова",
  },
  {
    id: 3,
    name: "Филиал Самарканд",
    address: "г. Самарканд, пр. Амира Темура 128",
    employees: 42,
    status: "active",
    manager: "Петр Васильев",
  },
  {
    id: 4,
    name: "Филиал Бухара",
    address: "г. Бухара, ул. Ходжа Нурободд 67",
    employees: 28,
    status: "inactive",
    manager: "Анна Николаева",
  },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("quota");
  const [quotaLimit, setQuotaLimit] = useState(10000);
  const [quotaUsed, setQuotaUsed] = useState(3247);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Настройка для базовых данных при ручном создании
  const [enableBasicDataOnManual, setEnableBasicDataOnManual] = useState(() => {
    return localStorage.getItem("verifix_enable_basic_data_manual") === "true";
  });

  // Временный переключатель для теста - обнуление квоты
  const [isQuotaEmpty, setIsQuotaEmpty] = useState(() => {
    return localStorage.getItem("verifix_test_quota_empty") === "true";
  });

  const handleBasicDataToggle = (checked: boolean) => {
    setEnableBasicDataOnManual(checked);
    localStorage.setItem("verifix_enable_basic_data_manual", checked.toString());
    window.dispatchEvent(new Event("storage"));
  };

  const handleQuotaEmptyToggle = (checked: boolean) => {
    setIsQuotaEmpty(checked);
    localStorage.setItem("verifix_test_quota_empty", checked.toString());
    window.dispatchEvent(new Event("storage"));
  };
  
  const quotaPercentage = (quotaUsed / quotaLimit) * 100;

  const tabs = [
    {
      key: "quota" as SettingsTab,
      label: "Квота",
      icon: CreditCard,
      description: "Управление квотой запросов",
    },
    {
      key: "audit" as SettingsTab,
      label: "Аудит",
      icon: Activity,
      description: "История операций",
    },
    {
      key: "access" as SettingsTab,
      label: "Доступ",
      icon: Shield,
      description: "Управление пользователями",
    },
    {
      key: "branches" as SettingsTab,
      label: "Филиалы",
      icon: Building2,
      description: "Управление филиалами",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <SettingsIcon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Настройки квоты</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Управление квотой, аудит операций и настройка доступа
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-start gap-3 p-4 rounded-lg transition-all ${
                    isActive
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isActive ? "text-teal-100" : "text-gray-500"
                      }`}
                    >
                      {tab.description}
                    </div>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </motion.button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            {/* Quota Tab */}
            {activeTab === "quota" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Current Quota Card */}
                <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl p-6 text-white shadow-xl shadow-teal-500/30">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Текущая квота запросов</h3>
                      <p className="text-teal-100 text-sm">
                        Лимит обращений к государственной базе данных
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <div className="text-xs font-medium">Период: Месяц</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-teal-100 mb-1">Использовано</div>
                      <div className="text-3xl font-bold">{quotaUsed.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-teal-100 mb-1">Осталось</div>
                      <div className="text-3xl font-bold">
                        {(quotaLimit - quotaUsed).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-teal-100 mb-1">Лимит</div>
                      <div className="text-3xl font-bold">{quotaLimit.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Использование</span>
                      <span className="font-semibold">{quotaPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${quotaPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-5 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity size={20} className="text-blue-600" />
                      </div>
                      <span className="text-xs text-gray-500">Сегодня</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">127</div>
                    <div className="text-sm text-gray-500 mt-1">Запросов</div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-[#d1f4f2] rounded-lg flex items-center justify-center">
                        <CheckCircle2 size={20} className="text-[#1bc5bd]" />
                      </div>
                      <span className="text-xs text-gray-500">Успешно</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">98.2%</div>
                    <div className="text-sm text-gray-500 mt-1">Выполнено</div>
                  </div>

                  <div className="bg-white rounded-lg p-5 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock size={20} className="text-orange-600" />
                      </div>
                      <span className="text-xs text-gray-500">Среднее</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">1.2с</div>
                    <div className="text-sm text-gray-500 mt-1">Время ответа</div>
                  </div>
                </div>
                
                {/* Basic Data Toggle */}
                <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <Info size={18} className="text-blue-600" />
                        Базовые данные при ручном создании
                      </h3>
                      <p className="text-sm text-gray-600">
                        При исчерпании квоты разрешить ввод ПИНФЛ в форме ручного создания для загрузки базовых данных (ФИО, дата рождения, пол, адрес) из госбазы без расхода квоты
                      </p>
                    </div>
                    <Switch
                      checked={enableBasicDataOnManual}
                      onCheckedChange={handleBasicDataToggle}
                      className="data-[state=checked]:bg-[#4a7dff]"
                    />
                  </div>
                  {enableBasicDataOnManual && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Функция активна</p>
                          <p className="text-xs">
                            При исчерпании квоты в форме ручного создания сотрудника появится возможность ввести ПИНФЛ для бесплатной загрузки базовых данных. Паспортные данные, регион и фото останутся недоступны.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Test Mode: Empty Quota Toggle */}
                <div className="bg-white rounded-lg border-2 border-amber-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <AlertCircle size={18} className="text-amber-600" />
                        Тестовый режим: исчерпание квоты
                      </h3>
                      <p className="text-sm text-gray-600">
                        Временный режим для тестирования функционала при нулевой квоте. Система будет вести себя так, как если бы квота была исчерпана
                      </p>
                    </div>
                    <Switch
                      checked={isQuotaEmpty}
                      onCheckedChange={handleQuotaEmptyToggle}
                      className="data-[state=checked]:bg-amber-600"
                    />
                  </div>
                  {isQuotaEmpty && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">⚠️ Тестовый режим активен</p>
                          <p className="text-xs">
                            Квота считается исчерпанной. Поиск в госбазе будет недоступен, форма ручного создания сотрудника откроется автоматически при попытке добавления.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Audit Tab */}
            {activeTab === "audit" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Search and Filters */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        placeholder="Поиск по пользователю, действию или объекту..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Download size={16} className="mr-2" />
                      Экспорт
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Все</Button>
                    <Button variant="outline" size="sm">Сегодня</Button>
                    <Button variant="outline" size="sm">Неделя</Button>
                    <Button variant="outline" size="sm">Месяц</Button>
                  </div>
                </div>

                {/* Audit Log Table */}
                <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Пользователь
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Действие
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Объект
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Время
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          IP
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                                  {log.user.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium text-gray-900">
                                {log.user}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{log.action}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">{log.target}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">{log.timestamp}</span>
                          </td>
                          <td className="px-6 py-4">
                            {log.status === "success" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#d1f4f2] text-[#138b86] rounded-full text-xs font-medium">
                                <CheckCircle2 size={12} />
                                Успешно
                              </span>
                            )}
                            {log.status === "error" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                <XCircle size={12} />
                                Ошибка
                              </span>
                            )}
                            {log.status === "warning" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                <AlertCircle size={12} />
                                Предупреждение
                              </span>
                            )}
                            {log.status === "info" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                <Info size={12} />
                                Информация
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-gray-500">{log.ip}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Access Tab */}
            {activeTab === "access" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header Actions */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        placeholder="Поиск пользователей..."
                        className="pl-10 max-w-md"
                      />
                    </div>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <UserPlus size={16} className="mr-2" />
                      Добавить пльзователя
                    </Button>
                  </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {mockAccessUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-lg border-2 border-gray-200 p-5 hover:border-teal-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-teal-400 to-blue-500 text-white font-semibold">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Роль</span>
                          <span className="text-sm font-medium text-gray-900">{user.role}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Статус</span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.status === "active"
                                ? "bg-[#d1f4f2] text-[#138b86]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                user.status === "active" ? "bg-[#1bc5bd]" : "bg-gray-400"
                              }`}
                            />
                            {user.status === "active" ? "Активен" : "Неактивен"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Последняя активность</span>
                          <span className="text-xs text-gray-600">{user.lastActive}</span>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500 mb-2">Права доступа</div>
                          <div className="flex flex-wrap gap-1.5">
                            {user.permissions.map((perm) => (
                              <span
                                key={perm}
                                className="px-2 py-0.5 bg-[#4a7dff]/10 text-[#4a7dff] rounded text-xs font-medium"
                              >
                                {perm === "read" && "Чтение"}
                                {perm === "write" && "Запись"}
                                {perm === "delete" && "Удаление"}
                                {perm === "admin" && "Админ"}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit2 size={14} className="mr-1.5" />
                          Изменить
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Branches Tab */}
            {activeTab === "branches" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header Actions */}
                <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        placeholder="Поиск филиалов..."
                        className="pl-10 max-w-md"
                      />
                    </div>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus size={16} className="mr-2" />
                      Добавить филиал
                    </Button>
                  </div>
                </div>

                {/* Branches List */}
                <div className="space-y-4">
                  {mockBranches.map((branch) => (
                    <div
                      key={branch.id}
                      className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-teal-300 transition-all"
                    >
                      <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/30">
                          <Building2 size={28} className="text-white" />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {branch.name}
                              </h3>
                              <p className="text-sm text-gray-500">{branch.address}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked={branch.status === "active"}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4a7dff]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4a7dff]"></div>
                            </label>
                          </div>

                          <div className="grid grid-cols-3 gap-6">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Сотрудников</div>
                              <div className="text-xl font-bold text-gray-900">
                                {branch.employees}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Руководитель</div>
                              <div className="text-sm font-medium text-gray-900">
                                {branch.manager}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Статус</div>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  branch.status === "active"
                                    ? "bg-[#d1f4f2] text-[#138b86]"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    branch.status === "active" ? "bg-[#1bc5bd]" : "bg-gray-400"
                                  }`}
                                />
                                {branch.status === "active" ? "Активен" : "Неактивен"}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                            <Button variant="outline" size="sm">
                              <Eye size={14} className="mr-1.5" />
                              Просмотр
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit2 size={14} className="mr-1.5" />
                              Изменить
                            </Button>
                            <Button variant="outline" size="sm">
                              <Users size={14} className="mr-1.5" />
                              Сотрудники ({branch.employees})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}