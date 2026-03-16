import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Eye, EyeOff, Camera, Info, X, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";

export function EmployeeCreate() {
  const navigate = useNavigate();
  const [showPinflModal, setShowPinflModal] = useState(true);
  const [pinfl, setPinfl] = useState("");
  const [isLoadingBasicData, setIsLoadingBasicData] = useState(false);
  const [basicDataLoaded, setBasicDataLoaded] = useState(false);
  const [loadedFields, setLoadedFields] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [useFaceRecognition, setUseFaceRecognition] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

  // Refs для секций
  const personalRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const employmentRef = useRef<HTMLDivElement>(null);

  // Данные формы
  const [formData, setFormData] = useState({
    // Персональные данные
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    nationality: "",
    gender: "male",
    passportSeries: "",
    passportNumber: "",
    pinfl: "",
    inps: "",
    inn: "",
    
    // Контакты
    phone: "",
    email: "",
    address: "",
    residenceAddress: "",
    region: "",
    
    // Пользователь
    login: "",
    location: "",
    password: "",
    
    // Прием на работу
    hireDate: "",
    employeeNumber: "",
    department: "",
    position: "",
    employmentType: "",
    title: "",
    workSchedule: "",
  });

  // Наблюдатель для активной секции
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    [personalRef, contactsRef, userRef, employmentRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Загрузка базовых данных по ПИНФЛ
  const handleLoadBasicData = async () => {
    if (!pinfl || pinfl.length !== 14) return;

    setIsLoadingBasicData(true);
    
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        lastName: "Иванов",
        firstName: "Иван",
        middleName: "Иванович",
        birthDate: "1990-05-15",
        gender: "male",
        address: "г. Ташкент, ул. Навои 123, кв. 45",
        pinfl: pinfl,
      }));
      setBasicDataLoaded(true);
      setIsLoadingBasicData(false);
      setShowPinflModal(false);
      setLoadedFields(["firstName", "lastName", "middleName", "birthDate", "gender", "address"]);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving manual employee:", formData);
    navigate("/");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl">Сотрудник (создание)</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              form="employee-form"
              className="bg-[#4a7dff] hover:bg-[#3a6de8] text-white px-6"
            >
              СОХРАНИТЬ
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="px-6"
            >
              ЗАКРЫТЬ
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto p-6 flex gap-6">
        {/* Main Form */}
        <div className="flex-1 space-y-6">
          <form id="employee-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Персональные данные */}
            <div ref={personalRef} id="personal" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-base text-gray-700 mb-6">Персональные данные</h2>
              
              {/* Avatar Section */}
              <div className="flex items-start gap-8 mb-8 pb-6 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M40 40C48.84 40 56 32.84 56 24C56 15.16 48.84 8 40 8C31.16 8 24 15.16 24 24C24 32.84 31.16 40 40 40ZM40 48C29.32 48 8 53.36 8 64V72H72V64C72 53.36 50.68 48 40 48Z"
                          fill="#9CA3AF"
                        />
                      </svg>
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50">
                      <Camera size={18} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <label className="flex items-start gap-2 cursor-pointer max-w-[180px]">
                    <input
                      type="checkbox"
                      checked={useFaceRecognition}
                      onChange={(e) => setUseFaceRecognition(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#4a7dff] rounded flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 leading-tight">
                      Использовать для распознавания лица
                    </span>
                  </label>
                </div>
                
                <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-5">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Имя <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className={`h-10 ${loadedFields.includes("firstName") ? "border-[#1bc5bd] bg-[#1bc5bd]/5 pr-10" : ""}`}
                      />
                      {loadedFields.includes("firstName") && (
                        <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1bc5bd]" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Дата рождения</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        placeholder="Выбрать дату"
                        className={`h-10 ${loadedFields.includes("birthDate") ? "border-[#1bc5bd] bg-[#1bc5bd]/5 pr-10" : ""}`}
                      />
                      {loadedFields.includes("birthDate") && (
                        <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1bc5bd]" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">ПИНФЛ</label>
                    <Input
                      value={formData.pinfl}
                      onChange={(e) => handleInputChange("pinfl", e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Фамилия</label>
                    <div className="relative">
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`h-10 ${loadedFields.includes("lastName") ? "border-[#1bc5bd] bg-[#1bc5bd]/5 pr-10" : ""}`}
                      />
                      {loadedFields.includes("lastName") && (
                        <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1bc5bd]" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Национальность</label>
                    <Input
                      value={formData.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                      placeholder="Поиск..."
                      className="h-10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">ИНПС</label>
                    <Input
                      value={formData.inps}
                      onChange={(e) => handleInputChange("inps", e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Отчество</label>
                    <div className="relative">
                      <Input
                        value={formData.middleName}
                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                        className={`h-10 ${loadedFields.includes("middleName") ? "border-[#1bc5bd] bg-[#1bc5bd]/5 pr-10" : ""}`}
                      />
                      {loadedFields.includes("middleName") && (
                        <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1bc5bd]" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Пол</label>
                    <div className={`flex items-center gap-6 h-10 ${loadedFields.includes("gender") ? "p-3 border border-[#1bc5bd] bg-[#1bc5bd]/5 rounded-md" : ""}`}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          className="w-4 h-4 text-[#4a7dff]"
                        />
                        <span className="text-sm text-gray-700">Мужской</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          className="w-4 h-4 text-[#4a7dff]"
                        />
                        <span className="text-sm text-gray-700">Женский</span>
                      </label>
                      {loadedFields.includes("gender") && (
                        <CheckCircle2 size={16} className="ml-auto text-[#1bc5bd]" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">ИНН</label>
                    <Input
                      value={formData.inn}
                      onChange={(e) => handleInputChange("inn", e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                <div className="col-span-3">
                  <label className="block text-sm text-gray-600 mb-2">
                    Серия и номер паспорта <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <Input
                      value={formData.passportSeries}
                      onChange={(e) => handleInputChange("passportSeries", e.target.value.toUpperCase())}
                      maxLength={2}
                      className="h-10 w-20"
                      required
                    />
                    <Input
                      value={formData.passportNumber}
                      onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                      maxLength={7}
                      className="h-10 flex-1"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Контакты и адреса */}
            <div ref={contactsRef} id="contacts" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-base text-gray-700 mb-6">Контакты и адреса</h2>
              
              <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Номер телефона</label>
                  <div className="flex gap-2">
                    <div className="w-20 h-10 border border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                      <span className="text-sm text-gray-600">+998</span>
                    </div>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="91 234 56 78"
                      className="h-10 flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Адрес</label>
                  <div className="relative">
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`h-10 ${loadedFields.includes("address") ? "border-[#1bc5bd] bg-[#1bc5bd]/5 pr-10" : ""}`}
                    />
                    {loadedFields.includes("address") && (
                      <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1bc5bd]" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Регион</label>
                  <Input
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    placeholder="Поиск..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">E-mail</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Адрес по прописке</label>
                  <Input
                    value={formData.residenceAddress}
                    onChange={(e) => handleInputChange("residenceAddress", e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Пользователь */}
            <div ref={userRef} id="user" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-base text-gray-700 mb-6">Пользователь</h2>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Логин</label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.login}
                      onChange={(e) => handleInputChange("login", e.target.value)}
                      placeholder="Поиск..."
                      className="h-10 flex-1"
                    />
                    <div className="px-3 h-10 bg-gray-100 border border-gray-300 rounded-md flex items-center text-sm text-gray-500">
                      @integration
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Локация</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Поиск..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Пароль</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Прием на работу */}
            <div ref={employmentRef} id="employment" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-base text-gray-700 mb-6">Прием на работу</h2>
              
              <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Дата приема</label>
                  <Input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleInputChange("hireDate", e.target.value)}
                    placeholder="Выбрать дату"
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Подразделение</label>
                  <Input
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    placeholder="Поиск..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Позиция</label>
                  <Input
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    placeholder="Поиск..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Табельный номер</label>
                  <Input
                    value={formData.employeeNumber}
                    onChange={(e) => handleInputChange("employeeNumber", e.target.value)}
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Отдел</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Поиск..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Тип занятости</label>
                  <Input
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange("employmentType", e.target.value)}
                    placeholder="Поиск..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Должность</label>
                  <Input
                    value={formData.workSchedule}
                    onChange={(e) => handleInputChange("workSchedule", e.target.value)}
                    placeholder="Поиск..."
                    className="h-10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">График работы</label>
                  <Input
                    placeholder="Поиск..."
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0 space-y-6">
          {/* Navigation Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Навигация</h3>
            <nav className="space-y-1">
              <button
                onClick={() => scrollToSection(personalRef)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  activeSection === "personal"
                    ? "bg-[#4a7dff] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Персональные данные
              </button>
              
              
              <button
                onClick={() => scrollToSection(employmentRef)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  activeSection === "employment"
                    ? "bg-[#4a7dff] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Прием на работу
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* PINFL Modal */}
      <Dialog open={showPinflModal} onOpenChange={setShowPinflModal}>
        <DialogContent className="max-w-[500px]">
          <DialogTitle className="sr-only">Загрузка базовых данных</DialogTitle>
          <DialogDescription className="sr-only">
            Введите ПИНФЛ для автоматической загрузки данных сотрудника из государственной базы
          </DialogDescription>
          <div className="p-2">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Info size={24} className="text-[#4a7dff]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Загрузка базовых данных
                </h3>
                <p className="text-sm text-gray-600">
                  Введите ПИНФЛ для автоматической загрузки данных сотрудника из государственной базы
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ПИНФЛ <span className="text-red-500">*</span>
                </label>
                <Input
                  value={pinfl}
                  onChange={(e) => setPinfl(e.target.value.replace(/\D/g, "").slice(0, 14))}
                  placeholder="Введите 14-значный ПИНФЛ"
                  maxLength={14}
                  className="h-11 text-base font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {pinfl.length}/14 цифр
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-medium text-blue-900 mb-2">
                  Будут загружены следующие данные:
                </p>
                <ul className="space-y-1 text-xs text-blue-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>ФИО (Фамилия, Имя, Отчество)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Пол</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Дата рождения</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>Адрес регистрации</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPinflModal(false)}
                  className="px-5"
                >
                  Пропустить
                </Button>
                <Button
                  type="button"
                  onClick={handleLoadBasicData}
                  className="bg-[#4a7dff] hover:bg-[#3a6de8] text-white px-6"
                  disabled={pinfl.length !== 14 || isLoadingBasicData}
                >
                  {isLoadingBasicData ? "Загрузка..." : "Загрузить данные"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}