import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['primitive/**/*.json', 'semantic/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: '../../apps/site/src/styles/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tailwind-preset.js',
          format: 'javascript/module',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✅ tokens.css + tailwind-preset.js generated');
