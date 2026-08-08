import React, {useState} from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import {siteAssets} from '@/shared/config/site-assets';
import {Button} from '@/shared/components/ui/Button';
import {Input} from '@/shared/components/ui/Input';
import {PhoneInput} from '@/shared/components/ui/PhoneInput';
import {ArrowRight, ArrowLeft, Check, Send} from 'lucide-react';
import client from '@/shared/lib/client';
import {toast} from 'sonner';

const CONFIGURATIONS = [
  {id: 'corner', label: 'Угловая душевая', img: siteAssets.constructions.corner},
  {id: 'niche', label: 'Линейная (в нишу)', img: siteAssets.constructions.doorNiche},
  {id: 'pentagon', label: 'Пятиугольная', img: siteAssets.constructions.frameMinimal},
  {id: 'u_shape', label: 'П-образная', img: siteAssets.constructions.frameBorder},
  {id: 'partition', label: 'Стационарная перегородка', img: siteAssets.constructions.partitionStationary},
  {id: 'sliding', label: 'Раздвижные двери', img: siteAssets.constructions.partitionSliding},
];

const GLASS_OPTIONS = [
  {id: 'regular', label: 'Обычное', img: siteAssets.glass.regular},
  {id: 'optiwhite', label: 'Осветленное Optiwhite', img: siteAssets.glass.optiwhite},
  {id: 'bronze', label: 'Бронза', img: siteAssets.glass.bronze},
  {id: 'graphite', label: 'Графит', img: siteAssets.glass.graphite},
  {id: 'frosted', label: 'Матовое', img: siteAssets.glass.frostedRegular},
];

const HARDWARE_OPTIONS = [
  {id: 'chrome', label: 'Хром', img: siteAssets.hardware.chrome},
  {id: 'black', label: 'Черный', img: siteAssets.hardware.black},
  {id: 'steel', label: 'Матовая сталь', img: siteAssets.hardware.steelMatte},
  {id: 'bronze', label: 'Бронза', img: siteAssets.hardware.bronze},
  {id: 'gold', label: 'Золото', img: siteAssets.hardware.gold},
];

export function QuizCalculatorBlock() {
  const [step, setStep] = useState(1);
  const [selectedConfig, setSelectedConfig] = useState(CONFIGURATIONS[0].label);
  const [height, setHeight] = useState('2000');
  const [width1, setWidth1] = useState('900');
  const [width2, setWidth2] = useState('900');
  const [selectedGlass, setSelectedGlass] = useState(GLASS_OPTIONS[0].label);
  const [selectedHardware, setSelectedHardware] = useState(HARDWARE_OPTIONS[0].label);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }

    setIsLoading(true);

    try {
      await client.post('/api/v1/order/save', {
        customer: {name: name || 'Клиент с квиза', phone},
        grand_total: 0,
        currency: 'BYN',
        customer_comment: `Расчет квиза: Конфигурация: ${selectedConfig}, Размеры: ${height}x${width1}x${width2}мм, Стекло: ${selectedGlass}, Фурнитура: ${selectedHardware}`,
        results: [{title: `Квиз: ${selectedConfig}`, price: {total: 0, grand_total: 0}}]
      });

      setIsSuccess(true);
      toast.success('Расчет отправлен! Скоро мы свяжемся с вами.');
    } catch (err) {
      toast.error('Ошибка отправки. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionLayout bg="bg-[#F2F7FA]" className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#024f87] uppercase tracking-widest mb-2 block">
            Запишитесь на бесплатный замер
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ответьте на несколько вопросов и получите расчет стоимости
          </h2>
        </div>

        <div
          className="w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
          <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-[#024f87] h-full transition-all duration-300"
              style={{width: `${(step / 5) * 100}%`}}
            />
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-slate-900">
                Шаг 1 из 5: Выберите подходящую конфигурацию
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CONFIGURATIONS.map((cfg) => (
                  <div
                    key={cfg.id}
                    onClick={() => setSelectedConfig(cfg.label)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                      selectedConfig === cfg.label
                        ? 'border-[#024f87] bg-sky-50/50 shadow-md'
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={cfg.img} alt={cfg.label} className="w-20 h-20 object-contain mb-3"/>
                    <span className="text-xs font-bold text-slate-800">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-slate-900">
                Шаг 2 из 5: Укажите ориентировочные размеры (мм)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Высота (мм)</label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Ширина 1 (мм)</label>
                  <Input type="number" value={width1} onChange={(e) => setWidth1(e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Ширина 2 (мм)</label>
                  <Input type="number" value={width2} onChange={(e) => setWidth2(e.target.value)}/>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-slate-900">
                Шаг 3 из 5: Выберите вид стекла
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {GLASS_OPTIONS.map((glass) => (
                  <div
                    key={glass.id}
                    onClick={() => setSelectedGlass(glass.label)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                      selectedGlass === glass.label
                        ? 'border-[#024f87] bg-sky-50/50 shadow-md'
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={glass.img} alt={glass.label} className="w-20 h-20 object-cover rounded-xl mb-3"/>
                    <span className="text-xs font-bold text-slate-800">{glass.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-slate-900">
                Шаг 4 из 5: Цвет фурнитуры
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {HARDWARE_OPTIONS.map((hw) => (
                  <div
                    key={hw.id}
                    onClick={() => setSelectedHardware(hw.label)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                      selectedHardware === hw.label
                        ? 'border-[#024f87] bg-sky-50/50 shadow-md'
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={hw.img} alt={hw.label} className="w-16 h-16 object-contain mb-3"/>
                    <span className="text-xs font-bold text-slate-800">{hw.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-slate-900">
                Шаг 5 из 5: Оставьте ваши контактные данные
              </h3>

              {isSuccess ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8"/>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Расчет отправлен!</h4>
                  <p className="text-sm text-slate-600 max-w-md">
                    Спасибо за обращение. Наш менеджер свяжется с вами с точной сметой.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 bg-[#024f87] hover:bg-[#024f87]/90 text-white font-bold uppercase tracking-wider rounded-xl mt-2 cursor-pointer"
                  >
                    {isLoading ? 'Отправка...' : (
                      <>
                        <Send className="w-4 h-4 mr-2"/>
                        Получить расчет
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          )}

          {!isSuccess && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5"/> Назад
                </Button>
              ) : <div/>}

              {step < 5 && (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="bg-[#024f87] hover:bg-[#024f87]/90 text-white font-bold uppercase tracking-wider rounded-xl px-6 cursor-pointer"
                >
                  Далее <ArrowRight className="w-4 h-4 ml-1.5"/>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </SectionLayout>
  );
}
