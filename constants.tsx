import React from 'react';
import { ContentTranslation, ResourceLink } from './types.ts';

export const LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export const TRANSLATIONS: Record<LanguageCode, any> = {
  pt: {
    nav: { home: 'Início', pdk: 'PDKs', tools: 'Ferramentas', analogFlow: 'Fluxo Analógico', digitalFlow: 'Fluxo Digital', resources: 'Recursos' },
    hero: {
      title: <>Prototipagem de CIs com Ferramentas de <span className="text-emerald-500">Código Aberto</span>.</>,
      description: 'Democratizando o design de semicondutores na América Latina. Utilize PDKs industriais e ferramentas livres para transformar suas ideias em silício real.',
      cta: 'Começar Agora'
    },
    intro: {
      title: 'Educação e Inovação',
      bullets: [
        'Acesso livre a PDKs de 130nm e 180nm.',
        'Fluxos de design RTL-to-GDSII automatizados.',
        'Comunidade global ativa (CI Aberto, ysyx).',
        'Oportunidades de fabricação gratuita via MPW.'
      ],
    },
    pdkSection: {
      title: 'PDKs Suportados',
      description: 'Escolha a tecnologia certa para o seu projeto de pesquisa ou prototipagem.',
      options: [
        {
          id: 'ihp',
          name: 'IHP SG13G2',
          techSummary: 'O processo SG13G2 da IHP é focado em aplicações de altíssima frequência, oferecendo transistores HBT de SiGe com performance excepcional.',
          useCases: ['Radar mm-Wave', '5G/6G', 'Criogenia'],
          docsLink: 'https://github.com/IHP-GmbH/IHP-Open-PDK',
          mpwLink: 'https://www.ihp-microelectronics.com/services/research-and-prototyping-service/mpw-prototyping-service'
        },
        {
          id: 'sky',
          name: 'SkyWater SKY130',
          techSummary: 'O SKY130 é um nó de 130nm maduro e amplamente documentado, ideal para a transição do design acadêmico para o silício.',
          useCases: ['Microcontroladores', 'Sinais Mistos', 'IoT'],
          docsLink: 'https://skywater-pdk.readthedocs.io/',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        }
      ]
    },
    toolsSection: {
      title: 'Toolchain Open EDA',
      description: 'Uma suíte completa de ferramentas para capturar, simular e layoutar seu chip.',
      tools: [
        { id: 'xschem', name: 'Xschem', category: 'Esquema', description: 'Captura de esquemáticos VLSI.', website: 'https://xschem.sourceforge.io/', installTip: 'Integrado ao PDK.' },
        { id: 'ngspice', name: 'Ngspice', category: 'Simulação', description: 'Simulador SPICE de sinal misto.', website: 'https://ngspice.sourceforge.io/', installTip: 'Integrado ao Xschem.' },
        { id: 'magic', name: 'Magic VLSI', category: 'Layout', description: 'Layout VLSI com DRC em tempo real.', website: 'http://opencircuitdesign.com/magic/', installTip: 'Foco em analógico.' },
        { id: 'openroad', name: 'OpenROAD', category: 'Digital', description: 'Fluxo RTL-to-GDSII automatizado.', website: 'https://theopenroadproject.org/', installTip: 'Foco em digital.' }
      ]
    },
    analogFlow: {
      title: 'Fluxo de Design Analógico',
      description: 'Design baseado em precisão elétrica, onde cada transístor é dimensionado manualmente.',
      steps: [
        { id: 1, label: 'Esquemático', details: 'Captura do circuito usando Xschem, definindo topologias de amplificadores, referências, etc.' },
        { id: 2, label: 'Simulação SPICE', details: 'Uso do Ngspice para análise de DC, AC, transiente e cantos (corners) de processo.' },
        { id: 3, label: 'Layout Manual', details: 'Desenho das máscaras no Magic ou KLayout, focando em casamento (matching) e isolamento.' },
        { id: 4, label: 'Verificação Física', details: 'DRC (Regras de Fabricação) e LVS (Comparação Layout vs Esquemático) via Magic/Netgen.' },
        { id: 5, label: 'Extração e PEX', details: 'Extração de parasitas para simulação pós-layout, garantindo que o silício opere na frequência desejada.' }
      ]
    },
    digitalFlow: {
      title: 'Fluxo de Design Digital',
      description: 'Design baseado em abstração RTL, utilizando ferramentas de automação para bilhões de transistores.',
      steps: [
        { id: 1, label: 'RTL (Verilog)', details: 'Descrição lógica do comportamento do chip usando linguagens de descrição de hardware.' },
        { id: 2, label: 'Síntese Lógica', details: 'Mapeamento do RTL para portas lógicas da Standard Cell Library usando Yosys.' },
        { id: 3, label: 'Floorplanning', details: 'Definição da área do chip, pinagem e rede de distribuição de energia (PDN).' },
        { id: 4, label: 'Placement & CTS', details: 'Posicionamento das células e síntese da árvore de clock para minimizar skew.' },
        { id: 5, label: 'Routing & GDSII', details: 'Roteamento detalhado dos sinais e geração do arquivo final para a fundição via OpenROAD.' }
      ]
    },
    resourcesSection: {
      title: 'Links e Recursos',
      description: 'Conecte-se com a comunidade e aprofunde seus conhecimentos.'
    },
    footer: { rights: 'Todos os direitos reservados.' }
  },
  en: {
    nav: { home: 'Home', pdk: 'PDKs', tools: 'Tools', analogFlow: 'Analog Flow', digitalFlow: 'Digital Flow', resources: 'Resources' },
    hero: {
      title: <>Prototyping ICs with <span className="text-emerald-500">Open-Source</span> Tools.</>,
      description: 'Democratizing semiconductor design in Latin America. Leverage industrial PDKs and free tools to turn your ideas into real silicon.',
      cta: 'Get Started'
    },
    intro: {
      title: 'Education and Innovation',
      bullets: [
        'Free access to 130nm and 180nm PDKs.',
        'Automated RTL-to-GDSII design flows.',
        'Active global community (CI Aberto, ysyx).',
        'Free fabrication opportunities via MPW programs.'
      ],
    },
    pdkSection: {
      title: 'Supported PDKs',
      description: 'Choose the right technology for your research or prototyping project.',
      options: [
        {
          id: 'ihp',
          name: 'IHP SG13G2',
          techSummary: 'The IHP SG13G2 process is focused on ultra-high-frequency applications, offering SiGe HBT transistors.',
          useCases: ['mm-Wave radar', '5G/6G', 'Cryogenics'],
          docsLink: 'https://github.com/IHP-GmbH/IHP-Open-PDK',
          mpwLink: 'https://www.ihp-microelectronics.com/services/research-and-prototyping-service/mpw-prototyping-service'
        },
        {
          id: 'sky',
          name: 'SkyWater SKY130',
          techSummary: 'SKY130 is a mature and widely documented 130nm node, ideal for academic designs.',
          useCases: ['Microcontrollers', 'Mixed-signal', 'IoT'],
          docsLink: 'https://skywater-pdk.readthedocs.io/',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        }
      ]
    },
    toolsSection: {
      title: 'Open EDA Toolchain',
      description: 'A complete suite of tools to capture, simulate, and layout your chip.',
      tools: [
        { id: 'xschem', name: 'Xschem', category: 'Schematic', description: 'VLSI schematic capture.', website: 'https://xschem.sourceforge.io/', installTip: 'Integrated with PDKs.' },
        { id: 'ngspice', name: 'Ngspice', category: 'Simulation', description: 'Mixed-signal SPICE simulator.', website: 'https://ngspice.sourceforge.io/', installTip: 'Integrated with Xschem.' },
        { id: 'magic', name: 'Magic VLSI', category: 'Layout', description: 'VLSI layout with real-time DRC.', website: 'http://opencircuitdesign.com/magic/', installTip: 'Analog focused.' },
        { id: 'openroad', name: 'OpenROAD', category: 'Digital', description: 'Automated RTL-to-GDSII flow.', website: 'https://theopenroadproject.org/', installTip: 'Digital focused.' }
      ]
    },
    analogFlow: {
      title: 'Analog Design Flow',
      description: 'Precision-based design where every transistor is manually sized for specific performance.',
      steps: [
        { id: 1, label: 'Schematic Capture', details: 'Drawing the circuit in Xschem using PDK symbols.' },
        { id: 2, label: 'Simulation', details: 'SPICE analysis (DC/AC/Tran) to verify electrical specs.' },
        { id: 3, label: 'Manual Layout', details: 'Drawing transistors and metal in Magic or KLayout.' },
        { id: 4, label: 'DRC & LVS', details: 'Physical verification to ensure the design can be manufactured.' },
        { id: 5, label: 'Extraction (PEX)', details: 'Extracting parasitic components for final validation.' }
      ]
    },
    digitalFlow: {
      title: 'Digital Design Flow',
      description: 'Abstraction-based design using logic description and automated placement/routing.',
      steps: [
        { id: 1, label: 'RTL Coding', details: 'Describing logic behavior using Verilog or VHDL.' },
        { id: 2, label: 'Logic Synthesis', details: 'Converting RTL into gates using Yosys and a standard cell library.' },
        { id: 3, label: 'Floorplanning', details: 'Defining chip dimensions and I/O placement.' },
        { id: 4, label: 'CTS & Placement', details: 'Placing gates and balancing the clock tree.' },
        { id: 5, label: 'Routing', details: 'Automated wiring of all logic gates via OpenROAD.' }
      ]
    },
    resourcesSection: {
      title: 'Links and Resources',
      description: 'Connect with the community and deepen your knowledge.'
    },
    footer: { rights: 'All rights reserved.' }
  },
  es: {
    nav: { home: 'Inicio', pdk: 'PDKs', tools: 'Herramientas', analogFlow: 'Flujo Analógico', digitalFlow: 'Flujo Digital', resources: 'Recursos' },
    hero: {
      title: <>Prototipado de CIs con Herramientas de <span className="text-emerald-500">Código Abierto</span>.</>,
      description: 'Democratizando el diseño de semiconductores en América Latina. Aproveche PDKs industriales y herramientas gratuitas.',
      cta: 'Empezar Ahora'
    },
    intro: {
      title: 'Educación e Innovación',
      bullets: [
        'Acceso gratuito a PDKs de 130nm y 180nm.',
        'Flujos de diseño RTL-to-GDSII automatizados.',
        'Comunidad global activa.',
        'Fabricación gratuita vía MPW.'
      ],
    },
    pdkSection: {
      title: 'PDKs Soportados',
      description: 'Elija la tecnología adecuada para su proyecto.',
      options: [
        {
          id: 'ihp',
          name: 'IHP SG13G2',
          techSummary: 'Proceso de alto rendimiento enfocado en radiofrecuencia (RF).',
          useCases: ['Radar', '5G/6G', 'Criogenia'],
          docsLink: 'https://github.com/IHP-GmbH/IHP-Open-PDK',
          mpwLink: 'https://www.ihp-microelectronics.com/services/research-and-prototyping-service/mpw-prototyping-service'
        },
        {
          id: 'sky',
          name: 'SkyWater SKY130',
          techSummary: 'Nodo de 130nm maduro e ideal para academia.',
          useCases: ['Microcontroladores', 'Señal Mixta', 'IoT'],
          docsLink: 'https://skywater-pdk.readthedocs.io/',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        }
      ]
    },
    toolsSection: {
      title: 'Toolchain Open EDA',
      description: 'Suite completa para capturar, simular y diseñar su chip.',
      tools: [
        { id: 'xschem', name: 'Xschem', category: 'Esquema', description: 'Captura de esquemáticos VLSI.', website: 'https://xschem.sourceforge.io/', installTip: 'Integrado.' },
        { id: 'ngspice', name: 'Ngspice', category: 'Simulación', description: 'Simulador SPICE.', website: 'https://ngspice.sourceforge.io/', installTip: 'Integrado con Xschem.' },
        { id: 'magic', name: 'Magic VLSI', category: 'Layout', description: 'Diseño manual y DRC.', website: 'http://opencircuitdesign.com/magic/', installTip: 'Enfoque analógico.' },
        { id: 'openroad', name: 'OpenROAD', category: 'Digital', description: 'Flujo digital automatizado.', website: 'https://theopenroadproject.org/', installTip: 'Enfoque digital.' }
      ]
    },
    analogFlow: {
      title: 'Flujo Analógico',
      description: 'Diseño basado en precisión donde cada componente se dimensiona manualmente.',
      steps: [
        { id: 1, label: 'Esquemático', details: 'Captura del circuito en Xschem.' },
        { id: 2, label: 'Simulación', details: 'Análisis eléctrico con Ngspice.' },
        { id: 3, label: 'Layout Manual', details: 'Dibujo de máscaras físicas en Magic.' },
        { id: 4, label: 'Verificación', details: 'DRC y LVS para asegurar manufacturabilidad.' },
        { id: 5, label: 'Extracción', details: 'Simulación post-layout con parasitos.' }
      ]
    },
    digitalFlow: {
      title: 'Flujo Digital',
      description: 'Diseño basado en descripción lógica y automatização de layout.',
      steps: [
        { id: 1, label: 'RTL (Verilog)', details: 'Descripción del comportamiento lógico.' },
        { id: 2, label: 'Síntesis', details: 'Conversión de lógica a compuertas físicas.' },
        { id: 3, label: 'Floorplanning', details: 'Definición de área y pines.' },
        { id: 4, label: 'Placement/CTS', details: 'Colocación de celdas y árbol de reloj.' },
        { id: 5, label: 'Ruteo', details: 'Conexão automática de señales en OpenROAD.' }
      ]
    },
    resourcesSection: {
      title: 'Enlaces y Recursos',
      description: 'Conéctese con la comunidad.'
    },
    footer: { rights: 'Todos los derechos reservados.' }
  }
};

export const RESOURCES: ResourceLink[] = [
  { title: 'IHP OpenPDK (GitHub)', url: 'https://github.com/IHP-GmbH/IHP-Open-PDK', type: 'github', description: 'The official source for the SG13G2 Open PDK.' },
  { title: 'SkyWater Open PDK Docs', url: 'https://skywater-pdk.readthedocs.io/', type: 'docs', description: 'Complete reference for the SKY130 process.' },
  { title: 'IIC-OSIC-TOOLS (Docker)', url: 'https://github.com/iic-jku/IIC-OSIC-TOOLS', type: 'github', description: 'All-in-one Docker/Podman container for open-source analog and digital IC design flows.' },
  { title: 'CI Aberto (Brazil)', url: 'https://www.ufrgs.br/cadmicro/ciaberto/', type: 'community', description: 'Brazilian initiative for open hardware curation.' },
  { title: 'One Student One Chip (ysyx)', url: 'https://ysyx.org/en/', type: 'community', description: 'A massive learning-by-doing program from China.' },
  { title: 'Efabless Open MPW', url: 'https://efabless.com/open_shuttle_program', type: 'community', description: 'Apply for free silicon manufacturing.' },
  { title: 'Zero to ASIC Course', url: 'https://zerotoasiccourse.com/', type: 'course', description: 'Comprehensive guide to designing your first chip.' }
];