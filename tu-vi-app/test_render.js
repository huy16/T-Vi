import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './src/App.jsx';
import { lapLaSo } from './src/utils/tuviEngine.js';

import HeroSection from './src/components/HeroSection.jsx';
import TuViChart from './src/components/TuViChart.jsx';
import TongQuanSection from './src/components/TongQuanSection.jsx';
import LuanGiai12Cung from './src/components/LuanGiai12Cung.jsx';
import VanHanSection from './src/components/VanHanSection.jsx';
import { SuNghiepSection, TinhDuyenSection, TaiLocSection, SucKhoeSection } from './src/components/DetailSections.jsx';
import { ConCaiSection, GiaiDoanSection, VanTrinh12ThangSection, PhongThuySection, ThanSatSection, DienTrachSection } from './src/components/AdvancedSections.jsx';

try {
  const data = {
    name: "User",
    gender: 'Nam',
    day: 18,
    month: 8,
    year: 1990,
    hour: 'Ti', // Fails here?
    solarDay: 6,
    solarMonth: 10,
    solarYear: 1990,
    namXem: 2026,
    thangXem: 1
  };
  const tuviData = lapLaSo(data);
  
  const components = [
    { name: 'HeroSection', comp: HeroSection },
    { name: 'TuViChart', comp: TuViChart },
    { name: 'TongQuanSection', comp: TongQuanSection },
    { name: 'LuanGiai12Cung', comp: LuanGiai12Cung },
    { name: 'VanHanSection', comp: VanHanSection },
    { name: 'SuNghiepSection', comp: SuNghiepSection },
    { name: 'TinhDuyenSection', comp: TinhDuyenSection },
    { name: 'TaiLocSection', comp: TaiLocSection },
    { name: 'SucKhoeSection', comp: SucKhoeSection },
    { name: 'ConCaiSection', comp: ConCaiSection },
    { name: 'GiaiDoanSection', comp: GiaiDoanSection },
    { name: 'VanTrinh12ThangSection', comp: VanTrinh12ThangSection },
    { name: 'PhongThuySection', comp: PhongThuySection },
    { name: 'ThanSatSection', comp: ThanSatSection },
    { name: 'DienTrachSection', comp: DienTrachSection }
  ];

  for (let c of components) {
      console.log(`Rendering ${c.name}...`);
      ReactDOMServer.renderToString(React.createElement(c.comp, { chartData: tuviData }));
  }
  
  console.log("All components rendered successfully.");
} catch(err) {
  console.error("Render failed with error:");
  console.error(err);
}
