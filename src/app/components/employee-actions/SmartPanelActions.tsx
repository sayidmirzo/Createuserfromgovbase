import React from 'react';
import { Briefcase, FileText, Save, AlertCircle, CheckCircle2, UserPlus, RefreshCw, Eye, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface SmartPanelActionsProps {
  status: 'found-new' | 'found-duplicate-unverified' | 'found-duplicate-verified' | 'merge-conflict';
  employmentStatus?: 'not-hired' | 'hired' | 'terminated';
  isSaving?: boolean;
  onHire?: () => void;
  onGPH?: () => void;
  onSave?: () => void;
  onUpdate?: () => void;
  onViewProfile?: () => void;
  onResolveConflict?: () => void;
  onClose?: () => void;
}

export function SmartPanelActions({
  status,
  employmentStatus = 'not-hired',
  isSaving = false,
  onHire,
  onGPH,
  onSave,
  onUpdate,
  onViewProfile,
  onResolveConflict,
  onClose
}: SmartPanelActionsProps) {
  const renderContent = () => {
    switch (status) {
      case 'found-new':
        // Новый сотрудник из госбазы (всегда "Не принят")
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#1bc5bd] rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-[#138b86] uppercase tracking-wide">Готов к оформлению</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">Рекомендуемое действие</h3>
            <p className="text-sm text-gray-600 mb-4">
              Данные проверены и актуальны
            </p>

            <div className="space-y-3 mb-6">
              <Button 
                type="button"
                onClick={onHire}
                className="w-full bg-[#4a7dff] hover:bg-[#3869e6] text-white h-11 justify-start"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">Принять на работу</span>
                <TrendingUp className="w-4 h-4 text-white/60" />
              </Button>
              
              <Button 
                type="button"
                onClick={onGPH}
                variant="outline"
                className="w-full h-11 justify-start border-gray-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">Принять на ГПХ</span>
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button 
                type="button"
                onClick={onSave}
                variant="outline"
                className="w-full h-11 justify-start border-gray-300"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                <span className="flex-1 text-left">Сохранить без оформления</span>
              </Button>
            </div>
          </>
        );

      case 'found-duplicate-unverified':
        // Не подтвержденный сотрудник - показываем действия в зависимости от статуса
        if (employmentStatus === 'hired') {
          // Принят, но не подтвержден - только сохранить
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Требуется обновление</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Рекомендуемое действие</h3>
              <p className="text-sm text-gray-600 mb-4">
                Обновите данные из госбазы для актуализации информации
              </p>

              <div className="pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  onClick={onSave}
                  variant="outline"
                  className="w-full h-11 justify-start border-gray-300"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="flex-1 text-left">Сохранить без оформления</span>
                </Button>
              </div>
            </>
          );
        } else {
          // Не принят или Уволен - показываем действия приема
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Требуется обновление</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Рекомендуемое действие</h3>
              <p className="text-sm text-gray-600 mb-4">
                {employmentStatus === 'terminated' 
                  ? 'Обновите данные и оформите повторный прием на работу'
                  : 'Обновите данные и оформите сотрудника на работу'}
              </p>

              <div className="space-y-3 mb-6">
                <Button 
                  type="button"
                  onClick={onHire}
                  className="w-full bg-[#4a7dff] hover:bg-[#3869e6] text-white h-11 justify-start"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">
                    {employmentStatus === 'terminated' ? 'Принять заново' : 'Принять на работу'}
                  </span>
                  <TrendingUp className="w-4 h-4 text-white/60" />
                </Button>
                
                <Button 
                  type="button"
                  onClick={onGPH}
                  variant="outline"
                  className="w-full h-11 justify-start border-gray-300"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Принять на ГПХ</span>
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  onClick={onSave}
                  variant="outline"
                  className="w-full h-11 justify-start border-gray-300"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="flex-1 text-left">Сохранить без оформления</span>
                </Button>
              </div>
            </>
          );
        }

      case 'found-duplicate-verified':
        // Подтвержденный сотрудник - действия в зависимости от статуса
        if (employmentStatus === 'hired') {
          // Уже работает - только сохранить
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4a7dff] rounded-full"></div>
                  <span className="text-xs font-medium text-[#4a7dff] uppercase tracking-wide">Уже работает</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Рекомендуемое действие</h3>
              <p className="text-sm text-gray-600 mb-4">
                Сотрудник уже оформлен и работает в компании
              </p>

              <div className="pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  onClick={onSave}
                  variant="outline"
                  className="w-full h-11 justify-start border-gray-300"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="flex-1 text-left">Сохранить без оформления</span>
                </Button>
              </div>
            </>
          );
        } else if (employmentStatus === 'terminated') {
          // Уволен - показать действия приема
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Уволен</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Рекомендуемое действие</h3>
              <p className="text-sm text-gray-600 mb-4">
                Повторное оформление сотрудника
              </p>

              <div className="space-y-3 mb-6">
                <Button 
                  type="button"
                  onClick={onHire}
                  className="w-full bg-[#4a7dff] hover:bg-[#3869e6] text-white h-11 justify-start"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Принять заново</span>
                  <TrendingUp className="w-4 h-4 text-white/60" />
                </Button>
                
                <Button 
                  type="button"
                  onClick={onGPH}
                  variant="outline"
                  className="w-full h-11 justify-start border-gray-300"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Принять на ГПХ</span>
                </Button>
              </div>
            </>
          );
        } else {
          // Не принят - показать действия приема
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1bc5bd] rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-[#138b86] uppercase tracking-wide">Готов к оформлению</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Рекомендуемое действие</h3>
              <p className="text-sm text-gray-600 mb-4">
                Данные проверены и актуальны
              </p>

              <div className="space-y-3 mb-6">
                <Button 
                  type="button"
                  onClick={onHire}
                  className="w-full bg-[#4a7dff] hover:bg-[#3869e6] text-white h-11 justify-start"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Принять на работу</span>
                  <TrendingUp className="w-4 h-4 text-white/60" />
                </Button>
                
                <Button 
                  type="button"
                  onClick={onGPH}
                  variant="outline"
                  className="w-full h-11 justify-start border-gray-300"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Принять на ГПХ</span>
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  onClick={onSave}
                  variant="outline"
                  className="w-full h-11 justify-start border-gray-300"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  <span className="flex-1 text-left">Сохранить без оформления</span>
                </Button>
              </div>
            </>
          );
        }

      case 'merge-conflict':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-red-700 uppercase tracking-wide">Конфликт</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">Требуется разрешение</h3>
            <p className="text-sm text-gray-600 mb-4">
              Выберите основную запись для объединения данных
            </p>

            <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 mb-1">Обнаружены расхождения</p>
                  <p className="text-xs text-red-700">
                    Проверьте данные и выберите основную запись в основном окне
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong className="text-gray-900">Инструкция:</strong><br/>
                  1. Сравните данные в карточках<br/>
                  2. Выберите основную запись<br/>
                  3. Нажмите "Объединить записи"
                </p>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      {renderContent()}
    </div>
  );
}