import React, {useState} from 'react';
import {Modal} from '@/shared/components/ui/Modal';
import {Input} from '@/shared/components/ui/Input';
import {PhoneInput} from '@/shared/components/ui/PhoneInput';
import {Button} from '@/shared/components/ui/Button';
import {User, Send, CheckCircle2} from 'lucide-react';
import client from '@/shared/lib/client';
import {toast} from 'sonner';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceTitle?: string;
}

export function LeadModal({isOpen, onClose, sourceTitle = "Заявка на бесплатный замер"}: LeadModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      toast.error('Пожалуйста, введите корректный номер телефона');
      return;
    }

    setIsLoading(true);

    try {
      await client.post('/api/v1/order/save', {
        customer: {
          name: name || 'Клиент с сайта',
          phone: phone,
        },
        grand_total: 0,
        currency: 'BYN',
        customer_comment: `${sourceTitle}. ${comment ? 'Комментарий: ' + comment : ''}`,
        results: [
          {
            title: sourceTitle,
            price: {total: 0, grand_total: 0},
          }
        ]
      });

      setIsSuccess(true);
      toast.success('Заявка успешно отправлена! Менеджер свяжется с вами в ближайшее время.');
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      toast.error('Произошла ошибка при отправке. Попробуйте еще раз или позвоните нам.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setComment('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={isSuccess ? "Заявка принята!" : sourceTitle}
      description={
        isSuccess
          ? "Спасибо за обращение. Наш специалист свяжется с вами для уточнения деталей."
          : "Оставьте ваши контактные данные, и мы бесплатно проконсультируем вас и рассчитаем стоимость изделия."
      }
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div
            className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <CheckCircle2 className="w-10 h-10"/>
          </div>
          <p className="text-white/80 text-sm mb-6">
            Мы уже обрабатываем вашу заявку.
          </p>
          <Button onClick={handleResetAndClose} className="w-full">
            Отлично
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            themeVariant="dark"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4"/>}
          />

          <PhoneInput
            themeVariant="dark"
            value={phone}
            onChange={setPhone}
            required
          />

          <textarea
            className="w-full min-h-[90px] p-3.5 rounded-xl border border-white/10 bg-[#1A1D21] text-white text-sm placeholder:text-white/40 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all resize-none autofill-dark"
            placeholder="Комментарий или пожелания по размерам (необязательно)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <p className="text-[11px] text-white/40 leading-snug">
            Нажимая кнопку «Отправить», вы соглашаетесь на обработку персональных данных.
          </p>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-sm font-bold uppercase tracking-widest mt-2"
          >
            {isLoading ? (
              'Отправка...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2"/>
                Отправить заявку
              </>
            )}
          </Button>
        </form>
      )}
    </Modal>
  );
}
