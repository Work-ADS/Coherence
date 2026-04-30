const path = require('path');
const rootConfig = require('../../tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...rootConfig,
  content: [
    path.join(__dirname, 'src/**/*.{html,ts}'),
    path.join(__dirname, '../../libs/ui/**/*.{html,ts}'),
  ],
};
