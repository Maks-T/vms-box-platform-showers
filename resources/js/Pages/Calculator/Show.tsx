import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

interface Props {
  initialData: {
    apiUrl: string;
    assetsUrl: string;
    baseUrl: string;
    policyLink?: string;
    ofertaLink?: string;
    state: any;
    type: string;
    lang?: string;
  };
}

declare global {
  interface Window {
    initCalculator?: (containerId: string, config: any) => () => void;
    initialData?: any;
  }
}

const ROOT_CONTAINER_ID = 'calcAppRoot';

export default function CalculatorShow({ initialData }: Props) {
  const urlLang = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null;
  const activeLang = urlLang || initialData?.lang || 'en';

  useEffect(() => {

    window.initialData = {
      ...initialData,
      lang: activeLang,
      assetsUrl: window.location.origin + '/widget/',
      apiUrl: window.location.origin + '/api/v1',
      baseUrl: window.location.origin,
    };

    // 2. Подключаем embed.js строго из папки /widget/embed.js
    const scriptId = 'vms-embed-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = '/widget/embed.js';
      script.dataset.lang = activeLang;
      script.async = true;
      document.body.appendChild(script);
    } else if (typeof window.initCalculator === 'function') {
      const container = document.getElementById(ROOT_CONTAINER_ID);
      if (container) {
        container.innerHTML = '';
      }
      window.initCalculator(ROOT_CONTAINER_ID, window.initialData);
    }

    return () => {
      const container = document.getElementById(ROOT_CONTAINER_ID);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [initialData, activeLang]);

  return (
    <MainLayout headerOverlaps={false}>
      <Head
        title={
          activeLang === 'en'
            ? 'Online Product Configurator'
            : 'Онлайн-калькулятор изделий'
        }
      />

      <SectionLayout containerVariant="page" className="!py-0 my-4">
        <div className="w-full relative z-10 py-0">
          <div className="relative w-full min-h-[750px] flex flex-col">
            <div id={ROOT_CONTAINER_ID} className="px-4" />
          </div>
        </div>
      </SectionLayout>
    </MainLayout>
  );
}

CalculatorShow.layout = (page: any) => page;