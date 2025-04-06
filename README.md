# 2D App

## Overview

The 2D App is a modern web application designed to demonstrate the capabilities of 2D graphics rendering using React, TypeScript, Tailwindcss, Konva, React-Konva and Vite. This project aims to provide a fast, responsive, and intuitive interface for users to interact with 2D graphics. It leverages modern development practices and tools to ensure high performance and maintainability.

### Project Domain

You can access the live application at https://2d-app.vercel.app.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Performance Optimizations](#performance-optimizations)

## Features

- Fast and responsive 2D graphics rendering.
- Intuitive user interface.
- Cross-platform compatibility.

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Package Manager**: This guide uses `yarn`. Ensure you have yarn installed. You can install it globally using npm:
  ```bash
  npm install --global yarn
  ```

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Artur1788/2d-app.git
   cd 2d-app
   ```

2. **Install Dependencies**:

   ```bash
   yarn
   ```

3. **Start the Development Server**:

   ```bash
   yarn dev
   ```

4. **Build for Production**:

   ```bash
   yarn build
   ```

5. **Preview Production Build**:
   ```bash
   yarn preview
   ```

## Performance Optimizations

### TypeScript and Vite

The project leverages TypeScript and Vite for optimized development and build processes. Vite ensures fast refresh and efficient module handling, while TypeScript provides type safety and better code maintainability.

### ESLint Configuration

For production applications, the ESLint configuration is enhanced to enable type-aware lint rules. This helps in catching potential issues early in the development cycle, leading to better performance and fewer runtime errors.

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

### Plugins for React

The project utilizes plugins like `eslint-plugin-react-x` and `eslint-plugin-react-dom` to enforce recommended TypeScript rules and React-specific optimizations.

```js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

### Lazy Loading

Components that are not immediately necessary are loaded lazily to improve initial load times and overall performance.

```js
const LazyComponent = React.lazy(() => import('./components/LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Memoization with `React.memo`

To prevent unnecessary re-renders, `React.memo` is used to memoize functional components that do not need to re-render when their props have not changed.

```js
const MemoizedComponent = React.memo(function Component({ prop }) {
  // Component implementation
});
```

### `useCallback` Hook

The `useCallback` hook is used to memoize callback functions, ensuring they are not re-created on every render. This reduces the number of re-renders for components that rely on stable function references.

```js
const handleClick = useCallback(() => {
  // Handle click event
}, [dependencies]);
```

### `useMemo` Hook

The `useMemo` hook is used to memoize expensive calculations, ensuring they are only re-computed when their dependencies change.

```js
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

These techniques help in optimizing the performance of the application by reducing unnecessary re-renders, improving load times, and ensuring efficient resource utilization.
