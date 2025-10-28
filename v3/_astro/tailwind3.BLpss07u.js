const n=`@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  padding: 2rem;
}
`,s=`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,i={package:{devDependencies:{tailwindcss:"^3.4.17",postcss:"^8.5.6"}},files:{"src/app.css":n,"postcss.config.js":s}};export{i as layer};
