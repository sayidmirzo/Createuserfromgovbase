import React from 'react';
import { Briefcase, FileText, Save, AlertCircle, CheckCircle2, UserPlus, RefreshCw, Eye, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface SmartPanelActionsProps {
  status: 'found-new' | 'found-duplicate-unverified' | 'found-duplicate-verified' | 'merge-conflict';
  employmentStatus?: 'working' | 'not-working' | 'fired';
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
  employmentStatus = 'not-working',
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
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Требуется обновление</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">Неподтвержденные данные</h3>
            <p className="text-sm text-gray-600 mb-4">
              Информация не синхронизирована с госбазой. После обновления станут доступны варианты оформления.
            </p>

            <div className="space-y-3 mb-4">
              <Button 
                type="button"
                onClick={onUpdate}
                disabled={isSaving}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white h-11 justify-start disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                <span className="flex-1 text-left">
                  {isSaving ? "Обновление..." : "Обновить данные"}
                </span>
                {!isSaving && <AlertCircle className="w-4 h-4 text-amber-200" />}
              </Button>
            </div>

            <Button 
              type="button"
              onClick={onViewProfile}
              variant="outline"
              className="w-full h-11 justify-start border-gray-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="flex-1 text-left">Посмотреть текущий профиль</span>
            </Button>
          </>
        );

      case 'found-duplicate-verified':
        if (employmentStatus === 'working') {
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4a7dff] rounded-full"></div>
                  <span className="text-xs font-medium text-[#4a7dff] uppercase tracking-wide">Уже работает</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Активный сотрудник</h3>
              <p className="text-sm text-gray-600 mb-4">
                Оформлен и работает в компании
              </p>

              <div className="bg-[#4a7dff]/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#4a7dff]" />
                  <span className="text-sm font-medium text-gray-900">Стаж: 2 года 3 месяца</span>
                </div>
                <p className="text-xs text-gray-700">Принят: 15.12.2023</p>
              </div>

              <Button 
                type="button"
                onClick={onViewProfile}
                className="w-full bg-[#4a7dff] hover:bg-[#3869e6] text-white h-11 justify-start mb-3"
              >
                <Eye className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">Открыть профиль</span>
              </Button>

              <Button 
                type="button"
                onClick={onClose}
                variant="outline"
                className="w-full h-10 border-gray-300"
              >
                Закрыть визард
              </Button>
            </>
          );
        } else if (employmentStatus === 'fired') {
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Уволен</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Повторный прием</h3>
              <p className="text-sm text-gray-600 mb-4">
                Сотрудник был уволен 12.02.2026
              </p>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-700 mb-1">
                  <strong>Последняя должность:</strong> Старший разработчик
                </p>
                <p className="text-xs text-gray-700">
                  <strong>Отработано:</strong> 1 год 8 месяцев
                </p>
              </div>

              <div className="space-y-3 mb-4">
                <Button 
                  type="button"
                  onClick={onHire}
                  className="w-full bg-[#4a7dff] hover:bg-[#3869e6] text-white h-11 justify-start"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Принять заново</span>
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

              <Button 
                type="button"
                onClick={onViewProfile}
                variant="outline"
                className="w-full h-11 justify-start border-gray-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">Посмотреть историю работы</span>
              </Button>
            </>
          );
        } else {
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4a7dff] rounded-full"></div>
                  <span className="text-xs font-medium text-[#4a7dff] uppercase tracking-wide">В системе</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">Восстановление</h3>
              <p className="text-sm text-gray-600 mb-4">
                Данные актуальны, готов к оформлению
              </p>

              <div className="space-y-3 mb-6">
                <Button 
                  type="button"
                  onClick={onHire}
                  className="w-full bg-[#4a7dff] hover:bg-[#3869e6] text-white h-11 justify-start"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Восстановить на работе</span>
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
                  onClick={onViewProfile}
                  variant="outline"
                  className="w-full h-11 justify-start border-gray-300"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">Посмотреть профиль</span>
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