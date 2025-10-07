import Dashboard from "../assets/cyberxss/Dashboard.png"
import AlertsCrit from "../assets/cyberxss/AlertsCrit.png"
import Login from "../assets/cyberxss/Login.png"
import Register from "../assets/cyberxss/Register.png"
import ApisExt from "../assets/cyberxss/ApisExt.png"
import Favorites from "../assets/cyberxss/Favorites.png"
import History from "../assets/cyberxss/History.png"
import Notifications from "../assets/cyberxss/Notify.png"
import ConfigXSS from "../assets/cyberxss/ConfigXSS.png"

import LoginOdonto from "../assets/odonto/Login.png"
import Agenda from "../assets/odonto/Agenda.png"
import DashboardOdonto from "../assets/odonto/Dashboard.png"
import NewCita from "../assets/odonto/NewCita.png"
import NewCita2 from "../assets/odonto/NewCita2.png"
import NewCita3 from "../assets/odonto/NewCita3.png"
import NewCitaPhone from "../assets/odonto/NewCitaPhone.png"
import Pacientes from "../assets/odonto/Pacientes.png"
import loginOdontoPhone from "../assets/odonto/LoginPhone.png"

import HomePortfolioWeb from "../assets/PorfolioWeb/Home.png"

import BlockchainView from "../assets/votacion/BlockchainView.png"
import HomeVotacion from "../assets/votacion/Home.png"
import Home2Votacion from "../assets/votacion/Home2.png"
import LoginVotacion from "../assets/votacion/Login.png"
import RegisterVotacion from "../assets/votacion/Register.png"
import Votar from "../assets/votacion/Votar.png"
import Admin1 from "../assets/votacion/admin1.png"
import Admin2 from "../assets/votacion/admin2.png"

import LoginChat from "../assets/chatRealTime/Login.png"
import AddFriend from "../assets/chatRealTime/AddFriend.png"
import AddFriend2 from "../assets/chatRealTime/addFriend2.png"
import Chat1 from "../assets/chatRealTime/Chat1.png"
import Emojis from "../assets/chatRealTime/emojis.png"

import homeBlog from "../assets/blog/home.png"



export const projects = [
  {
    title: "Cyber.xss",
    source: "Personal",
    description: "Plataforma de inteligencia de amenazas con autenticación, favoritos y feeds RSS.",
    tech: [
      "React",
      "Vite",
      "TailwindCSS",
      "React Router",
      "Firebase Web SDK",
      "Firebase Auth (Email, Google, GitHub)",
      "Node.js",
      "Express",
      "Firebase Admin",
    ],
    // Puedes usar 'images' (array) para múltiples imágenes, o 'image' (string) para una sola
    images: [
      Login,
      Register,
      Dashboard,
      AlertsCrit,
      ApisExt,
      Favorites,
      History,
      Notifications,
      ConfigXSS,
    ],
    imageAlt: "Vista previa de Cyber.xss",
    href: "#"
  },
  {
    title: "Odonto App",
    source: "Proyecto Universitario",
    description: "Sistema de gestión clínica para citas, pacientes y personal médico.",
    tech: [
      "React",
      "Vite",
      "TailwindCSS",
      "React Router",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "JWT",
    ],
    images: [
      LoginOdonto,
      Agenda,
      DashboardOdonto,
      NewCita,
      NewCita2,
      NewCita3,
      Pacientes,
      loginOdontoPhone,
      NewCitaPhone,
    ],
    imageAlt: "Vista previa de Odonto App",
    href: "#",
    repo: "#",
  },
  {
    title: "Portafolio Web",
    source: "Personal",
    description: "Portafolio web moderno con animaciones, enfoque en seguridad ofensiva y full stack.",
    tech: ["React", "Vite", "TailwindCSS"],
    image: [
      HomePortfolioWeb
    ],
    imageAlt: "Vista previa del portafolio",
    href: "#",
    repo: "#",
  },
  { 
    title: "Sistema de Votación Segura con Blockchain (GUI y CLI)", 
    source: "Proyecto Universitario", 
    description: "Sistema de votación seguro con blockchain para registro de votos verificables.", 
    tech: ["Python", "Blockchain", "RSA", "HMAC", "SQLite", "CustomTkinter", "CLI"], 
    images: [
      LoginVotacion,
      RegisterVotacion,
      HomeVotacion,
      Home2Votacion,
      Votar,
      BlockchainView,
      Admin1,
      Admin2
    ], 
    imageAlt: "Sistema de votación con blockchain" 
  },
  { 
    title: "Chat en Tiempo Real", 
    source: "Personal", 
    description: "Aplicación web de chat en tiempo real con autenticación y gestión de amigos.", 
    tech: ["React", "TailwindCSS", "Firebase", "Firebase Auth", "Firebase Realtime Database", "Vite"], 
    images: [
      LoginChat,
      AddFriend,
      AddFriend2,
      Emojis,
      Chat1
    ],
    imageAlt: "Chat en tiempo real" 
  },
  {
    title: "Blog personal de ciberseguridad ofensiva",
    source: "Personal",
    description: "Blog técnico sobre ciberseguridad ofensiva, CTFs y pentesting.",
    tech: ["CTFs", "Pentesting", "OWASP", "Hack The Box"],
    image: homeBlog,
    imageAlt: "Blog de ciberseguridad",
    href: "https://ch4r0niv.github.io/",
    repo: "#" 
  },
  {
    title: "Lentes con IA para Asistencia Visual",
    source: "Proyecto Universitario",
    description: "Lentes inteligentes con IA para asistencia visual a personas con discapacidad.",
    tech: ["Ollama", "React Native", "Python", "Flask", "ESP32-CAM"],
    imageAlt: "Lentes con IA",
  },
  {
    title: "Raccon (v1.0)",
    source: "Personal",
    description: "Herramienta para extraer y gestionar credenciales de navegadores Chromium.",
    tech: ["Python", "CSV", "Chrome"],
    imageAlt: "Herramienta Raccon",
    repo: "https://github.com/ch4r0niv/Raccon"
  },
  {
    title: "Personalización avanzada de entorno Linux para pentesting y productividad",
    source: "Personal",
    description: "Entorno Linux personalizado para pentesting y productividad.",
    tech: [
      "Linux",
      "bspwm",
      "polybar",
      "picom",
      "rofi",
      "zsh",
      "Powerlevel10k",
      "sxhkd",
      "Bash",
    ]
  },
  {
    title: "Hack The Box – Resolución de máquinas de pentesting",
    source: "Personal",
    description: "Resolución de más de 80 máquinas en Hack The Box.",
    tech: [
      "Hack The Box",
      "Pentesting",
      "Exploitation",
      "Privilege Escalation",
      "Scripting",
    ]
  },
  {
    title: "Creación de Laboratorio Active Directory",
    source: "Personal",
    description: "Laboratorio Active Directory configurado con vulnerabilidades intencionales.",
    tech: [
      "Active Directory",
      "Windows Server",
      "Kerberos",
      "LDAP",
      "GPO",
      "Lab",
    ]
  },
  {
    title: "Configuración de Laboratorios Locales con Docker",
    source: "Personal",
    description: "Laboratorios locales con Docker para prácticas de pentesting.",
    tech: ["Docker", "Docker Compose", "Pentesting", "Labs"]
  },
  {
    title: "crackfi",
    source: "Personal",
    description: "Script Bash para automatizar ataques WiFi WPA/WPA2.",
    tech: ["Bash", "WiFi", "Automatización"],
    repo: "https://github.com/ch4r0niv/crackfi"
  },
  {
    title: "macchanger en python3",
    source: "Personal",
    description: "Herramienta CLI en Python para cambiar direcciones MAC de interfaces de red.",
    tech: ["Python 3", "Networking", "CLI"],
    repo: "https://github.com/ch4r0niv/MACchanger"
  },
  {
    title: "ScannerICMP",
    source: "Personal",
    description: "Escáner de hosts activos en red mediante protocolo ICMP. Desarrollado en Python.",
    tech: ["Python", "ICMP", "Redes"],
    repo: "https://github.com/ch4r0niv/ScannerICMP"
  },
  {
    title: "Port_ScannerPY",
    source: "Personal",
    description: "Escáner de puertos rápido para identificación de servicios abiertos.",
    tech: ["Python", "Sockets", "Redes"],
    repo: "https://github.com/ch4r0niv/Port_ScannerPY"
  },
  {
    title: "Sitio Web de Búsqueda de Empleo (MERN)",
    source: "Proyecto Universitario",
    description: "Sitio web de búsqueda de empleo desarrollado con stack MERN.",
    tech: ["MongoDB", "Express", "React", "Node.js"]
  },
  {
    title: "Creación de Backdoors y Sistemas C&C",
    source: "Personal",
    description: "Desarrollo de backdoors y sistemas C&C para control remoto en simulaciones de pentesting."
  },
  {
    title: "Explotación de Vulnerabilidades OWASP Top 10",
    source: "Personal",
    description: "Explotación práctica de vulnerabilidades OWASP Top 10.",
    tech: [
      "OWASP Top 10",
      "SQLi",
      "XSS",
      "LFI",
      "IDOR",
      "Mitigación",
    ]
  },
  {
    title: "PasswordManager",
    source: "Personal",
    description: "Gestor de contraseñas con cifrado E2E y generación segura de claves.",
    tech: ["Python", "AES", "Argon2", "2FA", "UX"]
  },
]
