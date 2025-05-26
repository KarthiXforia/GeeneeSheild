# GeeneeShield Dashboard

A modern dashboard for Goverment to analyze and manage the distributed devices

[Live](https://geenee-sheild.vercel.app/)

## Features

- 📊 **Rich Visualizations** - Powered by GeeneeShield, including bar charts, gauge charts, circle packing charts, and more
- 🌗 **Dark Mode** - Seamless dark/light mode switching with system preference support
- 📱 **Responsive Design** - Fully responsive layout that works on all devices
- 🎨 **Beautiful UI** - Modern and clean interface built with Tailwind CSS
- ⚡️ **Next.js 15** - Built on the latest Next.js features and best practices
- 🔄 **State Management** - Efficient state management with Jotai, Zustand, TanStack Query and more
- 📦 **Component Library** - Includes Shadcn components styled with Tailwind CSS

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [VisActor](https://visactor.io/) - Visualization library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn](https://ui.shadcn.com/) - UI components
- [Jotai](https://jotai.org/) - State management
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TanStack Query](https://tanstack.com/query/v5) - Data fetching and state management
- [Zustand](https://github.com/joshuajortiz/zustand) - State management

## Quick Start

[Github Repo](https://github.com/KarthiXforia/GeeneeSheild)

1. Clone this repository

```bash
git clone https://github.com/KarthiXforia/GeeneeSheild.git || git clone git@github.com:KarthiXforia/GeeneeSheild.git
```

2. Install dependencies

```bash
pnpm install
```

3. Run the development server

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```bash
src/
├── app/ # App router pages
├── components/ # React components
│ ├── chart-blocks/ # Chart components
│ ├── nav/ # Navigation components
│ └── ui/ # UI components
├── config/ # Configuration files
├── data/ # Sample data
├── hooks/ # Custom hooks
├── lib/ # Utility functions
├── style/ # Global style
└── types/ # TypeScript types
```
