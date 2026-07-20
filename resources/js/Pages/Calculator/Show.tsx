import React, {useEffect, useRef, useState} from 'react';
import {Head} from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import {ShowCalcLoader} from './components/ShowCalcLoader';
import CalculatorTabs from './components/CalculatorTabs';

interface Props {
  assets: {
    js: string | null;
    css: string | null;
  };
  initialData: {
    apiUrl: string;
    assetsUrl: string;
    baseUrl: string;
    policyLink?: string;
    ofertaLink?: string;
    state: any;
    user: any;
    employee: any;
  };
  currentType: string | null;
}

declare global {
  interface Window {
    initCalculator?: (containerId: string, config: any) => () => void;
  }
}

const ROOT_CONTAINER_ID = 'calcAppRoot';

export default function CalculatorShow({assets, initialData, currentType}: Props) {
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const unmountFnRef = useRef<(() => void) | null>(null);

  const initialDataStr = JSON.stringify(initialData);

  useEffect(() => {
    if (!assets.js) {
      console.error('Калькулятор: JS-файл точки входа не найден в manifest.json');
      return;
    }

    setIsWidgetReady(false);

    const initWidget = () => {
      if (window.initCalculator) {
        if (unmountFnRef.current) {
          unmountFnRef.current();
          unmountFnRef.current = null;
        }

        const container = document.getElementById(ROOT_CONTAINER_ID);
        if (container) {
          container.innerHTML = '';
        }

        unmountFnRef.current = window.initCalculator(ROOT_CONTAINER_ID, {
          ...initialData,
          type: currentType,
        });
        setIsWidgetReady(true);
      }
    };

    const existingScript = document.getElementById('external-calc-js');

    if (!existingScript) {
      if (assets.css && !document.getElementById('external-calc-css')) {
        const link = document.createElement('link');
        link.id = 'external-calc-css';
        link.rel = 'stylesheet';
        link.href = assets.css;
        document.head.appendChild(link);
      }

      const script = document.createElement('script');
      script.id = 'external-calc-js';
      script.src = assets.js;
      script.type = 'module';
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      if (unmountFnRef.current) {
        unmountFnRef.current();
        unmountFnRef.current = null;
      }
    };
  }, [assets.js, assets.css, initialDataStr, currentType]);

  return (
    <MainLayout headerOverlaps={false}>
      <Head title="Онлайн-калькулятор изделий - VMS-NC"/>

      <SectionLayout containerVariant="page" className="!py-0">

        <CalculatorTabs
          currentType={currentType || 'manager'}
          className="m-4"
        />

        <div className="w-full relative z-10 bg-white rounded-2xl border border-border p-4 md:p-8 shadow-sm">
          <div className="relative w-full min-h-[650px] flex flex-col">
            <ShowCalcLoader isWidgetReady={isWidgetReady}/>
            <div id={ROOT_CONTAINER_ID} className="w-full flex-1"/>
          </div>
        </div>
      </SectionLayout>
    </MainLayout>
  );
}
