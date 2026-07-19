# Phase 3, Lesson 2: Shared State Across Routes

Now that you have a functioning SPA with multiple views (Dashboard and Issues), you might be wondering: *how do these two pages communicate with each other?*

If you resolve an issue on the Issues page, how does the Dashboard page know to update its metrics? 

The answer is the **Data Access Library** we built in Phase 2!

Because Angular registers the `IssueService` as a singleton using `@Injectable({ providedIn: 'root' })`, every component in your application that injects the service receives the exact same instance in memory. This means the Dashboard and the Issues list are reading from the exact same array.

---

## 🎯 Bootcamp Task: Dashboard Metrics

Let's prove this by hooking up our new Dashboard to the `IssueService` and watching the data sync perfectly between the two routes!

### Step 1: Inject the Service into the Dashboard
Open `libs/issues/feature-dashboard/src/lib/feature-dashboard/feature-dashboard.ts`.

Just like we did in the Issues page, we need to inject the `IssueService` and expose some data for the template. Update your class to look like this:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-dashboard',
  imports: [CommonModule],
  templateUrl: './feature-dashboard.html',
  styleUrl: './feature-dashboard.css',
})
export class FeatureDashboard {
  private issueService = inject(IssueService);

  get totalIssues() {
    return this.issueService.getIssues().length;
  }

  get openIssues() {
    return this.issueService.getIssues().filter(i => i.status === 'Open').length;
  }
}
```

### Step 2: Build the Dashboard UI
Open `libs/issues/feature-dashboard/src/lib/feature-dashboard/feature-dashboard.html` and let's add some metrics widgets:

```html
<div class="dashboard-container">
  <h2>Project Overview</h2>
  
  <div class="metrics-grid">
    <div class="metric-card">
      <h3>Total Issues</h3>
      <div class="value">{{ totalIssues }}</div>
    </div>
    
    <div class="metric-card alert">
      <h3>Needs Attention</h3>
      <div class="value">{{ openIssues }}</div>
    </div>
  </div>
</div>
```

### Step 3: Add some quick CSS
Open `libs/issues/feature-dashboard/src/lib/feature-dashboard/feature-dashboard.css` so our dashboard looks enterprise-ready:

```css
.dashboard-container {
  max-width: 900px;
  margin: 0 auto;
}

.metrics-grid {
  display: flex;
  gap: 24px;
  margin-top: 24px;
}

.metric-card {
  flex: 1;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.metric-card h3 {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-card .value {
  font-size: 3rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 12px;
}

.metric-card.alert .value {
  color: #ef4444;
}
```

### Step 4: The Ultimate Test
Check your browser! 
1. Look at the Dashboard: see the "Needs Attention" count.
2. Click "Issues" in the sidebar.
3. Click "Mark Resolved" on one of the Open issues.
4. Click "Dashboard" in the sidebar.

Because both routes are injected with the same `IssueService` singleton, your Dashboard metrics instantly reflect the changes made on the Issues page! You have officially mastered shared state.
