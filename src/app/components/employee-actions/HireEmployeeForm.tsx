import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Calendar,
  Building2,
  Briefcase,
  Users,
  Clock,
  DollarSign,
  X,
  Search,
  Check,
  ArrowLeft,
} from "lucide-react";
import { motion } from "motion/react";

interface HireEmployeeFormProps {
  onSubmit: (data: HireFormData) => void;
  onCancel: () => void;
  employeeName?: string;
}

export interface HireFormData {
  hireDate: string;
  department: string;
  position: string;
  employeeNumber?: string;
  division?: string;
  employmentType?: string;
  jobTitle?: string;
  schedule?: string;
  salaryType?: string;
  salary: string;
}

interface SearchableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  required?: boolean;
  options: string[];
}

function SearchableField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  required,
  options,
}: SearchableFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <Label className="text-xs text-gray-700 mb-1.5 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pr-8 text-sm h-9"
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              setSearch("");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {filteredOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option);
                  setSearch("");
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span>{option}</span>
                {value === option && (
                  <Check size={14} className="text-teal-600" />
                )}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

export function HireEmployeeForm({
  onSubmit,
  onCancel,
  employeeName,
}: HireEmployeeFormProps) {
  const [formData, setFormData] = useState<HireFormData>({
    hireDate: "",
    department: "",
    position: "",
    employeeNumber: "",
    division: "",
    employmentType: "",
    jobTitle: "",
    schedule: "",
    salaryType: "",
    salary: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid =
    formData.hireDate && formData.department && formData.position && formData.salary;

  // Mock data for dropdowns
  const departments = ["DEVELOPMENT", "HR", "SALES", "MARKETING", "FINANCE", "IT"];
  const positions = [
    "DEVELOPMENT DEVELOPER(3561460)",
    "Senior Developer",
    "Junior Developer",
    "Team Lead",
    "Project Manager",
  ];
  const divisions = ["Главный офис", "Филиал Чиланзар", "Филиал Самарканд"];
  const employmentTypes = ["Полная ставка", "Частичная занятость", "Временная"];
  const jobTitles = [
    "Math Teacher",
    "Senior Developer",
    "Project Manager",
    "HR Manager",
  ];
  const schedules = [
    "24 часовой график (ввод 12 часов)",
    "8 часовой график",
    "Гибкий график",
    "Сменный график",
  ];
  const salaryTypes = ["Месячная", "Почасовая", "Сдельная"];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-white px-5 py-3.5 border-b-4 border-blue-600">
        <div className="flex items-center justify-between mb-1.5">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 -ml-1 hover:bg-gray-100 rounded"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-blue-600">
            <Briefcase size={18} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Прием на работу</h3>
        {employeeName && (
          <p className="text-sm text-gray-600 mt-1 font-medium">{employeeName}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-3">
          {/* Row 1: Date, Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-700 mb-1.5 flex items-center gap-1">
                Дата приема
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  className="text-sm h-9"
                  required
                />
              </div>
            </div>

            <SearchableField
              label="Подразделение"
              value={formData.department}
              onChange={(value) =>
                setFormData({ ...formData, department: value })
              }
              placeholder="Поиск..."
              required
              options={departments}
            />
          </div>

          {/* Row 2: Position, Employee Number */}
          <div className="grid grid-cols-2 gap-3">
            <SearchableField
              label="Позиция"
              value={formData.position}
              onChange={(value) => setFormData({ ...formData, position: value })}
              placeholder="Поиск..."
              required
              options={positions}
            />
            
            <div>
              <Label className="text-xs text-gray-700 mb-1.5">
                Табельный номер
              </Label>
              <Input
                value={formData.employeeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, employeeNumber: e.target.value })
                }
                placeholder=""
                className="text-sm h-9"
              />
            </div>
          </div>

          {/* Row 3: Division, Employment Type */}
          {/* Row 3: Division, Employment Type */}
          <div className="grid grid-cols-2 gap-3">
            <SearchableField
              label="Отдел"
              value={formData.division}
              onChange={(value) => setFormData({ ...formData, division: value })}
              placeholder="Поиск..."
              options={divisions}
            />
            
            <SearchableField
              label="Тип занятости"
              value={formData.employmentType}
              onChange={(value) =>
                setFormData({ ...formData, employmentType: value })
              }
              placeholder="Поиск..."
              options={employmentTypes}
            />
          </div>

          {/* Row 4: Job Title, Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <SearchableField
              label="Должность"
              value={formData.jobTitle}
              onChange={(value) => setFormData({ ...formData, jobTitle: value })}
              placeholder="Поиск..."
              options={jobTitles}
            />

            <SearchableField
              label="График работы"
              value={formData.schedule}
              onChange={(value) => setFormData({ ...formData, schedule: value })}
              placeholder="Поиск..."
              options={schedules}
            />
          </div>

          {/* Row 5: Salary Type, Salary Amount */}
          <div className="grid grid-cols-2 gap-3">
            <SearchableField
              label="Тип зарплаты"
              value={formData.salaryType}
              onChange={(value) =>
                setFormData({ ...formData, salaryType: value })
              }
              placeholder="Месячная"
              options={salaryTypes}
            />

            <div>
              <Label className="text-xs text-gray-700 mb-1.5 flex items-center gap-1">
                Зарплата
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                placeholder="0"
                className="text-sm h-9"
                required
              />
            </div>
          </div>
        </div>

        {/* Required Fields Note */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-10"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Check size={16} className="mr-2" />
              Принять на работу
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}