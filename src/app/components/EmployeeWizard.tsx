import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  RefreshCw,
  XCircle,
  UserX,
  UserPlus,
  ChevronLeft,
  Briefcase,
  FileText,
  Save,
  UserCheck,
  UserMinus,
  AlertTriangle,
  WifiOff,
  HelpCircle,
  X,
  MapPin,
  Check,
  Keyboard,
  GitMerge,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SmartPanelActions } from "./employee-actions/SmartPanelActions";
import { HireEmployeeForm, HireFormData } from "./employee-actions/HireEmployeeForm";

type WizardStep = "search" | "result" | "manual";
type SearchState =
  | "idle"
  | "not-found"
  | "found-new"
  | "found-duplicate-unverified"
  | "found-duplicate-verified"
  | "found-merge-conflict"
  | "merge"
  | "updated"
  | "invalid-input"
  | "api-error"
  | "no-connection";

interface SearchResult {
  pinfl: string;
  firstName: string;
  lastName: string;
  middleName: string;
  passport: string;
  birthDate: string;
  gender: string;
  nationality: string;
  address: string;
  region: string;
  photoUrl: string;
  found: boolean;
}

interface ExistingEmployee {
  id: string;
  name: string;
  position: string;
  department: string;
  isHired: boolean;
  isVerified: boolean;
  lastVerified?: string;
  photoUrl?: string;
  pinfl: string;
  passport: string;
  employmentStatus: "active" | "inactive" | "terminated";
}

interface EmployeeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Helper: Format PINFL as 12345 67890 1234
function formatPinfl(value: string): string {
  const digits = value.replace(/\D/g, "");
  const parts = [];
  
  if (digits.length > 0) parts.push(digits.slice(0, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 10));
  if (digits.length > 10) parts.push(digits.slice(10, 14));
  
  return parts.join(" ");
}

// Helper: Format Passport as AA 1234567
function formatPassport(value: string): string {
  const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  const letters = cleaned.slice(0, 2);
  const numbers = cleaned.slice(2, 9);
  
  return letters + (numbers ? " " + numbers : "");
}

// Helper: Validate PINFL
function validatePinfl(value: string): { valid: boolean; error?: string } {
  const cleaned = value.replace(/\s/g, "");
  
  if (cleaned.length === 0) {
    return { valid: false };
  }
  
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, error: "ПИНФЛ может содержать только цифры" };
  }
  
  if (cleaned.length < 14) {
    return { valid: false, error: `Введите еще ${14 - cleaned.length} цифр` };
  }
  
  if (cleaned.length === 14) {
    return { valid: true };
  }
  
  return { valid: false };
}

// Helper: Validate Passport
function validatePassport(value: string): { valid: boolean; error?: string } {
  const cleaned = value.replace(/\s/g, "");
  
  if (cleaned.length === 0) {
    return { valid: false };
  }
  
  if (!/^[A-Z]{2}\d{7}$/.test(cleaned)) {
    if (!/^[A-Z]{2}/.test(cleaned)) {
      return { valid: false, error: "Начните с двух букв (например, AB)" };
    }
    if (cleaned.length < 9) {
      return { valid: false, error: `Введите еще ${9 - cleaned.length} символов` };
    }
  }
  
  return { valid: true };
}

export function EmployeeWizard({
  isOpen,
  onClose,
  onSuccess,
}: EmployeeWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("search");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [searchMethod, setSearchMethod] = useState<"pinfl" | "passport">(
    "pinfl"
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  // Quota state
  const maxQuota = 100;
  const [currentQuota, setCurrentQuota] = useState(86);
  const isQuotaLow = currentQuota <= 5;
  const quotaPercentage = (currentQuota / maxQuota) * 100;

  // Search form fields
  const [pinfl, setPinfl] = useState("");
  const [passport, setPassport] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Validation states
  const [pinflTouched, setPinflTouched] = useState(false);
  const [passportTouched, setPassportTouched] = useState(false);

  // Manual form fields
  const [manualForm, setManualForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    gender: "",
    passportSeries: "",
    passportNumber: "",
    pinfl: "",
    region: "",
    nationality: "",
    address: "",
  });

  // Results
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [existingEmployee, setExistingEmployee] =
    useState<ExistingEmployee | null>(null);
  const [conflictEmployee, setConflictEmployee] =
    useState<ExistingEmployee | null>(null);
  const [selectedMergeCard, setSelectedMergeCard] = useState<
    "local" | "government" | null
  >(null);

  // Contact data for new employee
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  // Track which action button was clicked
  const [currentAction, setCurrentAction] = useState<"work" | "gph" | "save" | null>(null);
  
  // Show hire form
  const [showHireForm, setShowHireForm] = useState(false);

  const searchResultRef = useRef<HTMLDivElement>(null);
  const pinflInputRef = useRef<HTMLInputElement>(null);
  const passportInputRef = useRef<HTMLInputElement>(null);

  // Autofocus on first input when wizard opens
  useEffect(() => {
    if (isOpen && currentStep === "search") {
      setTimeout(() => {
        if (searchMethod === "pinfl") {
          pinflInputRef.current?.focus();
        } else {
          passportInputRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, currentStep, searchMethod]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close wizard
      if (e.key === "Escape") {
        handleClose();
      }

      // Enter to search (only on search step)
      if (e.key === "Enter" && currentStep === "search") {
        if (!isSearching && consentChecked) {
          handleSearch();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, isSearching, consentChecked]);

  // Reset wizard
  const resetWizard = () => {
    setCurrentStep("search");
    setSearchState("idle");
    setPinfl("");
    setPassport("");
    setBirthDate("");
    setConsentChecked(false);
    setSearchResult(null);
    setExistingEmployee(null);
    setConflictEmployee(null);
    setSelectedMergeCard(null);
    setPhoneNumber("");
    setEmail("");
    setPinflTouched(false);
    setPassportTouched(false);
    setShowHireForm(false);
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  // Mock local database
  const mockLocalEmployees: ExistingEmployee[] = [
    {
      id: "1",
      name: "Иванов Иван Иванович",
      position: "Менеджер",
      department: "Отдел продаж",
      isHired: true,
      isVerified: false,
      pinfl: "31234567890123",
      passport: "AB 1234567",
      employmentStatus: "active",
    },
    {
      id: "2",
      name: "Петров Петр Петрович",
      position: "Директор",
      department: "Руководство",
      isHired: true,
      isVerified: true,
      lastVerified: "2026-03-01",
      pinfl: "41234567890124",
      passport: "CD 7654321",
      employmentStatus: "active",
    },
    {
      id: "3",
      name: "Сидорова Мария Викторовна",
      position: "Бухгалтер",
      department: "Финансы",
      isHired: false,
      isVerified: false,
      pinfl: "55555555555555",
      passport: "EF 9876543",
      employmentStatus: "pending",
    },
  ];

  // Mock government database
  const mockGovernmentData: Record<string, SearchResult> = {
    "00000000000000": {
      pinfl: "00000000000000",
      firstName: "Тестовый",
      lastName: "Сотрудник",
      middleName: "Тестович",
      passport: "AA 0000000",
      birthDate: "01.01.2000",
      gender: "Мужской",
      nationality: "Узбекистан",
      address: "г. Ташкент, ул. Тестовая, д. 1",
      region: "Ташкент",
      photoUrl: "https://i.pravatar.cc/150?img=12",
      found: true,
    },
    "11111111111111": {
      pinfl: "11111111111111",
      firstName: "Алексей",
      lastName: "Сидоров",
      middleName: "Александрович",
      passport: "EF 1111111",
      birthDate: "01.01.1990",
      gender: "Мужской",
      nationality: "Узбекистан",
      address: "г. Ташкент, ул. Примерная, д. 1",
      region: "Ташкент",
      photoUrl: "https://i.pravatar.cc/150?img=13",
      found: true,
    },
    "31234567890123": {
      pinfl: "31234567890123",
      firstName: "Иван",
      lastName: "Иванов",
      middleName: "Иванович",
      passport: "AB 1234567",
      birthDate: "15.05.1985",
      gender: "Мужской",
      nationality: "Узбекистан",
      address: "г. Ташкент, ул. Мирабадская, д. 10",
      region: "Ташкент",
      photoUrl: "https://i.pravatar.cc/150?img=33",
      found: true,
    },
    "41234567890124": {
      pinfl: "41234567890124",
      firstName: "Петр",
      lastName: "Петров",
      middleName: "Петрович",
      passport: "CD 7654321",
      birthDate: "20.08.1975",
      gender: "Мужской",
      nationality: "Узбекистан",
      address: "г. Ташкент, ул. Центральная, д. 5",
      region: "Ташкент",
      photoUrl: "https://i.pravatar.cc/150?img=14",
      found: true,
    },
    "55555555555555": {
      pinfl: "55555555555555",
      firstName: "Ольга",
      lastName: "Смирнова",
      middleName: "Викторовна",
      passport: "AB 1234567",
      birthDate: "10.03.1992",
      gender: "Женский",
      nationality: "Узбекистан",
      address: "г. Ташкент, ул. Навои, д. 15",
      region: "Ташкент",
      photoUrl: "https://i.pravatar.cc/150?img=44",
      found: true,
    },
  };

  const handleSearch = async () => {
    if (!consentChecked) {
      toast.error(
        "Необходимо дать согласие на использование персональных данных"
      );
      return;
    }

    // Validation
    if (searchMethod === "pinfl") {
      const cleanPinfl = pinfl.replace(/\s/g, "");
      const validation = validatePinfl(cleanPinfl);
      
      if (!validation.valid) {
        toast.error(validation.error || "ПИНФЛ должен содержать 14 цифр");
        return;
      }
    } else {
      if (!passport || !birthDate) {
        toast.error("Заполните паспорт и дату рождения");
        return;
      }
      
      const cleanPassport = passport.replace(/\s/g, "");
      const validation = validatePassport(cleanPassport);
      
      if (!validation.valid) {
        toast.error(validation.error || "Введите корректный номер паспорта");
        return;
      }
    }

    setIsSearching(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const searchKey = searchMethod === "pinfl" 
      ? pinfl.replace(/\s/g, "") 
      : passport.replace(/\s/g, "");

    // Test cases
    if (searchKey === "99999999999999") {
      setSearchState("invalid-input");
      setIsSearching(false);
      toast.error("Неверный формат данных");
      setTimeout(() => {
        searchResultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
      return;
    }

    if (searchKey === "88888888888888") {
      setSearchState("api-error");
      setCurrentQuota((prev) => Math.max(0, prev - 1));
      setIsSearching(false);
      toast.error("Ошибка при обращении к госбазе");
      setTimeout(() => {
        searchResultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
      return;
    }

    if (searchKey === "77777777777777") {
      setSearchState("no-connection");
      setIsSearching(false);
      toast.error("Нет соединения с сервером");
      setTimeout(() => {
        searchResultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
      return;
    }

    // Check local database first
    const localMatch = mockLocalEmployees.find(
      (emp) => emp.pinfl === searchKey || emp.passport.replace(/\s/g, "") === searchKey
    );

    if (localMatch) {
      const govData = mockGovernmentData[localMatch.pinfl];
      
      // Check for data conflict between local and government records
      if (govData) {
        const hasNameConflict = 
          `${govData.lastName} ${govData.firstName} ${govData.middleName}` !== localMatch.name;
        
        const hasPassportConflict = 
          localMatch.passport.replace(/\s/g, "") !== govData.passport.replace(/\s/g, "");
        
        if (hasNameConflict || hasPassportConflict) {
          // Data conflict detected!
          setSearchState("found-merge-conflict");
          setSearchResult(govData);
          setExistingEmployee(localMatch);
          setConflictEmployee(localMatch);
          setCurrentQuota((prev) => Math.max(0, prev - 1));
          toast.warning("Обнаружен конфликт данных");
          setCurrentStep("result");
          setIsSearching(false);
          return;
        }
      }
      
      setExistingEmployee(localMatch);
      setSearchResult(govData || null);

      if (localMatch.isVerified) {
        setSearchState("found-duplicate-verified");
        toast.info("Сотрудник найден в локальной базе (подтвержден)");
      } else {
        setSearchState("found-duplicate-unverified");
        toast.warning("Сотрудник найден в локальной базе (не подтвержден)");
      }
      
      setCurrentQuota((prev) => Math.max(0, prev - 1));
      setCurrentStep("result");
      setIsSearching(false);
      return;
    }

    // Check government database
    const govData = mockGovernmentData[searchKey];

    if (govData) {
      // Check for merge conflict
      const conflictingEmployee = mockLocalEmployees.find((emp) => {
        return (
          (emp.pinfl === govData.pinfl && emp.passport.replace(/\s/g, "") !== govData.passport.replace(/\s/g, "")) ||
          (emp.passport.replace(/\s/g, "") === govData.passport.replace(/\s/g, "") && emp.pinfl !== govData.pinfl)
        );
      });

      if (conflictingEmployee) {
        setSearchState("found-merge-conflict");
        setSearchResult(govData);
        setExistingEmployee(conflictingEmployee);
        setConflictEmployee(conflictingEmployee);
        setCurrentQuota((prev) => Math.max(0, prev - 1));
        toast.warning("Обнаружен конфликт данных");
        setCurrentStep("result");
        setIsSearching(false);
        return;
      }

      // New employee - prefill contact data
      setSearchState("found-new");
      setSearchResult(govData);
      setCurrentQuota((prev) => Math.max(0, prev - 1));
      toast.success("Сотрудник успешно добавлен");
      setCurrentStep("result");
      setIsSearching(false);
      return;
    }

    // Not found
    setSearchState("not-found");
    setCurrentQuota((prev) => Math.max(0, prev - 1));
    toast.error("Не найдено в госбазе");
    setIsSearching(false);
    setTimeout(() => {
      searchResultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  const handleUpdateData = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check for conflict after update
    const hasConflict = Math.random() > 0.7;

    if (hasConflict) {
      setSearchState("merge");
      const conflictEmp: ExistingEmployee = {
        id: "3",
        name: "Николаев Николай Николаевич",
        position: "Специалист",
        department: "Отдел разработки",
        isHired: true,
        isVerified: false,
        pinfl: "66666666666666",
        passport: searchResult?.passport || "",
        employmentStatus: "active",
      };
      setConflictEmployee(conflictEmp);
      setCurrentQuota((prev) => Math.max(0, prev - 1));
      toast.warning("Обнаружен конфликт после обновления данных");
    } else {
      setSearchState("updated");
      if (existingEmployee) {
        existingEmployee.isVerified = true;
        existingEmployee.lastVerified = new Date().toISOString().split("T")[0];
      }
      setCurrentQuota((prev) => Math.max(0, prev - 1));
      toast.success("Данные сотрудника обновлены из госбазы");
    }

    setIsSaving(false);
  };

  const handleMergeSelect = async () => {
    if (!selectedMergeCard) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSearchState("updated");
    if (existingEmployee) {
      existingEmployee.isVerified = true;
    }
    toast.success(
      `Записи успешно объединены. Основная: ${
        selectedMergeCard === "local" ? "Локальная запись" : "Данные из госбазы"
      }`
    );
    setSelectedMergeCard(null);
    setConflictEmployee(null);
    setIsSaving(false);
  };

  const handleEmploymentAction = async (
    action: "work" | "gph" | "save",
    contactData?: { phone?: string; email?: string }
  ) => {
    // If action is "work", show hire form
    if (action === "work") {
      setShowHireForm(true);
      return;
    }
    
    // Validate manual form if on manual step
    if (currentStep === "manual") {
      if (
        !manualForm.firstName ||
        !manualForm.lastName ||
        !manualForm.birthDate
      ) {
        toast.error(
          "Заполните обязательные поля: Имя, Фамилия, Дата рождения"
        );
        return;
      }
    }

    setCurrentAction(action);
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const messages = {
      work: "Сотрудник добавлен и принят на работу",
      gph: "Сотрудник добавлен и принят на ГПХ",
      save: "Сотрудник добавлен в систему",
    };

    // Log contact data if provided
    if (contactData?.phone || contactData?.email) {
      console.log("Contact data saved:", contactData);
    }

    toast.success(messages[action]);
    setIsSaving(false);
    setCurrentAction(null);

    // Close wizard and call success callback
    setTimeout(() => {
      handleClose();
      onSuccess?.();
    }, 500);
  };
  
  const handleHireSubmit = async (hireData: HireFormData) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Hire data:", hireData);
    console.log("Contact data:", { phone: phoneNumber, email });
    
    toast.success("Сотрудник успешно принят на работу!");
    setIsSaving(false);
    setShowHireForm(false);
    
    // Close wizard and call success callback
    setTimeout(() => {
      handleClose();
      onSuccess?.();
    }, 500);
  };

  if (!isOpen) return null;

  // Step indicator
  const steps = [
    { key: "search", label: "Поиск" },
    { key: "result", label: "Результат" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <TooltipProvider>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <UserPlus size={20} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentStep === "search" && "Добавить сотрудника"}
                  {currentStep === "result" && "Результат поиска"}
                  {currentStep === "manual" && "Ручное добавление"}
                </h2>
                <p className="text-sm text-gray-500">
                  {currentStep === "search" && "Поиск в государствен��ой базе данных"}
                  {currentStep === "result" && "Проверка и подтверждение данных"}
                  {currentStep === "manual" && "Заполнение информации вручную"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Step Indicator */}
              {currentStep !== "manual" && (
                <div className="flex items-center gap-3">
                  {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 ${
                          index <= currentStepIndex
                            ? "bg-teal-600 shadow-lg shadow-teal-600/30"
                            : "bg-gray-100"
                        }`}
                      >
                        {/* Circle with icon/number */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            index < currentStepIndex
                              ? "bg-white text-teal-600"
                              : index === currentStepIndex
                              ? "bg-white text-teal-600 ring-2 ring-white/50"
                              : "bg-white text-gray-400"
                          }`}
                        >
                          {index < currentStepIndex ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                              <Check size={14} strokeWidth={3} />
                            </motion.div>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        
                        {/* Label */}
                        <span className={`text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
                          index <= currentStepIndex
                            ? "text-white"
                            : "text-gray-500"
                        }`}>
                          {step.label}
                        </span>
                      </motion.div>
                      
                      {/* Connector line */}
                      {index < steps.length - 1 && (
                        <div className="relative w-8 h-0.5 overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className="absolute inset-0 bg-teal-600"
                            initial={{ x: "-100%" }}
                            animate={{ 
                              x: index < currentStepIndex ? "0%" : "-100%"
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="p-8"
              >
              {currentStep === "search" && (
                <SearchStep
                  searchMethod={searchMethod}
                  setSearchMethod={setSearchMethod}
                  pinfl={pinfl}
                  setPinfl={setPinfl}
                  passport={passport}
                  setPassport={setPassport}
                  birthDate={birthDate}
                  setBirthDate={setBirthDate}
                  consentChecked={consentChecked}
                  setConsentChecked={setConsentChecked}
                  isSearching={isSearching}
                  handleSearch={handleSearch}
                  setCurrentStep={setCurrentStep}
                  currentQuota={currentQuota}
                  maxQuota={maxQuota}
                  quotaPercentage={quotaPercentage}
                  isQuotaLow={isQuotaLow}
                  searchState={searchState}
                  searchResultRef={searchResultRef}
                  pinflInputRef={pinflInputRef}
                  passportInputRef={passportInputRef}
                  pinflTouched={pinflTouched}
                  setPinflTouched={setPinflTouched}
                  passportTouched={passportTouched}
                  setPassportTouched={setPassportTouched}
                />
              )}

              {currentStep === "result" && (
                <ResultStep
                  searchState={searchState}
                  setCurrentStep={setCurrentStep}
                  searchResult={searchResult}
                  existingEmployee={existingEmployee}
                  conflictEmployee={conflictEmployee}
                  selectedMergeCard={selectedMergeCard}
                  setSelectedMergeCard={setSelectedMergeCard}
                  isSaving={isSaving}
                  handleUpdateData={handleUpdateData}
                  handleMergeSelect={handleMergeSelect}
                  handleEmploymentAction={handleEmploymentAction}
                  handleClose={handleClose}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  email={email}
                  setEmail={setEmail}
                  showHireForm={showHireForm}
                  setShowHireForm={setShowHireForm}
                  handleHireSubmit={handleHireSubmit}
                />
              )}

              {currentStep === "manual" && (
                <ManualStep
                  setCurrentStep={setCurrentStep}
                  manualForm={manualForm}
                  setManualForm={setManualForm}
                  isSaving={isSaving}
                  currentAction={currentAction}
                  handleEmploymentAction={handleEmploymentAction}
                />
              )}
            </motion.div>
          </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}

// Search Step Component
function SearchStep({
  searchMethod,
  setSearchMethod,
  pinfl,
  setPinfl,
  passport,
  setPassport,
  birthDate,
  setBirthDate,
  consentChecked,
  setConsentChecked,
  isSearching,
  handleSearch,
  setCurrentStep,
  currentQuota,
  maxQuota,
  quotaPercentage,
  isQuotaLow,
  searchState,
  searchResultRef,
  pinflInputRef,
  passportInputRef,
  pinflTouched,
  setPinflTouched,
  passportTouched,
  setPassportTouched,
}: any) {
  const pinflValidation = pinfl ? validatePinfl(pinfl.replace(/\s/g, "")) : { valid: false };
  const passportValidation = passport ? validatePassport(passport.replace(/\s/g, "")) : { valid: false };

  const handlePinflChange = (value: string) => {
    const formatted = formatPinfl(value);
    setPinfl(formatted);
  };

  const handlePassportChange = (value: string) => {
    const formatted = formatPassport(value);
    setPassport(formatted);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Quota Panel */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Info size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                Квота: Март 2026
              </h3>
              <p className="text-sm text-blue-700">
                {isQuotaLow
                  ? `Осталось ${currentQuota} запросов`
                  : "Доступно запросов к госбазе"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">
              {currentQuota}
            </div>
            <div className="text-sm text-blue-700">из {maxQuota}</div>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="relative w-full bg-blue-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${quotaPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full transition-colors duration-500 ${
              isQuotaLow
                ? "bg-orange-500"
                : "bg-gradient-to-r from-[#1bc5bd] to-[#0ea89e]"
            }`}
          >
            <div className="h-full w-full bg-white/20 animate-pulse" />
          </motion.div>
        </div>
        
        <p className="text-xs text-blue-600 mt-3">
          Поиск в госбазе и обновление данных расходуют квоту
        </p>
      </div>

      {/* Search Method Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Способ поиска
        </label>
        <div className="inline-flex items-center bg-gray-100 p-1.5 rounded-lg">
          <button
            type="button"
            onClick={() => {
              if (searchMethod !== "pinfl") {
                setSearchMethod("pinfl");
                setPassport("");
                setBirthDate("");
                setPassportTouched(false);
                setTimeout(() => pinflInputRef.current?.focus(), 100);
              }
            }}
            className={`px-6 py-2.5 rounded-md transition-all font-medium ${
              searchMethod === "pinfl"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            По ПИНФЛ
          </button>
          <button
            type="button"
            onClick={() => {
              if (searchMethod !== "passport") {
                setSearchMethod("passport");
                setPinfl("");
                setPinflTouched(false);
                setTimeout(() => passportInputRef.current?.focus(), 100);
              }
            }}
            className={`px-6 py-2.5 rounded-md transition-all font-medium ${
              searchMethod === "passport"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            По паспорту
          </button>
        </div>
      </div>

      {/* Search Fields */}
      <div className="space-y-6">
        {searchMethod === "pinfl" ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="pinfl" className="text-sm font-semibold text-gray-700">
                ПИНФЛ <span className="text-red-500">*</span>
              </Label>
              
              {/* Validation Indicator */}
              {pinflTouched && pinfl && (
                <div className="flex items-center gap-1.5">
                  {pinflValidation.valid ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-[#1bc5bd] text-xs font-medium"
                    >
                      <CheckCircle2 size={14} />
                      Корректный формат
                    </motion.div>
                  ) : pinflValidation.error ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-orange-600 text-xs font-medium"
                    >
                      <AlertCircle size={14} />
                      {pinflValidation.error}
                    </motion.div>
                  ) : null}
                </div>
              )}
            </div>
            
            <div className="relative">
              <Input
                ref={pinflInputRef}
                id="pinfl"
                value={pinfl}
                onChange={(e) => {
                  handlePinflChange(e.target.value);
                  setPinflTouched(true);
                }}
                onBlur={() => setPinflTouched(true)}
                placeholder="12345 67890 1234"
                maxLength={16}
                className={`h-12 text-lg pr-10 transition-all ${
                  pinflTouched && pinfl
                    ? pinflValidation.valid
                      ? "border-[#a8f0eb] focus:border-[#1bc5bd] focus:ring-[#1bc5bd]"
                      : "border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    : ""
                }`}
              />
              
              {/* Validation Icon */}
              {pinflTouched && pinfl && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {pinflValidation.valid ? (
                    <CheckCircle2 size={20} className="text-[#1bc5bd]" />
                  ) : (
                    <AlertCircle size={20} className="text-orange-500" />
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-start justify-between mt-2">
              <p className="text-sm text-gray-500">
                Введите 14-значный ПИНФЛ сотрудника
              </p>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-gray-400 hover:text-gray-600">
                    <HelpCircle size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">Формат ПИНФЛ:</p>
                    <p>• 14 цифр</p>
                    <p>• Пример: 12345 67890 1234</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="passport" className="text-sm font-semibold text-gray-700">
                  Паспорт <span className="text-red-500">*</span>
                </Label>
                
                {/* Validation Indicator */}
                {passportTouched && passport && (
                  <div className="flex items-center gap-1.5">
                    {passportValidation.valid ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 text-[#1bc5bd] text-xs font-medium"
                      >
                        <CheckCircle2 size={14} />
                      </motion.div>
                    ) : passportValidation.error ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 text-orange-600 text-xs font-medium cursor-help"
                          >
                            <AlertCircle size={14} />
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{passportValidation.error}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : null}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Input
                  ref={passportInputRef}
                  id="passport"
                  value={passport}
                  onChange={(e) => {
                    handlePassportChange(e.target.value);
                    setPassportTouched(true);
                  }}
                  onBlur={() => setPassportTouched(true)}
                  placeholder="AB 1234567"
                  maxLength={10}
                  className={`h-12 pr-10 ${
                    passportTouched && passport
                      ? passportValidation.valid
                        ? "border-[#a8f0eb] focus:border-[#1bc5bd] focus:ring-[#1bc5bd]"
                        : "border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                      : ""
                  }`}
                />
                
                {/* Validation Icon */}
                {passportTouched && passport && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passportValidation.valid ? (
                      <CheckCircle2 size={20} className="text-[#1bc5bd]" />
                    ) : (
                      <AlertCircle size={20} className="text-orange-500" />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-500">
                  Формат: AA 1234567
                </p>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-gray-400 hover:text-gray-600">
                      <HelpCircle size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p className="font-semibold">Формат паспорта:</p>
                      <p>• 2 заглавные бу��вы</p>
                      <p>• 7 цифр</p>
                      <p>• Пример: AB 1234567</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div>
              <Label htmlFor="birthDate" className="text-sm font-semibold text-gray-700 mb-2 block">
                Дата рождения <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        )}
      </div>

      {/* Consent Checkbox */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer group">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={consentChecked}
            onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="consent" className="text-sm leading-relaxed text-gray-700 cursor-pointer">
            Даю согласие на обработку персональных данных в соответствии с{" "}
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="text-teal-600 hover:text-teal-700 underline font-medium transition-colors"
            >
              политикой конфиденциальности
            </a>
          </Label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !consentChecked}
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 h-12 text-base font-medium shadow-lg shadow-teal-600/30 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  <span>Поиск в госбазе</span>
                  <motion.span
                    className="ml-1"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ...
                  </motion.span>
                </>
              ) : (
                <>
                  <Search size={20} className="mr-2" />
                  Добавить из госбазы
                </>
              )}
            </Button>
          </TooltipTrigger>
          {!consentChecked && (
            <TooltipContent>
              <p className="text-xs">Необходимо дать согласие</p>
            </TooltipContent>
          )}
        </Tooltip>
        
        <Button
          variant="outline"
          onClick={() => setCurrentStep("manual")}
          size="lg"
          className="h-12 px-8 text-base font-medium border-2"
        >
          <UserPlus size={20} className="mr-2" />
          Добавить вручную
        </Button>
      </div>

      {/* Search Result Notifications */}
      {searchState !== "idle" && (
        <motion.div
          ref={searchResultRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6"
        >
          {searchState === "not-found" && (
            <NotFoundAlert setCurrentStep={setCurrentStep} />
          )}
          {searchState === "invalid-input" && <InvalidInputAlert />}
          {searchState === "api-error" && <ApiErrorAlert />}
          {searchState === "no-connection" && <NoConnectionAlert />}
        </motion.div>
      )}
    </div>
  );
}

// Notification Components
function NotFoundAlert({ setCurrentStep }: any) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <HelpCircle size={24} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Не найдено в госба��е
          </h3>
          <p className="text-sm text-blue-700 mb-4 leading-relaxed">
            По указанным данным информация в государственной базе не найдена.
            Возможно, данные были введены некорректно или сотрудник отсутствует
            в системе.
          </p>
          <div className="bg-white/60 rounded-lg p-4 mb-4">
            <p className="font-semibold text-blue-900 mb-2 text-sm">Рекомендации:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                <span>Проверьте правильность введенного ПИНФЛ или паспорта</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                <span>Убедитесь, что дата рождения указана верно</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                <span>Попробуйте использовать альтернативный способ поиска</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                <span>Добавьте сотрудника вручную, если данные отсутствуют в госбазе</span>
              </li>
            </ul>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentStep("manual")}
            className="border-[#4a7dff]/40 hover:bg-[#4a7dff]/5 text-[#4a7dff] font-medium"
          >
            <UserPlus size={16} className="mr-2" />
            Добавить вручную
          </Button>
        </div>
      </div>
    </div>
  );
}

function InvalidInputAlert() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={24} className="text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            Неверный формат данных
          </h3>
          <p className="text-sm text-orange-700 mb-4 leading-relaxed">
            Введенные данные не соответствуют формату, принятому в
            государственной базе данных.
          </p>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="font-semibold text-orange-900 mb-2 text-sm">Возможные причины:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-orange-700">
                <span className="text-orange-400 mt-1">•</span>
                <span>ПИНФЛ содержит недопустимые символы</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-orange-700">
                <span className="text-orange-400 mt-1">•</span>
                <span>Неверная серия или номер ��аспорта</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-orange-700">
                <span className="text-orange-400 mt-1">•</span>
                <span>Дата рождения не соответствует формату</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiErrorAlert() {
  return (
    <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <XCircle size={24} className="text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Ошибка при обращении к госбазе
          </h3>
          <p className="text-sm text-red-700 mb-4 leading-relaxed">
            Не удалось получить данные из государственной базы. Возможно,
            сервис временно недоступен или произошла техническая ошибка.
          </p>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="font-semibold text-red-900 mb-2 text-sm">Что делать:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-red-700">
                <span className="text-red-400 mt-1">•</span>
                <span>Попробуйте повторить запрос через несколько минут</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-700">
                <span className="text-red-400 mt-1">•</span>
                <span>Проверьте стабильность интернет-соединения</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-700">
                <span className="text-red-400 mt-1">•</span>
                <span>Если проблема сохраняется, обратитесь в техподдержку</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoConnectionAlert() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <WifiOff size={24} className="text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Нет соединения с сервером
          </h3>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Не удалось установить соединение с сервером госбазы. Проверьте
            подключение к интернету и повторите попытку.
          </p>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2 text-sm">Рекомендации:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-1">•</span>
                <span>Проверьте подключение к интернету</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-1">•</span>
                <span>Убедитесь, что VPN или прокси не блокируют доступ</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-1">•</span>
                <span>Попробуйте перезагрузить страницу</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Result Step Component
function ResultStep({
  searchState,
  setCurrentStep,
  searchResult,
  existingEmployee,
  conflictEmployee,
  selectedMergeCard,
  setSelectedMergeCard,
  isSaving,
  handleUpdateData,
  handleMergeSelect,
  handleEmploymentAction,
  handleClose,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  showHireForm,
  setShowHireForm,
  handleHireSubmit,
}: any) {
  // Determine status for SmartPanel
  const getSmartPanelStatus = () => {
    if (searchState === "found-merge-conflict" || searchState === "merge") {
      return "merge-conflict";
    }
    if (searchState === "found-duplicate-unverified") {
      return "found-duplicate-unverified";
    }
    if (searchState === "found-duplicate-verified" || searchState === "updated") {
      return "found-duplicate-verified";
    }
    return "found-new";
  };

  return (
    <div className="flex gap-4 items-start min-h-[500px]">
      {/* Main Content */}
      <div className="flex-1 space-y-3">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setCurrentStep("search")}
          className="flex items-center gap-2 -ml-2 hover:bg-gray-100 h-9"
          size="sm"
        >
          <ChevronLeft size={18} />
          Назад к поиску
        </Button>

      {/* Status Notification */}
      {searchState === "found-duplicate-verified" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-0.5">
                Сотрудник уже существует
              </h3>
              <p className="text-sm text-blue-700">
                Данный сотрудник уже есть в системе с подтвержденными данными
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {searchState === "found-duplicate-unverified" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900 mb-0.5">
                Сотрудник найден в системе
              </h3>
              <p className="text-sm text-orange-700">
                Сотрудник существует, но данные не подтверждены. Обновите данные из госбазы.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {searchState === "updated" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#e6f9f8] to-[#d1f4f2] border-2 border-[#a8f0eb] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#d1f4f2] rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-[#1bc5bd]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#138b86] mb-0.5">
                Данные обновлены
              </h3>
              <p className="text-sm text-[#138b86]">
                Данные сотрудника успешно обновлены из госбазы и подтверждены
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {searchState === "found-new" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#e6f9f8] to-[#d1f4f2] border-2 border-[#a8f0eb] rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#d1f4f2] rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-[#1bc5bd]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#138b86] mb-0.5">
                Новый сотрудник найден
              </h3>
              <p className="text-sm text-[#138b86]">
                Данные получены из госбазы и готовы для оформления
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {(searchState === "found-merge-conflict" || searchState === "merge") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900 mb-0.5">
                Обнаружен конфликт данных
              </h3>
              <p className="text-sm text-orange-700">
                {searchState === "merge"
                  ? "После обновления данных обнаружено совпадение с другой записью."
                  : "Найдены две записи с частично совпадающими данными."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Employee Cards */}
      {(searchState === "found-merge-conflict" || searchState === "merge") &&
      conflictEmployee ? (
        <MergeConflictCards
          existingEmployee={existingEmployee}
          searchResult={searchResult}
          selectedMergeCard={selectedMergeCard}
          setSelectedMergeCard={setSelectedMergeCard}
          isSaving={isSaving}
          handleMergeSelect={handleMergeSelect}
        />
      ) : (
        <EmployeeCard
          searchState={searchState}
          searchResult={searchResult}
          existingEmployee={existingEmployee}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          email={email}
          setEmail={setEmail}
        />
      )}

      </div>

      {/* Smart Panel Actions or Hire Form */}
      <div className={showHireForm ? "w-[500px] flex-shrink-0 pt-12" : "w-80 flex-shrink-0 pt-12"}>
        <AnimatePresence mode="wait">
          {showHireForm ? (
            <HireEmployeeForm
              key="hire-form"
              onSubmit={handleHireSubmit}
              onCancel={() => setShowHireForm(false)}
              employeeName={
                searchResult
                  ? `${searchResult.lastName} ${searchResult.firstName} ${searchResult.middleName}`
                  : undefined
              }
            />
          ) : (
            <SmartPanelActions
              key="smart-panel"
              status={getSmartPanelStatus()}
              employmentStatus="not-working"
              isSaving={isSaving}
              onHire={() => handleEmploymentAction("work", { phone: phoneNumber, email })}
              onGPH={() => handleEmploymentAction("gph", { phone: phoneNumber, email })}
              onSave={() => handleEmploymentAction("save", { phone: phoneNumber, email })}
              onUpdate={handleUpdateData}
              onViewProfile={() => toast.info("Открытие профиля...")}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmployeeCard({
  searchState,
  searchResult,
  existingEmployee,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
}: any) {
  const isVerified =
    searchState === "found-duplicate-verified" || searchState === "updated";
  const isNew = searchState === "found-new";
  const isUnverified = searchState === "found-duplicate-unverified";
  
  // Track if contact data was changed
  const hasContactData = phoneNumber || email;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="relative">
          <Avatar className="w-12 h-12 ring-2 ring-gray-100">
            <AvatarImage
              src={searchResult?.photoUrl || existingEmployee?.photoUrl}
            />
            <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white text-base font-semibold">
              {searchResult?.firstName?.[0] || existingEmployee?.name?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900">
              {existingEmployee?.name ||
                `${searchResult?.lastName} ${searchResult?.firstName} ${searchResult?.middleName}`}
            </h3>
            {/* Status icons */}
            {isVerified || searchResult ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center text-[#1bc5bd]"
                title="Подтвержден"
              >
                <CheckCircle2 size={16} />
              </motion.span>
            ) : (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`inline-flex items-center ${
                  isUnverified ? "text-orange-600" : "text-red-600"
                }`}
                title={isUnverified ? "Требует обновления" : "Невалидные данные"}
              >
                {isUnverified ? <Clock size={16} /> : <AlertTriangle size={16} />}
              </motion.span>
            )}
          </div>
          {existingEmployee?.isHired ? (
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-600">
                {existingEmployee.position} • {existingEmployee.department}
              </p>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-teal-500 text-white">
                Принят
              </span>
            </div>
          ) : (
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-300 text-gray-700">
                Не принят
              </span>
            </div>
          )}
        </div>
      </div>



      {/* Government Data */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Данные из госбазы
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {searchResult?.pinfl && (
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">ПИНФЛ</Label>
              <div className="bg-gray-100 rounded px-3 py-2">
                <p className="font-mono text-xs text-gray-900">{formatPinfl(searchResult.pinfl)}</p>
              </div>
            </div>
          )}
          
          {searchResult?.passport && (
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Паспорт</Label>
              <div className="bg-gray-100 rounded px-3 py-2">
                <p className="font-mono text-xs text-gray-900">{searchResult.passport}</p>
              </div>
            </div>
          )}
          
          {searchResult?.birthDate && (
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Дата рождения</Label>
              <div className="bg-gray-100 rounded px-3 py-2">
                <p className="text-xs text-gray-900">{searchResult.birthDate}</p>
              </div>
            </div>
          )}
          {searchResult?.gender && (
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Пол</Label>
              <div className="bg-gray-100 rounded px-3 py-2">
                <p className="text-xs text-gray-900">{searchResult.gender}</p>
              </div>
            </div>
          )}
          
          {searchResult?.nationality && (
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Национальность</Label>
              <div className="bg-gray-100 rounded px-3 py-2">
                <p className="text-xs text-gray-900">{searchResult.nationality}</p>
              </div>
            </div>
          )}
          
          {searchResult?.region && (
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Регион</Label>
              <div className="bg-gray-100 rounded px-3 py-2">
                <p className="text-xs text-gray-900">{searchResult.region}</p>
              </div>
            </div>
          )}
          
          {searchResult?.address && (
            <div className="col-span-3">
              <Label className="text-xs text-gray-500 mb-1 block">Адрес</Label>
              <div className="bg-gray-100 rounded px-3 py-2">
                <p className="text-xs text-gray-900">{searchResult.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Data for New Employee */}
      {isNew && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.2 }}
          className="pt-4 border-t border-gray-200"
        >
          {/* Eye-catching header with background */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-3 mb-3"
          >
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-[#4a7dff] rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-blue-900 mb-0.5">
                  Добавьте контактные данные
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Укажите телефон и email для связи с сотрудником.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone" className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Phone size={12} className="text-[#4a7dff]" />
                Телефон
              </Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+998 90 123 45 67"
                className={`h-9 text-sm transition-all ${phoneNumber ? 'border-[#4a7dff]/60 bg-[#4a7dff]/5 focus:border-[#4a7dff] focus:ring-4 focus:ring-[#4a7dff]/20' : 'focus:border-[#4a7dff] focus:ring-4 focus:ring-[#4a7dff]/20'}`}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Mail size={12} className="text-blue-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className={`h-9 text-sm transition-all ${email ? 'border-[#4a7dff]/60 bg-[#4a7dff]/5 focus:border-[#4a7dff] focus:ring-4 focus:ring-[#4a7dff]/20' : 'focus:border-[#4a7dff] focus:ring-4 focus:ring-[#4a7dff]/20'}`}
              />
            </div>
          </div>
          
          {hasContactData && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-1.5 text-xs text-teal-600 font-medium"
            >
              <CheckCircle2 size={14} />
              Контактные данные добавлены
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function MergeConflictCards({
  existingEmployee,
  searchResult,
  selectedMergeCard,
  setSelectedMergeCard,
  isSaving,
  handleMergeSelect,
}: any) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          Выберите основную запись
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          Данные из выбранной записи будут использованы для объединения
        </p>
        <div className="grid grid-cols-2 gap-3">
          {/* Local Record */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Локальная запись
              </span>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMergeCard("local")}
              className={`w-full bg-gradient-to-br from-white to-gray-50 border-2 rounded-lg p-3 text-left transition-all ${
                selectedMergeCard === "local"
                  ? "border-[#4a7dff] ring-2 ring-[#4a7dff]/20 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
              <Avatar className="w-10 h-10 ring-2 ring-white">
                <AvatarImage src={existingEmployee?.photoUrl} />
                <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-sm font-semibold">
                  {existingEmployee?.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMergeCard === "local"
                  ? "border-[#4a7dff] bg-[#4a7dff]"
                  : "border-gray-300 bg-white"
              }`}>
                {selectedMergeCard === "local" && (
                  <Check size={14} className="text-white" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-gray-900">{existingEmployee?.name}</h3>
              <span className="inline-flex items-center text-red-600" title="Невалидные данные">
                <AlertTriangle size={14} />
              </span>
            </div>
            {existingEmployee?.isHired ? (
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs text-gray-600">
                  {existingEmployee?.position} • {existingEmployee?.department}
                </p>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-teal-500 text-white">
                  Принят
                </span>
              </div>
            ) : (
              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-300 text-gray-700">
                  Не принят
                </span>
              </div>
            )}
            <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Паспорт</span>
                <span className="font-mono text-xs text-gray-900">{existingEmployee?.passport}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Паспорт</span>
                <span className="font-mono text-xs text-gray-900">{existingEmployee?.passport}</span>
              </div>
            </div>
            </motion.button>
          </div>

          {/* Government Data */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Данные из госбазы
              </span>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMergeCard("government")}
              className={`w-full bg-gradient-to-br from-white to-gray-50 border-2 rounded-lg p-3 text-left transition-all ${
                selectedMergeCard === "government"
                  ? "border-[#4a7dff] ring-2 ring-[#4a7dff]/20 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
              <Avatar className="w-10 h-10 ring-2 ring-white">
                <AvatarImage src={searchResult?.photoUrl} />
                <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-600 text-white text-sm font-semibold">
                  {searchResult?.firstName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedMergeCard === "government"
                  ? "border-[#4a7dff] bg-[#4a7dff]"
                  : "border-gray-300 bg-white"
              }`}>
                {selectedMergeCard === "government" && (
                  <Check size={14} className="text-white" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-gray-900">
                {searchResult?.lastName} {searchResult?.firstName}{" "}
                {searchResult?.middleName}
              </h3>
              <span className="inline-flex items-center text-[#1bc5bd]" title="Подтвержден">
                <CheckCircle2 size={14} />
              </span>
            </div>
            <div className="mb-2">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-300 text-gray-700">
                Не принят
              </span>
            </div>
            <div className="space-y-2 mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Паспорт</span>
                <span className="font-mono text-xs text-gray-900">{searchResult?.passport}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Паспорт</span>
                <span className="font-mono text-xs text-gray-900">{searchResult?.passport}</span>
              </div>
            </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Merge Button */}
      <Button
        onClick={handleMergeSelect}
        disabled={isSaving || !selectedMergeCard}
        className="w-full bg-teal-600 hover:bg-teal-700 h-10 shadow-lg disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2 size={18} className="animate-spin mr-2" />
            Объединение записей...
          </>
        ) : (
          <>
            <GitMerge size={18} className="mr-2" />
            Объединить записи
          </>
        )}
      </Button>
      {!selectedMergeCard && !isSaving && (
        <p className="text-xs text-gray-500 text-center -mt-1">
          Выберите основную запись для объединения
        </p>
      )}
    </div>
  );
}

// Manual Step Component
function ManualStep({
  setCurrentStep,
  manualForm,
  setManualForm,
  isSaving,
  currentAction,
  handleEmploymentAction,
}: any) {
  // Validation: check required fields
  const isFormValid = 
    manualForm.lastName?.trim() && 
    manualForm.firstName?.trim() && 
    manualForm.birthDate;
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setCurrentStep("search")}
        className="flex items-center gap-2 -ml-2 hover:bg-gray-100"
      >
        <ChevronLeft size={20} />
        Назад к поиску
      </Button>

      {/* Personal Data Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <UserPlus size={20} className="text-teal-600" />
          </div>
          Личные данные
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
              Фамилия <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              value={manualForm.lastName}
              onChange={(e) =>
                setManualForm({ ...manualForm, lastName: e.target.value })
              }
              className="mt-2 h-12"
              placeholder="Иванов"
            />
          </div>
          <div>
            <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
              Имя <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              value={manualForm.firstName}
              onChange={(e) =>
                setManualForm({ ...manualForm, firstName: e.target.value })
              }
              className="mt-2 h-12"
              placeholder="Иван"
            />
          </div>
          <div>
            <Label htmlFor="middleName" className="text-sm font-semibold text-gray-700">Отчество</Label>
            <Input
              id="middleName"
              value={manualForm.middleName}
              onChange={(e) =>
                setManualForm({ ...manualForm, middleName: e.target.value })
              }
              className="mt-2 h-12"
              placeholder="Иванович"
            />
          </div>
          <div>
            <Label htmlFor="manualBirthDate" className="text-sm font-semibold text-gray-700">
              Дата рождения <span className="text-red-500">*</span>
            </Label>
            <Input
              id="manualBirthDate"
              type="date"
              value={manualForm.birthDate}
              onChange={(e) =>
                setManualForm({ ...manualForm, birthDate: e.target.value })
              }
              className="mt-2 h-12"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Пол</Label>
            <Input
              id="gender"
              value={manualForm.gender}
              onChange={(e) =>
                setManualForm({ ...manualForm, gender: e.target.value })
              }
              placeholder="Мужской / Женский"
              className="mt-2 h-12"
            />
          </div>
        </div>
      </motion.div>

      {/* Documents Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-blue-600" />
          </div>
          Документы
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="passportSeries" className="text-sm font-semibold text-gray-700">Серия паспорта</Label>
            <Input
              id="passportSeries"
              value={manualForm.passportSeries}
              onChange={(e) =>
                setManualForm({
                  ...manualForm,
                  passportSeries: e.target.value.toUpperCase(),
                })
              }
              maxLength={2}
              placeholder="AB"
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label htmlFor="passportNumber" className="text-sm font-semibold text-gray-700">Номер паспорта</Label>
            <Input
              id="passportNumber"
              value={manualForm.passportNumber}
              onChange={(e) =>
                setManualForm({
                  ...manualForm,
                  passportNumber: e.target.value.replace(/\D/g, ""),
                })
              }
              maxLength={7}
              placeholder="1234567"
              className="mt-2 h-12"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="manualPinfl" className="text-sm font-semibold text-gray-700">ПИНФЛ</Label>
            <Input
              id="manualPinfl"
              value={formatPinfl(manualForm.pinfl)}
              onChange={(e) =>
                setManualForm({
                  ...manualForm,
                  pinfl: e.target.value.replace(/\D/g, ""),
                })
              }
              maxLength={16}
              placeholder="12345 67890 1234"
              className="mt-2 h-12"
            />
            <p className="text-sm text-gray-500 mt-2">
              Введите 14-значный ПИНФЛ сотрудника
            </p>
          </div>
        </div>
      </motion.div>

      {/* Address Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <MapPin size={20} className="text-purple-600" />
          </div>
          Адрес
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="region" className="text-sm font-semibold text-gray-700">Регион</Label>
            <Input
              id="region"
              value={manualForm.region}
              onChange={(e) =>
                setManualForm({ ...manualForm, region: e.target.value })
              }
              className="mt-2 h-12"
              placeholder="Ташкент"
            />
          </div>
          <div>
            <Label htmlFor="nationality" className="text-sm font-semibold text-gray-700">Национальность</Label>
            <Input
              id="nationality"
              value={manualForm.nationality}
              onChange={(e) =>
                setManualForm({ ...manualForm, nationality: e.target.value })
              }
              className="mt-2 h-12"
              placeholder="Узбекистан"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Адрес</Label>
            <Input
              id="address"
              value={manualForm.address}
              onChange={(e) =>
                setManualForm({ ...manualForm, address: e.target.value })
              }
              className="mt-2 h-12"
              placeholder="г. Ташкент, ул. Примерная, д. 1"
            />
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-6 pt-4"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleEmploymentAction("work")}
              disabled={isSaving || !isFormValid}
              className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8 hover:border-[#4a7dff] hover:shadow-xl transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {isSaving && currentAction === "work" ? (
                  <Loader2 size={32} className="text-teal-600 animate-spin" />
                ) : (
                  <Briefcase size={32} className="text-teal-600" />
                )}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                {isSaving && currentAction === "work" ? "Добавление..." : "На работу"}
              </h4>
              <p className="text-sm text-gray-500">Трудовой договор</p>
            </button>
          </TooltipTrigger>
          {!isFormValid && (
            <TooltipContent>
              <p className="text-xs">Заполните обязательные поля: Фамилия, Имя, Дата рождения</p>
            </TooltipContent>
          )}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleEmploymentAction("gph")}
              disabled={isSaving || !isFormValid}
              className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8 hover:border-[#4a7dff] hover:shadow-xl transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#4a7dff]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {isSaving && currentAction === "gph" ? (
                  <Loader2 size={32} className="text-[#4a7dff] animate-spin" />
                ) : (
                  <FileText size={32} className="text-[#4a7dff]" />
                )}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                {isSaving && currentAction === "gph" ? "Добавление..." : "На ГПХ"}
              </h4>
              <p className="text-sm text-gray-500">Договор ГПХ</p>
            </button>
          </TooltipTrigger>
          {!isFormValid && (
            <TooltipContent>
              <p className="text-xs">Заполните обязательные поля: Фа��илия, Имя, Дата рождения</p>
            </TooltipContent>
          )}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleEmploymentAction("save")}
              disabled={isSaving || !isFormValid}
              className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8 hover:border-purple-500 hover:shadow-xl transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {isSaving && currentAction === "save" ? (
                  <Loader2 size={32} className="text-purple-600 animate-spin" />
                ) : (
                  <Save size={32} className="text-purple-600" />
                )}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                {isSaving && currentAction === "save" ? "Сохранение..." : "Не нанимать"}
              </h4>
              <p className="text-sm text-gray-500">Только данные</p>
            </button>
          </TooltipTrigger>
          {!isFormValid && (
            <TooltipContent>
              <p className="text-xs">Заполните обязательные поля: Фамилия, Имя, Дата рождения</p>
            </TooltipContent>
          )}
        </Tooltip>
      </motion.div>
    </div>
  );
}
