# 🏆 CWL MVP Analyzer

Una aplicación web que analiza automáticamente el desempeño de los jugadores en la Liga de Guerras (CWL) de Clash of Clans y determina quién merece recibir las medallas o recompensas extra del clan.

## 🎯 Objetivo

Proporcionar a los líderes y colíderes de clanes una herramienta objetiva para evaluar el rendimiento de los jugadores durante toda la Liga de Guerras, facilitando la distribución justa de recompensas.

## ✨ Características Principales

### 1. **Análisis por Tag de Clan**
- Introduce el tag del clan (ej: `#2VCVGLJ`)
- Obtención automática de datos mediante la API oficial de Clash of Clans
- Análisis completo de los 7 días de CWL

### 2. **Ranking MVP**
- Clasificación completa con medallería (🥇🥈🥉)
- Puntos totales
- Estrellas obtenidas
- Porcentaje promedio
- Número de triples (3 estrellas)
- Ataques realizados vs perdidos

### 3. **Perfil Detallado**
- Nombre y posición en guerra
- Historial completo de ataques
- Desempeño por día
- Rivales atacados
- Estadísticas de destrucción

### 4. **Sistema de Puntuación Inteligente (MVP Score)**
```
🌟 3 estrellas = 100 puntos
🌟 2 estrellas = 60 puntos
🌟 1 estrella = 25 puntos
+ 0.5 puntos por cada % de destrucción
+ Bonificación por atacar rivales superiores
- Penalización por ataques no utilizados
```

### 5. **Recomendación Automática**
- Muestra el jugador recomendado para medallas extra
- Detalla las razones de la selección

### 6. **Insignias Especiales**
- 🏅 MVP de la Liga
- ⚔️ Mejor Atacante
- ⭐ Más Triples
- 💥 Mayor Destrucción
- 🎯 Triple Más Difícil
- 🔄 Jugador Más Consistente

## 🎨 Diseño

- **Tema**: Inspirado en Clash of Clans, War Reports y Clash Ninja
- **Estilo**: Diseño oscuro profesional
- **Responsivo**: Compatible con dispositivos móviles
- **Componentes**: Tablas dinámicas, tarjetas de estadísticas, ranking visual

## 🛠️ Tecnologías

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla + Fetch API)

### Backend
- Node.js
- Express.js
- Axios para llamadas API

### Base de Datos
- Almacenamiento temporal en JSON (escalable a MongoDB)

### API
- Clash of Clans Official API

## 📁 Estructura del Proyecto

```
CWL-MVP-Analyzer/
├── public/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   └── js/
│       ├── app.js
│       ├── api-client.js
│       └── utils.js
├── server/
│   ├── server.js
│   ├── routes/
│   │   └── api.js
│   ├── controllers/
│   │   └── cwlController.js
│   ├── services/
│   │   ├── clashAPI.js
│   │   └── mvpCalculator.js
│   └── config/
│       └── config.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js v14+
- npm o yarn
- API Token de Clash of Clans

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Steven2702/CWL-MVP-Analyzer.git
cd CWL-MVP-Analyzer
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tu API Token de Clash of Clans
```

4. **Iniciar el servidor**
```bash
npm start
```

5. **Acceder a la aplicación**
```
http://localhost:3000
```

## 💡 Uso de la Aplicación

1. Introduce el tag del clan (ej: `#2VCVGLJ`)
2. Presiona "Analizar"
3. Espera a que se carguen los datos
4. Revisa:
   - Ranking MVP
   - Perfiles detallados
   - Recomendaciones
   - Insignias especiales

## 📊 Sistema de Puntuación Detallado

El MVP Score se calcula considerando:

- **Estrellas** (60% del peso)
  - 3⭐ = 100 pts
  - 2⭐ = 60 pts
  - 1⭐ = 25 pts

- **Destrucción** (20% del peso)
  - 0.5 pts por cada %

- **Rivales Superiores** (10% del peso)
  - Bonificación si ataca jugadores de mayor nivel

- **Consistencia** (10% del peso)
  - Basada en desempeño uniforme a lo largo de la liga

## 🔐 Seguridad

- API Token almacenado en variables de entorno
- Validación de inputs
- Rate limiting en llamadas a API
- CORS configurado

## 📝 Licencia

MIT - Libre para uso personal y comercial

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

**Steven2702** - [@GitHub](https://github.com/Steven2702)

---

**Nota**: Esta aplicación no está afiliada a Supercell. Clash of Clans es propiedad de Supercell.
