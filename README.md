# Inventory Management Project

Welcome to the Inventory Management Project! This application allows users to add items to their pantry, scan images using a camera, and classify these items using the OpenAI or Stripe AI API. The project is built with Next.js and uses Firebase for data storage and authentication.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Features

- Add and manage Inventory items
- Scan images using the camera
- Classify items using OpenAI or Stripe AI API
- Store and retrieve data from Firebase

## Installation

To get started with the project, follow these steps:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/yourusername/Inventory-management.git
   cd pantry-management
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Set up Firebase**:

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Authentication.
   - Copy the Firebase configuration and replace the placeholders in `.env.local` file.

4. **Set up OpenAI or Stripe AI API**:
   - Obtain your API key from OpenAI or Stripe AI.
   - Add your API key to the `.env.local` file.

## Usage

1. **Run the development server**:

   ```sh
   npm run dev
   ```

2. **Open your browser** and navigate to `http://localhost:3000` to see the application in action.

3. **Add items** to your pantry and use the camera feature to scan and classify items.

## Configuration

Create a `.env.local` file in the root directory and add your Firebase and API configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
# OR
NEXT_PUBLIC_STRIPE_AI_API_KEY=your_stripe_ai_api_key
```

## Technologies Used

- **Next.js** - React framework for server-side rendering
- **Firebase** - Backend-as-a-Service for authentication and Firestore
- **camera-pro** - NPM package for camera functionalities
- **OpenAI API** or **Stripe AI API** - For image classification

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
