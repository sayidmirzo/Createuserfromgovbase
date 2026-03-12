import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Eye,
  FileDown,
  Trash2,
  Play,
  X,
  UserPlus,
  Users,
  RefreshCw,
  Edit2,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { useEmployeeStore } from "../store/employeeStore";

type ImportStep = "upload" | "preview" | "processing" | "results";

type ImportStatus = "pending" | "processing" | "success" | "error" | "duplicate" | "warning";

type ImportAction = "add" | "skip" | "update" | "replace";

interface ImportRow {
  id: number;
  pinfl: string;
  firstName: string;
  lastName: string;
  middleName: string;
  passport: string;
  phone?: string;
  email?: string;
  position?: string;
  department?: string;
  status: ImportStatus;
  action: ImportAction;
  errorMessage?: string;
  warnings?: string[];
  duplicateId?: string; // ID существующего сотрудника-дубликата
}

export function BulkImport() {
  const navigate = useNavigate();
  const { employees, addEmployee } = useEmployeeStore();
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [addedEmployeeIds, setAddedEmployeeIds] = useState<string[]>([]);

  // Parse Excel file
  const parseExcelFile = (file: File): Promise<ImportRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          const parsed: ImportRow[] = jsonData.map((row: any, index) => ({
            id: index + 1,
            pinfl: String(row["ПИНФЛ"] || row["PINFL"] || row["pinfl"] || "").trim(),
            firstName: String(row["Имя"] || row["FirstName"] || row["firstName"] || "").trim(),
            lastName: String(row["Фамилия"] || row["LastName"] || row["lastName"] || "").trim(),
            middleName: String(row["Отчество"] || row["MiddleName"] || row["middleName"] || "").trim(),
            passport: String(row["Паспорт"] || row["Passport"] || row["passport"] || "").trim(),
            phone: row["Телефон"] || row["Phone"] || row["phone"] || "",
            email: row["Email"] || row["email"] || "",
            position: row["Должность"] || row["Position"] || row["position"] || "",
            department: row["Отдел"] || row["Department"] || row["department"] || "",
            status: "pending",
            action: "add",
          }));
          
          resolve(parsed.filter(row => row.pinfl && row.firstName && row.lastName));
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error("Ошибка чтения файла"));
      reader.readAsArrayBuffer(file);
    });
  };

  // Parse CSV file
  const parseCSVFile = (file: File): Promise<ImportRow[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            const parsed: ImportRow[] = results.data.map((row: any, index) => ({
              id: index + 1,
              pinfl: String(row["ПИНФЛ"] || row["PINFL"] || row["pinfl"] || "").trim(),
              firstName: String(row["Имя"] || row["FirstName"] || row["firstName"] || "").trim(),
              lastName: String(row["Фамилия"] || row["LastName"] || row["lastName"] || "").trim(),
              middleName: String(row["Отчество"] || row["MiddleName"] || row["middleName"] || "").trim(),
              passport: String(row["Паспорт"] || row["Passport"] || row["passport"] || "").trim(),
              phone: row["Телефон"] || row["Phone"] || row["phone"] || "",
              email: row["Email"] || row["email"] || "",
              position: row["Должность"] || row["Position"] || row["position"] || "",
              department: row["Отдел"] || row["Department"] || row["department"] || "",
              status: "pending",
              action: "add",
            }));
            
            resolve(parsed.filter(row => row.pinfl && row.firstName && row.lastName));
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error),
      });
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      let parsed: ImportRow[];
      
      if (fileExt === "csv") {
        parsed = await parseCSVFile(file);
      } else if (fileExt === "xlsx" || fileExt === "xls") {
        parsed = await parseExcelFile(file);
      } else {
        toast.error("Неподдерживаемый формат файла");
        return;
      }
      
      if (parsed.length === 0) {
        toast.error("В файле не найдено валидных записей");
        return;
      }
      
      // Validate and check duplicates
      const validated = validateAndCheckDuplicates(parsed);
      
      setImportData(validated);
      setCurrentStep("preview");
      toast.success(`Файл "${file.name}" успешно загружен. Найдено записей: ${parsed.length}`);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Ошибка при обработке файла");
    } finally {
      setIsUploading(false);
    }
  };

  // Validate and check for duplicates
  const validateAndCheckDuplicates = (rows: ImportRow[]): ImportRow[] => {
    return rows.map((row) => {
      const warnings: string[] = [];
      let status: ImportStatus = "pending";
      let action: ImportAction = "add";
      let errorMessage: string | undefined;
      let duplicateId: string | undefined;

      // Check for duplicates in existing employees
      const existingEmployee = employees.find(
        (emp) => emp.pinfl === row.pinfl || emp.passport === row.passport
      );

      if (existingEmployee) {
        status = "duplicate";
        action = "skip";
        duplicateId = existingEmployee.id;
        errorMessage = `Дубликат: ${existingEmployee.lastName} ${existingEmployee.firstName} (${existingEmployee.position})`;
      }

      // Validate ПИНФЛ
      if (!row.pinfl) {
        status = "error";
        action = "skip";
        errorMessage = "ПИНФЛ обязателен";
      } else if (row.pinfl.length !== 14) {
        status = "warning";
        warnings.push("ПИНФЛ должен содержать 14 цифр");
      }

      // Validate passport
      if (!row.passport) {
        status = "error";
        action = "skip";
        errorMessage = errorMessage || "Паспорт обязателен";
      } else if (row.passport.length < 7) {
        status = "warning";
        warnings.push("Некорректный формат паспорта");
      }

      // Validate names
      if (!row.firstName || !row.lastName) {
        status = "error";
        action = "skip";
        errorMessage = errorMessage || "Фамилия и имя обязательны";
      }

      // Warnings for missing optional fields
      if (!row.phone) warnings.push("Отсутствует телефон");
      if (!row.email) warnings.push("Отсутствует email");
      if (!row.position) warnings.push("Не указана должность");
      if (!row.department) warnings.push("Не указан отдел");

      return {
        ...row,
        status: status === "pending" && warnings.length > 0 ? "warning" : status,
        action,
        errorMessage,
        warnings,
        duplicateId,
      };
    });
  };

  // Change action for a row
  const handleChangeAction = (rowId: number, newAction: ImportAction) => {
    setImportData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, action: newAction } : row
      )
    );
  };

  // Apply action to all rows with specific status
  const handleApplyActionToAll = (status: ImportStatus, action: ImportAction) => {
    setImportData((prev) =>
      prev.map((row) =>
        row.status === status ? { ...row, action } : row
      )
    );
    toast.success(`Действие "${getActionLabel(action)}" применено ко всем записям со статусом "${getStatusLabel(status)}\"`);
  };

  // Helper to get action label
  const getActionLabel = (action: ImportAction): string => {
    switch (action) {
      case "add": return "Добавить";
      case "skip": return "Пропустить";
      case "update": return "Обновить";
      case "replace": return "Заменить";
      default: return action;
    }
  };

  // Helper to get status label
  const getStatusLabel = (status: ImportStatus): string => {
    switch (status) {
      case "duplicate": return "Дубликаты";
      case "warning": return "Предупреждения";
      case "error": return "Ошибки";
      case "pending": return "Готовы";
      default: return status;
    }
  };

  // Start processing
  const handleStartImport = () => {
    setCurrentStep("processing");
    setIsProcessing(true);
    setProgress(0);
    const newAddedIds: string[] = [];

    const total = importData.length;
    let processed = 0;

    const interval = setInterval(() => {
      processed++;
      setProgress((processed / total) * 100);

      setImportData((prev) =>
        prev.map((row, index) => {
          if (index === processed - 1) {
            // Check if employee already exists
            const isDuplicate = employees.some(
              (emp) => emp.pinfl === row.pinfl || emp.passport === row.passport
            );

            if (isDuplicate) {
              return {
                ...row,
                status: "duplicate" as ImportStatus,
                action: "skip" as ImportAction,
                errorMessage: "Сотрудник с таким ПИНФЛ или паспортом уже существует",
                duplicateId: employees.find(emp => emp.pinfl === row.pinfl || emp.passport === row.passport)?.id,
              };
            }

            // Validate required fields
            if (!row.pinfl || row.pinfl.length !== 14) {
              return {
                ...row,
                status: "error" as ImportStatus,
                action: "skip" as ImportAction,
                errorMessage: "ПИНФЛ должен содержать 14 цифр",
              };
            }

            if (!row.passport) {
              return {
                ...row,
                status: "error" as ImportStatus,
                action: "skip" as ImportAction,
                errorMessage: "Не указан номер паспорта",
              };
            }

            // Simulate validation (70% success rate)
            const random = Math.random();
            if (random < 0.85) {
              // Success - add to store
              const newEmployee = {
                id: `emp-${Date.now()}-${index}`,
                pinfl: row.pinfl,
                firstName: row.firstName,
                lastName: row.lastName,
                middleName: row.middleName,
                passport: row.passport,
                phone: row.phone || "",
                email: row.email || "",
                position: row.position || "Сотрудник",
                department: row.department || "Общий",
                status: "active" as const,
                hireDate: new Date().toISOString().split("T")[0],
              };
              
              addEmployee(newEmployee);
              newAddedIds.push(newEmployee.id);
              
              return { ...row, status: "success" as ImportStatus, action: "add" as ImportAction };
            } else {
              return {
                ...row,
                status: "error" as ImportStatus,
                action: "skip" as ImportAction,
                errorMessage: "Не найден в государственной базе или некорректные данные",
              };
            }
          }
          return row;
        })
      );

      if (processed >= total) {
        clearInterval(interval);
        setIsProcessing(false);
        setCurrentStep("results");
        setAddedEmployeeIds(newAddedIds);
        
        const successCount = importData.filter(r => r.status === "success").length;
        toast.success(`Импорт завершен. Успешно добавлено: ${successCount} сотрудников`);
      }
    }, 600);
  };

  // Download template
  const handleDownloadTemplate = () => {
    const template = [
      {
        "ПИНФЛ": "12345678901234",
        "Фамилия": "Иванов",
        "Имя": "Алексей",
        "Отчество": "Петрович",
        "Паспорт": "AA1234567",
        "Телефон": "+998901234567",
        "Email": "alexey.ivanov@example.com",
        "Должность": "Менеджер",
        "Отдел": "Продажи",
      },
      {
        "ПИНФЛ": "98765432109876",
        "Фамилия": "Петрова",
        "Имя": "Мария",
        "Отчество": "Ивановна",
        "Паспорт": "AB9876543",
        "Телефон": "+998907654321",
        "Email": "maria.petrova@example.com",
        "Должность": "HR-менеджер",
        "Отдел": "HR",
      },
      {
        "ПИНФЛ": "11223344556677",
        "Фамилия": "Сидоров",
        "Имя": "Дмитрий",
        "Отчество": "Сергеевич",
        "Паспорт": "AC1122334",
        "Телефон": "+998901122334",
        "Email": "dmitry.sidorov@example.com",
        "Должность": "Разработчик",
        "Отдел": "IT",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Шаблон");
    XLSX.writeFile(wb, "template_import.xlsx");
    toast.success("Шаблон успешно скачан");
  };

  // Export report
  const handleExportReport = () => {
    const reportData = importData.map((row, index) => ({
      "№": index + 1,
      "ПИНФЛ": row.pinfl,
      "ФИО": `${row.lastName} ${row.firstName} ${row.middleName}`,
      "Паспорт": row.passport,
      "Должность": row.position || "—",
      "Отдел": row.department || "—",
      "Статус": row.status === "success" ? "Успешно" : row.status === "duplicate" ? "Дубликат" : "Ошибка",
      "Описание": row.errorMessage || "Успешно добавлен",
    }));

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Отчет");
    XLSX.writeFile(wb, `import_report_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Отчет успешно экспортирован");
  };

  // View added employees
  const handleViewAdded = () => {
    navigate("/");
    toast.success(`Перейдите к списку сотрудников для просмотра ${successCount} добавленных`);
  };

  // Remove row
  const handleRemoveRow = (id: number) => {
    setImportData((prev) => prev.filter((row) => row.id !== id));
    toast.info("Запись удалена из списка импорта");
  };

  // Reset
  const handleReset = () => {
    setCurrentStep("upload");
    setImportData([]);
    setSelectedFile(null);
    setProgress(0);
    setAddedEmployeeIds([]);
  };

  // Memoized counts to prevent unnecessary recalculations
  const successCount = useMemo(
    () => importData.filter((r) => r.status === "success").length,
    [importData]
  );
  const errorCount = useMemo(
    () => importData.filter((r) => r.status === "error").length,
    [importData]
  );
  const duplicateCount = useMemo(
    () => importData.filter((r) => r.status === "duplicate").length,
    [importData]
  );
  const warningCount = useMemo(
    () => importData.filter((r) => r.status === "warning").length,
    [importData]
  );
  const pendingCount = useMemo(
    () => importData.filter((r) => r.status === "pending").length,
    [importData]
  );
  const readyToImportCount = useMemo(
    () => importData.filter((r) => r.action !== "skip").length,
    [importData]
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft size={16} />
                  Назад
                </Button>
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <FileSpreadsheet size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Массовый импорт</h1>
                  <p className="text-xs text-gray-500">
                    Загрузите файл Excel или CSV для добавления сотрудников
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              {["upload", "preview", "processing", "results"].map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === step
                        ? "bg-purple-600 text-white ring-4 ring-purple-100"
                        : ["upload", "preview", "processing", "results"].indexOf(
                            currentStep
                          ) >
                          ["upload", "preview", "processing", "results"].indexOf(step)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {["upload", "preview", "processing", "results"].indexOf(currentStep) >
                    ["upload", "preview", "processing", "results"].indexOf(step) ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-12 h-0.5 ${
                        ["upload", "preview", "processing", "results"].indexOf(currentStep) >
                        index
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {currentStep === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-purple-400 transition-colors">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload size={32} className="text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Загрузите файл с данными сотрудников
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Поддерживаются форматы: Excel (.xlsx, .xls) и CSV (.csv)
                </p>

                <div>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors font-medium"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Выбрать файл
                      </>
                    )}
                  </label>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-start gap-3 text-left max-w-md mx-auto">
                    <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <strong className="text-gray-900 font-semibold">
                        Формат файла:
                      </strong>
                      <div className="mt-2 space-y-1 text-xs">
                        <div>• ПИНФЛ (обязательно)</div>
                        <div>• Фамилия, Имя, Отчество</div>
                        <div>• Серия и номер паспорта</div>
                        <div>• Телефон, Email (опционально)</div>
                        <div>• Должность, Отдел (опционально)</div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="mt-6 gap-2" size="sm" onClick={handleDownloadTemplate}>
                    <Download size={14} />
                    Скачать шаблон
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Preview */}
          {currentStep === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {importData.length}
                      </div>
                      <div className="text-sm text-gray-500">Всего записей</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-2 border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-900">
                        {readyToImportCount}
                      </div>
                      <div className="text-sm text-gray-500">Готовы к импорту</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-2 border-amber-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertCircle size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-900">{duplicateCount}</div>
                      <div className="text-sm text-gray-500">Дубликаты</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-2 border-red-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle size={20} className="text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-900">{errorCount}</div>
                      <div className="text-sm text-gray-500">Ошибки</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                {/* Bulk Actions */}
                {(duplicateCount > 0 || errorCount > 0 || warningCount > 0) && (
                  <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">Массовые действия:</span>
                      
                      {duplicateCount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Дубликаты ({duplicateCount}):</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleApplyActionToAll("duplicate", "skip")}
                          >
                            <X size={12} />
                            Пропустить все
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleApplyActionToAll("duplicate", "update")}
                          >
                            <RefreshCw size={12} />
                            Обновить все
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleApplyActionToAll("duplicate", "replace")}
                          >
                            <Edit2 size={12} />
                            Заменить все
                          </Button>
                        </div>
                      )}

                      {warningCount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">С предупреждениями ({warningCount}):</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleApplyActionToAll("warning", "add")}
                          >
                            <Check size={12} />
                            Добавить все
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleApplyActionToAll("warning", "skip")}
                          >
                            <X size={12} />
                            Пропустить все
                          </Button>
                        </div>
                      )}

                      {errorCount > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">С ошибками ({errorCount}):</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleApplyActionToAll("error", "skip")}
                          >
                            <X size={12} />
                            Пропустить все
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          #
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          ПИНФЛ
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          ФИО
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Паспорт
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Должность
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Статус
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Действие
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase w-20">
                          
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {importData.map((row, index) => (
                        <tr
                          key={row.id}
                          className={`transition-colors ${
                            row.status === "duplicate"
                              ? "bg-amber-50/30"
                              : row.status === "error"
                              ? "bg-red-50/30"
                              : row.status === "warning"
                              ? "bg-yellow-50/30"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">
                            {row.pinfl}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {row.lastName} {row.firstName} {row.middleName}
                            </div>
                            {row.warnings && row.warnings.length > 0 && (
                              <div className="text-xs text-amber-600 mt-1">
                                {row.warnings.join(", ")}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">
                            {row.passport}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {row.position || "—"}
                          </td>
                          <td className="px-4 py-3">
                            {row.status === "pending" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                <CheckCircle2 size={12} />
                                Готов
                              </span>
                            )}
                            {row.status === "warning" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                <AlertCircle size={12} />
                                Предупреждение
                              </span>
                            )}
                            {row.status === "duplicate" && (
                              <div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                  <AlertCircle size={12} />
                                  Дубликат
                                </span>
                                {row.errorMessage && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {row.errorMessage}
                                  </div>
                                )}
                              </div>
                            )}
                            {row.status === "error" && (
                              <div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                  <XCircle size={12} />
                                  Ошибка
                                </span>
                                {row.errorMessage && (
                                  <div className="text-xs text-red-600 mt-1">
                                    {row.errorMessage}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={row.action}
                              onChange={(e) =>
                                handleChangeAction(row.id, e.target.value as ImportAction)
                              }
                              className={`text-xs border rounded px-2 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                row.action === "skip"
                                  ? "border-gray-300 bg-gray-50 text-gray-600"
                                  : row.action === "add"
                                  ? "border-green-300 bg-green-50 text-green-700"
                                  : row.action === "update"
                                  ? "border-blue-300 bg-blue-50 text-blue-700"
                                  : "border-purple-300 bg-purple-50 text-purple-700"
                              }`}
                            >
                              {/* Show different options based on status */}
                              {row.status === "duplicate" && (
                                <>
                                  <option value="skip">Пропустить</option>
                                  <option value="update">Обновить данные</option>
                                  <option value="replace">Заменить полностью</option>
                                </>
                              )}
                              {row.status === "error" && (
                                <>
                                  <option value="skip">Пропустить</option>
                                </>
                              )}
                              {(row.status === "warning" || row.status === "pending") && (
                                <>
                                  <option value="add">Добавить</option>
                                  <option value="skip">Пропустить</option>
                                </>
                              )}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleRemoveRow(row.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <X size={16} />
                    Отменить
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      Будет импортировано: <span className="font-bold text-purple-600">{readyToImportCount}</span> из {importData.length}
                    </div>
                    <Button
                      onClick={handleStartImport}
                      className="bg-purple-600 hover:bg-purple-700 gap-2"
                      disabled={readyToImportCount === 0}
                    >
                      <Play size={16} />
                      Начать импорт ({readyToImportCount})
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Processing */}
          {currentStep === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader2 size={32} className="text-purple-600 animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Импорт в процессе...
                    </h2>
                    <p className="text-sm text-gray-500">
                      Пожалуйста, подождите. Идет проверка данных в государственной базе.
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Прогресс</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Live Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {successCount}
                      </div>
                      <div className="text-xs text-green-700 mt-1">Успешно</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">
                        {duplicateCount}
                      </div>
                      <div className="text-xs text-amber-700 mt-1">Дубликаты</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                      <div className="text-xs text-red-700 mt-1">Ошибки</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {currentStep === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {importData.length}
                      </div>
                      <div className="text-xs text-gray-500">Всего</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-2 border-green-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {successCount}
                      </div>
                      <div className="text-xs text-gray-500">Успешно</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-2 border-amber-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertCircle size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">
                        {duplicateCount}
                      </div>
                      <div className="text-xs text-gray-500">Дубликаты</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border-2 border-red-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle size={20} className="text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                      <div className="text-xs text-gray-500">Ошибки</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          #
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          ПИНФЛ
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          ФИО
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Должность
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Статус
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                          Описание
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {importData.map((row, index) => (
                        <tr
                          key={row.id}
                          className={`transition-colors ${
                            row.status === "success"
                              ? "bg-green-50/50 hover:bg-green-50"
                              : row.status === "duplicate"
                              ? "bg-amber-50/50 hover:bg-amber-50"
                              : row.status === "error"
                              ? "bg-red-50/50 hover:bg-red-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">
                            {row.pinfl}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {row.lastName} {row.firstName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {row.position || "—"}
                          </td>
                          <td className="px-4 py-3">
                            {row.status === "success" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <CheckCircle2 size={12} />
                                Добавлен
                              </span>
                            )}
                            {row.status === "duplicate" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                <AlertCircle size={12} />
                                Дубликат
                              </span>
                            )}
                            {row.status === "error" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                <XCircle size={12} />
                                Ошибка
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {row.errorMessage || "Успешно добавлен в систему"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" size="sm" onClick={handleExportReport}>
                      <FileDown size={14} />
                      Экспорт отчета
                    </Button>
                    <Button variant="outline" className="gap-2" size="sm" onClick={handleViewAdded}>
                      <Eye size={14} />
                      Просмотреть добавленых
                    </Button>
                  </div>
                  <Button
                    onClick={handleReset}
                    className="bg-purple-600 hover:bg-purple-700 gap-2"
                  >
                    <UserPlus size={16} />
                    Новый импорт
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}