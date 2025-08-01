# Vue 2 to Vue 3 Migration Guide

## Overview
This guide documents the migration of your Vue 2 project to Vue 3 with Node 20 support.

## Key Changes Made

### 1. Package.json Updates
- Updated Vue from 2.6.11 to 3.4.19
- Updated Vuetify from 2.2.11 to 3.5.8
- Replaced Vuex with Pinia (2.1.7)
- Updated Vue Router to 4.2.5
- Replaced deprecated packages:
  - `idle-vue` → Custom Vue 3 implementation
  - `vue-clipboard2` → `@vueuse/clipboard`
  - `vue-loading-overlay` → Updated to 6.0.3
- Updated all dev dependencies for Vue 3 compatibility

### 2. Main Application Changes
- **main.js**: Migrated to Vue 3 `createApp()` syntax
- **App.vue**: Converted to Composition API
- **Router**: Updated to Vue Router 4 syntax
- **Store**: Replaced Vuex with Pinia
- **Vuetify**: Updated to Vuetify 3 configuration

### 3. Event Bus Replacement
The global event bus (`$root.$emit`, `$root.$on`) has been replaced with a provide/inject pattern:
```javascript
// Old Vue 2 way
this.$root.$emit("SHOW_SNACKBAR", data);
this.$root.$on("SHOW_SNACKBAR", callback);

// New Vue 3 way
const eventBus = inject('eventBus');
eventBus.emit("SHOW_SNACKBAR", data);
eventBus.on("SHOW_SNACKBAR", callback);
```

### 4. Component Updates
- **app-drawer.vue**: Converted to Composition API
- **app-toolbar.vue**: Converted to Composition API
- **Home.vue**: Updated to use Composition API

## Remaining Tasks

### 1. Update All Components Using $root.$emit
The following files still need to be updated to use the new event bus pattern:

**Authentication Pages:**
- `src/pages/Authentication/login.vue`
- `src/pages/Authentication/signup.vue`
- `src/pages/Authentication/verifyUser.vue`
- `src/pages/Authentication/forgotPassword.vue`
- `src/pages/Authentication/securityQuestion.vue`
- `src/pages/Authentication/updatePassword.vue`

**Dashboard Pages:**
- `src/pages/Dashboard/dashboard.vue`
- `src/pages/Dashboard/ViewOrderCustomerDetail.vue`
- `src/pages/Dashboard/DidNumbers.vue`
- `src/pages/Dashboard/didnumberDetails.vue`

**Other Pages:**
- `src/pages/RateUpload/rateUpload.vue`
- `src/pages/DidCountry/didCountry.vue`
- `src/pages/DocumentRequest/docList.vue`
- `src/pages/Device/device.vue`
- `src/pages/Carrier/carrier.vue`
- `src/pages/RecieveDID/sip.vue`
- `src/pages/RecieveDID/security.vue`
- `src/pages/ShoppingCart/shoppingcart.vue`
- `src/pages/numberManager/assigningNumberDilaog.vue`
- `src/pages/numberManager/numberSubscriptionDataTable.vue`
- `src/pages/ProfileImage/profileimage.vue`
- `src/pages/billingAccount/recharge.vue`
- `src/pages/billingAccount/payment.vue`
- `src/pages/CostEdit/bulkCostEdit.vue`

### 2. Update Vuetify Components
Some Vuetify 2 components may need updates for Vuetify 3:
- Check for deprecated props and events
- Update component imports if needed
- Verify all Vuetify components work correctly

### 3. Test All Functionality
- Test authentication flow
- Test navigation and routing
- Test all API calls
- Test event bus functionality
- Test idle timeout functionality

## Migration Steps for Remaining Components

### Step 1: Update Event Bus Usage
Replace all instances of `this.$root.$emit` and `this.$root.$on` with the new event bus:

```javascript
// Add to setup() function
const eventBus = inject('eventBus');

// Replace this.$root.$emit with
eventBus.emit("SHOW_SNACKBAR", { text: "Message", color: "success" });

// Replace this.$root.$on with
onMounted(() => {
  eventBus.on("SHOW_SNACKBAR", (data) => {
    // Handle event
  });
});
```

### Step 2: Convert to Composition API
Convert components from Options API to Composition API:

```javascript
// Old Options API
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}

// New Composition API
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    return { count, increment }
  }
}
```

### Step 3: Update Store Usage
Replace Vuex with Pinia:

```javascript
// Old Vuex
this.$store.commit('STORE_SIGNUP_DATA', data)
this.$store.state.signUpData

// New Pinia
import { useMainStore } from '@/store'
const store = useMainStore()
store.storeSignUpData(data)
store.getSignUpData
```

## Installation and Setup

1. **Install Dependencies:**
```bash
npm install
```

2. **Start Development Server:**
```bash
npm run serve
```

3. **Build for Production:**
```bash
npm run build
```

## Node.js Version
The project now requires Node.js 20+ as specified in package.json engines.

## Troubleshooting

### Common Issues:
1. **Vuetify Components Not Rendering**: Check if components are properly imported in Vuetify 3
2. **Event Bus Not Working**: Ensure the eventBus is properly injected in components
3. **Router Issues**: Check if all routes are properly defined for Vue Router 4
4. **Store Issues**: Verify Pinia store is properly set up and imported

### Debugging Tips:
- Check browser console for Vue 3 specific errors
- Verify all imports are correct for Vue 3
- Test components individually to isolate issues
- Use Vue DevTools for Vue 3 to debug components

## Next Steps
1. Update all remaining components using the patterns above
2. Test all functionality thoroughly
3. Update any remaining Vue 2 specific syntax
4. Optimize performance if needed
5. Update documentation and README 