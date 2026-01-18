# Ihssan Tracker (Ibadah & Habits)

<div align="center">

  **Your Companion for Spiritual Growth and Consistency**

  [![Expo SDK](https://img.shields.io/badge/Expo-SDK_54-000.svg?style=flat-square&logo=expo)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React_Native-0.81-blue.svg?style=flat-square&logo=react)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

**Ihssan Tracker** is a premium, privacy-focused mobile application designed to help Muslims build and maintain consistent spiritual habits. Built with **React Native** and **Expo**, it offers a modern, beautiful interface for tracking daily prayers (Salat), Adhkar, Quran reading, Charity (Sadaqah), and optional prayers (Tahajjud), along with custom habit tracking.

## ✨ Key Features

- **📊 Comprehensive Dashboard**: View your daily progress at a glance with a clean, grid-based UI.
- **🕌 Salat Tracking**: Track 5 daily prayers with a simple, pill-based interface.
- **📿 Adhkar Reader**: Integrated Morning & Evening Adhkar with Arabic text, transliteration, and translation.
- **📖 Quran Tracker**: Set daily reading goals and track pages read with a visual progress bar.
- **🌙 Tahajjud & Sunnah**: Dedicated tracking for night prayers and voluntary acts.
- **🤝 Charity Tracker**: Weekly goals for Sadaqah to encourage regular giving.
- **🎯 Custom Goals**: Fully customizable weekly targets for all activities via a premium "Goals" modal with sliders.
- **📈 Insights & Analytics**: Visualize your consistency (streaks) and history over time.
- **🌍 Multi-language & RTL**: Full support for **English** and **Arabic** (RTL-first design).
- **🌗 Theme System**: Beautiful Light and Dark modes with high-contrast, premium colors.
- **🔒 Privacy First**: All data is stored locally on your device using `AsyncStorage`. No account required.

## 🛠 Tech Stack

- **Framework**: React Native (via Expo SDK 54)
- **Language**: TypeScript
- **State Management**: Zustand
- **Storage**: AsyncStorage (Persist middleware)
- **UI Components**: 
  - Custom Design System (Cards, Chips, Modals)
  - `@gorhom/bottom-sheet` for smooth interactions
  - `react-native-reanimated` for fluid animations
  - `react-native-pager-view` for swipeable content
- **Navigation**: React Navigation v7
- **Internationalization**: i18next & react-i18next
- **Video/Fonts**: Expo AV & Google Fonts (Amiri, Inter, Noto Sans)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo Go** app on your iOS/Android device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ihssan-tracker.git
   cd ihssan-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - Scan the QR code with the **Expo Go** app (Android) or Camera app (iOS).

## 📱 Screenshots

| Dashboard (Light) | Adhkar Reader | Goals Settings | Dark Mode |
|:---:|:---:|:---:|:---:|
| <div style="width:200px; height:400px; background:#e0e0e0; display:flex; align-items:center; justify-content:center;">Screenshot</div> | <div style="width:200px; height:400px; background:#e0e0e0; display:flex; align-items:center; justify-content:center;">Screenshot</div> | <div style="width:200px; height:400px; background:#e0e0e0; display:flex; align-items:center; justify-content:center;">Screenshot</div> | <div style="width:200px; height:400px; background:#111; color:white; display:flex; align-items:center; justify-content:center;">Screenshot</div> |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ for the Ummah
</div>
