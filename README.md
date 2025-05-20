# Expensify - Expense Tracking App

A modern expense tracking application built with Expo and React Native that helps users manage their finances efficiently. The app features a clean, dark-themed UI with smooth animations and comprehensive financial management capabilities.

## Features

### Authentication & User Management

- Secure Firebase authentication
- User profile management with customizable avatars

### Transaction Management

- Add, edit, and delete transactions
- Categorize expenses and income
- Advanced transaction search functionality
- Date-based transaction filtering
- Attach images to transactions

### UI/UX Features

- Dark mode interface
- Smooth animations using React Native Reanimated
- Responsive design for all screen sizes
- Intuitive navigation with Expo Router

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Firebase (Authentication & Firestore)
- **State Management**: React Context API
- **Navigation**: Expo Router
- **UI Components**: Custom components with React Native
- **Animations**: React Native Reanimated
- **Icons**: Phosphor React Native

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

```bash
npm install -g expo-cli
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/abuhasanrumi/expense-tracker-app.git
cd expense-tracker-app
```

2. Install dependencies

```bash
npm install
```

3. Set up Firebase

   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Create a web app in your Firebase project
   - Copy the Firebase config
   - Create `config/firebase.ts` and add your Firebase configuration

4. Start the development server

```bash
npx expo start
```

### Building the App

1. Install EAS CLI

```bash
npm install -g eas-cli
```

2. Login to Expo

```bash
eas login
```

3. Configure EAS Build

```bash
eas build:configure
```

4. Build for Android

```bash
# Development build
eas build -p android --profile development

# Production build
eas build -p android --profile production
```

5. Build for iOS

```bash
# Development build
eas build -p ios --profile development

# Production build
eas build -p ios --profile production
```

## Development Notes

- Uses TypeScript for type safety
- Implements custom hooks for data fetching
- Features real-time updates using Firebase
- Follows modular architecture
- Implements secure authentication flow

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Abu Hasan Rumi - [GitHub](https://github.com/abuhasanrumi)
