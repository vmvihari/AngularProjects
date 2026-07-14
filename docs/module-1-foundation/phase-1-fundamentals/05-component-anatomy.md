# Phase 1, Lesson 5: The Anatomy of an Angular Component

Just like a .NET solution generates configuration files such as `.csproj` or `appsettings.json`, Nx generates several configuration files (like `nx.json` and `project.json`) to handle the build system. We can safely ignore these for now.

In the previous lessons, we learned that our actual business logic lives in the `libs/` folder. However, the root "shell" of our application lives in `apps/issue-tracker/src/app`. 

Inside that folder, you will find `app.ts`, which is the absolute root component of your application.

## Comparing an Angular Component to a C# Class

If you open `apps/issue-tracker/src/app/app.ts` in your editor, you can look at the anatomy of an Angular component and see how it compares to a standard C# class. Let's take a look at the generated code:

```typescript
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'issue-tracker';
}
```

In Angular, every component requires three main parts:
1. A **TypeScript class** for your logic.
2. An **HTML template** for the UI.
3. A **CSS selector** to define how it is used as an HTML tag.

You link these together using the `@Component` decorator, which functions very much like a C# `[Attribute]`.

Inside that `@Component` decorator, you will see an `imports` array. As we learned in the previous lesson, modern Angular components are "standalone". Just like you use `using` statements in C#, you import other components or directives directly into this array so that you can use them in your HTML template!

---

## 🎯 Bootcamp Task: Build the Application Layout

Let's clear out the default Nx boilerplate. We need to create the root shell for our Enterprise Issue Tracker, which will consist of a sidebar for navigation and a main content area. Since we are building an enterprise application, it's best practice to keep our logic, templates, and styles strictly separated.

### Step 1: Update the Component Class (`app.ts`)
Open `apps/issue-tracker/src/app/app.ts` and ensure it uses `RouterOutlet` to load our feature components. Replace its contents with:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
```

### Step 2: Update the Template (`app.html`)
Open `apps/issue-tracker/src/app/app.html` and replace its contents with our new layout structure:

```html
<div class="app-container">
  <aside class="glass-sidebar">
    <div class="brand">
      <div class="logo-glow"></div>
      <h2>Tracker<span class="highlight">Pro</span></h2>
    </div>
    <nav>
      <a href="#" class="nav-item active">
        <span class="icon">📊</span>
        Dashboard
      </a>
      <a href="#" class="nav-item">
        <span class="icon">🎯</span>
        Issues
      </a>
      <a href="#" class="nav-item">
        <span class="icon">⚙️</span>
        Settings
      </a>
    </nav>
  </aside>
  
  <main class="content-area">
    <header class="topbar">
      <div class="search-bar">
        <input type="text" placeholder="Search issues..." />
      </div>
      <div class="user-profile">
        <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
      </div>
    </header>
    
    <div class="router-wrapper">
      <!-- The routed components will load here -->
      <router-outlet></router-outlet>
    </div>
  </main>
</div>
```

### Step 3: Update the Styles (`app.css`)
Open `apps/issue-tracker/src/app/app.css` and add our premium, glassmorphism styling:

```css
/* Ensure the body takes up the full viewport with no margins */
:host-context(body) { 
  margin: 0; 
  background: #f8fafc;
  color: #334155;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.glass-sidebar {
  width: 260px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 8px;
}

.logo-glow {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.highlight {
  color: #6366f1;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(241, 245, 249, 0.8);
  color: #334155;
}

.nav-item.active {
  background: #eff6ff;
  color: #2563eb;
}

.icon {
  font-size: 1.1rem;
  opacity: 0.8;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.topbar {
  height: 64px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.search-bar input {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  color: #334155;
  width: 280px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.search-bar input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-bar input::placeholder {
  color: #94a3b8;
}

.user-profile img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.user-profile img:hover {
  transform: scale(1.05);
}

.router-wrapper {
  padding: 32px;
  flex: 1;
  overflow-y: auto;
}
```

Check your browser at `http://localhost:4200` to see your brand new layout!
