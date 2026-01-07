import React from 'react';
import { ContentTranslation, ResourceLink } from './types.ts';

export const LANGUAGES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export const TRANSLATIONS: Record<LanguageCode, ContentTranslation> = {
  pt: {
    nav: { home: 'Início', pdk: 'PDKs', tools: 'Ferramentas', flow: 'Fluxo', resources: 'Recursos' },
    hero: {
      title: <>Prototipagem de CIs com Ferramentas de <span className="text-emerald-500">Código Aberto</span>.</>,
      description: 'Democratizando o design de semicondutores na América Latina. Utilize PDKs industriais e ferramentas livres para transformar suas ideias em silício real.',
      cta: 'Começar Agora'
    },
    intro: {
      title: 'Educação e Inovação',
      description: 'O ecossistema Open Source IC permite que estudantes e pesquisadores contornem NDAs restritivos e custos proibitivos de licenciamento.',
      bullets: [
        'Acesso livre a PDKs de 130nm e 180nm.',
        'Fluxos de design RTL-to-GDSII automatizados.',
        'Comunidade global ativa (CI Aberto, ysyx).',
        'Oportunidades de fabricação gratuita via MPW.'
      ],
      illustration: 'Diagrama de Camadas de Semicondutores'
    },
    pdkSection: {
      title: 'PDKs Suportados',
      description: 'Escolha a tecnologia certa para o seu projeto de pesquisa ou prototipagem.',
      viewDetails: 'Ver Detalhes',
      options: [
        {
          id: 'ihp',
          name: 'IHP SG13G2',
          description: '130nm BiCMOS f_t/f_max 350/450 GHz.',
          details: 'Tecnologia de alto desempenho para RF e mm-Wave.',
          techSummary: 'O processo SG13G2 da IHP é focado em aplicações de altíssima frequência, oferecendo transistores HBT de SiGe com performance excepcional.',
          useCases: ['Sistemas de radar mm-Wave', 'Comunicação 5G/6G', 'Circuitos criogênicos'],
          docsLink: 'https://github.com/IHP-GmbH/IHP-Open-PDK',
          mpwLink: 'https://www.ihp-microelectronics.com/services/research-and-prototyping-service/mpw-prototyping-service'
        },
        {
          id: 'sky',
          name: 'SkyWater SKY130',
          description: 'O primeiro PDK open-source comercial (130nm).',
          details: 'Processo CMOS robusto para sinais mistos.',
          techSummary: 'O SKY130 é um nó de 130nm maduro e amplamente documentado, ideal para a transição do design acadêmico para o silício.',
          useCases: ['Microcontroladores open-source', 'Sensores analógicos', 'IoT de baixa potência'],
          docsLink: 'https://skywater-pdk.readthedocs.io/',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        },
        {
          id: 'gf',
          name: 'GlobalFoundries 180MCU',
          description: '180nm CMOS para aplicações IoT.',
          details: 'PDK flexible para prototipagem rápida.',
          techSummary: 'Tecnologia de 180nm otimizada para microcontroladores e aplicações de sinal mixta, com suporte completo no ecossistema Google Open MPW.',
          useCases: ['Sistemas embarcados', 'Interface de sensores', 'Educação em VLSI'],
          docsLink: 'https://github.com/google/gf180mcu-pdk',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        }
      ]
    },
    toolsSection: {
      title: 'Toolchain Open EDA',
      description: 'Uma suíte completa de ferramentas para capturar, simular e layoutar seu chip.',
      visitSite: 'Visitar Site',
      tools: [
        { id: 'xschem', name: 'Xschem', category: 'Esquema', description: 'Captura de esquemáticos VLSI.', website: 'https://xschem.sourceforge.io/', installTip: 'Disponível em repositórios Linux ou via compilação.' },
        { id: 'ngspice', name: 'Ngspice', category: 'Simulação', description: 'Simulador SPICE de sinal misto.', website: 'https://ngspice.sourceforge.io/', installTip: 'Integrado ao Xschem e KiCad.' },
        { id: 'magic', name: 'Magic VLSI', category: 'Layout', description: 'Layout VLSI com DRC em tempo real.', website: 'http://opencircuitdesign.com/magic/', installTip: 'Essencial para verificação física.' },
        { id: 'klayout', name: 'KLayout', category: 'Visualização', description: 'Editor e visualizador de GDSII/OASIS.', website: 'https://www.klayout.de/', installTip: 'Excelente suporte a scripts Python.' },
        { id: 'openems', name: 'OpenEMS', category: 'EM', description: 'Simulador eletromagnético 3D FDTD.', website: 'https://openems.de/', installTip: 'Modelagem de antenas e indutores.' },
        { id: 'openvaf', name: 'OpenVAF', category: 'Modelagem', description: 'Compilador Verilog-A moderno.', website: 'https://openvaf.semimod.de/', installTip: 'Use para modelos compactos de dispositivos.' }
      ]
    },
    flowSection: {
      title: 'Fluxo de Trabalho',
      description: 'Do RTL ao GDSII: como o silício é criado.',
      cta: 'Ver Guia para Iniciantes',
      steps: [
        { id: 1, label: 'Design & RTL', description: 'Escreva seu código Verilog ou desenhe seu esquema.', details: 'Nesta fase, você define a funcionalidade lógica ou analógica do seu chip.' },
        { id: 2, label: 'Simulação', description: 'Valide o comportamento elétrico e lógico.', details: 'Use Ngspice para analógico e Icarus/Verilator para digital.' },
        { id: 3, label: 'P&R', description: 'Posicionamento e Roteamento físico das células.', details: 'Ferramentas como OpenROAD automatizam este processo complexo.' },
        { id: 4, label: 'Verificação', description: 'DRC e LVS para garantir que o layout está correto.', details: 'O layout deve seguir regras rígidas da fundição (DRC) e bater com o esquema (LVS).' },
        { id: 5, label: 'Tapeout', description: 'Geração do arquivo GDSII final para fabricação.', details: 'O GDSII é enviado para a fundição via programas MPW.' }
      ]
    },
    resourcesSection: {
      title: 'Links e Recursos',
      description: 'Conecte-se com a comunidade e aprofunde seus conhecimentos.',
      roadmapTitle: 'Próximos Passos',
      roadmapDescription: 'Estamos expandindo nossa rede de colaboração em toda a região.',
      roadmapFeatures: ['Tutoriais em Português/Espanhol', 'Workshops Regionais', 'Bibliotecas de IP Abertas']
    },
    footer: {
      rights: 'Todos os direitos reservados.',
      contact: 'Contato'
    }
  },
  en: {
    nav: { home: 'Home', pdk: 'PDKs', tools: 'Tools', flow: 'Workflow', resources: 'Resources' },
    hero: {
      title: <>Prototyping ICs with <span className="text-emerald-500">Open-Source</span> Tools.</>,
      description: 'Democratizing semiconductor design in Latin America. Leverage industrial PDKs and free tools to turn your ideas into real silicon.',
      cta: 'Get Started'
    },
    intro: {
      title: 'Education and Innovation',
      description: 'The Open Source IC ecosystem enables students and researchers to bypass restrictive NDAs and prohibitive licensing costs.',
      bullets: [
        'Free access to 130nm and 180nm PDKs.',
        'Automated RTL-to-GDSII design flows.',
        'Active global community (CI Aberto, ysyx).',
        'Free fabrication opportunities via MPW programs.'
      ],
      illustration: 'Semiconductor Layer Diagram'
    },
    pdkSection: {
      title: 'Supported PDKs',
      description: 'Choose the right technology for your research or prototyping project.',
      viewDetails: 'View Details',
      options: [
        {
          id: 'ihp',
          name: 'IHP SG13G2',
          description: '130nm BiCMOS f_t/f_max 350/450 GHz.',
          details: 'High-performance technology for RF and mm-Wave.',
          techSummary: 'The IHP SG13G2 process is focused on ultra-high-frequency applications, offering SiGe HBT transistors with exceptional performance.',
          useCases: ['mm-Wave radar systems', '5G/6G communication', 'Cryogenic circuits'],
          docsLink: 'https://github.com/IHP-GmbH/IHP-Open-PDK',
          mpwLink: 'https://www.ihp-microelectronics.com/services/research-and-prototyping-service/mpw-prototyping-service'
        },
        {
          id: 'sky',
          name: 'SkyWater SKY130',
          description: 'The first commercial open-source PDK (130nm).',
          details: 'Robust CMOS process for mixed-signal designs.',
          techSummary: 'SKY130 is a mature and widely documented 130nm node, ideal for transitioning academic designs to silicon.',
          useCases: ['Open-source microcontrollers', 'Analog sensors', 'Low-power IoT'],
          docsLink: 'https://skywater-pdk.readthedocs.io/',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        },
        {
          id: 'gf',
          name: 'GlobalFoundries 180MCU',
          description: '180nm CMOS for IoT applications.',
          details: 'Flexible PDK for fast prototyping.',
          techSummary: '180nm technology optimized for microcontrollers and mixed-signal applications, with full support in the Google Open MPW ecosystem.',
          useCases: ['Embedded systems', 'Sensor interfaces', 'VLSI education'],
          docsLink: 'https://github.com/google/gf180mcu-pdk',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        }
      ]
    },
    toolsSection: {
      title: 'Open EDA Toolchain',
      description: 'A complete suite of tools to capture, simulate, and layout your chip.',
      visitSite: 'Visit Website',
      tools: [
        { id: 'xschem', name: 'Xschem', category: 'Schematic', description: 'VLSI schematic capture.', website: 'https://xschem.sourceforge.io/', installTip: 'Available in Linux repos or via source compilation.' },
        { id: 'ngspice', name: 'Ngspice', category: 'Simulation', description: 'Mixed-signal SPICE simulator.', website: 'https://ngspice.sourceforge.io/', installTip: 'Integrated with Xschem and KiCad.' },
        { id: 'magic', name: 'Magic VLSI', category: 'Layout', description: 'VLSI layout with real-time DRC.', website: 'http://opencircuitdesign.com/magic/', installTip: 'Essential for physical verification.' },
        { id: 'klayout', name: 'KLayout', category: 'Masks', description: 'GDSII/OASIS viewer and editor.', website: 'https://www.klayout.de/', installTip: 'Excellent Python scripting support.' },
        { id: 'openems', name: 'OpenEMS', category: 'EM', description: '3D FDTD electromagnetic simulator.', website: 'https://openems.de/', installTip: 'Modeling antennas and inductors.' },
        { id: 'openvaf', name: 'OpenVAF', category: 'Modeling', description: 'Modern Verilog-A compiler.', website: 'https://openvaf.semimod.de/', installTip: 'Use for compact device models.' }
      ]
    },
    flowSection: {
      title: 'Workflow',
      description: 'From RTL to GDSII: how silicon is born.',
      cta: 'View Beginner\'s Guide',
      steps: [
        { id: 1, label: 'Design & RTL', description: 'Write Verilog code or draw your schematic.', details: 'In this phase, you define the logical or analog functionality of your chip.' },
        { id: 2, label: 'Simulation', description: 'Validate electrical and logical behavior.', details: 'Use Ngspice for analog and Icarus/Verilator for digital.' },
        { id: 3, label: 'P&R', description: 'Physical cell placement and routing.', details: 'Tools like OpenROAD automate this complex process.' },
        { id: 4, label: 'Verification', description: 'DRC and LVS to ensure correct layout.', details: 'The layout must follow rigid foundry rules (DRC) and match the schematic (LVS).' },
        { id: 5, label: 'Tapeout', description: 'Final GDSII generation for manufacturing.', details: 'GDSII is sent to the foundry via MPW programs.' }
      ]
    },
    resourcesSection: {
      title: 'Links and Resources',
      description: 'Connect with the community and deepen your knowledge.',
      roadmapTitle: 'Next Steps',
      roadmapDescription: 'We are expanding our collaboration network across the region.',
      roadmapFeatures: ['Tutorials in PT/ES', 'Regional Workshops', 'Open IP Libraries']
    },
    footer: {
      rights: 'All rights reserved.',
      contact: 'Contact'
    }
  },
  es: {
    nav: { home: 'Inicio', pdk: 'PDKs', tools: 'Herramientas', flow: 'Flujo', resources: 'Recursos' },
    hero: {
      title: <>Prototipado de CIs con Herramientas de <span className="text-emerald-500">Código Abierto</span>.</>,
      description: 'Democratizando el diseño de semiconductores en América Latina. Aproveche PDKs industriales y herramientas gratuitas para convertir sus ideas en silicio real.',
      cta: 'Empezar Ahora'
    },
    intro: {
      title: 'Educacción e Innovación',
      description: 'El ecosistema Open Source IC permite que estudiantes e investigadores eviten NDAs restrictivos y costos prohibitivos de licencia.',
      bullets: [
        'Acceso gratuito a PDKs de 130nm y 180nm.',
        'Flujos de diseño RTL-to-GDSII automatizados.',
        'Comunidad global activa (CI Aberto, ysyx).',
        'Oportunidades de fabricación gratuita vía MPW.'
      ],
      illustration: 'Diagrama de Capas de Semiconductores'
    },
    pdkSection: {
      title: 'PDKs Soportados',
      description: 'Elija la tecnología adecuada para su proyecto de investigación o prototipado.',
      viewDetails: 'Ver Detalles',
      options: [
        {
          id: 'ihp',
          name: 'IHP SG13G2',
          description: '130nm BiCMOS f_t/f_max 350/450 GHz.',
          details: 'Tecnología de alto rendimiento para RF e mm-Wave.',
          techSummary: 'El proceso SG13G2 de IHP está enfocado en aplicaciones de frecuencia ultra alta, ofreciendo transistores SiGe HBT con un rendimiento excepcional.',
          useCases: ['Sistemas de radar mm-Wave', 'Comunicación 5G/6G', 'Circuitos criogénicos'],
          docsLink: 'https://github.com/IHP-GmbH/IHP-Open-PDK',
          mpwLink: 'https://www.ihp-microelectronics.com/services/research-and-prototyping-service/mpw-prototyping-service'
        },
        {
          id: 'sky',
          name: 'SkyWater SKY130',
          description: 'El primer PDK open-source comercial (130nm).',
          details: 'Proceso CMOS robusto para diseño de señal mixta.',
          techSummary: 'SKY130 es un nodo de 130nm maduro y ampliamente documentado, ideal para la transición de diseños académicos a silicio.',
          useCases: ['Microcontroladores open-source', 'Sensores analógicos', 'IoT de baja potencia'],
          docsLink: 'https://skywater-pdk.readthedocs.io/',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        },
        {
          id: 'gf',
          name: 'GlobalFoundries 180MCU',
          description: '180nm CMOS para aplicaciones IoT.',
          details: 'PDK flexible para prototipado rápido.',
          techSummary: 'Tecnología de 180nm optimizada para microcontroladores y aplicaciones de señal mixta, con soporte completo en el ecosistema Google Open MPW.',
          useCases: ['Sistemas embebidos', 'Interfaz de sensores', 'Educación en VLSI'],
          docsLink: 'https://github.com/google/gf180mcu-pdk',
          mpwLink: 'https://efabless.com/open_shuttle_program'
        }
      ]
    },
    toolsSection: {
      title: 'Toolchain Open EDA',
      description: 'Una suite completa de herramientas para capturar, simular y diseñar su chip.',
      visitSite: 'Visitar Sitio',
      tools: [
        { id: 'xschem', name: 'Xschem', category: 'Esquema', description: 'Captura de esquemáticos VLSI.', website: 'https://xschem.sourceforge.io/', installTip: 'Disponible en repositorios Linux o mediante compilación de código fuente.' },
        { id: 'ngspice', name: 'Ngspice', category: 'Simulación', description: 'Simulador SPICE de señal mixta.', website: 'https://ngspice.sourceforge.io/', installTip: 'Integrado con Xschem y KiCad.' },
        { id: 'magic', name: 'Magic VLSI', category: 'Layout', description: 'Layout VLSI con DRC en tiempo real.', website: 'http://opencircuitdesign.com/magic/', installTip: 'Esencial para la verificación física.' },
        { id: 'klayout', name: 'KLayout', category: 'Máscaras', description: 'Editor y visualizador de GDSII/OASIS.', website: 'https://www.klayout.de/', installTip: 'Excelente soporte para scripting en Python.' },
        { id: 'openems', name: 'OpenEMS', category: 'EM', description: 'Simulador electromagnético 3D FDTD.', website: 'https://openems.de/', installTip: 'Modelado de antenas e indutores.' },
        { id: 'openvaf', name: 'OpenVAF', category: 'Modelado', description: 'Compilador moderno de Verilog-A.', website: 'https://openvaf.semimod.de/', installTip: 'Úselo para modelos compactos de dispositivos.' }
      ]
    },
    flowSection: {
      title: 'Flujo de Trabajo',
      description: 'De RTL a GDSII: cómo nace el silicio.',
      cta: 'Ver Guía para Principiantes',
      steps: [
        { id: 1, label: 'Diseño & RTL', description: 'Escriba su código Verilog o dibuje su esquema.', details: 'En esta fase, se define la funcionalidad lógica o analógica de su chip.' },
        { id: 2, label: 'Simulación', description: 'Valide el comportamiento eléctrico y lógico.', details: 'Use Ngspice para analógico e Icarus/Verilator para digital.' },
        { id: 3, label: 'P&R', description: 'Colocación física de celdas y enrutamiento.', details: 'Herramientas como OpenROAD automatizan este complejo proceso.' },
        { id: 4, label: 'Verificación', description: 'DRC y LVS para asegurar un layout correcto.', details: 'El layout debe seguir reglas rígidas de la fundición (DRC) y coincidir con el esquema (LVS).' },
        { id: 5, label: 'Tapeout', description: 'Generación final de GDSII para fabricación.', details: 'El GDSII se envía a la fundición mediante programas MPW.' }
      ]
    },
    resourcesSection: {
      title: 'Enlaces y Recursos',
      description: 'Conéctese con la comunidad y profundice sus conocimientos.',
      roadmapTitle: 'Próximos Passos',
      roadmapDescription: 'Estamos expandiendo nuestra red de colaboración en toda la región.',
      roadmapFeatures: ['Tutoriales en PT/ES', 'Talleres Regionales', 'Bibliotecas de IP abiertas']
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      contact: 'Contacto'
    }
  }
};

export const RESOURCES: ResourceLink[] = [
  { title: 'IHP OpenPDK (GitHub)', url: 'https://github.com/IHP-GmbH/IHP-Open-PDK', type: 'github', description: 'The official source for the SG13G2 Open PDK.' },
  { title: 'SkyWater Open PDK Docs', url: 'https://skywater-pdk.readthedocs.io/', type: 'docs', description: 'Complete reference for the SKY130 process.' },
  { title: 'CI Aberto (Brazil)', url: 'https://www.ufrgs.br/cadmicro/ciaberto/', type: 'community', description: 'Brazilian initiative for open hardware curation.' },
  { title: 'One Student One Chip (ysyx)', url: 'https://ysyx.org/en/', type: 'community', description: 'A massive learning-by-doing program from China.' },
  { title: 'Efabless Open MPW', url: 'https://efabless.com/open_shuttle_program', type: 'community', description: 'Apply for free silicon manufacturing.' },
  { title: 'FOSSEE eSim', url: 'https://esim.fossee.in/', type: 'docs', description: 'An integrated circuit design tool using open-source tools.' },
  { title: 'Zero to ASIC Course', url: 'https://zerotoasiccourse.com/', type: 'course', description: 'Comprehensive guide to designing your first chip.' }
];