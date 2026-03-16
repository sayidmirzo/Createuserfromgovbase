import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Employee {
  id: string;
  pinfl: string;
  firstName: string;
  lastName: string;
  middleName: string;
  passport: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  status: "active" | "inactive";
  hireDate: string;
  photo?: string;
  login?: string;
  birthDate?: string;
  address?: string;
}

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: [],
      
      addEmployee: (employee) =>
        set((state) => ({
          employees: [...state.employees, employee],
        })),
      
      updateEmployee: (id, updatedData) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updatedData } : emp
          ),
        })),
      
      removeEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        })),
      
      getEmployeeById: (id) => {
        return get().employees.find((emp) => emp.id === id);
      },
    }),
    {
      name: "employee-storage",
    }
  )
);