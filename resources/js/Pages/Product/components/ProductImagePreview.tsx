import React from 'react';
import {Image as ImageIcon} from 'lucide-react';
import GlassPanel from '@/shared/components/ui/GlassPanel';
import StatusBadge from '@/shared/components/ui/StatusBadge';
import {useTranslation} from '@/shared/i18n/useTranslation';

interface Props {
  image: string | null;
  name: string;
  externalCode: string | null;
  id: number;
}

export function ProductImagePreview({image, name, externalCode, id}: Props) {
  const { t } = useTranslation();
  return (
    <GlassPanel variant="glow" padding="none"
                className="relative aspect-square overflow-hidden flex items-center justify-center p-8 bg-slate-50/50">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      ) : (
        <div className="flex flex-col items-center text-muted-foreground/50">
          <ImageIcon className="w-24 h-24 mb-4"/>
          <span className="text-sm font-medium uppercase tracking-widest">{t('product_no_photo')}</span>
        </div>
      )}

      <div className="absolute top-6 left-6">
        <StatusBadge variant="blue">
          {t('product_sku_prefix')} {externalCode || id}
        </StatusBadge>
      </div>
    </GlassPanel>
  );
}