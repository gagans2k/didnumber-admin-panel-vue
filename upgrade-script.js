#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to update Vue 2 components to Vue 3
function updateVueComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // Replace this.$root.$emit with eventBus.emit
  if (content.includes('this.$root.$emit')) {
    content = content.replace(
      /this\.\$root\.\$emit\(/g,
      'eventBus.emit('
    );
    updated = true;
  }

  // Replace this.$root.$on with eventBus.on
  if (content.includes('this.$root.$on')) {
    content = content.replace(
      /this\.\$root\.\$on\(/g,
      'eventBus.on('
    );
    updated = true;
  }

  // Add eventBus injection if needed
  if (updated && !content.includes('inject(\'eventBus\')')) {
    // Add import for inject
    if (!content.includes('import { inject }')) {
      content = content.replace(
        /import { ([^}]+) } from 'vue'/,
        'import { $1, inject } from \'vue\''
      );
    }

    // Add eventBus injection in setup function
    if (content.includes('setup()')) {
      content = content.replace(
        /setup\(\) {/,
        `setup() {
    const eventBus = inject('eventBus');`
      );
    }
  }

  // Update Vuex to Pinia
  if (content.includes('this.$store')) {
    content = content.replace(
      /this\.\$store\.state\./g,
      'store.'
    );
    content = content.replace(
      /this\.\$store\.commit\(/g,
      'store.'
    );
    content = content.replace(
      /this\.\$store\.dispatch\(/g,
      'store.'
    );
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

// Function to find all Vue components
function findVueComponents() {
  const pattern = 'src/**/*.vue';
  return glob.sync(pattern);
}

// Main execution
console.log('Starting Vue 2 to Vue 3 component updates...');

const vueFiles = findVueComponents();
console.log(`Found ${vueFiles.length} Vue components`);

vueFiles.forEach(file => {
  try {
    updateVueComponent(file);
  } catch (error) {
    console.error(`Error updating ${file}:`, error.message);
  }
});

console.log('Component update script completed!');
console.log('\nNext steps:');
console.log('1. Review the updated components');
console.log('2. Test the application');
console.log('3. Fix any remaining issues manually');
console.log('4. Update any remaining Vue 2 specific syntax'); 