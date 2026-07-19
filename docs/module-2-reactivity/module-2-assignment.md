# Module 2 Assignment: Persistent UI Filters

Congratulations on completing Module 2! You have successfully upgraded this application from a basic component tree into a highly reactive, enterprise-grade architecture using Angular Signals, RxJS Interoperability, NgRx SignalStore, and safe Browser Storage patterns!

To solidify your understanding of these concepts, your assignment is to build a brand new real-world feature entirely from scratch.

---

## 🎯 Assignment Brief
You will implement **Persistent UI Filters** for the Issue Tracker. 

Currently, when a user selects a filter (e.g., viewing only "Open" issues) on the Manage Issues screen, that filter resets back to "All" if they navigate to the Dashboard and back, or if they refresh the page. This is a very common UX frustration in enterprise applications!

Your task is to fix this by persisting the user's active filter to `localStorage` using your new `StorageService` and `IssueStore`.

### Requirements

#### 1. Implement LocalStorage Persistence
Update your `IssueStore` (`libs/issues/data-access/src/lib/issue.store.ts`):
- Inject the `StorageService`.
- Use the `withHooks` feature to load the saved filter from `localStorage` (key: `issue-tracker-filter`) during store initialization. If a saved filter exists, patch the state so it is applied immediately.

#### 2. Synchronize State changes with an Effect
When the user clicks a filter button on the UI, it currently calls `updateFilter()` on your store. We need to intercept this state change and save it!
- Inside `withHooks` (or by creating a new `effect()` in your root component), set up a reactive subscription that listens to changes to the `filter()` signal.
- Whenever `filter()` changes, use your `StorageService` to save the new value to `localStorage`.

#### 3. Update the UI Component (Bonus)
The `UiIssueFilters` dumb component currently has hardcoded CSS classes. 
- Open `libs/issues/ui-issue-filters/src/lib/ui-issue-filters/ui-issue-filters.html`.
- Add an `@Input() activeFilter = 'All'` to the component typescript.
- Update the template to apply the `.active` CSS class to the button that matches the `activeFilter` string!
- Finally, pass `issueStore.filter()` into that input from your `FeatureManage` smart component so the UI button visually updates when the filter changes!

---

## 💡 Tips for Success
- Remember that `effect()` automatically tracks any signals you read inside of it! If you read `store.filter()` inside an effect, it will automatically run every time the user clicks a filter button.
- Make sure to use the type assertions appropriately, as the `filter` state is strictly typed to `'All' | 'Open' | 'Closed'`.

Good luck! Once you have finished building the Persistent Filter feature, you are ready to move on to Module 3!
